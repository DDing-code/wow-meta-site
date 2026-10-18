import io
p = r'C:\wowmeta\site\artifacts\mm-concept-sample\book-timelines.cjs'
s = io.open(p, encoding='utf8').read()
start = s.index("      {\n        label: '오프닝 — 파수꾼")
end = s.index("      {\n        label: '반복 흐름 — 단일")
opener_rails = s[start:end]
s = s[:start] + s[end:]
s = s.replace(
    "    intro: '굵은 줄이 손이 가는 순서입니다. 줄 위로 올라간 스킬은 그 조건이 됐을 때 그 자리에 끼워 넣습니다. 아이콘에 마우스를 올리면 스킬 설명이 뜹니다.',",
    "    intro: '굵은 줄이 손이 가는 순서입니다. 줄 위로 올라간 스킬은 그 조건이 됐을 때 그 자리에 끼워 넣습니다. 아이콘에 마우스를 올리면 스킬 설명이 뜹니다. 전투 시작 순서는 다음 장의 오프닝 타임라인에 있습니다.',",
    1)
opener = (
    "  '정조준과 오프닝: 몇 번 쓰느냐가 먼저입니다': {\n"
    "    title: '오프닝 타임라인 — 영웅 특성별',\n"
    "    intro: '허수아비 앞에서 풀 카운트를 세며 이 순서대로 연습합니다. 마지막 아이콘 다음에는 앞 장의 단일 반복 흐름으로 넘어갑니다.',\n"
    "    rails: [\n" + opener_rails + "    ],\n"
    "  },\n\n"
)
anchor = "  '광역은 교묘한 사격 켜기부터': {"
s = s.replace(anchor, opener + anchor, 1)
io.open(p, 'w', encoding='utf8', newline='').write(s)
print('ok')
