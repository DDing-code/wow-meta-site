// demonhunter-devourer 후속(2026-10-22, 사용자 수정 지시 "포식 풀링 1초 전 영혼 제물 → 흡수로 풀링"):
// 2026-10-20 로그 대조 때 두 영웅 오프닝을 흡수 → 영혼 제물로 바꿨던 것을, 풀링 1초 전 영혼 제물 → 흡수로 풀링으로 되돌린다.
// 상위 레이드 로그에는 영혼 제물이 전투 시작 뒤에 찍힌 경우가 많았지만, 풀링 1초 전에 써 두면 5초에 걸쳐 들어오는 격노·파편이
// 전투 시작과 함께 들어온다. 2부 오프닝 장(개념·문단·요점·rail 2개), 영웅 탭 오프닝 2개, 맨 위 오프닝, 근거 기록을 함께 맞춘다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('후속: 바꿀 문장을 못 찾음: ' + from.slice(0, 40)); return text.replace(from, to); };

const SAC = '1241937', CONSUME = '473662';
const PULL_LINE = '풀링 1초 전에 영혼 제물을 쓰고, 흡수로 풀링합니다.';

module.exports = function followup(m) {
  const block = t => { const b = m.blocks.find(x => x.title.startsWith(t)); if (!b) throw new Error('후속: 장 없음 ' + t); return b; };
  const hero = l => { const h = m.heroBranches.find(x => x.label === l); if (!h) throw new Error('후속: 영웅 없음 ' + l); return h; };

  // 2부 오프닝 장
  const opener = block('쿨기와 오프닝');
  opener.title = rep(opener.title, '풀링 2초 전부터', '풀링 1초 전부터');
  opener.concept = '오프닝은 풀링 1초 전 영혼 제물, 흡수로 풀링해 시작하고, 수확·공허 광선으로 첫 탈태 조건을 만든 뒤 들어가자마자 공허 광선과 붕괴하는 별로 여는 흐름입니다. 궤멸자가 기준이고, 공허상흔은 진입 직전 굶주린 베기 발동을 들고 들어가 사신의 대가부터 씁니다.';
  opener.paragraphs[0] = '풀링 타이머 1초 전에 영혼 제물을 쓰고, 흡수를 풀링에 맞춰 시작해 전투를 엽니다. 영혼 제물의 격노 30과 영혼 파편 3개는 5초에 걸쳐 들어오므로, 풀링 1초 전에 써 두면 전투 시작과 함께 자원이 들어오기 시작합니다. 실제 전투 시작 전에 적을 먼저 때려 선풀하지 않도록 흡수의 시전 시간을 맞춥니다. 12.1.5 이후 상위 레이드 로그에는 영혼 제물이 전투 시작 뒤에 찍힌 경우가 많았지만, 쓰자마자 자원을 전부 받았다고 계산하지 않는 것은 같습니다. 그 뒤 수확으로 4개 이상 거두고, 공허 광선과 생성기로 첫 탈태 조건을 만듭니다.';
  opener.bullets[0] = PULL_LINE + ' 타이머를 보고 선풀하지 않습니다.';
  const oRails = tlOf(opener)[0].rails;
  const swapRail = (label) => {
    const r = oRails.find(x => x.label === label);
    if (!r) throw new Error('후속: rail 없음 ' + label);
    if (r.nodes[0].skillId !== CONSUME || r.nodes[1].skillId !== SAC) throw new Error('후속: rail 첫 두 칸이 흡수·영혼 제물이 아님 ' + label);
    r.nodes = [{skillId: SAC, caption: '풀링 1초 전'}, {skillId: CONSUME, caption: '풀링 · 전투 시작'}, ...r.nodes.slice(2)];
  };
  swapRail('궤멸자 오프닝');
  swapRail('공허상흔 ① 전투 전부터 첫 진입까지');
  const annOpen = oRails.find(x => x.label === '궤멸자 오프닝');
  annOpen.note = rep(annOpen.note,
    '12.1.5 이후 상위 레이드 로그 8개는 모두 흡수로 시작해 영혼 제물을 그 뒤에 썼고, 6개는 첫 별 바로 뒤에 공허 광선을 썼습니다.',
    PULL_LINE + ' 12.1.5 이후 상위 레이드 로그 8개 중 6개는 첫 별 바로 뒤에 공허 광선을 썼습니다.');

  // 영웅 탭 오프닝 2개
  const fixSteps = (steps, who) => {
    if (steps[0].skillId !== CONSUME || steps[1].skillId !== SAC) throw new Error('후속: 영웅 오프닝 첫 두 단계가 흡수·영혼 제물이 아님 ' + who);
    const sac = {...steps[1], phase: '전투 전', trigger: '풀링 1초 전',
      note: '격노 30과 파편 3개가 5초에 걸쳐 들어옵니다. 풀링 1초 전에 써 두면 전투 시작과 함께 자원이 들어오기 시작합니다. 타이머를 확인해 선풀하지 않도록 준비합니다.'};
    const con = {...steps[0], phase: '첫 생성', trigger: '풀링 타이머 0초',
      note: '흡수로 풀링해 전투를 엽니다. 격노와 파편을 생성하며 첫 진입 조건을 만들고, 이후 빈 시간에도 파편과 격노를 만듭니다.'};
    return [sac, con, ...steps.slice(2)];
  };
  const ann = hero('궤멸자');
  ann.opener.steps = fixSteps(ann.opener.steps, '궤멸자');
  ann.opener.summary = rep(ann.opener.summary,
    '12.1.5 이후 상위 레이드 로그 8개에 맞춰 흡수를 먼저 쓰고 첫 별 뒤에 공허 광선을 넣었고,',
    '풀링 1초 전 영혼 제물 → 흡수로 풀링해 시작하고, 12.1.5 이후 상위 레이드 로그 8개에 맞춰 첫 별 뒤에 공허 광선을 넣었고,');
  const vs = hero('공허상흔');
  vs.opener.steps = fixSteps(vs.opener.steps, '공허상흔');

  // 맨 위 오프닝(기본 영웅 궤멸자 기준)
  if (m.opener && m.opener.steps) {
    const s = m.opener.steps;
    if (s[0].skillId === SAC && s[1].skillId === CONSUME) {
      s[0] = {...s[0], phase: '전투 전', trigger: '풀링 1초 전', note: '격노 30과 파편 3개가 5초에 걸쳐 들어옵니다. 풀링 1초 전에 써 두면 전투 시작과 함께 자원이 들어오기 시작합니다. 타이머를 확인해 선풀하지 않도록 준비합니다.'};
      s[1] = {...s[1], phase: '첫 생성', trigger: '풀링 타이머 0초', note: '흡수로 풀링해 전투를 엽니다. 격노와 파편을 생성하며 첫 진입 조건을 만듭니다.'};
    } else if (s[0].skillId === CONSUME && s[1].skillId === SAC) {
      m.opener.steps = fixSteps(s, '맨 위');
    } else throw new Error('후속: 맨 위 오프닝 첫 두 단계가 예상과 다름');
    if (m.opener.summary.includes('흡수를 먼저 쓰고')) m.opener.summary = ann.opener.summary;
  }

  m.evidence = [...(m.evidence || []).filter(x => !x.startsWith('풀링 순서 확정')),
    '풀링 순서 확정(2026-10-22): 사용자 확인으로 포식 오프닝 시작을 풀링 1초 전 영혼 제물 → 흡수로 풀링으로 정했습니다. 2026-10-20 로그 대조 때 흡수 → 영혼 제물로 바꿨던 2부 오프닝 rail 2개, 영웅 탭 오프닝 2개, 맨 위 오프닝, 같은 장의 개념·첫 문단·요점을 이 순서로 되돌렸습니다. 상위 레이드 로그에는 영혼 제물이 전투 시작 뒤에 찍힌 경우가 많았지만, 풀링 1초 전에 쓰면 5초에 걸쳐 들어오는 자원이 전투 시작과 함께 들어옵니다. 첫 별 뒤 공허 광선 등 나머지 순서는 그대로입니다.'];
  return m;
};
