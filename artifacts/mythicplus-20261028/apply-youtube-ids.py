"""유튜브 업로드 기록의 영상 번호를 쐐기 가이드 정본(KB mythicplus-guide.json)에 넣는다.

입력: ai-hub workspace/outputs/mythicplus-dungeon-storyboard-20261026/youtube-upload.json (youtube-upload.mjs 기록, 와우메타 채널 공개분만)
출력: artifacts/mythicplus-20261028/youtube-ids.json (slug → 번호, build.py 가 다시 돌 때 읽음)
      KB 정본의 dungeons[].video.youtubeId (그 밖의 내용은 건드리지 않는다)
실행: python artifacts/mythicplus-20261028/apply-youtube-ids.py  →  npm run sync-kb → npm run validate:mythicplus-guide
"""
import json
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parents[2]
KB = SITE.parent / "WoW-Meta-Knowledge" / "08-직업별-Knowledge-Base" / "00-공통" / "공용" / "Meta" / "mythicplus-guide.json"
UPLOADS = Path(r"F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/mythicplus-dungeon-storyboard-20261026/youtube-upload.json")
IDS = Path(__file__).with_name("youtube-ids.json")
CHANNEL = "UCYXt-DyhdhkkRqB-UUJRdKQ"   # wowmeta 와우메타

items = json.loads(UPLOADS.read_text(encoding="utf-8"))
ids = {}
for item in items:
    if item.get("status") != "published" or item.get("channelId") != CHANNEL:
        print(f"건너뜀(공개 아님): {item['id']} {item.get('status')}")
        continue
    assert re.fullmatch(r"[A-Za-z0-9_-]{11}", item["youtubeId"]), item
    ids[item["id"]] = item["youtubeId"]

guide = json.loads(KB.read_text(encoding="utf-8"))
changed = 0
for d in guide["dungeons"]:
    new = ids.get(d["id"])
    if new is None:
        continue
    item = next(x for x in items if x["id"] == d["id"])
    assert item["title"] == d["video"]["title"], (item["title"], d["video"]["title"])
    if d["video"]["youtubeId"] != new:
        d["video"]["youtubeId"] = new
        changed += 1
IDS.write_text(json.dumps(ids, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")
KB.write_text(json.dumps(guide, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")
print(f"영상 번호 {len(ids)}개 · 정본 갱신 {changed}개 → {KB}")
print("\n".join(f"  {k}: {v}" for k, v in ids.items()))
sys.exit(0 if len(ids) == 8 else 1)
