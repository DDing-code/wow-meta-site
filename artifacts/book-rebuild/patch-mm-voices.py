import io
p = r'C:\wowmeta\site\artifacts\mm-concept-sample\book-voices.cjs'
s = io.open(p, encoding='utf8').read()
anchor = "  {\n    id: 'azortharion-sims',"
assert s.count(anchor) == 1
voice = """  {
    id: 'azortharion-raid',
    name: 'Azortharion',
    channel: '가이드 글 · Wowhead 공격대 팁',
    title: '사격 사냥꾼 한밤 시즌 2 공격대 팁(Wowhead 공략)',
    url: 'https://www.wowhead.com/ko/guide/classes/hunter/marksmanship/midnight-season-2-raid-tips',
    date: '2026-08-18 수정',
    access: '직접 읽음(브라우저)',
    takeaways: [
      '맹독 심연 모든 네임드에서 파수꾼을 씁니다. 스조라크만 단일 빌드, 님리사는 광역 빌드, 나머지는 히드라의 상 빌드입니다.',
      '스조라크·똬리의 제단·쌍둥이 송곳니는 정조준을 맞출 구간이 정해져 있다고 적었습니다.',
      '사격의 공격대 약점으로 쿨기 중 강제 이동을 꼽습니다. 출시 전에 쓴 부분이 있어 일부 팁은 작성자도 확실하지 않다고 밝혔습니다.',
    ],
  },
"""
s = s.replace(anchor, voice + anchor, 1)
tips_anchor = "  logs: ["
assert s.count(tips_anchor) == 1
raid = """  raid: [
    { voice: 'azortharion-raid', text: '스조라크는 매번 같은 시점에 오는 구간에 정조준을 맞추고, 쌍둥이 송곳니는 쫄 무리가 나올 때까지 정조준을 아낍니다.' },
    { voice: 'azortharion-videos', text: '연사로 붙는 폭발 사격은 연발 공격 0.5초 뒤에 걸립니다. 그래서 쫄이 나오기 직전에 연발 공격을 미리 깔아도 됩니다.' },
    { voice: 'azortharion-raid', text: '사격은 강제 이동에 약합니다. 쿨기 중에 이동이 겹치는 네임드에서는 이동 구간을 피해 정조준 자리를 잡습니다.' },
  ],
"""
s = s.replace(tips_anchor, raid + tips_anchor, 1)
io.open(p, 'w', encoding='utf8', newline='').write(s)
print('ok')
