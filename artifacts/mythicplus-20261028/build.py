"""쐐기 던전 8곳 가이드를 사이트 정본(KB mythicplus-guide.json)과 사이트 그림(public/images/mythicplus)으로 옮긴다.

원본: ai-hub workspace/outputs/mythicplus-dungeon-storyboard-20261026 (2026-10-27 한글화·풀링 확대·공식 설명 복원판)
  data/dungeons.json            루트·풀링·몹·스킬(와우헤드 한국어 툴팁, 게임 공식 한국어 문장)
  data/tactics/<slug>.json      요령(Method 한밤 2시즌판 통일) — overview·trash·pulls·bosses·sources
  video/<slug>.scenes.json      영상 장면표(네임드 동작 제목) / video/<slug>.captured.json 실제 시각
  frames/<slug>/00-route.png    전체 루트(지도 부분만 자른다)
  frames/<slug>/pull-NN.png     풀링 컷(왼쪽 지도 800x720 부분만 자른다 — 글은 사이트에서 글로 보인다)
  diagrams/<slug>/boss-<npc>-NN.png  네임드 동작 도식(영상 장면의 지도 부분 1100x748만 자른다)
  assets/sprites/<npc>.png · 초보자 영상 cut/<이름>_0.png   도트 모델
  thumbnails/art/<slug>.png     유튜브 썸네일 픽셀아트(글 없음) → 홈 카드·던전 머리 그림

실행: python artifacts/mythicplus-20261028/build.py [--no-images]
그 다음 npm run sync-kb → src/data/mythicPlusGuide.json, npm run validate:mythicplus-guide.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image

SITE = Path(__file__).resolve().parents[2]
KB = SITE.parent / "WoW-Meta-Knowledge" / "08-직업별-Knowledge-Base" / "00-공통" / "공용" / "Meta" / "mythicplus-guide.json"
SB = Path(r"F:/01_프로젝트/90_개발/ai-hub/workspace/outputs/mythicplus-dungeon-storyboard-20261026")
BEGINNER = SB.parent / "beginner-pixel-video-20261026" / "assets" / "cut"
OUT = SITE / "public" / "images" / "mythicplus"
NO_IMAGES = "--no-images" in sys.argv
# 유튜브 번호(던전 slug → 11자리). apply-youtube-ids.py 가 업로드 기록에서 만든다. 다시 돌려도 번호가 지워지지 않게 여기서 읽는다.
YOUTUBE_IDS_FILE = Path(__file__).with_name("youtube-ids.json")
YOUTUBE_IDS = json.loads(YOUTUBE_IDS_FILE.read_text(encoding="utf-8")) if YOUTUBE_IDS_FILE.exists() else {}

BG = (11, 15, 19)
# 송곳니의 제단은 초보자 영상 때 그린 도트 모델을 쓴다(build_frames.SPRITE 와 같다)
SPRITE = {259445: "b_ravi", 259446: "b_coil", 259447: "b_zuljan", 261560: "m_primal", 261554: "m_twinfang", 261553: "m_ravenous",
          261557: "m_evolutionist", 263109: "m_chosen", 261550: "m_leech", 262398: "m_uncoiled", 270417: "m_uncoiled",
          261552: "m_bloodletter", 261573: "m_ascendant", 270306: "m_chieftain", 271453: "m_blade"}
MINI = {187897, 197697, 197698, 197535}      # 루비 생명의 웅덩이의 네임드급 주요 쫄(조사 결과에 네임드처럼 적힘)
TAGS = (("kick", "차단"), ("dispel", "해제"), ("dodge", "피하기"), ("tank", "탱커"), ("cc", "통제"))
TAG_ORDER = {"차단": 0, "해제": 1, "통제": 2, "탱커": 3, "피하기": 4}
COLORS = {"altar-of-fangs": "#a6d779", "den-of-nalorakk": "#83d0ed", "kings-rest": "#e7c46f", "murder-row": "#e8836f",
          "ruby-life-pools": "#f0a050", "temple-of-sethraliss": "#7fd4b8", "the-blinding-vale": "#f3e7a8", "voidscar-arena": "#bb9ff3"}
ORDINAL = ["첫 번째", "두 번째", "세 번째", "네 번째", "다섯 번째"]


def read(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def webp(im, dest, width=None, quality=82):
    if NO_IMAGES:
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    if width and im.width != width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(dest, "WEBP", quality=quality, method=6)


def trim_bg(im, bg=BG):
    """바탕색(검정 여백)을 사방에서 잘라 낸다."""
    px = im.convert("RGB").load()
    w, h = im.size
    def is_bg(x, y):
        r, g, b = px[x, y]
        return abs(r - bg[0]) < 6 and abs(g - bg[1]) < 6 and abs(b - bg[2]) < 6
    x0 = next(x for x in range(w) if not all(is_bg(x, y) for y in range(0, h, 7)))
    x1 = next(x for x in range(w - 1, -1, -1) if not all(is_bg(x, y) for y in range(0, h, 7))) + 1
    y0 = next(y for y in range(h) if not all(is_bg(x, y) for x in range(0, w, 7)))
    y1 = next(y for y in range(h - 1, -1, -1) if not all(is_bg(x, y) for x in range(0, w, 7))) + 1
    return im.crop((x0, y0, x1, y1))


def sprite_src(npc):
    name = SPRITE.get(int(npc))
    p = BEGINNER / f"{name}_0.png" if name else SB / "assets" / "sprites" / f"{npc}.png"
    if not p.exists():
        return None
    im = Image.open(p).convert("RGBA")
    bb = im.getbbox()
    return im.crop(bb) if bb else None


def clean_desc(s):
    """와우헤드 설명의 `|1을;를;` 조사 표기를 앞 글자 받침으로 푼다(글은 고치지 않음 — build_frames.clean_desc 와 같은 규칙)."""
    if not s:
        return s
    def pick(m):
        before = s[:m.start()]
        ch = before[-1] if before else ""
        has = 0xAC00 <= ord(ch) <= 0xD7A3 and (ord(ch) - 0xAC00) % 28 != 0
        a, b = m.group(1), m.group(2)
        return a if has else b
    return re.sub(r"\|1([^;]*);([^;]*);", pick, s)


def clock(sec):
    sec = int(round(sec))
    return f"{sec // 60}:{sec % 60:02d}"


def build_dungeon(D, n_index):
    slug = D["slug"]
    tac = read(SB / "data" / "tactics" / f"{slug}.json")
    scenes = read(SB / "video" / f"{slug}.scenes.json")
    captured = read(SB / "video" / f"{slug}.captured.json")
    mobs = D["mobs"]
    pulls = D["pulls"]
    color = COLORS[slug]

    # 스킬 사전(이름 있는 것만). 설명은 공식 한국어(와우헤드 ko 또는 게임 클라이언트 문장).
    spells = {}
    for m in mobs.values():
        for sp in m["spells"]:
            if not sp.get("name"):
                continue
            spells[str(sp["id"])] = {
                "name": sp["name"], "icon": sp.get("icon") or "", "cast": sp.get("cast") or "",
                "desc": clean_desc(sp.get("desc") or ""), "status": sp.get("descriptionStatus") or "none",
                "mob": int(m["id"]),
            }

    def tags_for(npc):
        m = mobs[str(npc)]
        t = (tac.get("trash") or {}).get(str(npc)) or (tac.get("bosses") or {}).get(str(npc)) or {}
        have = {s["id"] for s in m["spells"] if s.get("name")}
        out = []
        for key, lab in TAGS:
            for sid in t.get(key) or []:
                if int(sid) in have:
                    out.append({"tag": lab, "spell": int(sid)})
        if not t:   # 조사 결과가 없는 몹은 MDT 표시(차단·해제)를 쓴다
            for s in m["spells"]:
                for f in s.get("flags") or []:
                    if f == "차단" or f.endswith("해제"):
                        out.append({"tag": "차단" if f == "차단" else "해제", "spell": s["id"]})
        return out, list(t.get("notes") or []), t.get("priority")

    # 몹 사전
    mob_out = {}
    for key, m in mobs.items():
        tags, notes, priority = tags_for(key)
        # 표시된 스킬부터, 모자라면 설명 있는 스킬 둘까지 (build_frames.mob_skills 와 같은 선택)
        by = {}
        for t in tags:
            by.setdefault(t["spell"], []).append(t["tag"])
        rows = sorted(by.items(), key=lambda r: min(TAG_ORDER.get(t, 9) for t in r[1]))
        shown = [sid for sid, _ in rows]
        if len(shown) < 2:
            for s in m["spells"]:
                if s["id"] not in by and s.get("name") and s.get("desc") and len(shown) < 2:
                    shown.append(s["id"])
        mob_out[key] = {
            "name": m["ko"], "en": m["en"], "forces": m.get("forces") or 0, "boss": bool(m["boss"]), "type": m.get("type") or "",
            "cc": list(m.get("cc") or []),
            "priority": priority or "", "notes": notes,
            "spells": [{"id": sid, "tags": by.get(sid, [])} for sid in shown],
            "sprite": key if sprite_src(key) is not None else None,
        }
    # 루트에 처음 나오는 쫄(네임드 제외)마다 설명 하나 — 설명할 스킬도 요령도 없는 몹은 뺀다 (build_frames.mob_cuts)
    seen, first_at = set(), {}
    for p in pulls:
        for mm in p["mobs"]:
            npc = int(mm["id"])
            m = mobs[str(npc)]
            if m["boss"] or npc in seen:
                continue
            seen.add(npc)
            mo = mob_out[str(npc)]
            if mo["spells"] or mo["notes"]:
                first_at.setdefault(p["n"], []).append(npc)

    # 장면 시각(실제 렌더 시각)
    pull_second, boss_second = {}, {}
    for sc in captured:
        if sc.get("kind") == "pull" and sc.get("pull") is not None:
            pull_second.setdefault(int(sc["pull"]), int(round(sc["start"])))
        if sc.get("kind") == "boss" and sc.get("step") == 0:
            boss_second.setdefault(str(sc["npc"]), int(round(sc["start"])))
    scene_titles = {}
    for sc in scenes:
        if sc.get("kind") == "boss":
            scene_titles[(str(sc["npc"]), int(sc["step"]))] = sc["title"]
    overview_second = next((int(round(sc["start"])) for sc in captured if sc.get("kind") == "overview"), 0)
    route_second = next((int(round(sc["start"])) for sc in captured if sc.get("kind") == "route"), 0)
    total = max(sc["end"] for sc in captured)

    # 풀링
    pull_out = []
    for p in pulls:
        boss_ids = [int(mm["id"]) for mm in p["mobs"] if mobs[str(mm["id"])]["boss"]]
        pull_out.append({
            "n": p["n"], "boss": bool(p["boss"]), "bossIds": boss_ids,
            "forces": p["forces"], "pct": p["pct"], "cum": p["cum"],
            "mobs": [{"id": int(mm["id"]), "count": mm["count"]} for mm in p["mobs"]],
            "notes": list((tac.get("pulls") or {}).get(str(p["n"])) or []),
            "newMobs": first_at.get(p["n"], []),
            "figure": f"pull-{p['n']:02d}",
            "videoSecond": pull_second.get(p["n"]),
        })

    # 네임드(조사 결과 순서 = 루트 순서). 루비의 주요 쫄은 '주요 쫄'로 표시
    boss_out = []
    real_index = 0
    for npc, t in (tac.get("bosses") or {}).items():
        m = mobs[str(npc)]
        pull_n = next((p["n"] for p in pulls if any(int(mm["id"]) == int(npc) for mm in p["mobs"])), None)
        major = int(npc) in MINI or not m["boss"]
        if major:
            order = f"주요 쫄 · 풀링 {pull_n}" if pull_n else "주요 쫄"
        else:
            order = f"{ORDINAL[real_index]} 네임드"
            real_index += 1
        keys = [int(k) for k in (t.get("keySpells") or []) if str(k) in spells][:8]
        diagram_dir = SB / "diagrams" / slug
        steps = []
        for i, line in enumerate(t.get("flow") or []):
            fig = f"boss-{npc}-{i + 1:02d}"
            has = (diagram_dir / f"{fig}.png").exists()
            steps.append({"title": scene_titles.get((str(npc), i), f"동작 {i + 1}"), "text": line, "figure": fig if has else None})
        boss_out.append({
            "id": str(npc), "name": m["ko"], "en": m["en"], "order": order, "major": major, "pull": pull_n,
            "sprite": str(npc) if sprite_src(npc) is not None else None,
            "summary": t.get("summary") or "", "steps": steps,
            "roles": [{"role": r, "text": list(v)} for r, v in (t.get("roles") or {}).items() if v],
            "keySpells": keys, "danger": t.get("danger") or "",
            "videoSecond": boss_second.get(str(npc)),
        })

    # 꼭 끊을 것 · 지울 것(우선도 순, build_frames.Stage.kicks_dispels)
    order = {"높음": 0, "보통": 1, "낮음": 2, "": 3}
    kicks, dispels = [], []
    for npc, tr in (tac.get("trash") or {}).items():
        if str(npc) not in mobs:
            continue
        have = {s["id"] for s in mobs[str(npc)]["spells"] if s.get("name")}
        for sid in tr.get("kick") or []:
            if int(sid) in have:
                kicks.append((order.get(tr.get("priority") or "", 3), int(npc), int(sid)))
        for sid in tr.get("dispel") or []:
            if int(sid) in have:
                dispels.append((order.get(tr.get("priority") or "", 3), int(npc), int(sid)))
    kicks.sort(key=lambda x: x[0])
    dispels.sort(key=lambda x: x[0])

    r = D["route"]
    chapters = [{"second": route_second, "label": "루트와 전투 순서", "section": "route"},
                {"second": overview_second, "label": "던전 개요", "section": "route"}]
    first_pull = next((p for p in pull_out if p["videoSecond"] is not None), None)
    if first_pull:
        chapters.append({"second": first_pull["videoSecond"], "label": f"풀링 {first_pull['n']}부터", "section": "pulls"})
    for b in boss_out:
        if b["videoSecond"] is not None:
            chapters.append({"second": b["videoSecond"], "label": b["name"], "section": f"boss-{b['id']}"})
    chapters.sort(key=lambda c: c["second"])

    out = {
        "id": slug, "name": D["ko"], "en": D["en"], "abbr": D["abbr"], "color": color,
        "timer": D["timer"], "required": D["required"], "routeForces": D["routeForces"],
        "route": {"runs": r["runs"], "timed": r["timed"], "medianSec": r["medianSec"], "level": r.get("level"),
                  "totalRuns": D["routeTotalRuns"], "key": r.get("routeKey"), "url": D.get("routeKeyUrl") or ""},
        "overview": tac.get("overview") or "",
        "video": {"youtubeId": YOUTUBE_IDS.get(slug), "title": f"한밤 2시즌 12.1.5 {D['ko']} 가이드", "length": clock(total), "chapters": chapters},
        "thumbnail": slug,
        "routeFigure": "route",
        "bosses": boss_out,
        "pulls": pull_out,
        "mobs": mob_out,
        "spells": spells,
        "kicks": [{"mob": npc, "spell": sid} for _, npc, sid in kicks],
        "dispels": [{"mob": npc, "spell": sid} for _, npc, sid in dispels],
        "sources": [{"title": s["title"], "href": s["url"], "note": s.get("note") or ""} for s in tac.get("sources") or []],
    }

    if not NO_IMAGES:
        dest = OUT / slug
        # 전체 루트: 1920x1080 컷의 지도 부분(위 90·아래 60 글줄 제외) → 검정 여백 정리
        route = Image.open(SB / "frames" / slug / "00-route.png").convert("RGB").crop((0, 90, 1920, 1020))
        route = trim_bg(route)
        webp(route, dest / "route-1600.webp", 1600)
        webp(route, dest / "route-960.webp", 960)
        # 풀링: 1280x720 컷의 왼쪽 지도 800x720(번호·금색 띠·도트 모델 포함)
        for p in pull_out:
            src = SB / "frames" / slug / f"{p['figure']}.png"
            im = Image.open(src).convert("RGB").crop((0, 0, 800, 720))
            webp(im, dest / f"{p['figure']}-800.webp", 800)
        # 네임드 동작 도식: 1920x1080 장면의 지도 부분(60,180)-(1160,928)
        for b in boss_out:
            for s in b["steps"]:
                if not s["figure"]:
                    continue
                im = Image.open(SB / "diagrams" / slug / f"{s['figure']}.png").convert("RGB").crop((60, 180, 1160, 928))
                webp(im, dest / f"{s['figure']}-960.webp", 960)
        # 썸네일 픽셀아트(글 없음) → 16:9 가운데 960x540
        art = Image.open(SB / "thumbnails" / "art" / f"{slug}.png").convert("RGB")
        tw = art.width
        th = round(tw * 9 / 16)
        top = (art.height - th) // 2
        art = art.crop((0, top, tw, top + th))
        webp(art, OUT / "thumb" / f"{slug}-960.webp", 960)
        # 도트 모델(투명 배경) 높이 192
        for key in mobs:
            sp = sprite_src(key)
            if sp is None:
                continue
            h = 192
            w = max(1, round(sp.width * h / sp.height))
            if w > h * 1.7:
                w = round(h * 1.7)
                h = max(1, round(sp.height * w / sp.width))
            sp = sp.resize((w, h), Image.LANCZOS)
            p = OUT / "sprites" / f"{key}.webp"
            p.parent.mkdir(parents=True, exist_ok=True)
            sp.save(p, "WEBP", quality=90, method=6)
    return out


def main():
    data = read(SB / "data" / "dungeons.json")
    dungeons = [build_dungeon(D, i) for i, D in enumerate(data["dungeons"])]
    guide = {
        "metadata": {
            "patch": "12.1.5", "updated": "2026-10-28", "season": "한밤 2시즌", "difficulty": "쐐기",
            "client": "12.1.5.70575 koKR(핫픽스 포함)",
            "storyboard": "ai-hub workspace/outputs/mythicplus-dungeon-storyboard-20261026 (던전 8곳, 2026-10-27 한글화·풀링 확대·공식 한국어 설명 복원판)의 요령·풀링·몹 자료를 글로 옮기고, 전체 루트·풀링 지도·네임드 동작 도식·도트 모델을 WebP로 넣었다(artifacts/mythicplus-20261028/build.py). 풀링 지도의 글은 사이트에서 글로 보이므로 지도 부분만 잘랐다. 영상 번호는 유튜브 공개 뒤 dungeons[].video.youtubeId 에 넣는다.",
        },
        "page": {
            "eyebrow": "한밤 시즌 2 · 쐐기 던전 8곳 · 가장 많이 쓴 루트 기준",
            "title": "쐐기 가이드",
            "lead": "한밤 시즌 2 쐐기 던전 8곳을 던전마다 한 탭으로 정리했습니다. 가장 많이 쓴 루트의 풀링 순서, 몹마다 차단·해제·피하기 표시, 네임드 전투 흐름을 지도와 동작 도식으로 차례로 적었습니다.",
            "notes": [
                "루트는 레이더 아이오 던전 탐색기에서 최근 2주 2~11단 기록 중 가장 많이 쓴 1번 루트이고, 풀링 번호와 몹 구성은 그 기록을 키스톤 구루로 연 그대로입니다.",
                "요령은 Method 한밤 시즌 2 공략을 기준으로 통일했습니다. 공식 패치·긴급 수정이 Method와 다를 때만 공식 쪽을 따르고, 다른 공략은 Method에 없는 내용만 보조로 썼습니다.",
                "몹·스킬 이름과 설명은 와우헤드 한국어 툴팁 기준이고, 와우헤드에 영어만 있던 스킬은 게임 클라이언트의 공식 한국어 문장을 그대로 썼습니다. 수치가 공략과 툴팁에서 다르면 본문에는 적지 않았습니다.",
                "몹별 스킬 목록과 차단·해제 표시는 MythicDungeonTools(MDT) 자료를 따릅니다. 스킬 이름에 마우스를 올리면 한국어 공식 툴팁이 열립니다.",
                "네임드 동작 도식의 사람·장판·이동 경로·크기는 동작을 설명하는 배치 예시이며 실제 전투 좌표나 거리 축척이 아닙니다. 같은 내용을 와우메타 채널의 던전별 영상으로도 볼 수 있습니다.",
            ],
        },
        "legend": {"차단": "차단한다", "해제": "해제한다", "피하기": "피한다", "탱커": "탱커가 받는다", "통제": "군중 제어로 끊는다"},
        "sources": {
            "raiderio": {"title": "레이더 아이오 · 던전 탐색기(Dungeon Explorer)", "href": "https://raider.io/dungeons/season-mn-2", "note": "최근 2주·2~11단·가장 많이 쓴 루트 1번(2026-10-26 확인)"},
            "keystone": {"title": "키스톤 구루 · 루트 지도", "href": "https://keystone.guru/", "note": "레이더 아이오 1번 루트의 대표 기록을 연 풀링 번호·몹 구성·지도 타일"},
            "mdt": {"title": "MythicDungeonTools(MDT)", "href": "https://github.com/Nnoggie/MythicDungeonTools", "note": "몹별 스킬 목록과 차단·해제 표시(2026-10-23 판)"},
            "wowhead": {"title": "와우헤드 한국어", "href": "https://ko.wowhead.com/", "note": "몹·스킬 이름·설명·수치의 기준(한국어 공식 툴팁)"},
            "client": {"title": "게임 클라이언트 공식 한국어 문장(SpellEffectAutoDescription, Wago Tools)", "href": "https://wago.tools/db2/SpellEffectAutoDescription?build=12.1.5.70575", "note": "와우헤드에 영어만 있던 스킬 24종의 공식 한국어 설명(12.1.5.70575 koKR, 핫픽스 포함)"},
            "method": {"title": "Method · 한밤 시즌 2 던전 공략", "href": "https://www.method.gg/guides/dungeons", "note": "요령의 기준(던전마다 근거에 따로 적음)"},
        },
        "dungeons": dungeons,
    }
    KB.parent.mkdir(parents=True, exist_ok=True)
    KB.write_text(json.dumps(guide, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")
    print(f"KB: {KB} ({KB.stat().st_size // 1024} KB) · 던전 {len(dungeons)} · 풀링 {sum(len(d['pulls']) for d in dungeons)} · 네임드 {sum(len(d['bosses']) for d in dungeons)}")
    if not NO_IMAGES:
        files = list(OUT.rglob("*.webp"))
        print(f"그림 {len(files)}장 · {sum(f.stat().st_size for f in files) // 1024 // 1024} MB → {OUT}")


if __name__ == "__main__":
    main()
