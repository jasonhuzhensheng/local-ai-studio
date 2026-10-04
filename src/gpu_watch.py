#!/usr/bin/env python3
"""Read-only GPU signals. Never creates instances/reservations or claims allocation."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
import fcntl
import json
import os
from pathlib import Path
import shutil
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]


class CheckError(Exception):
    pass


def now():
    return datetime.now(timezone.utc).isoformat()


def command(args):
    if not shutil.which(args[0]):
        raise CheckError('missing_cli:' + args[0])
    try:
        p = subprocess.run(args, capture_output=True, text=True, timeout=45,
                           env={**os.environ, 'AWS_PAGER': '', 'CLOUDSDK_CORE_DISABLE_PROMPTS': '1'})
    except subprocess.TimeoutExpired:
        raise CheckError('command_timeout') from None
    if p.returncode:
        # CLI stderr may contain credentials or account information. Never persist it.
        raise CheckError('cli_failed:check_login_and_read_permissions')
    return p.stdout


def request(url, headers, body=None):
    req = urllib.request.Request(url, headers=headers,
                                 data=json.dumps(body).encode() if body is not None else None)
    try:
        with urllib.request.urlopen(req, timeout=25) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        raise CheckError('http_' + str(exc.code)) from None
    except (urllib.error.URLError, TimeoutError):
        raise CheckError('network_or_timeout') from None


def runpod(t):
    key = os.environ.get('RUNPOD_API_KEY')
    if not key:
        raise CheckError('missing_env:RUNPOD_API_KEY')
    count = t['gpu_count']
    query = '''query($gpu: GpuTypeFilter, $price: GpuLowestPriceInput) {
      gpuTypes(input: $gpu) { id lowestPrice(input: $price) {
        stockStatus uninterruptablePrice availableGpuCounts } } }'''
    data = request('https://api.runpod.io/graphql',
                   {'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'},
                   {'query': query, 'variables': {'gpu': {'id': t['gpu']},
                    'price': {'gpuCount': count, 'secureCloud': t['secure_cloud']}}})
    if data.get('errors'):
        raise CheckError('graphql_error:check_credentials_and_schema')
    rows = data['data']['gpuTypes']
    matches = [r for r in rows if r['id'] == t['gpu']]
    if not matches:
        return {'status': 'unknown', 'reason': 'gpu_not_in_catalog'}
    price = matches[0].get('lowestPrice')
    if not price:
        return {'status': 'unknown', 'reason': 'no_price_or_stock_response'}
    stock, counts = price.get('stockStatus'), price.get('availableGpuCounts')
    status = 'unknown'
    if stock == 'None':
        status = 'no_stock_signal'
    elif stock in ('High', 'Medium', 'Low') and isinstance(counts, list):
        status = 'stock_signal' if count in counts else 'no_stock_signal'
    return {'status': status, 'stock': stock, 'available_gpu_counts': counts,
            'quoted_uninterruptable_price': price.get('uninterruptablePrice'),
            'price_note': 'API raw quote; not a complete Pod/storage/tax total',
            'scope': 'global Secure Cloud' if t['secure_cloud'] else 'global Community Cloud',
            'reason': 'inventory_signal_not_allocation_guarantee'}


def aws(t):
    if t.get('mode') == 'spot_score':
        data = json.loads(command([
            'aws', 'ec2', 'get-spot-placement-scores', '--region', t['region'],
            '--region-names', t['region'], '--instance-types', *t['instance_types'],
            '--target-capacity', str(t['instance_count']), '--target-capacity-unit-type',
            'units', '--single-availability-zone', '--output', 'json']))
        scores = data['SpotPlacementScores']
        return {'status': 'placement_signal' if scores else 'unknown', 'scores': scores,
                'reason': 'Spot_score_is_probability_guidance_not_allocation_guarantee'}
    args = ['aws', 'ec2', 'describe-instance-type-offerings', '--region', t['region'],
            '--location-type', 'availability-zone', '--filters',
            'Name=instance-type,Values=' + t['instance_type'], '--output', 'json']
    data = json.loads(command(args))
    locations = sorted({r['Location'] for r in data['InstanceTypeOfferings']})
    if t.get('zone'):
        locations = [z for z in locations if z == t['zone']]
    return {'status': 'catalog_only' if locations else 'not_offered', 'locations': locations,
            'reason': 'EC2_offerings_do_not_report_live_capacity_or_account_quota'}


def gcp(t):
    project = os.environ.get('GOOGLE_CLOUD_PROJECT')
    if not project:
        raise CheckError('missing_env:GOOGLE_CLOUD_PROJECT')
    token = command(['gcloud', 'auth', 'print-access-token']).strip()
    base = ('https://compute.googleapis.com/compute/v1/projects/' + urllib.parse.quote(project, safe='')
            + '/zones/' + urllib.parse.quote(t['zone'], safe='') + '/acceleratorTypes')
    names, page = [], None
    while True:
        data = request(base + ('?pageToken=' + urllib.parse.quote(page, safe='') if page else ''),
                       {'Authorization': 'Bearer ' + token})
        names.extend(r['name'] for r in data.get('items', []))
        page = data.get('nextPageToken')
        if not page:
            break
    return {'status': 'catalog_only' if t['gpu'] in names else 'not_offered',
            'reason': 'accelerator_catalog_does_not_report_live_capacity_or_account_quota'}


ADAPTERS = {'runpod': runpod, 'aws': aws, 'gcp': gcp}


def validate(config):
    if type(config.get('interval_seconds')) is not int or config['interval_seconds'] < 60:
        raise ValueError('interval_seconds must be an integer >= 60')
    seen = set()
    for t in config['targets']:
        if not isinstance(t.get('id'), str) or not t['id'] or t['id'] in seen:
            raise ValueError('target id must be nonempty and unique')
        seen.add(t['id'])
        provider = t.get('provider')
        if provider not in ADAPTERS or type(t.get('enabled')) is not bool:
            raise ValueError('invalid provider or enabled')
        required = {'runpod': ['gpu'], 'aws': ['region'], 'gcp': ['zone', 'gpu']}[provider]
        if provider == 'aws':
            mode = t.get('mode', 'catalog')
            if mode == 'catalog':
                required.append('instance_type')
            elif mode == 'spot_score':
                types = t.get('instance_types')
                if not isinstance(types, list) or len(set(types)) < 3 or any(not isinstance(x, str) or not x or x.startswith('-') for x in types):
                    raise ValueError('spot_score needs >= 3 distinct compatible instance types')
                if type(t.get('instance_count')) is not int or t['instance_count'] < 1:
                    raise ValueError('instance_count must be positive')
            else:
                raise ValueError('invalid AWS mode')
        for name in required:
            if not isinstance(t.get(name), str) or not t[name] or t[name].startswith('-'):
                raise ValueError('missing or invalid ' + name)
        if provider == 'runpod':
            if type(t.get('gpu_count')) is not int or t['gpu_count'] < 1 or type(t.get('secure_cloud')) is not bool:
                raise ValueError('invalid Runpod count/cloud')
            if t.get('region') or t.get('zone') or t.get('data_center_id'):
                raise ValueError('Runpod adapter only supports global scope; region cannot be silently ignored')
    return config


def check(t):
    result = {'id': t['id'], 'provider': t['provider'], 'checked_at': now(),
              'allocation_confirmed': False}
    if not t['enabled']:
        return {**result, 'status': 'not_configured', 'reason': 'example_target_disabled'}
    try:
        return {**result, **ADAPTERS[t['provider']](t)}
    except CheckError as exc:
        return {**result, 'status': 'error', 'reason': str(exc)}
    except Exception:
        return {**result, 'status': 'error', 'reason': 'unexpected_response_or_adapter_error'}


def changes(old, rows):
    def stable(row):
        return {k: v for k, v in row.items() if k != 'checked_at'}
    previous = {r['id']: stable(r) for r in old.get('results', [])}
    return [r for r in rows if previous.get(r['id']) != stable(r)]


def cycle(config, out):
    previous = out / 'latest.json'
    try:
        old = json.loads(previous.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        old = {}
    with ThreadPoolExecutor(max_workers=3) as executor:
        rows = list(executor.map(check, config['targets']))
    stamp = now()
    report = {'checked_at': stamp,
              'expires_at': (datetime.now(timezone.utc) + timedelta(seconds=config['interval_seconds'] * 2)).isoformat(),
              'note': 'Expired snapshots are unknown. No instance was allocated. Disabled targets are examples.',
              'results': rows}
    temporary = out / 'latest.tmp'
    temporary.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(previous)
    changed = changes(old, rows)
    if changed:
        with (out / 'changes.jsonl').open('a') as log:
            log.write(json.dumps({'at': stamp, 'changes': changed}, ensure_ascii=False) + '\n')
    print(json.dumps({'at': stamp, 'changes': changed, 'report': str(previous)}, ensure_ascii=False), flush=True)
    return any(r['status'] in ('error', 'not_configured') for r in rows) or not rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=ROOT / 'src/gpu_watch.example.json')
    parser.add_argument('--out', type=Path, default=ROOT / '.local/gpu-watch')
    parser.add_argument('--watch', action='store_true', help='poll until interrupted; no background installation')
    args = parser.parse_args()
    config = validate(json.loads(args.config.read_text()))
    args.out.mkdir(parents=True, exist_ok=True)
    with (args.out / 'watch.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            parser.error('another checker uses this output directory')
        while True:
            failed = cycle(config, args.out)
            if not args.watch:
                return 2 if failed else 0
            time.sleep(config['interval_seconds'])


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(0)
