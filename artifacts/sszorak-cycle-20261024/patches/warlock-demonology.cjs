// warlock-demonology 단일 딜사이클 스조라크 대조 — 근거: digests/warlock-demonology.md, apl/warlock_demonology.simc, sources/warlock-demonology.txt
// 악마학자: 오프닝의 흑마법서 → 공포사냥개 를 공포사냥개 → 흑마법서 로(로그 9/9가 공포사냥개 먼저, Method 오프닝도 같은 순서).
// 영혼 수확자: 스조라크 로그 0개라 바꾸지 않는다. 프리풀(사전 악마 화살)은 심크 우선순위·Icy와 맞아 그대로 둔다.
// 그림 중심 개념서(book.visual)라 본문 150자·한 줄 원리 110자·요점 50자 제한을 지킨다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const pick = (rows, skillId, nth = 0) => {
  const hit = rows.filter(r => r.skillId === skillId)[nth];
  if (!hit) throw new Error(`행을 못 찾음: ${skillId} #${nth}`);
  return {...hit};
};

module.exports = {
  evidenceNote: '단일 딜사이클 스조라크 대조(2026-10-24): 스조라크 신화(12.1.5) WCL 상위 악마학자 로그 9개(영혼 수확자는 상위 랭킹에 없음)의 실제 시전 순서와 심크 우선순위(midnight 3af1a757, 악마 APL은 8월 30일 수정)·Icy Veins·Method 프리풀을 대조했습니다. 악마학자 오프닝은 9개 모두 공포사냥개를 흑마법서보다 먼저 불러서 공포사냥개 → 흑마법서 순서로 바꿨습니다. 폭군 뒤 굴단의 손 두 번 → 파열(9개 중 8개), 사전 악마 화살, 단일 반복 흐름은 그대로 두었고, 영혼 수확자는 로그가 없어 바꾸지 않았습니다.',
  changelog: [
    '- 악마학자 오프닝(연습 장 타임라인·영웅 탭): 악마 화살 → 흑마법서: 임프 군주 → 공포사냥개 부르기 → … 를 악마 화살 → 공포사냥개 부르기 → 흑마법서: 임프 군주 → … 로 (근거: 스조라크 로그 9/9가 공포사냥개를 첫 소환으로 씀, 흑마법서를 오프닝에 쓴 6개 중 5개는 공포사냥개 바로 뒤 — 예 https://www.warcraftlogs.com/reports/4T1z8LyRKPq3HdBt#fight=22&source=23 . Method 오프닝도 Call Dreadstalkers → Grimoire Imp Lord)',
    '- 연습 장 오프닝 한 줄 원리·본문·요점·rail note·그림 카드(같은 시작 줄)를 같은 순서로 맞추고, 님리사 근거 문장을 스조라크 근거로 바꿈',
    '- 그대로 둔 것: 사전 악마 화살(심크 우선순위 precombat demonbolt·Icy Pre-cast Demonbolt, 로그 첫 시전 4/9), 폭군 뒤 굴단의 손 ×2 → 어둠의 화살 → 파열(8/9), 단일 반복 rail·영웅 탭 단일 우선순위(분당 굴단의 손 15.8·악마 화살 11.6·어둠의 화살 8.2, 심크 우선순위 diabolist 목록과 일치), 마력 착취 사전 시전(Icy·Method·심크 우선순위에 있으나 상위 로그 9개 모두 마력 착취 시전 0회 — 고른 빌드가 없음), 파멸수호병 소환(분당 0회, "고른 빌드" 가지로 이미 표시), 영혼 수확자 전체(로그 0개)',
  ].join('\n'),
  apply(m) {
    const block = t => {
      const b = m.blocks.find(x => x.title.startsWith(t));
      if (!b) throw new Error('장을 못 찾음: ' + t);
      return b;
    };
    const dia = m.heroBranches.find(h => h.label === '악마학자');

    // ── 악마학자 영웅 탭 오프닝 ──
    {
      const o = dia.opener.steps;
      if (o[1].skillId !== '1276452' || o[2].skillId !== '104316') throw new Error('악마학자 오프닝 모양이 예상과 다름');
      const lord = pick(o, '1276452'), hound = pick(o, '104316');
      hound.phase = '첫 소환';
      hound.trigger = '풀링 직후·실제 특성 비용 충족';
      hound.note = '2마리를 부릅니다. 스조라크 신화 상위 로그 9개 모두 흑마법서보다 먼저 불렀습니다. 기본 2조각이며 악마의 부름 2점이면 무료 즉시 시전입니다. 이후 폭군 시전 완료 전에 사라지지 않을 여유를 확보합니다.';
      lord.phase = '흑마법서';
      lord.trigger = '공포사냥개 뒤·조각 1개';
      dia.opener.steps = [o[0], hound, lord, ...o.slice(3)];
      dia.opener.summary = '파열·지옥으로부터의 귀환·아르거스의 지배자와 임프 군주를 선택한 단일 시작 예시입니다. 지옥수호병은 전투 전에 소환합니다. 스조라크 신화 상위 로그처럼 공포사냥개를 먼저 부르고 흑마법서를 씁니다. 공포사냥개의 비용은 악마의 부름 투자에 따라 달라지므로, 자원 준비 단계는 현재 조각 수까지 반복합니다. 마력 착취 빌드는 이 흐름과 별개입니다.';
    }

    // ── 2부 오프닝 연습 ──
    {
      const b = block('쿨기와 오프닝');
      b.concept = '오프닝은 사전 악마 화살로 시작해 흑마법서와 공포사냥개를 부릅니다(악마학자는 공포사냥개 먼저). 그다음 영혼 수확자는 2조각 이하, 악마학자는 5조각을 맞추고 폭군을 엽니다.';
      b.paragraphs = ['스조라크 신화 상위 악마학자 로그 9개 모두 공포사냥개를 먼저 불렀고, 8개가 폭군 뒤 굴단의 손 두 번 → 어둠의 화살 한 번 안팎 → 파열이었습니다. 조건이 안 된 단계는 건너뜁니다.'];
      b.bullets[0] = '사전 악마 화살 뒤 악마학자는 공포사냥개 → 흑마법서 순서입니다.';
      const rail = tlOf(b)[0].rails.find(r => r.label.startsWith('오프닝 — 악마학자'));
      if (!rail) throw new Error('악마학자 오프닝 rail 을 못 찾음');
      const n = rail.nodes;
      if (n[1].skillId !== '1276452' || n[2].skillId !== '104316') throw new Error('악마학자 오프닝 rail 모양이 예상과 다름');
      rail.nodes = [n[0], {...n[2], caption: '먼저 · 공포사냥개 2마리'}, {...n[1], caption: '이어서 · 조각 1개'}, ...n.slice(3)];
      const card = [].concat(b.cards || []).find(c => (c.title || '').startsWith('폭군 직전'));
      const same = card && card.items.find(i => i.label === '같은 시작');
      const at = same ? same.lines.indexOf('흑마법서 → 공포사냥개(앞뒤는 로그마다 다름)') : -1;
      if (at < 0) throw new Error('오프닝 카드의 같은 시작 줄을 못 찾음');
      same.lines[at] = '흑마법서·공포사냥개 소환(악마학자는 공포사냥개 먼저)';
      rail.note = '지옥수호병은 전투 전에 부릅니다. 스조라크 상위 로그 9개 모두 공포사냥개를 먼저 불렀고, 흑마법서는 6개가 오프닝에 썼습니다. 이미 5조각이면 어둠의 화살 단계는 건너뛰고, 준비가 길어져 공포사냥개가 사라지지 않게 합니다.';
    }
    return m;
  },
};
