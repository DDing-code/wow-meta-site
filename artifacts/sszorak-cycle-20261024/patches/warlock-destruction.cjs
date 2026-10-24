// warlock-destruction 단일 딜사이클 스조라크 대조 — 근거: digests/warlock-destruction.md, apl/warlock_destruction.simc, sources/warlock-destruction.txt
// 프리풀: 영혼의 불꽃 사전 시전(심크 우선순위 precombat soul_fire, Icy Pre-cast Soul Fire, Method 'Pre-cast Soulfire at 4 seconds' — 두 영웅 특성 모두).
//   지옥소환사는 이미 있던 사전 시전 단계를 '전투 전 · 풀링 4초 전'으로 표시만 맞춘다.
//   악마학자는 제물 시작을 영혼의 불꽃 사전 시전으로 바꾸고, 정령 → 점화 순서로(스조라크 로그 2/2, Method 악마학자 오프닝).
// 지옥소환사 풀링 뒤 순서는 첫 점화 자리가 정령 앞 4·뒤 5로 갈려 그대로 두고 note 근거만 바꾼다. 단일 반복은 그대로.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };
const pick = (rows, skillId, nth = 0) => {
  const hit = rows.filter(r => r.skillId === skillId)[nth];
  if (!hit) throw new Error(`행을 못 찾음: ${skillId} #${nth}`);
  return {...hit};
};

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 로그 12개(지옥소환사 10·악마학자 2)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757, 파괴 APL은 9월 10일 수정)·Icy Veins·Method 프리풀을 대조했습니다. 심크 우선순위의 전투 전 목록과 두 공개 가이드가 모두 영혼의 불꽃 사전 시전(Method는 풀링 4초 전)으로 시작해, 악마학자 오프닝을 제물 시작에서 영혼의 불꽃 사전 시전으로 바꾸고 로그 2개 모두처럼 정령 → 점화 순서로 고쳤습니다. 지옥소환사 오프닝은 정령 직후 적개심(9개 중 8개)이 맞고 첫 점화 자리는 정령 앞 4개·뒤 5개로 갈려 순서를 두고 근거 문장만 바꿨습니다. 단일 반복 흐름은 그대로 두었습니다.',
  changelog: [
    '- 악마학자 오프닝(연습 장 타임라인·영웅 탭): 제물 → 점화 → 지옥불정령 소환 → 혼돈의 화살 … 을 영혼의 불꽃(전투 전 · 풀링 4초 전) → 지옥불정령 소환 → 점화 → 혼돈의 화살 … 로 (근거: 심크 우선순위 precombat soul_fire, Icy Pre-cast Soul Fire, Method 악마학자 오프닝 Pre-cast Soulfire at 4 seconds → Summon Infernal → Conflagrate. 스조라크 로그 2/2가 영혼의 불꽃 → 정령 → 점화 — 예 https://www.warcraftlogs.com/reports/rTqXg7ZyWtCH4dkL#fight=21&source=14 . 로그가 2개뿐이라 정령·점화 앞뒤는 Method와 함께 판단)',
    '- 지옥소환사 오프닝 첫 단계(영혼의 불꽃): 단계·캡션을 전투 전 · 풀링 4초 전으로 (근거: Method Pre-cast Soulfire at 4 seconds, 심크 우선순위 precombat soul_fire, Icy Pre-cast Soul Fire. 로그 첫 시전은 10개 중 5개)',
    '- 연습 장 오프닝 한 줄 원리·본문·요점·rail note 를 같은 순서로 맞추고, 님리사 근거 문장(악마학자 4개 중 3개 제물 시작, 무료 어둠의 연소 7개 중 2개)을 스조라크 근거로 바꿈',
    '- 그대로 둔 것: 지옥소환사 풀링 뒤 순서(정령 → 적개심은 9개 중 8개로 맞음, 첫 점화는 정령 앞 4개·뒤 5개로 갈림, 적개심 뒤 첫 소비도 점화 → 혼돈의 화살 ×2 3개, 혼돈의 화살 → 점화 → 혼돈의 화살 3개, 혼돈의 화살 ×2 3개로 갈림), 단일 반복 rail·영웅 탭 단일 우선순위(분당 소각 18.7·점화 8.6·어둠의 연소 8.5·혼돈의 화살 7.6 — 모두 이미 있는 버튼, 심크 우선순위와 크게 어긋나지 않음), Icy의 소각·제물·대재앙 사전 시전(심크 우선순위·Method·로그에 없음)',
  ].join('\n'),
  apply(m) {
    const block = t => {
      const b = m.blocks.find(x => x.title.startsWith(t));
      if (!b) throw new Error('장을 못 찾음: ' + t);
      return b;
    };
    const hc = m.heroBranches.find(h => h.label === '지옥소환사');
    const dia = m.heroBranches.find(h => h.label === '악마학자');

    // ── 지옥소환사 영웅 탭: 사전 시전 표시만 맞춤 ──
    {
      const o = hc.opener.steps;
      if (o[0].skillId !== '6353') throw new Error('지옥소환사 오프닝 첫 단계가 영혼의 불꽃이 아님');
      o[0] = {...o[0], phase: '전투 전', trigger: '풀링 4초 전', note: '카운트가 끝날 때 맞도록 시전해 쇠퇴와 조각을 얻습니다. 공개 가이드는 풀링 4초 전에 시전을 시작합니다. 차원의 균열을 선택했다면 이 주문은 없으므로 쇠퇴 적용과 소각을 이용하는 다른 시작으로 바꿉니다.'};
      const conflag = o.findIndex(s => s.skillId === '17962');
      o[conflag] = {...o[conflag], note: '역류를 준비합니다. 스조라크 상위 로그는 첫 점화를 정령 앞에 쓴 경우와 정령·적개심 뒤에 쓴 경우가 비슷하게 많습니다. 영혼의 불꽃으로 이미 쇠퇴가 적용된 단일 대상에게 수동 쇠퇴를 바로 중복 적용하지 않습니다.'};
      const malev = o.findIndex(s => s.skillId === '442726');
      o[malev] = {...o[malev], note: '현재 쇠퇴 대상에 적개심을 연결합니다. 스조라크 상위 로그 9개 중 8개가 정령 직후 적개심을 썼습니다. 광역 풀이라면 이 전에 대재앙·점화 전파로 주요 대상들을 준비합니다.'};
      hc.opener.summary = '영혼의 불꽃·역류·적개심을 사용하는 단일 예시입니다. 영혼의 불꽃을 풀링 4초 전에 시전하고, 점화와 정령을 사용한 뒤 정령 직후 적개심을 켜고 소비를 이어갑니다. 첫 소비 뒤에는 소각 → 점화 → 혼돈의 화살 반복으로 넘어가며, 무료 어둠의 연소는 뜰 때 끼워 넣습니다.';
    }

    // ── 악마학자 영웅 탭 오프닝 ──
    {
      const o = dia.opener.steps;
      if (o[0].skillId !== '348' || o[1].skillId !== '17962' || o[2].skillId !== '1122') throw new Error('악마학자 오프닝 모양이 예상과 다름');
      const soulFire = {
        skillId: '6353',
        label: '영혼의 불꽃',
        phase: '전투 전',
        trigger: '풀링 4초 전',
        note: '카운트가 끝날 때 맞도록 시전해 제물과 조각을 함께 준비합니다. 심크 우선순위와 공개 가이드 모두 이렇게 시작합니다. 영혼의 불꽃을 고르지 않았다면 전투 시작에 제물을 겁니다.',
      };
      const infernal = {...o[2], phase: '정령 소환', trigger: '풀링 직후·소비할 시간 확보', note: '정령을 부르고 선택한 장비 효과를 겹칩니다. 스조라크 상위 로그 2개 모두 점화보다 먼저 불렀습니다. 지옥의 기계와 파편 생성이 시작되므로 뒤의 소비를 미루지 않습니다.'};
      const conflag = {...o[1], trigger: '정령 뒤·첫 긴 시전'};
      dia.opener.steps = [soulFire, infernal, conflag, ...o.slice(3)];
      dia.opener.summary = '영혼의 불꽃·역류·란코라의 손길을 사용하는 단일 예시입니다. 영혼의 불꽃을 풀링 4초 전에 시전하고, 스조라크 상위 로그처럼 정령 → 점화로 엽니다. 첫 소비 뒤에는 소각 → 점화 → 혼돈의 화살로 넘어갑니다. 지옥불 화살·황폐는 첫 의식이 끝나야 열리니 뜰 때만 끼워 넣고, 광역 시작에는 적이 모인 뒤 선택한 대재앙을 끼워 적용합니다.';
    }

    // ── 2부 오프닝 연습 ──
    {
      const b = block('쿨기와 오프닝');
      b.concept = '오프닝은 풀링 4초 전 영혼의 불꽃으로 시작해 점화·지옥불정령 소환(지옥소환사는 적개심까지)을 거쳐 첫 소비까지만 정해 둡니다. 그다음은 소각 → 점화 → 혼돈의 화살을 반복하며 단일 우선순위로 넘어갑니다.';
      b.paragraphs[2] = '두 영웅 특성 모두 영혼의 불꽃 사전 시전으로 시작합니다. 심크 우선순위와 공개 가이드가 모두 이렇게 시작하고, 공개 가이드는 풀링 4초 전에 시전을 시작하라고 합니다. 날아가는 시간이 있으니 카운트가 끝날 때 맞도록 연습하고, 탱커보다 먼저 맞히지 않게 합니다. 영혼의 불꽃이 지속 피해를 걸어 주니 바로 쇠퇴나 제물을 다시 누를 필요는 없습니다. 지옥소환사는 점화로 역류를 얻고 정령을 부른 뒤, 정령 직후 쇠퇴가 걸린 대상에 적개심을 쓰고 혼돈의 화살로 조각을 비웁니다. 스조라크 신화 상위 로그 9개 중 8개가 정령 직후 적개심을 썼고, 첫 점화는 정령 앞에 쓴 로그 4개와 뒤에 쓴 로그 5개로 갈렸습니다. 악마학자는 상위 로그 2개 모두 정령을 먼저 부르고 점화를 썼습니다. 그다음 혼돈의 화살로 의식을 진행하고, 의식이 끝나 악마술이 생긴 다음 새 혼돈의 화살을 시작합니다.';
      b.paragraphs[3] = rep(b.paragraphs[3], '상위 레이드 로그의 첫 22번 시전에서 무료 어둠의 연소는 지옥소환사 7개 중 2개에만 나왔고, 악마학자의 지옥불 화살·황폐는 4개 모두 나오지 않았습니다.', '스조라크 상위 로그의 첫 24번 시전에서 무료 어둠의 연소는 지옥소환사 10개 중 8개에 나왔지만 자리는 제각각이었고, 악마학자의 지옥불 화살·황폐는 2개 모두 나오지 않았습니다.');
      b.paragraphs[3] = rep(b.paragraphs[3], '영혼의 불꽃이 없으니 지옥소환사도 이 시작을 그대로 쓸 수 없습니다.', '영혼의 불꽃이 없으니 이 시작을 그대로 쓸 수 없습니다.');
      b.bullets[0] = '영혼의 불꽃 사전 시전 → 점화·정령(→ 적개심) → 첫 소비까지만 고정합니다.';
      const t = tlOf(b)[0];
      const hcRail = t.rails.find(r => r.label.startsWith('오프닝 — 지옥소환사'));
      if (!hcRail || hcRail.nodes[0].skillId !== '6353') throw new Error('지옥소환사 오프닝 rail 모양이 예상과 다름');
      hcRail.nodes = [{...hcRail.nodes[0], caption: '풀링 4초 전'}, ...hcRail.nodes.slice(1)];
      hcRail.note = '광역 풀이라면 적개심 전에 대재앙·점화 전파로 주요 대상에 쇠퇴를 먼저 넓힙니다. 첫 점화를 정령 앞에 쓸지 적개심 뒤에 쓸지는 로그마다 다릅니다(스조라크 상위 로그 4개와 5개). 무료 어둠의 연소가 뜨면 이 사이 아무 자리에나 끼워 넣습니다.';
      const diaRail = t.rails.find(r => r.label.startsWith('오프닝 — 악마학자'));
      if (!diaRail) throw new Error('악마학자 오프닝 rail 을 못 찾음');
      const n = diaRail.nodes;
      if (n[0].skillId !== '348' || n[1].skillId !== '17962' || n[2].skillId !== '1122') throw new Error('악마학자 오프닝 rail 모양이 예상과 다름');
      diaRail.label = '오프닝 — 악마학자 (영혼의 불꽃 빌드 · 단일)';
      diaRail.nodes = [
        {skillId: '6353', caption: '풀링 4초 전'},
        {...n[2], caption: '정령 먼저'},
        {...n[1], caption: '역류 얻기'},
        ...n.slice(3),
      ];
      diaRail.note = '영혼의 불꽃을 고르지 않았다면 첫 자리에 제물을 씁니다. 스조라크 상위 로그 2개 모두 정령을 점화보다 먼저 불렀습니다. 지옥불 화살·황폐는 첫 의식이 끝나야 열리니 뜨면 그때 끼워 넣고 기다리지 않습니다.';
    }
    return m;
  },
};
