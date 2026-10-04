import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('gpu_watch', Path(__file__).resolve().parents[1] / 'src/gpu_watch.py')
w = importlib.util.module_from_spec(spec)
spec.loader.exec_module(w)


class GpuWatchTests(unittest.TestCase):
    def setUp(self):
        self.config = json.loads((w.ROOT / 'src/gpu_watch.example.json').read_text())
        self.rp = {**self.config['targets'][0], 'enabled': True}

    def stock(self, price):
        return {'data': {'gpuTypes': [{'id': self.rp['gpu'], 'lowestPrice': price}]}}

    def test_runpod_stock_and_count(self):
        with patch.dict(w.os.environ, {'RUNPOD_API_KEY': 'test-secret'}):
            for stock, counts, expected in [('High', [1], 'stock_signal'), ('None', [], 'no_stock_signal'),
                                           ('Low', [2], 'no_stock_signal'), ('NewValue', [1], 'unknown')]:
                with patch.object(w, 'request', return_value=self.stock({'stockStatus': stock, 'availableGpuCounts': counts})):
                    self.assertEqual(w.check(self.rp)['status'], expected)

    def test_null_and_graphql_error_not_no_stock(self):
        with patch.dict(w.os.environ, {'RUNPOD_API_KEY': 'test-secret'}):
            with patch.object(w, 'request', return_value=self.stock(None)):
                self.assertEqual(w.check(self.rp)['status'], 'unknown')
            with patch.object(w, 'request', return_value={'errors': [{'message': 'test-secret'}]}):
                result = w.check(self.rp)
                self.assertEqual(result['status'], 'error')
                self.assertNotIn('test-secret', json.dumps(result))

    def test_missing_key_and_disabled(self):
        with patch.dict(w.os.environ, {}, clear=True):
            self.assertEqual(w.check(self.rp)['status'], 'error')
        with patch.object(w, 'request', side_effect=AssertionError('must not request')):
            self.assertEqual(w.check(self.config['targets'][0])['status'], 'not_configured')

    def test_aws_catalog_never_stock(self):
        with patch.object(w, 'command', return_value=json.dumps({'InstanceTypeOfferings': [{'Location': 'us-east-1a'}]})):
            result = w.aws(self.config['targets'][1])
            self.assertEqual(result['status'], 'catalog_only')
            self.assertEqual(result['locations'], ['us-east-1a'])

    def test_gcp_pagination(self):
        with patch.dict(w.os.environ, {'GOOGLE_CLOUD_PROJECT': 'test'}), patch.object(w, 'command', return_value='token'), patch.object(w, 'request', side_effect=[{'items': [], 'nextPageToken': 'next'}, {'items': [{'name': 'nvidia-tesla-t4'}]}]) as req:
            self.assertEqual(w.gcp(self.config['targets'][2])['status'], 'catalog_only')
            self.assertIn('pageToken=next', req.call_args[0][0])

    def test_spot_score_is_not_guarantee(self):
        target = {'id': 'spot', 'provider': 'aws', 'enabled': True, 'mode': 'spot_score',
                  'region': 'us-east-1', 'instance_types': ['g5.xlarge', 'g5.2xlarge', 'g5.4xlarge'],
                  'instance_count': 1}
        w.validate({'interval_seconds': 300, 'targets': [target]})
        with patch.object(w, 'command', return_value=json.dumps({'SpotPlacementScores': [{'Score': 10}]})):
            result = w.check(target)
            self.assertEqual(result['status'], 'placement_signal')
            self.assertFalse(result['allocation_confirmed'])
        target['instance_types'] = ['g5.xlarge']
        with self.assertRaises(ValueError):
            w.validate({'interval_seconds': 300, 'targets': [target]})

    def test_failure_replaces_old_stock_and_deduplicates(self):
        config = {**self.config, 'targets': [self.rp]}
        with tempfile.TemporaryDirectory() as directory, contextlib.redirect_stdout(io.StringIO()):
            out = Path(directory)
            with patch.dict(w.ADAPTERS, {'runpod': lambda t: {'status': 'stock_signal'}}):
                w.cycle(config, out)
                w.cycle(config, out)
            self.assertEqual(len((out / 'changes.jsonl').read_text().splitlines()), 1)
            with patch.dict(w.ADAPTERS, {'runpod': lambda t: (_ for _ in ()).throw(w.CheckError('http_429'))}):
                self.assertTrue(w.cycle(config, out))
            self.assertEqual(json.loads((out / 'latest.json').read_text())['results'][0]['status'], 'error')
            self.assertEqual(len((out / 'changes.jsonl').read_text().splitlines()), 2)

    def test_config_validation(self):
        w.validate(self.config)
        self.config['targets'][0]['zone'] = 'ignored-zone'
        with self.assertRaises(ValueError):
            w.validate(self.config)


if __name__ == '__main__':
    unittest.main()
