// 2026-10-31 메타 점검(artifacts/meta-check-20261031) 결과를 원고·KB 정본에 반영한다.
//   1) 10월 27일(미국) 직업 조정: 야성·회복 드루이드·사격·화염·잠행·고통·파괴 (근거 hotfix-20261030-ko.txt, 공식 한국어 문장)
//   2) 포식 레이드: 님리사 상위 기록의 공허상흔 상승을 적고 견본은 그대로 둔다(공개 가이드는 궤멸자).
//   3) 10월 24일 단일 견본 교체 뒤 반대가 된 낡은 문장(풍운·조화·잠행·포식)
//   4) 생존: Icy Veins 10월 22일 아웃랜드 맹독 채택을 근거에 적고 견본은 그대로 둔다.
// 와우헤드 한국어 툴팁은 2026-10-31 확인 때 아직 조정 전 수치라 KB 스킬 설명은 고치지 않는다.
// 이번 작업 시작 때의 정본(orig/<ID>.json, 첫 실행 때 저장)에 적용해 KB 정본과 사이트 원고를 같은 객체로 쓴다.
// 사용: node apply.cjs [--dry]
const fs = require('node:fs');
const path = require('node:path');
const SITE = 'C:/wowmeta/site';
const {manuscriptFile, kbGuidePath, replaceManuscript} = require(SITE + '/artifacts/book-rebuild/lib.cjs');
const ORIG = path.join(__dirname, 'orig');
const HEAD = '## 2026-10-31 · 메타 점검 반영 (10월 27일 직업 조정·상위 기록 재집계·낡은 문장)';
const HOTFIX_URL = 'https://worldofwarcraft.blizzard.com/ko-kr/news/24307310';
const HOTFIX_UPDATED = '2026-10-27 미국 적용(한국어판 10월 28일 표기) / 2026-10-31 확인';
const LOGS_NOTE = '이 가이드의 상위 로그 근거는 대부분 이 조정 전 기록입니다.';

const rep = (text, from, to) => {
  if (typeof text !== 'string' || !text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 40));
  return text.replace(from, to);
};
const addEvidence = (m, text) => { m.evidence = [...(m.evidence || []).filter(x => !x.startsWith(text.slice(0, 18))), text]; };
const addCaveat = (m, text) => { m.caveats = [...(m.caveats || []).filter(x => !x.startsWith(text.slice(0, 18))), text]; };
const addHotfixSource = (m, note) => {
  const src = {tier: 'S', label: 'Blizzard 10월 27일 직업 조정 긴급 수정 (한국어)', url: HOTFIX_URL, updated: HOTFIX_UPDATED, note};
  m.sources = [...m.sources.filter(s => s.label !== src.label), src];
};

const P = {
  'druid-feral': {
    changelog: '- 10월 27일(미국) 긴급 수정: 야성 모든 공격력 5% 증가(PvP 제외). 근거·주의·출처에 추가, 딜사이클·견본은 그대로(모든 기술에 같은 비율).',
    apply(m) {
      addEvidence(m, '10월 27일 직업 조정(2026-10-31 확인): 10월 27일(미국) 긴급 수정으로 야성의 모든 공격력이 5%만큼 증가했습니다(플레이어 간 전투 제외, 한국어 공지는 10월 28일 표기). 모든 기술에 같은 비율로 붙는 변경이라 딜사이클 순서와 특성 견본은 그대로 둡니다. ' + LOGS_NOTE);
      addHotfixSource(m, '야성 모든 공격력 5% 증가(플레이어 간 전투 제외). 같은 날 다른 직업 조정과 PvP 절은 구분했습니다.');
    },
  },
  'mage-fire': {
    changelog: '- 10월 27일(미국) 긴급 수정: 화염 모든 공격력 5% 증가(PvP 제외). 근거·출처에 추가, 딜사이클·견본은 그대로(모든 기술에 같은 비율).',
    apply(m) {
      addEvidence(m, '10월 27일 직업 조정(2026-10-31 확인): 10월 27일(미국) 긴급 수정으로 화염의 모든 공격력이 5%만큼 증가했습니다(플레이어 간 전투 제외, 한국어 공지는 10월 28일 표기). 모든 기술에 같은 비율로 붙는 변경이라 딜사이클 순서와 특성 견본은 그대로 둡니다. ' + LOGS_NOTE);
      addHotfixSource(m, '화염 모든 공격력 5% 증가(플레이어 간 전투 제외). 같은 날 다른 직업 조정과 PvP 절은 구분했습니다.');
    },
  },
  'warlock-affliction': {
    changelog: '- 10월 27일(미국) 긴급 수정: 불안정한 고통 공격력 20% 증가(PvP 제외). 근거·주의·출처에 추가, 딜사이클은 그대로(순서를 바꾼 공개 자료 미확인).',
    apply(m) {
      addEvidence(m, '10월 27일 직업 조정(2026-10-31 확인): 10월 27일(미국) 긴급 수정으로 불안정한 고통의 공격력이 20%만큼 증가했습니다(플레이어 간 전투 제외, 한국어 공지는 10월 28일 표기). 이 조정으로 우선순위를 다시 계산한 공개 자료는 아직 확인하지 못해 딜사이클과 특성 견본은 그대로 둡니다.');
      addCaveat(m, '10월 27일(미국) 조정 전 기록은 불안정한 고통의 피해 비중이 지금보다 낮습니다. 이 가이드의 상위 로그 근거는 대부분 조정 전 기록이라, 불안정한 고통의 피해 비중은 지금 기록과 바로 비교하지 않고 시전 횟수·순서만 참고합니다.');
      addHotfixSource(m, '불안정한 고통 공격력 20% 증가(플레이어 간 전투 제외). 같은 날 파괴 불의 비 상향과 PvP 절은 구분했습니다.');
    },
  },
  'warlock-destruction': {
    changelog: '- 10월 27일(미국) 긴급 수정: 불의 비 공격력 20% 증가. 3부 광역 장 본문(불의 비 대상 수 문단)·근거·주의·출처에 추가, 대상 수 기준은 그대로(새 기준 공개 자료 미확인).',
    apply(m) {
      const i = m.blocks.findIndex(b => (b.paragraphs || []).some(p => p.startsWith('불의 비는 8월 25일에 피해가 30% 늘었습니다.')));
      if (i < 0) throw new Error('불의 비 문단을 못 찾음');
      const j = m.blocks[i].paragraphs.findIndex(p => p.startsWith('불의 비는 8월 25일에 피해가 30% 늘었습니다.'));
      let p = m.blocks[i].paragraphs[j];
      p = rep(p, '불의 비는 8월 25일에 피해가 30% 늘었습니다. 그래서 지금 기본 출발점은 악마학자 3대상, 지옥소환사 4대상부터 불의 비입니다.',
        '불의 비는 8월 25일에 피해가 30% 늘었고, 10월 27일(미국)에 20% 더 늘었습니다. 기본 출발점은 악마학자 3대상, 지옥소환사 4대상부터 불의 비입니다. 이 기준은 10월 27일 상향 전 자료이고 새 대상 수를 계산한 공개 자료는 아직 확인하지 못했으니, 경계에 있는 대상 수에서는 실제 적중 수를 확인하세요.');
      m.blocks[i].paragraphs[j] = p;
      addEvidence(m, '10월 27일 직업 조정(2026-10-31 확인): 10월 27일(미국) 긴급 수정으로 불의 비의 공격력이 20%만큼 증가했습니다(한국어 공지는 10월 28일 표기, 이 항목에는 플레이어 간 전투 제외 문구가 없습니다). 불의 비 대상 수 기준을 새로 계산한 공개 자료는 아직 확인하지 못해 기준과 특성 견본은 그대로 둡니다.');
      addCaveat(m, '10월 27일(미국) 조정 전 기록은 불의 비의 피해 비중이 지금보다 낮습니다. 이 가이드의 상위 로그 근거는 대부분 조정 전 기록이라 광역 피해 비중은 지금 기록과 바로 비교하지 않습니다.');
      addHotfixSource(m, '불의 비 공격력 20% 증가. 같은 날 고통 불안정한 고통 상향과 PvP 절은 구분했습니다.');
    },
  },
  'hunter-marksmanship': {
    changelog: '- 10월 27일(미국) 긴급 수정: 교묘한 사격 도탄 85%(기존 75%), 폭발 사격·연발 공격 공격력 10% 증가. 3부 광역 장 본문·도식 설명, 9월 23일 근거 문장의 "현재 툴팁도 75%"를 고침. 와우헤드 한국어 툴팁은 아직 75%라 KB 설명은 그대로.',
    apply(m) {
      const OLD = '교묘한 사격의 현재 한국어 툴팁도 75%입니다.';
      const NEW = '튕김 피해는 10월 27일(미국) 긴급 수정으로 85%가 됐습니다(와우헤드 한국어 툴팁은 10월 31일 확인 때 아직 75%).';
      m.evidence = m.evidence.map(e => (e.includes(OLD) ? rep(e, OLD, NEW) : e));
      m.sources = m.sources.map(s => (s.note.includes(OLD) ? {...s, note: rep(s.note, OLD, NEW)} : s));
      let hit = 0;
      m.blocks.forEach(b => {
        (b.paragraphs || []).forEach((p, k) => {
          if (p.includes('튕김 피해는 일반 공격력의 75%이고, 9월 23일 조정으로 60%에서 올랐습니다.')) {
            b.paragraphs[k] = rep(p, '튕김 피해는 일반 공격력의 75%이고, 9월 23일 조정으로 60%에서 올랐습니다.',
              '튕김 피해는 9월 23일 조정으로 일반 공격력의 60%에서 75%가 됐고, 10월 27일(미국) 조정으로 85%가 됐습니다(툴팁 표기는 아직 75%).');
            hit++;
          }
        });
        const layers = b.diagram?.layers || [];
        layers.forEach(l => (l.nodes || []).forEach(n => {
          if (n.note === '다음 조준 사격·속사가 최대 5명에게 튕김 · 튕김 피해는 일반 공격력의 75%') { n.note = '다음 조준 사격·속사가 최대 5명에게 튕김 · 튕김 피해는 일반 공격력의 85%(10월 27일 조정)'; hit++; }
        }));
      });
      if (hit !== 2) throw new Error('사격 광역 장 문장 수가 예상과 다름: ' + hit);
      addEvidence(m, '10월 27일 직업 조정(2026-10-31 확인): 10월 27일(미국) 긴급 수정으로 교묘한 사격이 조준 사격과 속사의 도탄 공격력을 85%만큼 증가시킵니다(기존 75%). 폭발 사격과 연발 공격의 공격력도 10%만큼 증가했습니다(한국어 공지는 10월 28일 표기). 개발자는 사격의 광역 피해 효율을 높이는 변경이라고 밝혔습니다. 광역 진입 대상 수를 새로 계산한 공개 자료는 아직 확인하지 못해 기준과 특성 견본은 그대로 둡니다.');
      addCaveat(m, '10월 27일(미국) 조정 전 기록은 교묘한 사격 도탄(75%)·폭발 사격·연발 공격의 광역 피해 비중이 지금보다 낮습니다. 이 가이드의 상위 로그 근거는 대부분 조정 전 기록이라 광역 피해 비중은 지금 기록과 바로 비교하지 않습니다.');
      addHotfixSource(m, '교묘한 사격 도탄 85%(기존 75%), 폭발 사격·연발 공격(공지 표기 연발 사격) 공격력 10% 증가. 같은 날 사격 PvP 절은 구분했습니다.');
    },
  },
  'rogue-subtlety': {
    changelog: [
      '- 10월 27일(미국) 긴급 수정: 잠행 모든 능력 공격력 8% 감소, 기만자 당혹 5%(기존 7%). 12.1.5 "14% 증가" 문장(3부 기만자 장·5부 요점·주의·출처)과 "당혹 7%" 본문에 되돌림을 적음.',
      '- 하향 뒤 상위 기록(10월 28일 이후) 기만자: 스조라크 9/9행, 님리사 7/7행, 쐐기 17/17행 — 기본 영웅 특성·견본 그대로.',
      '- 낡은 문장: 근거의 "순수 단일은 … 단일 견본을 유지했습니다", 영웅 결론의 "죽음추적자 단일 견본"(10월 24일 단일 견본을 기만자로 바꾼 뒤 반대가 됨).',
    ].join('\n'),
    apply(m) {
      const ROLL = ' 10월 27일(미국) 긴급 수정으로 모든 능력의 공격력이 8%만큼 감소해 이 상향의 상당 부분이 되돌려졌습니다.';
      const s11 = m.sources.find(s => s.note.includes('이를 고려해 잠행 모든 능력의 공격력이 14% 증가했습니다.'));
      s11.note = rep(s11.note, '이를 고려해 잠행 모든 능력의 공격력이 14% 증가했습니다.', '이를 고려해 잠행 모든 능력의 공격력이 14% 증가했습니다.' + ROLL);
      m.caveats = m.caveats.map(c => {
        if (c.includes('같은 패치의 모든 능력 공격력 14% 증가는')) return rep(c, '(SimC 12.1.0.69933 → 12.1.5.70448 주문 자료).', '(SimC 12.1.0.69933 → 12.1.5.70448 주문 자료).' + ROLL);
        if (c.startsWith('미국 10월 6일 잠행 기만자의 당혹 피해 보정이 5%에서 7%')) return c + ' 10월 27일(미국) 조정으로 당혹은 다시 5%입니다.';
        return c;
      });
      let hit = 0;
      m.blocks.forEach(b => {
        (b.paragraphs || []).forEach((p, k) => {
          if (p.includes('툴팁 기준은 5%이고, 10월 6일 미국 조정으로 잠행 기만자는 7%가 됐습니다(PvP 제외).')) {
            b.paragraphs[k] = rep(p, '툴팁 기준은 5%이고, 10월 6일 미국 조정으로 잠행 기만자는 7%가 됐습니다(PvP 제외).', '툴팁 기준은 5%입니다. 10월 6일 미국 조정으로 잠행 기만자는 7%가 됐다가, 10월 27일(미국) 조정으로 다시 5%가 됐습니다.');
            hit++;
          }
        });
        (b.bullets || []).forEach((x, k) => {
          if (x === '9월 23일 상향과 10월 6일 조정, 10월 13일 12.1.5 적용을 거쳤습니다. 그 전 평가나 사용률을 지금 순위로 읽지 않습니다.') { b.bullets[k] = '9월 23일 상향과 10월 6일 조정, 10월 13일 12.1.5 적용, 10월 27일 하향을 거쳤습니다. 그 전 평가나 사용률을 지금 순위로 읽지 않습니다.'; hit++; }
          if (x.startsWith('10월 13일 적용된 12.1.5에서 암흑 피해 보정이 두 번 붙던 문제가 고쳐졌고, 잠행 모든 능력의 공격력이 14% 올랐습니다.')) {
            b.bullets[k] = rep(x, '잠행 모든 능력의 공격력이 14% 올랐습니다.', '잠행 모든 능력의 공격력이 14% 올랐습니다. 10월 27일(미국)에는 모든 능력의 공격력이 다시 8% 줄었습니다.');
            hit++;
          }
        });
      });
      if (hit !== 3) throw new Error('잠행 본문 문장 수가 예상과 다름: ' + hit);
      m.evidence = m.evidence.map(e => (e.includes('순수 단일은 두 저자의 본문이 모두 죽음추적자를 앞에 두어 단일 견본을 유지했습니다.')
        ? rep(e, '순수 단일은 두 저자의 본문이 모두 죽음추적자를 앞에 두어 단일 견본을 유지했습니다.', '순수 단일은 두 저자의 본문이 모두 죽음추적자를 앞에 두지만, 2026-10-24에 단일 견본도 신화 스조라크 상위 기록(전체 199행·한국 100행 모두 기만자)의 대표 빌드로 바꿨습니다.')
        : e));
      const hc = m.logReview.heroConclusion;
      hc.conclusion = rep(hc.conclusion, '적 하나만 계속 때리는 연습은 죽음추적자 단일 견본, 일반 쐐기와 기만자 운용을 익히는 연습은 기만자 견본을 쓰세요. 공격대 견본의 기만자가 모든 순수 단일 전투에서도 더 강하다는 뜻은 아닙니다.',
        '단일·레이드·쐐기 견본은 모두 기만자입니다. 단일 견본은 신화 스조라크 상위 기록(전체 199행·한국 100행 모두 기만자)으로 만든 빌드이고, 죽음추적자는 징표 관리가 손에 익었을 때 직접 비교하는 대안입니다. 기만자가 모든 순수 단일 전투에서 더 강하다는 뜻은 아닙니다.');
      hc.conclusion = rep(hc.conclusion, '단일 죽음추적자와 레이드·쐐기 기만자 견본은 서로 다른 연습 목적을 가진 것으로 유지합니다.', '10월 27일(미국) 하향 뒤 10월 28일 이후 상위 기록도 스조라크 9행·님리사 7행·쐐기 17행 모두 기만자였습니다(기록 수가 적음).');
      hc.checkedAt = '2026-10-31';
      m.sourceNote = rep(m.sourceNote, '적 하나만 계속 때리는 연습은 죽음추적자 단일 견본, 일반 쐐기와 기만자 운용을 익히는 연습은 기만자 견본을 쓰세요.', '단일·레이드·쐐기 견본은 모두 기만자이고, 단일 견본은 신화 스조라크 상위 기록으로 만든 빌드입니다(2026-10-24).');
      if (m.sourceNote.includes('단일 죽음추적자와 레이드·쐐기 기만자 견본은 서로 다른 연습 목적을 가진 것으로 유지합니다.')) m.sourceNote = rep(m.sourceNote, '단일 죽음추적자와 레이드·쐐기 기만자 견본은 서로 다른 연습 목적을 가진 것으로 유지합니다.', '죽음추적자는 직접 비교하는 대안입니다.');
      addEvidence(m, '10월 27일 직업 조정(2026-10-31 확인): 10월 27일(미국) 긴급 수정으로 잠행 모든 능력의 공격력이 8%만큼 감소했고, 기만자의 당혹이 받는 피해를 5%만큼 증가시킵니다(기존 7%, 한국어 공지는 10월 28일 표기). 개발자는 12.1.5 보상 상향이 예상보다 컸고 패치 변경이 죽음추적자보다 기만자에게 더 유리했다고 밝혔습니다. 하향 뒤 10월 28일 이후 WCL 상위 기록은 신화 스조라크 9행·신화 님리사 7행·쐐기 17행 모두 기만자였습니다. 기록 수가 적은 랭킹 상위 기록이라 전체 사용률이 아니며, 기본 영웅 특성과 특성 견본은 그대로 둡니다.');
      addHotfixSource(m, '잠행 모든 능력 공격력 8% 감소, 기만자 당혹 5%(기존 7%). 12.1.5 보상 상향의 상당 부분을 되돌리고 기만자를 추가로 낮춘 조정입니다.');
    },
  },
  'druid-restoration': {
    changelog: [
      '- 10월 27일(미국) 긴급 수정: 푸른 신록 치유량 60%·재생 치유량 10% 증가, 신속한 치유 연마 40%(기존 30%), 모두 PvP 제외. 근거·주의·출처(12.1.5 이후 긴급 수정 항목)에 추가.',
      '- KB 새 노트: Talents/신속한치유연마.md(470549, 툴팁은 조정 전 30% 그대로).',
      '- 쐐기 상위 기록은 신속한 치유 연마를 대부분 고르지만(조정 전 51/54행, 뒤 29/35행) 쐐기 견본(Wowhead Mythic+ Best)은 고르지 않음 — 근거가 갈려 견본은 그대로, 두 근거를 함께 적음.',
    ].join('\n'),
    apply(m) {
      const s = m.sources.find(x => x.url === HOTFIX_URL);
      if (!s) throw new Error('12.1.5 이후 긴급 수정 출처가 없음');
      s.updated = '2026-10-14 적용(한국어판 10월 15일 표기) · 2026-10-27 적용(한국어판 10월 28일 표기) / 2026-10-31 확인';
      s.note = rep(s.note, '10월 16일 항목까지 회복 드루이드 항목은 이것 하나입니다.', '10월 27일(미국)에는 푸른 신록 치유량 60%·재생 치유량 10% 증가와 신속한 치유 연마 40%(기존 30%)가 적용됐습니다(모두 플레이어 간 전투 제외). 10월 30일 항목까지 회복 드루이드 PvE 항목은 이 둘입니다.');
      addEvidence(m, '10월 27일 직업 조정(2026-10-31 확인): 10월 27일(미국) 긴급 수정으로 푸른 신록의 치유량이 60%, 재생의 치유량이 10%만큼 증가했고, 신속한 치유 연마가 신속한 치유의 치유량을 40%만큼 증가시킵니다(기존 30%). 모두 플레이어 간 전투 제외이고 한국어 공지는 10월 28일 표기입니다. 개발자는 공격대 성능은 괜찮다고 보고 던전의 폭발적인 피해 대응을 돕는 변경이라고 밝혔습니다. 와우헤드 한국어 툴팁은 10월 31일 확인 때 신속한 치유 연마가 아직 30%라 스킬 설명은 툴팁 그대로 둡니다.');
      addEvidence(m, '쐐기 특성 재집계(2026-10-31): 12.1.5 이후 쐐기 상위 기록은 10월 27일 조정 전 54행 중 51행, 조정 뒤 35행 중 29행이 신속한 치유 연마를 골랐고, 푸른 신록은 각각 40행·21행이 골랐습니다. 이 가이드의 쐐기 견본(Wowhead Mythic+ Best)은 푸른 신록은 고르지만 신속한 치유 연마는 고르지 않습니다. 공개 가이드와 상위 기록이 갈려 견본은 그대로 두고, 폭발적인 피해가 잦은 던전에서는 신속한 치유 연마를 고른 빌드와 비교해 보세요. 랭킹 상위 행은 전체 사용률이 아닙니다.');
      addCaveat(m, '10월 27일(미국) 조정 전 기록은 푸른 신록·재생·신속한 치유의 치유 비중이 지금보다 낮습니다. 이 가이드의 로그 근거는 대부분 조정 전 기록이라 이 셋의 치유량 비중은 지금 기록과 바로 비교하지 않습니다.');
    },
  },
  'monk-windwalker': {
    changelog: '- 낡은 문장: 12.1.5 추천 조건 재검수(10월 19일)의 "단일·레이드 음영파 … 견본을 유지합니다"(근거·출처·영웅 결론) — 10월 24일 단일 견본을 천신의 대변자로 바꾼 뒤 반대가 됨.',
    apply(m) {
      const OLD = '단일·레이드 음영파, 쐐기 천신의 대변자 견본을 유지합니다.';
      const NEW = '레이드 음영파, 쐐기 천신의 대변자 견본을 유지하고, 단일 견본은 2026-10-24에 신화 스조라크 상위 기록의 천신의 대변자 빌드로 바꿨습니다.';
      let hit = 0;
      m.evidence = m.evidence.map(e => (e.includes(OLD) ? (hit++, rep(e, OLD, NEW)) : e));
      m.sources = m.sources.map(s => (s.note.includes(OLD) ? (hit++, {...s, note: rep(s.note, OLD, NEW)}) : s));
      const hc = m.logReview.heroConclusion;
      if (hc.conclusion.includes(OLD)) { hc.conclusion = rep(hc.conclusion, OLD, NEW); hit++; }
      if (m.sourceNote.includes(OLD)) m.sourceNote = rep(m.sourceNote, OLD, NEW);
      if (hit !== 3) throw new Error('풍운 낡은 문장 수가 예상과 다름: ' + hit);
    },
  },
  'druid-balance': {
    changelog: '- 낡은 문장: 12.1.5 추천 조건 재검수(10월 19일)의 "엘룬 견본은 기본 학습용"(근거·출처·영웅 결론·게시 검수 근거), Wowhead 출처의 "기존 엘룬의 대행자 견본 유지 근거", 영웅 결론 첫 문장 — 10월 24일 기본 탭과 단일 견본을 숲의 수호자로 바꾼 뒤 반대가 됨.',
    apply(m) {
      const OLD = '따라서 엘룬 견본은 기본 학습용으로 유지하고, 님리사 상위 기록을 따라 연습할 때는 숲의 수호자 운용을 별도로 비교합니다.';
      const NEW = '그래서 레이드·쐐기 견본은 엘룬의 대행자로 유지하고, 기본 탭과 단일 견본은 2026-10-24에 신화 스조라크 상위 기록의 숲의 수호자로 바꿨습니다. 님리사 상위 기록을 따라 연습할 때는 숲의 수호자 운용을 함께 비교합니다.';
      let hit = 0;
      m.evidence = m.evidence.map(e => (e.includes(OLD) ? (hit++, rep(e, OLD, NEW)) : e));
      m.sources = m.sources.map(s => {
        if (s.note.includes(OLD)) { hit++; return {...s, note: rep(s.note, OLD, NEW)}; }
        if (s.note.endsWith('기존 엘룬의 대행자 견본 유지 근거.')) { hit++; return {...s, note: rep(s.note, '기존 엘룬의 대행자 견본 유지 근거.', '레이드·쐐기 엘룬의 대행자 견본 유지 근거(단일 견본은 스조라크 상위 기록의 숲의 수호자).')}; }
        return s;
      });
      const hc = m.logReview.heroConclusion;
      hc.conclusion = rep(hc.conclusion, OLD, NEW);
      hc.conclusion = rep(hc.conclusion, '한 분기부터 익힌다면 엘룬의 대행자로 시작하세요. 쐐기에서 모인 적을 계속 때리는 상황도 같은 견본으로 연습합니다.', '스조라크 같은 단일 네임드는 숲의 수호자 순서와 단일 견본부터 익히세요. 쐐기에서 모인 적을 계속 때리는 상황은 엘룬의 대행자 쐐기 견본으로 연습합니다.');
      hc.checkedAt = '2026-10-31';
      const pr = m.logReview.publicationReview;
      pr.evidence = rep(pr.evidence, OLD, NEW);
      if (m.sourceNote.includes(OLD)) m.sourceNote = rep(m.sourceNote, OLD, NEW);
      m.sourceNote = rep(m.sourceNote, '한 분기부터 익힌다면 엘룬의 대행자로 시작하세요. 쐐기에서 모인 적을 계속 때리는 상황도 같은 견본으로 연습합니다.', '스조라크 같은 단일 네임드는 숲의 수호자 순서와 단일 견본부터 익히세요. 쐐기에서 모인 적을 계속 때리는 상황은 엘룬의 대행자 쐐기 견본으로 연습합니다.');
      if (hit !== 3) throw new Error('조화 낡은 문장 수가 예상과 다름: ' + hit);
    },
  },
  'demonhunter-devourer': {
    changelog: [
      '- 상위 기록 재집계(2026-10-31): 신화 님리사 100행 궤멸자 57·공허상흔 43(10월 28일 이후 39행은 공허상흔 22행), 쐐기 92행 궤멸자 65행(71%), 스조라크 100행 공허상흔 93행.',
      '- 공개 가이드(Wowhead 10월 13일판·Icy Veins 12.1.5판)는 여전히 궤멸자 → 근거가 갈려 레이드·쐐기 견본은 궤멸자 그대로, 두 근거를 함께 적음.',
      '- 고친 문장: 3부 영웅 특성 장 문단 1, 4부 공허상흔 장 고르는 기준 문단, 영웅 탭 공허상흔 선택 기준·궤멸자 요약의 "님리사 100행 중 85행" 문장, 영웅 결론의 "단일·쐐기·레이드 모두 궤멸자"(10월 24일 단일 견본을 공허상흔으로 바꾼 뒤 반대가 됨).',
      '- 그대로 둔 것: 오프닝(풀링 1초 전 영혼 제물 → 흡수), 딜사이클, 견본 코드.',
    ].join('\n'),
    apply(m) {
      const NEWDATA = '10월 31일 다시 집계하니 신화 님리사는 100행 중 궤멸자 57행·공허상흔 43행으로 좁혀졌고, 10월 28일 이후 기록 39행만 보면 공허상흔이 22행으로 더 많았습니다. 쐐기는 92행 중 65행이 궤멸자입니다.';
      let hit = 0;
      m.blocks.forEach(b => (b.paragraphs || []).forEach((p, k) => {
        if (p.includes('12.1.5 이후(10월 13일 미국 적용 뒤) WCL 상위 랭킹도 같은 쪽이라, 신화 님리사는 100행 중 85%(한국 51행 중 82%), 쐐기는 판정한 62행 중 81%(한국 15행 중 93%)가 궤멸자였습니다.')) {
          b.paragraphs[k] = rep(p, '12.1.5 이후(10월 13일 미국 적용 뒤) WCL 상위 랭킹도 같은 쪽이라, 신화 님리사는 100행 중 85%(한국 51행 중 82%), 쐐기는 판정한 62행 중 81%(한국 15행 중 93%)가 궤멸자였습니다.',
            '10월 19일 집계한 WCL 상위 랭킹도 같은 쪽이라, 신화 님리사는 100행 중 85%(한국 51행 중 82%), 쐐기는 판정한 62행 중 81%(한국 15행 중 93%)가 궤멸자였습니다. ' + NEWDATA + ' 공개 가이드는 아직 궤멸자를 권해 쐐기·레이드 견본은 궤멸자로 두니, 쫄이 적은 레이드 네임드에서는 공허상흔(4부)도 비교해 보세요.');
          hit++;
        }
        if (p.includes('쫄이 섞이는 님리사(100행 중 85행)와 쐐기(62행 중 50행)는 궤멸자가 다수라 쐐기·레이드 견본은 궤멸자입니다.')) {
          b.paragraphs[k] = rep(p, '쫄이 섞이는 님리사(100행 중 85행)와 쐐기(62행 중 50행)는 궤멸자가 다수라 쐐기·레이드 견본은 궤멸자입니다.',
            '쫄이 섞이는 님리사와 쐐기는 궤멸자가 다수라 쐐기·레이드 견본은 궤멸자입니다. 다만 님리사는 10월 31일 집계에서 100행 중 궤멸자 57행·공허상흔 43행으로 좁혀졌고, 10월 28일 이후 기록은 39행 중 22행이 공허상흔이었습니다.');
          hit++;
        }
      }));
      const vs = m.heroBranches.find(h => h.label === '공허상흔');
      const an = m.heroBranches.find(h => h.label === '궤멸자');
      vs.bullets = vs.bullets.map(x => (x.includes('쫄이 섞이는 레이드(신화 님리사 상위 100행 중 85행)와 쐐기(62행 중 50행)는 궤멸자가 다수라 그쪽은 궤멸자 탭을 봅니다.')
        ? (hit++, rep(x, '쫄이 섞이는 레이드(신화 님리사 상위 100행 중 85행)와 쐐기(62행 중 50행)는 궤멸자가 다수라 그쪽은 궤멸자 탭을 봅니다.', '쫄이 섞이는 레이드(10월 31일 신화 님리사 상위 100행 중 57행)와 쐐기(92행 중 65행)는 궤멸자가 다수라 그쪽은 궤멸자 탭을 봅니다. 님리사는 10월 28일 이후 기록에서 공허상흔이 더 많아 비교해 볼 만합니다.'))
        : x));
      an.summary = rep(an.summary, '12.1.5 이후 상위 랭킹은 신화 님리사 100행 중 85행(한국 51행 중 42행), 쐐기 62행 중 50행이 궤멸자였고,',
        '12.1.5 이후 상위 랭킹은 10월 19일 집계에서 신화 님리사 100행 중 85행(한국 51행 중 42행), 쐐기 62행 중 50행이 궤멸자였고, 10월 31일 집계에서는 님리사 100행 중 57행, 쐐기 92행 중 65행으로 줄었습니다.');
      hit++;
      if (hit !== 4) throw new Error('포식 문장 수가 예상과 다름: ' + hit);
      const hc = m.logReview.heroConclusion;
      hc.conclusion = rep(hc.conclusion, '단일·쐐기·레이드 모두 궤멸자를 기준으로 둡니다.', '단일은 공허상흔(신화 스조라크 상위 기록), 쐐기·레이드는 궤멸자를 기준으로 둡니다.');
      hc.conclusion = rep(hc.conclusion, '10월 10일 한국 사례 두 분기는 12.1.5 적용 전 기록입니다.', NEWDATA + ' 공개 저자가 아직 궤멸자를 권해 쐐기·레이드 견본은 그대로 둡니다. 10월 10일 한국 사례 두 분기는 12.1.5 적용 전 기록입니다.');
      hc.checkedAt = '2026-10-31';
      addEvidence(m, '상위 기록 재집계(2026-10-31): 12.1.5 이후 WCL 상위 랭킹 첫 100행을 다시 받았습니다. 신화 님리사는 궤멸자 57행·공허상흔 43행(10월 19일 85행·15행)이고, 10월 28일 이후 기록 39행만 보면 공허상흔 22행·궤멸자 17행입니다. 쐐기는 92행 중 궤멸자 65행(10월 28일 이후 34행 중 22행), 신화 스조라크는 100행 중 공허상흔 93행입니다. Wowhead 12.1.5판(10월 13일)과 Icy Veins 12.1.5판은 여전히 쐐기·레이드에 궤멸자를 권해, 근거가 갈린 레이드도 견본은 궤멸자로 두고 두 근거를 함께 적었습니다. 랭킹 상위 행은 전체 사용률이 아닙니다.');
    },
  },
  'hunter-survival': {
    changelog: '- Icy Veins 10월 22일 갱신: 아웃랜드 맹독이 치명타 피해 4%를 온전히 주도록 고쳐져 파수꾼 단일·레이드 광역·쐐기·구렁 빌드에 넣음. 10월 22일 이후 상위 기록은 소수(스조라크 13/47·님리사 9/45·쐐기 6/57행)라 견본 세 개는 그대로, 근거·출처에 적음.',
    apply(m) {
      const iv = m.sources.find(s => s.url === 'https://www.icy-veins.com/wow/survival-hunter-pve-dps-spec-builds-talents');
      if (!iv || !iv.updated.includes('2026-10-19')) throw new Error('생존 Icy Veins 출처가 예상과 다름');
      iv.updated = 'Oct 12, 2026 - 4:30 PM 갱신 / 2026-10-19 브라우저 확인 / Oct 22, 2026 갱신(아웃랜드 맹독) 2026-10-31 확인';
      iv.note = iv.note.replace(/\s*$/, '') + ' 10월 22일 갱신에서 아웃랜드 맹독이 치명타 피해 4%를 온전히 주도록 고쳐졌다며 파수꾼 단일·레이드 광역·쐐기·구렁 빌드에 넣었습니다.';
      addEvidence(m, '아웃랜드 맹독 재검토(2026-10-31): Icy Veins는 10월 22일 아웃랜드 맹독이 치명타 피해 4%를 온전히 주도록 고쳐졌다며 파수꾼 단일·레이드 광역·쐐기·구렁 빌드에 넣었습니다. 같은 수정은 공식 긴급 수정 공지(10월 30일 항목까지)에서 찾지 못했습니다. 12.1.5 이후 WCL 상위 기록에서 이 특성을 고른 행은 10월 22일 전 신화 스조라크 53행 중 3행·님리사 55행 중 3행·쐐기 15행 중 1행, 뒤 47행 중 13행·45행 중 9행·57행 중 6행으로 늘었지만 아직 소수입니다. 공개 가이드와 상위 기록이 갈려 이 가이드의 견본 세 개는 그대로 두니, 고르려면 Icy Veins 빌드와 비교해 보세요. 랭킹 상위 행은 전체 사용률이 아닙니다.');
    },
  },
};

function apply(id, dry) {
  const {file} = kbGuidePath(id);
  fs.mkdirSync(ORIG, {recursive: true});
  const origFile = path.join(ORIG, id + '.json');
  if (!fs.existsSync(origFile)) fs.copyFileSync(file, origFile);
  const original = JSON.parse(fs.readFileSync(origFile, 'utf8'));
  const next = JSON.parse(JSON.stringify(original));
  P[id].apply(next);
  const changed = JSON.stringify(original) !== JSON.stringify(next);
  if (dry) { console.log(`${id}: dry — 바뀜 ${changed}`); return; }
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + '\n');
  const target = manuscriptFile(id);
  fs.writeFileSync(target, replaceManuscript(fs.readFileSync(target, 'utf8'), id, next));
  const log = path.join(path.dirname(file), 'patch-changelog.md');
  let text = fs.existsSync(log) ? fs.readFileSync(log, 'utf8') : '# 변경 기록\n';
  const at = text.indexOf(HEAD);
  if (at >= 0) {
    const nextHead = text.indexOf('\n## ', at + HEAD.length);
    text = text.slice(0, at).replace(/\n+$/, '\n') + (nextHead >= 0 ? text.slice(nextHead + 1) : '');
  }
  text = text.replace(/\n*$/, '\n\n') + HEAD + '\n\n' + P[id].changelog.trim() + '\n';
  fs.writeFileSync(log, text);
  console.log(`${id}: 반영 — 바뀜 ${changed}`);
}

const dry = process.argv.includes('--dry');
const ids = process.argv.slice(2).filter(a => !a.startsWith('--'));
for (const id of ids.length ? ids : Object.keys(P)) apply(id, dry);
