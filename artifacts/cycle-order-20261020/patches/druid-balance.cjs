// druid-balance 딜사이클 순서 수정 — 근거: digests/druid-balance.md, apl/druid_balance.simc
const tl = b => (Array.isArray(b.timeline) ? b.timeline : b.timeline ? [b.timeline] : []);
const block = (m, start) => {
  const b = m.blocks.find(x => x.title.startsWith(start));
  if (!b) throw new Error('장 없음: ' + start);
  return b;
};
const rail = (b, label) => {
  for (const t of tl(b)) for (const r of t.rails || []) if (r.label.startsWith(label)) return r;
  throw new Error('rail 없음: ' + label);
};
const hero = (m, label) => {
  const h = m.heroBranches.find(x => x.label === label);
  if (!h) throw new Error('영웅 없음: ' + label);
  return h;
};
const replaceText = (arr, from, to) => {
  const i = arr.findIndex(x => x.includes(from));
  if (i < 0) {
    if (arr.some(x => x.includes(to))) return;
    throw new Error('문장 없음: ' + from);
  }
  arr[i] = arr[i].replace(from, to);
};

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 13개(엘룬의 대행자 5·숲의 수호자 8)·쐐기 8개(엘룬의 대행자)의 실제 시전 순서와 심크 APL(midnight d91a5707)을 대조해, 엘룬의 대행자 오프닝에 구간을 연 직후의 즉시 별빛섬광을 넣고, 숲의 수호자 오프닝을 일월식 (태양) → 천벌 → 자연의 군대 → 화신 순서로 바꿨으며, 숲의 수호자 야생 버섯을 일월식·화신 구간의 소비로 올렸습니다. 엘룬의 대행자 반복·광역 순서는 로그와 맞아 그대로 두었습니다.',
  changelog: [
    '- 엘룬의 대행자 오프닝(2부 오프닝 장 줄, 영웅 탭 오프닝): 화신/일월식 (달) → 별빛쇄도 ⇒ 화신/일월식 (달) → 별빛섬광(즉시 시전 한 번) → 별빛쇄도. 근거: 레이드 오프닝 5개 모두 구간을 연 직후 별빛섬광을 먼저 씀(화신 4개, 일월식 (달) 1개, 예: https://www.warcraftlogs.com/reports/j369qgtaYZQBv2AK#fight=51&source=3 ). KB 승천자의 일월식(일월식 활성화 시 다음 별빛섬광 즉시 시전). 엘룬의 분노 → 화신 인접은 화신을 오프닝에 쓴 4개 모두 일치해 그대로.',
    '- 숲의 수호자 오프닝(2부 오프닝 장 줄, 영웅 탭 오프닝): 천벌 → 달빛섬광 → 태양섬광 → 자연의 군대 → 화신(또는 일월식 (태양)) → 천벌 → 별빛쇄도 ⇒ 천벌 → 달빛섬광 → 태양섬광 → 일월식 (태양) → 천벌 → 자연의 군대 → 화신 → 천벌(꿈의 폭발) → 별빛쇄도. 근거: 레이드 오프닝 8개 모두 첫 도트 무렵 일월식을 열었고(7개는 도트 직후, 1개는 첫 천벌과 함께 · 7개 태양, 1개 달), 자연의 군대·화신은 8개 모두 첫 22회 안에 없이 첫 쫄 무리 무렵(로그 기준 22~37초)에 함께 씀(예: https://www.warcraftlogs.com/reports/t78VfT1FLayjG3Cm#fight=7&source=4 ). APL opener도 moonfire → sunfire → eclipse → wrath(천공의 힘 80 미만) → force_of_nature → celestial_alignment 순서. 2부 오프닝 장 요점, 2부 단일 장·4부 숲의 수호자 장의 오프닝 서술을 함께 맞춤(반복 구간의 "자연의 군대 → 다음 글쿨 일월식·화신" 묶음은 로그·APL mini/cooldowns 목록과 맞아 유지).',
    '- 숲의 수호자 단일 우선순위(영웅 탭)와 2부 단일 장 끼워 넣기 줄: 천벌 → 야생 버섯(이동 글쿨) ⇒ 야생 버섯(일월식·화신 구간) → 천벌. 근거: 야생 버섯을 쓴 레이드 로그 7개에서 87회 중 80회가 일월식·화신 구간 안. APL kotg_st wild_mushroom,if=buff.eclipse.up|충전이 가득 참 이 wrath보다 위. 2부 움직임 장의 야생 버섯 문장도 맞춤.',
    '- 그대로 둔 것: 엘룬의 대행자 단일 반복 rail·우선순위(도트 → 엘룬의 분노 → 일월식/화신 순서가 로그와 같음, 구간 뒤 첫 소비는 반복 구간에서 별빛섬광·별빛쇄도·별똥별로 갈림), 엘룬의 대행자 광역(쐐기 풀 시작 7개가 달빛섬광 → 태양섬광 → 엘룬의 분노/일월식 → 별똥별·별빛섬광으로 가이드와 같음, 엘룬의 분노와 일월식 앞뒤는 갈림), 숲의 수호자 광역(쐐기 로그 없음).',
  ].join('\n'),
  apply(m) {
    const openBlock = block(m, '쿨기와 오프닝');

    // 1) 엘룬의 대행자 오프닝: 구간을 연 직후 즉시 별빛섬광 한 번
    const ecRail = rail(openBlock, '오프닝 — 엘룬의 대행자');
    ecRail.nodes = [
      {skillId: '5176', caption: '풀 약 4초 전 2~3회'},
      {skillId: '8921', caption: '첫 글쿨 · 우선 대상'},
      {skillId: '93402', caption: '도트 정리'},
      {skillId: '202770', caption: '구간 직전 자원 준비'},
      {skillId: '102560', caption: 'A · 화신이 준비됐으면'},
      {skillId: '48518', caption: 'B · 화신이 없으면'},
      {skillId: '194153', caption: '구간 첫 즉시 시전'},
      {skillId: '78674', caption: '단일 첫 소비'},
      {skillId: '191034', caption: '3대상 이상이면 대신'},
      {skillId: '391528', caption: '골랐을 때 · 낮은 자원'},
      {skillId: '194153', caption: '자원 다시 만들기'},
      {skillId: '78674', caption: '상한·구간 끝 소비'},
    ];
    ecRail.note = 'A와 B는 둘 중 하나만 씁니다. 구간을 열면 승천자의 일월식으로 다음 별빛섬광이 즉시 시전되니 이 한 번을 먼저 씁니다. 별빛쇄도와 별똥별도 대상 수에 맞는 하나만 씁니다. 영혼 소집은 고르지 않았다면 건너뜁니다.';
    const ec = hero(m, '엘룬의 대행자');
    const steps = ec.opener.steps;
    if (!steps.some(s => s.label === '별빛섬광 · 즉시 시전')) {
      const at = steps.findIndex(s => s.skillId === '48518');
      steps.splice(at + 1, 0, {
        skillId: '194153',
        label: '별빛섬광 · 즉시 시전',
        phase: '구간 첫 글쿨',
        trigger: '화신·일월식 직후',
        note: '승천자의 일월식으로 구간에 들어가면 다음 별빛섬광이 즉시 시전됩니다. 이 한 번을 먼저 쓰고 별빛쇄도나 별똥별로 넘어갑니다.',
      });
    }
    ec.opener.summary = '위의 기본 오프닝과 같은 흐름입니다. 전투 전 천벌 투사체를 보낸 뒤에는 천벌을 빼고, 도트·엘룬의 분노로 준비한 다음 화신 또는 일월식 (달) 중 하나로 구간을 엽니다. 구간을 연 직후에는 즉시 시전되는 별빛섬광을 한 번 먼저 씁니다.';
    replaceText(openBlock.paragraphs, '구간이 열리면 단일은 별빛쇄도, 오래 사는 3대상 이상은 별똥별로 첫 자원을 씁니다.', '구간이 열리면 승천자의 일월식으로 즉시 시전되는 별빛섬광을 한 번 먼저 쓰고, 단일은 별빛쇄도, 오래 사는 3대상 이상은 별똥별로 첫 자원을 씁니다.');

    // 2) 숲의 수호자 오프닝: 일월식 (태양) → 천벌 → 자연의 군대 → 화신
    const kgRail = rail(openBlock, '오프닝 — 숲의 수호자');
    kgRail.nodes = [
      {skillId: '5176', caption: '풀 약 4초 전 · 태양 모드'},
      {skillId: '8921', caption: '첫 글쿨 · 우선 대상'},
      {skillId: '93402', caption: '도트 정리'},
      {skillId: '48517', caption: '도트 직후 · 단일'},
      {skillId: '5176', caption: '천공의 힘 모으기'},
      {skillId: '205636', caption: '자원 확보 · 대상 고정'},
      {skillId: '102560', caption: '자연의 군대 직후'},
      {skillId: '5176', caption: '꿈의 폭발 3중첩 소비'},
      {skillId: '78674', caption: '나무정령 있는 동안 소비'},
    ];
    kgRail.note = '첫 구간은 일월식 (태양)으로 열고, 천벌로 천공의 힘을 모은 뒤 자연의 군대와 화신을 이어서 씁니다. 님리사 상위 로그 8개는 모두 자연의 군대와 화신을 첫 쫄 무리(전투 20~40초 무렵)에 맞춰 함께 썼고, 그동안은 천벌로 모아 별빛쇄도로 썼습니다. 여러 대상이면 별빛섬광 뒤 일월식 (달)로 열고, 꿈의 폭발도 별빛섬광으로 씁니다. 오래 사는 3대상 이상이면 별빛쇄도 자리가 별똥별입니다.';
    const kg = hero(m, '숲의 수호자');
    const ks = kg.opener.steps;
    const get = (id, n = 0) => {
      const hit = ks.filter(s => s.skillId === id);
      if (!hit[n]) throw new Error('숲의 수호자 오프닝 행 없음: ' + id);
      return hit[n];
    };
    const wrath1 = get('5176', 0), moon = get('8921'), sun = get('93402'), fon = get('205636'), inc = get('102560'), solar = get('48517'), wrath2 = get('5176', 1), surge = get('78674');
    solar.label = '일월식 (태양)';
    solar.phase = '첫 구간';
    solar.trigger = '도트 직후 · 단일';
    solar.note = '직전 천벌로 태양 모드가 됩니다. 여러 대상이면 별빛섬광 뒤 일월식 (달)로 엽니다. 세나리우스의 권능이 진입 시 6초 동안 가속 6%를 줍니다.';
    const wrathBuild = {
      skillId: '5176',
      label: '천벌 · 천공의 힘 모으기',
      phase: '자원 준비',
      trigger: '태양 일월식 중',
      note: '태양 일월식이 강화한 천벌로 천공의 힘을 모읍니다. 자연의 군대와 화신을 곧 쓴다면 소비기 두 번분 이상을 들고 들어가고, 쿨기를 쫄 무리에 맞춰 미루는 동안에는 상한 전에 별빛쇄도로 씁니다.',
    };
    fon.phase = '숲의 조화 시작';
    fon.trigger = '자원 확보 · 대상 고정';
    fon.note = '천공의 힘 20을 만들고 나무정령 3마리를 소환합니다. 나무정령이 남아 있는 동안 숲의 조화가 주문 공격력을 올립니다. 쫄이 정해진 시간에 나오는 네임드라면 그 무리에 맞춥니다.';
    inc.phase = '큰 구간';
    inc.trigger = '자연의 군대 직후';
    inc.note = '자연의 군대 바로 다음 글쿨에 엽니다. 일반 일월식 도중 쓰면 남은 효과가 사라지니, 첫 일월식이 거의 끝났을 때 여는 편이 손실이 적습니다.';
    kg.opener.steps = [wrath1, moon, sun, solar, wrathBuild, fon, inc, wrath2, surge];
    kg.opener.summary = '첫 구간은 일월식 (태양)으로 열고, 천벌로 천공의 힘을 모은 뒤 자연의 군대와 화신을 이어서 씁니다. 꿈의 쇄도로 받은 꿈의 폭발 3중첩을 천벌·별빛섬광 세 번으로 소비하며, 숲의 조화가 켜진 동안 별빛쇄도·별똥별을 몰아 씁니다. 쫄이 정해진 시간에 나오는 네임드라면 자연의 군대와 화신을 그 무리에 맞춥니다.';
    replaceText(openBlock.bullets, '화신과 일반 일월식은 둘 중 하나입니다. 연달아 누르지 않습니다.', '엘룬의 대행자 오프닝에서 화신과 일반 일월식은 둘 중 하나입니다. 연달아 누르지 않습니다.');
    replaceText(openBlock.bullets, '숲의 수호자는 자연의 군대를 일월식 밖에서 먼저 쓰고 다음 글쿨에 구간을 엽니다.', '숲의 수호자 오프닝은 일월식 (태양)부터 열고, 천벌로 천공의 힘을 모은 뒤 자연의 군대와 화신을 이어서 씁니다.');

    // 2부 단일 장·4부 숲의 수호자 장: 반복 묶음은 그대로, 전투 시작은 예외라고 적기
    const st = block(m, '첫 연습은 단일 대상');
    replaceText(st.paragraphs, '태양 일월식 동안에는 천벌이 기본 생성기가 되고, 이동할 때는 야생 버섯으로 생성 공백을 메웁니다.', '태양 일월식 동안에는 천벌이 기본 생성기이고, 야생 버섯 충전은 일월식과 화신 구간에 씁니다. 전투 시작만은 일월식 (태양)을 먼저 열고 자원을 모은 뒤 자연의 군대와 화신을 씁니다.');
    const kgBlock = block(m, '숲의 수호자:');
    replaceText(kgBlock.paragraphs, '자연의 군대만 쿨마다 누르고 뒤의 구간이 비면 이 영웅 특성의 장점을 거의 살리지 못합니다.', '자연의 군대만 쿨마다 누르고 뒤의 구간이 비면 이 영웅 특성의 장점을 거의 살리지 못합니다. 전투 시작은 예외로, 일월식 (태양)을 먼저 열고 천벌로 천공의 힘을 모은 뒤 자연의 군대와 화신을 함께 씁니다.');

    // 3) 숲의 수호자 야생 버섯: 일월식·화신 구간의 소비로 천벌보다 위
    const p = kg.singleTarget.priority;
    const iw = p.findIndex(r => r.skillId === '5176');
    const im = p.findIndex(r => r.skillId === '88747');
    if (iw < 0 || im < 0) throw new Error('숲의 수호자 단일 행 없음');
    const mush = p[im];
    mush.label = '야생 버섯 · 일월식·화신 구간';
    mush.note = '충전을 일월식이나 화신 구간에 쓰고, 충전이 가득 찰 것 같으면 그 전에 씁니다. 즉시 시전이라 이동 중에도 쓸 수 있습니다. 대상이 범위에 머물 때 씁니다.';
    if (im > iw) {
      p.splice(im, 1);
      p.splice(iw, 0, mush);
    }
    const ins = rail(st, '영웅 특성·선택 특성별로 끼워 넣는 것');
    const mn = ins.nodes.find(n => n.skillId === '88747');
    if (mn) mn.caption = '숲의 수호자 · 일월식 중 소비';
    const move = block(m, '움직일 때와');
    replaceText(move.paragraphs, '야생 버섯을 골랐다면 즉시 시전으로 천공의 힘을 만들 수 있으니, 대상이 범위에 머물 때 이동 글쿨에 넣습니다.', '야생 버섯을 골랐다면 즉시 시전이라 움직이면서도 천공의 힘을 만들 수 있습니다. 충전은 주로 일월식·화신 구간에 쓰니, 그 구간의 이동 글쿨에 맞춥니다.');
    return m;
  },
};
