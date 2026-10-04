"""Detect macOS file placeholders before a model loader blocks in mmap."""
from pathlib import Path


def require_resident_files(paths):
    for path in paths:
        path = Path(path)
        if getattr(path.stat(), "st_flags", 0) & 0x40000000:  # macOS SF_DATALESS
            raise RuntimeError(
                f"LOCAL_MODEL_NOT_RESIDENT: 模型文件尚未完整保存在本机：{path.name}；"
                "请恢复本地文件后再生成，不是生成步数或显存问题。"
            )


def require_resident_tree(directory):
    root = Path(directory)
    require_resident_files(
        p for p in root.rglob("*")
        if ".cache" not in p.relative_to(root).parts and p.is_file()
    )
