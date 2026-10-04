"""macOS startup headroom estimate, including reclaimable file-backed cache.
Runtime protection continues to use psutil's conservative available metric.
"""
import re
import subprocess
import sys


def macos_start_available(text, total):
    page = re.search(r'page size of (\d+) bytes', text)
    counters = {k.strip(): int(v) for k, v in re.findall(r'^([^:\n]+):\s*(\d+)\.', text, re.M)}
    required = ('Pages free', 'Pages speculative', 'File-backed pages',
                'Anonymous pages', 'Pages wired down', 'Pages occupied by compressor')
    if not page or any(k not in counters for k in required):
        raise ValueError('Incomplete macOS memory statistics')
    size = int(page[1])
    cache_headroom = sum(counters[k] for k in required[:3]) * size
    # Bound the estimate to exclude wired, anonymous and compressed memory.
    noncache_headroom = total - sum(counters[k] for k in required[3:]) * size
    return max(0, min(total, cache_headroom, noncache_headroom))


def startup_memory(memory):
    result = {'availableBytes': memory.available, 'psutilAvailableBytes': memory.available,
              'method': 'psutil'}
    if sys.platform == 'darwin':
        try:
            text = subprocess.run(['/usr/bin/vm_stat'], capture_output=True, text=True,
                                  timeout=3, check=True).stdout
            estimate = macos_start_available(text, memory.total)
            result.update(availableBytes=estimate, method='macos_file_cache_bounded')
        except (OSError, ValueError, subprocess.SubprocessError):
            pass  # Missing statistics must never bypass the original check.
    return result
