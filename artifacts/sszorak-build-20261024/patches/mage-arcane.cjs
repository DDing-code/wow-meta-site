// mage-arcane 단일 딜사이클 스조라크 빌드 기준 — 근거: bd/mage-arcane.md, ../sszorak-cycle-20261024/apl/mage_arcane.simc, ../sszorak-cycle-20261024/sources/mage-arcane.txt, ../sszorak-cycle-20261024/events/mage-arcane-*(성난태양 10개)
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 30)); return text.replace(from, to); };

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 빌드 기준(2026-10-24): 스조라크 신화(12.1.5) 상위 랭킹 영웅 특성(196행 모두 성난태양, 한국 95행 모두 성난태양)과 성난태양 로그 10개의 실제 순서·반복 횟수로 오프닝·단일 반복을 다시 확인하고 단일 견본을 스조라크 대표 성난태양 빌드로 바꿨습니다(자극을 넣고 공명·에테르 조율을 뺌). 순서는 로그 과반과 같아 그대로 두고, 오프닝의 비전 작렬에 ×3~6(작렬로 채운 기록 4개 중 3개), 비전의 영혼 구간 비전 탄막을 한 칸 ×4~6(영혼 구간 탄막 연속 4~6번)으로 묶었습니다.',
  buildNote: '자극(비전 작렬이 충전물을 더 줌)을 넣고 공명·에테르 조율을 뺀 단일 빌드입니다.',
  changelog: [
    '- 단일 견본: 스조라크 대표 성난태양 빌드(apply-patch 자동). 기본 영웅 탭은 그대로 성난태양(스조라크 신화 상위 196행 모두, 한국 95행 모두).',
    '- 2부 단일 장 비전의 영혼 줄: 비전 탄막 네 칸 → 한 칸 ×4~6(성난태양 로그 10개의 영혼 구간 탄막 연속 4번 17·5번 14·6번 6, 1차 집계 영혼 구간 33번 모두 4~6번). 평시 반복 줄 순서는 로그·심크 우선순위 sunfury 와 같아 그대로(오색 화살 다음 탄막 85%, 신비한 화살·비전 작렬 이어서 누른 횟수 중앙값 1·2(1~3)이라 횟수 없음).',
    '- 2부 오프닝 장·성난태양 영웅 탭 오프닝: 순서 그대로(쇄도 뒤 탄막 → 여파 → 화살 10/10, 그 앞 화살 8/10). 여파 뒤 비전 작렬에 ×3~6(작렬로 채운 기록 4개가 3·4·6·1번, 나머지 6개는 오색 화살 3·바로 탄막 3).',
    '- 글: 성난태양 영웅 탭 요약·요점 2, 3부 성난태양 장 요점 4, 주문술사 영웅 탭 요약·4부 주문술사 장의 "이번 한국 검수" 문장을 스조라크·님리사·쐐기 상위 행 수로 바꿨습니다.',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));
    const hero = l => m.heroBranches.find(h => h.label === l);
    const sun = hero('성난태양');
    const ss = hero('주문술사');

    // ── 2부 단일 장: 비전의 영혼 줄의 탄막 네 칸을 한 칸 ×4~6 으로 ──
    const single = block('첫 연습은 단일 대상');
    const stl = [].concat(single.timeline)[0];
    const soul = stl.rails.find(r => r.label.startsWith('쇄도가 끝난 뒤 비전의 영혼'));
    soul.nodes = [
      soul.nodes[0],
      {skillId: '44425', caption: '영혼 끝까지 탄막', count: '4~6'},
      soul.nodes[soul.nodes.length - 1],
    ];
    soul.note = rep(soul.note, '스조라크 신화 상위 로그 10개에서도 영혼 구간 33번 모두 탄막을 4~6번 이어 썼습니다.', '스조라크 신화 상위 로그 10개에서도 영혼 구간 33번 모두 탄막을 4~6번 이어 썼습니다(4~5번이 가장 많음).');

    // ── 2부 오프닝 장 ──
    const open = block('쿨기와 오프닝');
    const otl = [].concat(open.timeline)[0];
    const railS = otl.rails.find(r => r.label === '오프닝 — 성난태양');
    railS.nodes = railS.nodes.map(n => (n.skillId === '30451' ? {...n, count: '3~6'} : n));
    railS.note = rep(railS.note, '나머지 3개는 작렬 없이 탄막이었습니다.', '나머지 3개는 작렬 없이 탄막이었습니다. 작렬로 채운 4개는 번뜩임이나 오색 화살이 뜰 때까지 3·4·6·1번 이어 썼습니다.');
    open.bullets[1] = '연결 단계: 비전 탄막 발사 → 투사체가 맞기 전에 비전의 여파 → 남은 번뜩임으로 신비한 화살 → 비전 작렬 여러 번(오색 화살이 떴다면 오색 화살) → 비전 탄막.';

    // ── 성난태양 영웅 탭(기준) ──
    sun.summary = rep(sun.summary, '이번 한국 검수: 레이드 1건·쐐기 1건. 선택·시전 사례이며 상대 분기보다 강하다는 증명이 아닙니다.', '스조라크 신화 상위 196행(한국 95행)이 모두 성난태양이라 단일 견본도 스조라크 대표 빌드로 만들었고, 님리사·쐐기 상위 기록도 모두 성난태양이었습니다. 기록 수이며 상대 분기보다 강하다는 증명은 아닙니다.');
    sun.bullets[1] = '추천 콘텐츠: 스조라크 신화 상위 196행, 님리사 100행, 쐐기 34행이 모두 성난태양이었습니다. 9월 9일 확인한 Wowhead와 Icy Veins도 레이드와 쐐기 모두 성난태양을 추천합니다.';
    sun.opener.summary = '비전 충전물 4개를 준비한 예시입니다. 탄막 투사체가 도착하기 전에 여파를 적용하고, 쇄도 뒤의 비전의 영혼까지 한 구간으로 봅니다. 스조라크 신화 상위 성난태양 기록 10개 모두 쇄도 뒤 탄막 → 여파 → 화살을 이었고, 8개는 그 탄막 앞에 화살을 한 번 썼습니다.';
    sun.opener.steps = sun.opener.steps.map(s => (s.skillId === '30451' ? {
      ...s,
      count: '3~6',
      note: '오색 화살이 없으면 비전 작렬로 충전물을 채우며 번뜩임을 기다린 뒤 탄막을 씁니다. 오색 화살이 떴다면 작렬 대신 오색 화살을 탄막 앞에 씁니다. 작렬로 채운 상위 기록 4개는 3·4·6·1번 이어 썼습니다.',
    } : s));

    // ── 3부 성난태양 장 ──
    const sunCh = block('성난태양:');
    sunCh.bullets[3] = '스조라크 196행·님리사 100행·쐐기 34행 상위 기록이 모두 성난태양이었습니다. 기록 수이며 주문술사보다 강하다는 증명은 아닙니다.';

    // ── 주문술사(기준 아님) ──
    ss.summary = rep(ss.summary, '이번 한국 검수: 레이드 0건·쐐기 0건. 이 분기는 이번 한국 로그에 없어 조정 후 성능을 직접 비교하지 못했습니다.', '스조라크·님리사·쐐기 상위 기록에는 주문술사가 없어(0행) 조정 후 성능을 직접 비교하지 못했습니다.');
    const ssCh = block('주문술사:');
    ssCh.paragraphs[2] = rep(ssCh.paragraphs[2], '이번 한국 로그 검수에는 주문술사 사례가 없어 조정 뒤 성능을 직접 비교하지 못했습니다.', '스조라크·님리사·쐐기 상위 기록에도 주문술사는 없어(0행) 조정 뒤 성능을 직접 비교하지 못했습니다.');
    // 통합 단계에서 더함: 주문술사 단일 오프닝의 '2대상 이상 · 보주 숙련' 갈래를 뺀다(단일 순서에서 광역 갈래 제외, 광역 장·탭은 그대로)
    for (const b of m.blocks) for (const t of [].concat(b.timeline || [])) for (const r of t.rails) if (r.label === '오프닝 — 주문술사') r.nodes = r.nodes.filter(n => n.caption !== '2대상 이상 · 보주 숙련이면');
    const spell = m.heroBranches.find(h => h.label === '주문술사');
    spell.opener = {...spell.opener, steps: spell.opener.steps.filter(st => !st.note.startsWith('2대상 이상이고 보주 숙련을 골랐다면'))};
    return m;
  },
};
