#!/usr/bin/env python3
"""Render the Recall Rescue sample sprint pack (A4, 2 pages) to PDF.

Usage:
    python3 tools/build_sample_pack.py [output.pdf]

Default output: ../downloads/Recall-Rescue-Sample-Pack.pdf relative to the repo root
(i.e. assets/Recall-Rescue-Sample-Pack.pdf in the repo).
"""
import os
import sys
from weasyprint import HTML

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
SRC = os.path.join(HERE, "sample-pack.html")


def main() -> int:
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(REPO, "assets", "Recall-Rescue-Sample-Pack.pdf")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    HTML(filename=SRC).write_pdf(out)
    print("wrote", out, os.path.getsize(out), "bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
