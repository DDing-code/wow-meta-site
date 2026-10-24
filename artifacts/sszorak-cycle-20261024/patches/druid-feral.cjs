// druid-feral 단일 딜사이클 스조라크 대조 — 근거: digests/druid-feral.md, apl/druid_feral.simc, sources/druid-feral.txt
// 두 오프닝: 도려내기 뒤 마무리 일격 하나(야생추적자 흉포한 이빨 8/10, 발톱 찢어발기기 6/8)를 쓰고 영혼 소집.
// 야생추적자 오프닝에 달빛섬광(달 바라기, 8/10), 단일 반복 rail 의 영혼 소집을 흉포한 이빨 뒤로, 야생추적자 단일 우선순위의 달빛섬광을 기습 칼날 발톱 위로.
// 숨기(프리풀)는 이미 있고 심크 precombat prowl·Icy·Method 와 맞아 그대로 둔다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 18개(야생추적자 10·발톱의 드루이드 8)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757)·Icy Veins·Method 프리풀을 대조해, 두 오프닝에서 도려내기 뒤 마무리 일격 하나를 쓰고 영혼 소집에 들어가도록 고쳤습니다(야생추적자 흉포한 이빨 10개 중 8개, 발톱의 드루이드 찢어발기기 8개 중 6개). 야생추적자 오프닝에 달빛섬광(달 바라기, 10개 중 8개)을 끼우고, 단일 반복 흐름의 영혼 소집을 흉포한 이빨 뒤로, 야생추적자 단일 우선순위의 달빛섬광을 기습 공격 칼날 발톱 위로 올렸습니다. 풀링 전 숨기는 그대로 두었습니다.',
  changelog: [
    '- 야생추적자 오프닝(연습 장 타임라인·영웅 탭): … 도려내기 → 영혼 소집 → 흉포한 이빨 을 … 도려내기 → 흉포한 이빨 → 영혼 소집 → 흉포한 이빨 로, 도려내기 앞에 달빛섬광(달 바라기 선택 시) 추가 (근거: 스조라크 야생추적자 로그 10개 중 8개가 영혼 소집 직전에 흉포한 이빨, 8개가 오프닝에 달빛섬광. 심크 우선순위 convoke_the_spirits 의 prev_gcd.1.ferocious_bite, builder 의 moonfire_cat)',
    '- 발톱의 드루이드 오프닝: … 도려내기 → 영혼 소집 → 흉포한 이빨 을 … 도려내기 → 찢어발기기(점수 모자라면 칼날 발톱 먼저) → 영혼 소집 → 흉포한 이빨 로 (근거: 스조라크 발톱의 드루이드 로그 8개 중 6개가 영혼 소집 전에 찢어발기기, 4개는 그 앞에 칼날 발톱)',
    '- 단일 반복 rail: 영혼 소집 위 가지를 흉포한 이빨 노드에서 그다음 칼날 발톱 노드로 옮김(이빨 직후) (근거: 반복 구간 영혼 소집 55회 중 바로 앞이 흉포한 이빨·찢어발기기 32회, 도려내기 10회)',
    '- 야생추적자 단일 우선순위: 달빛섬광을 칼날 발톱(기습 공격) 위로 (근거: 심크 우선순위 builder 가 rake → moonfire_cat → shred 이고 기습 공격 칼날 발톱 우선은 발톱의 드루이드 전용, 로그 분당 달빛섬광 4.6회)',
    '- 오프닝 장 한 줄 원리·본문, rail note 를 같은 순서로 맞춤',
    '- 그대로 둔 것: 숨기(풀링 전, 심크 우선순위 precombat prowl·Icy·Method 일치), 호랑이의 분노 → 갈퀴 발톱 → 광폭화 → 야성의 광기 → 도려내기(발톱 8개 중 5개 같은 순서, 야생추적자는 야성의 광기가 도려내기 앞뒤 5:5)',
    '- 보류: 재생(분당 1.5~2회, 포식자의 신속함 즉시 시전)은 심크 우선순위에서 variable.regrowth=0 으로 쓰지 않는 치유라 딜사이클에 넣지 않음',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));

    // 2부 단일 연습: 영혼 소집 위 가지를 이빨 다음 노드로
    const single = block('허수아비 첫 연습');
    const loop = tlOf(single)[0].rails.find(r => r.loop);
    const at = loop.nodes.findIndex(n => n.above && n.above.skillId === '391528');
    if (at < 0 || loop.nodes[at].skillId !== '22568' || !loop.nodes[at + 1]) throw new Error('영혼 소집 위 가지 위치가 예상과 다름');
    const {above, ...fb} = loop.nodes[at];
    loop.nodes[at] = fb;
    loop.nodes[at + 1] = {...loop.nodes[at + 1], above: {skillId: '391528', when: '이빨 직후 · 출혈 남음'}};
    loop.note = rep(loop.note,
      '이미 5점이라면 생성기보다 마무리 판단이 먼저입니다.',
      '이미 5점이라면 생성기보다 마무리 판단이 먼저입니다. 영혼 소집은 흉포한 이빨로 점수를 비운 직후에 시작합니다.');

    single.paragraphs[0] = rep(single.paragraphs[0],
      '기습 공격이 떠 있어도 갈퀴 발톱 갱신을 칼날 발톱보다 먼저 봅니다.',
      '기습 공격이 떠 있어도 갈퀴 발톱 갱신과 달빛섬광(달 바라기 선택 시)을 칼날 발톱보다 먼저 봅니다.');

    // 2부 오프닝 연습
    const opener = block('쿨기와 오프닝');
    opener.concept = '단일 오프닝은 숨기로 접근해 첫 갈퀴 발톱 직전에 호랑이의 분노를 쓰고, 광폭화와 야성의 광기로 첫 5점 도려내기를 건 뒤, 마무리 일격 하나로 점수를 비우고 영혼 소집을 끝까지 쓰는 흐름입니다. 야생추적자는 흉포한 이빨, 발톱의 드루이드는 찢어발기기로 비웁니다.';
    opener.paragraphs[1] = '은신 중 갈퀴 발톱으로 첫 출혈과 점수를 만들고, 광폭화와 야성의 광기로 첫 5점을 채워 도려내기를 겁니다. 그다음 마무리 일격 하나로 점수를 비우고 영혼 소집에 들어갑니다. 야생추적자는 흉포한 이빨을 쓰고, 발톱의 드루이드는 찢어발기기로 변환된 이빨을 씁니다. 점수가 모자라면 칼날 발톱으로 채웁니다. 스조라크 신화 상위 로그에서 야생추적자 10개 중 8개, 발톱의 드루이드 8개 중 6개가 이 순서였습니다. 달 바라기를 골랐다면 야생추적자는 도려내기 앞에 달빛섬광을 겁니다. 영혼 소집을 끝까지 쓴 뒤에는 흉포한 이빨로 유지 흐름에 들어갑니다. 화신을 고른 빌드는 광폭화 자리가 화신으로 바뀌고, 이 예시의 영혼 소집까지 함께 넣지 않습니다.';
    const rails = tlOf(opener)[0].rails;
    const dotc = rails.find(r => r.label.startsWith('오프닝 — 발톱의 드루이드'));
    const ws = rails.find(r => r.label.startsWith('오프닝 — 야생추적자'));
    const idx = (r, id) => r.nodes.findIndex(n => n.skillId === id);
    // 발톱: 도려내기 → 찢어발기기 → 영혼 소집 → 흉포한 이빨
    {
      const base = dotc.nodes.filter(n => n.skillId !== '441591');
      const ri = base.findIndex(n => n.skillId === '1079');
      const conv = base.find(n => n.skillId === '391528');
      const bite = base.find(n => n.skillId === '22568');
      dotc.nodes = [
        ...base.slice(0, ri + 1),
        {skillId: '441591', caption: '소집 직전 마무리', above: {skillId: '5221', when: '점수 모자라면 먼저'}},
        {...conv, caption: '점수 비운 뒤 · 끝까지'},
        {...bite, caption: '소집 뒤 유지로'},
      ];
      dotc.note = '점수가 이미 찼다면 필요한 마무리 일격으로 먼저 비우고, 도려내기 단계에서 점수가 모자라면 생성기를 보충합니다. 스조라크 신화 상위 발톱의 드루이드 로그 8개 중 6개가 영혼 소집 전에 찢어발기기를 썼습니다. 마지막 단계 뒤에는 정해진 순서가 아니라 단일 우선순위로 돌아갑니다.';
    }
    // 야생추적자: 도려내기(위: 달빛섬광) → 흉포한 이빨 → 영혼 소집 → 흉포한 이빨
    {
      const ri = idx(ws, '1079');
      const conv = ws.nodes.find(n => n.skillId === '391528');
      const bite = ws.nodes.find(n => n.skillId === '22568');
      if (ri < 0 || !conv || !bite) throw new Error('야생추적자 오프닝 rail 위치가 예상과 다름');
      ws.nodes = [
        ...ws.nodes.slice(0, ri),
        {...ws.nodes[ri], above: {skillId: '155625', when: '달 바라기 · 그 앞에'}},
        {skillId: '22568', caption: '소집 직전 마무리'},
        {...conv, caption: '점수 비운 뒤 · 끝까지'},
        {...bite, caption: '덩굴이면 폭발까지'},
      ];
      ws.note = '덩굴은 자동으로 생깁니다. 덩굴이 보일 때까지 기다렸다가 전투를 시작하지 않습니다. 스조라크 신화 상위 야생추적자 로그 10개 중 8개가 영혼 소집 직전에 흉포한 이빨로 점수를 비웠고, 8개가 도려내기 앞뒤에 달빛섬광을 걸었습니다. 야성의 광기는 도려내기 앞에 쓰는 로그와 뒤에 쓰는 로그가 반반입니다.';
    }

    // 영웅 특성 탭
    const dh = m.heroBranches.find(h => h.label === '발톱의 드루이드');
    {
      const s = dh.opener.steps.filter(x => x.skillId !== '441591');
      const ri = s.findIndex(x => x.skillId === '1079');
      const conv = s.find(x => x.skillId === '391528');
      const bite = s.find(x => x.skillId === '22568');
      dh.opener.steps = [
        ...s.slice(0, ri + 1),
        {skillId: '441591', label: '찢어발기기', phase: '극딜 중', trigger: '변환됨 · 소집 직전', note: '흉포한 이빨이 찢어발기기로 변환돼 있으면 영혼 소집 전에 써서 점수를 비웁니다. 점수가 모자라면 칼날 발톱으로 먼저 채웁니다. 스조라크 신화 상위 발톱의 드루이드 로그 8개 중 6개가 이 자리에 찢어발기기를 썼습니다.'},
        {...conv, note: '찢어발기기로 점수를 비운 직후, 호랑이의 분노와 광폭화가 있는 구간에 끝까지 사용합니다. 발동으로 찬 점수를 0점으로 만들려 계속 늦추지는 않습니다.'},
        {...bite, note: '영혼 소집 뒤 무료 발동이면 바로 쓰고, 아니면 5점과 기력을 보고 씁니다. 찢어발기기로 변환됐다면 그 실제 공격을 쓰고, 다음부터 단일 우선순위로 판단합니다.'},
      ];
      dh.opener.summary = '정점 마지막 노드와 영혼 소집을 선택한 빠른 단일 시작입니다. 첫 호랑이의 분노는 첫 갈퀴 발톱 직전이며 일부 기력 손실을 감수하는 예시입니다. 도려내기 뒤 찢어발기기로 점수를 비우고 영혼 소집에 들어갑니다. 광역의 첫 전투 중 호랑이의 분노 조건과 혼동하지 않습니다.';
    }
    const wh = m.heroBranches.find(h => h.label === '야생추적자');
    {
      const s = wh.opener.steps.filter(x => x.skillId !== '155625');
      const ri = s.findIndex(x => x.skillId === '1079');
      const conv = s.find(x => x.skillId === '391528');
      const bite = s.find(x => x.skillId === '22568');
      wh.opener.steps = [
        ...s.slice(0, ri),
        {skillId: '155625', label: '달빛섬광', phase: '첫 출혈', trigger: '달 바라기 선택 시', note: '달 바라기를 배웠다면 도려내기 앞에 겁니다. 배우지 않았다면 건너뜁니다. 스조라크 신화 상위 야생추적자 로그 10개 중 8개가 오프닝에 걸었습니다.'},
        s[ri],
        {skillId: '22568', label: '흉포한 이빨', phase: '극딜 중', trigger: '소집 직전 · 점수 비우기', note: '영혼 소집 전에 흉포한 이빨로 점수를 비웁니다. 스조라크 신화 상위 야생추적자 로그 10개 중 8개가 영혼 소집 직전에 흉포한 이빨을 썼습니다.'},
        {...conv, trigger: '이빨 직후 · 출혈 유지', note: '흉포한 이빨로 점수를 비운 직후 안전한 위치에서 끝까지 사용합니다. 덩굴이 생길 때까지 무기한 기다려 쿨다운을 미루지 않습니다.'},
        bite,
      ];
      wh.opener.summary = '정점 마지막 노드와 영혼 소집을 선택합니다. 덩굴 발생은 자동이므로 기다렸다가 전투를 시작하지 않습니다. 출혈을 깐 뒤 흉포한 이빨로 점수를 비우고 영혼 소집을 쓰며, 그 뒤 발동한 덩굴을 이빨 대상 판단에 활용합니다.';
      const p = wh.singleTarget.priority;
      const mf = p.findIndex(x => x.skillId === '155625');
      const sa = p.findIndex(x => x.skillId === '5221');
      if (mf > sa) {
        const [row] = p.splice(mf, 1);
        p.splice(sa, 0, {...row, note: row.note + ' 심크 우선순위도 기습 공격 칼날 발톱보다 달빛섬광 갱신을 먼저 봅니다.'});
      }
    }
    return m;
  },
};
