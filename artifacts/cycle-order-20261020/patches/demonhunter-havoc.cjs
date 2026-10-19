// demonhunter-havoc 딜사이클 순서 수정 — 근거: digests/demonhunter-havoc.md, apl/demonhunter_havoc.simc
// 알드라치 파괴자: 레이드 로그 7개가 모두 같은 단일 오프닝이라 2부 오프닝 rail 을 레이드 단일 순서로 바꾼다.
//   (영웅 탭 알드라치 오프닝은 검사기가 '광역 흐름: 파멸이 죽음의 휩쓸기보다 먼저'를 강제하므로 광역 예시로 둔다.)
// 지옥상흔: 첫 안광과 사냥의 앞뒤는 로그 5:3 으로 갈리고 APL(10월 13일)은 안광 먼저라 순서는 두고 '로그마다 다름'만 적는다.
// 두 영웅 공통: 분당 2회 넘게 누르는 복수의 퇴각이 우선순위에 없어 넣고, 알드라치 목록에 빠진 탈태·제물의 오라를 넣는다.
const tlOf = b => (Array.isArray(b.timeline) ? b.timeline : [b.timeline]);
const rep = (text, from, to) => { if (!text.includes(from)) throw new Error('바꿀 문장을 못 찾음: ' + from.slice(0, 40)); return text.replace(from, to); };

const RETREAT = {skillId: '198793', label: '복수의 퇴각', note: '탈태나 안광 바로 앞에서 뒤쪽이 안전할 때 씁니다. 자주성·갈무리한 기운을 다시 켜고, 타성은 뒤이은 지옥칼로 켭니다. 상위 레이드 로그도 오프닝에서 탈태 바로 앞에 썼습니다.'};

module.exports = {
  evidenceNote: '딜사이클 순서 대조(2026-10-20): 12.1.5 이후 WCL 상위 레이드 15개(지옥상흔 8·알드라치 파괴자 7)·쐐기 16개의 실제 시전 순서와 심크 APL(midnight d91a5707, 10월 13일 수정)을 대조했습니다. 알드라치 파괴자의 2부 오프닝을 레이드 로그 7개가 모두 쓴 단일 순서(사냥 → 파괴자의 글레이브 → 안광 → 정수 파쇄 → 죽음의 휩쓸기 → 파멸 → 죽음의 휩쓸기 → 복수의 퇴각 → 탈태)로 고치고, 두 영웅 특성 탭 우선순위에 빠져 있던 복수의 퇴각(알드라치는 탈태·제물의 오라도)을 넣었습니다. 지옥상흔의 첫 안광과 사냥 앞뒤는 로그가 5:3으로 갈리고 APL이 안광 먼저라 순서는 그대로 두고 로그마다 다르다고 적었습니다.',
  changelog: [
    '- 알드라치 파괴자 2부 오프닝 rail(① 글레이브와 첫 형상·② 직접 탈태 구간): (전, 두 대상 이상 기준) 제물의 오라 → 사냥 → 파괴자의 글레이브 → 안광 → 파멸 → 정수 파쇄 / 죽음의 휩쓸기 → 죽음의 휩쓸기 → 복수의 퇴각 → 탈태 → 죽음의 휩쓸기 → 안광 → (후, 레이드 단일) 제물의 오라 → 사냥 → 파괴자의 글레이브 → 안광 → 정수 파쇄 → 죽음의 휩쓸기 → 파멸 → 죽음의 휩쓸기 / 복수의 퇴각 → 탈태 → 죽음의 휩쓸기 → 안광. 근거: 상위 레이드 7개 모두 안광 바로 뒤 정수 파쇄, 그다음 죽음의 휩쓸기 → 파멸 → 죽음의 휩쓸기, 6개가 복수의 퇴각 바로 뒤 탈태. 예시 https://www.warcraftlogs.com/reports/BnZG9KqvFwYWr286#fight=4&source=30 . APL 의 annihilation,if=buff.rending_strike.up&buff.glaive_flurry.down&debuff.reavers_mark.stack<2 (단일은 칼춤 계열 먼저), essence_break,if=cooldown.eye_beam.remains>4. 같은 장 본문 셋째 문단과 영웅 탭 알드라치 오프닝 소개 문장도 맞춤(영웅 탭 오프닝 단계는 광역 예시로 둠).',
    '- 두 영웅 특성 탭 단일·광역 우선순위: 사냥 다음에 복수의 퇴각 추가. 근거: 레이드 분당 지옥상흔 2.4회·알드라치 2.6회, 쐐기 2.4회·2.0회, 오프닝 15개 중 14개가 탈태 바로 앞. APL 4번째 줄 vengeful_retreat(탈태 쿨 중 안광 직전·탈태 직전).',
    '- 알드라치 파괴자 탭 단일·광역 우선순위: 맨 위에 탈태, 안광 다음에 제물의 오라 추가(2부 단일 연습 본문의 공통 우선순위 문장과 같게). 근거: 레이드 분당 제물의 오라 2.1회·쐐기 2.7회, 모든 레이드 오프닝에 탈태. APL 첫 줄 metamorphosis.',
    '- 2부 단일 연습 본문의 공통 우선순위 문장에 복수의 퇴각을 넣음.',
    '- 그대로 둔 것: 지옥상흔 오프닝의 안광 → 사냥(로그 8개 중 5개는 사냥 먼저, 3개는 안광 먼저, APL 10월 13일판은 영원한 사냥이면 안광 먼저) — rail note 와 영웅 탭 사냥 단계 note 에 로그마다 다르다고 적음. 지옥상흔 직접 탈태 뒤 집어삼키는 불길·심연의 응시 앞뒤는 4:4. 정수 파쇄는 안광 직후가 절반쯤이고 안광과 10초 넘게 떨어진 경우도 30% 안팎이라 지금 설명(안광이 멀면 기다리지 않음)을 유지.',
  ].join('\n'),
  apply(m) {
    const block = t => m.blocks.find(b => b.title.startsWith(t));
    const hero = l => m.heroBranches.find(h => h.label === l);
    const byId = (rows, id) => { const r = rows.find(x => x.skillId === id); if (!r) throw new Error('행 없음 ' + id); return r; };

    // 2부 단일 연습: 공통 우선순위 문장
    const single = block('허수아비 첫 연습');
    single.paragraphs[0] = rep(single.paragraphs[0],
      '탈태 → (알드라치라면 파괴자의 글레이브) → 사냥 → 정수 파쇄 →',
      '탈태 → (알드라치라면 파괴자의 글레이브) → 사냥 → (탈태·안광 직전) 복수의 퇴각 → 정수 파쇄 →');

    // 2부 오프닝: 알드라치 rail 두 줄을 레이드 단일 순서로
    const opener = block('쿨기와 오프닝');
    opener.paragraphs[2] = '알드라치 파괴자는 글레이브 준비부터 다릅니다. 제물의 오라 뒤 사냥으로 글레이브를 만들고, 파괴자의 글레이브를 오래 살 대상에게 쓴 다음 안광을 완주합니다. 레이드 단일에서는 바로 정수 파쇄를 열고, 죽음의 휩쓸기로 몰아치는 전투검을 먼저, 파멸로 분쇄 일격을 그다음에 써서 징표를 더 쌓습니다. 초기화된 죽음의 휩쓸기까지 쓴 뒤 복수의 퇴각과 직접 탈태로 넘어갑니다. 12.1.5 이후 상위 레이드 로그 7개가 모두 이 순서였습니다. 두 대상 이상이 오래 붙어 있으면 파멸을 먼저 쓰는 광역 순서(영웅 특성 탭 오프닝)를 씁니다. 직접 탈태에서 지옥상흔의 오라 초기화나 심연의 응시는 기대하지 않습니다.';
    const rails = tlOf(opener)[0].rails;
    const felRail = rails.find(r => r.label === '지옥상흔 ① 첫 안광과 짧은 형상');
    felRail.note = '파멸을 두 죽음의 휩쓸기 앞이나 사이에 두는 것은 정수 파쇄 남은 시간과 자원에 따라 조정해도 됩니다. 사냥과 첫 안광의 앞뒤는 로그마다 다릅니다. 상위 레이드 로그 8개 중 5개는 사냥을 먼저 써서 그 강화를 첫 안광에 썼습니다.';
    const ald1 = rails.find(r => r.label === '알드라치 파괴자 ① 글레이브와 첫 형상');
    ald1.label = '알드라치 파괴자 ① 레이드 단일: 글레이브와 첫 형상';
    ald1.nodes = [
      {skillId: '258920', caption: '전투 전 · 진입 준비'},
      {skillId: '370965', caption: '보유 글레이브 없을 때'},
      {skillId: '442294', caption: '오래 살 대상에게'},
      {skillId: '198013', caption: '격노 30 · 끝까지'},
      {skillId: '258860', caption: '안광 바로 뒤'},
      {skillId: '210152', caption: '전투검 먼저 회수'},
      {skillId: '201427', caption: '분쇄 일격 · 징표'},
      {skillId: '210152', caption: '초기화된 두 번째'},
    ];
    const ald2 = rails.find(r => r.label === '알드라치 파괴자 ② 직접 탈태 구간');
    ald2.nodes = [
      {skillId: '198793', caption: '안전한 복귀 경로'},
      {skillId: '191427', caption: '안광·휩쓸기 쓴 뒤'},
      {skillId: '210152', caption: '초기화 소비'},
      {skillId: '198013', caption: '다음 완주 → 반복'},
    ];
    ald2.note = '레이드 단일 기준입니다. 12.1.5 이후 상위 레이드 로그 7개가 모두 이 순서로 열었습니다. 두 대상 이상이 오래 붙어 있으면 파멸을 죽음의 휩쓸기보다 먼저 씁니다(영웅 특성 탭 오프닝). 글레이브를 이미 들고 있다면 사냥 단계를 뒤로 미룹니다.';

    // 지옥상흔 영웅 탭
    const fel = hero('지옥상흔');
    const hunt = byId(fel.opener.steps, '370965');
    hunt.note = '다음 안광 강화를 직접 탈태 후 심연의 응시에 남기는 흐름입니다. 상위 레이드 로그 8개 중 5개는 사냥을 첫 안광 앞에 썼으니 로그마다 다릅니다. 실제 대상과 돌진 경로를 확인합니다.';
    for (const mode of [fel.singleTarget, fel.aoe]) {
      const rows = mode.priority;
      const at = rows.findIndex(r => r.skillId === '370965');
      mode.priority = [...rows.slice(0, at + 1), {...RETREAT}, ...rows.slice(at + 1)];
    }

    // 알드라치 파괴자 영웅 탭
    const ald = hero('알드라치 파괴자');
    ald.opener.summary = rep(ald.opener.summary,
      '순수 단일의 징표 중첩 순서는 본문의 별도 설명을 적용하세요.',
      '레이드 단일 오프닝(죽음의 휩쓸기 먼저)은 2부 오프닝 장에 있습니다.');
    const metaRow = {...byId(fel.singleTarget.priority, '191427'), note: '초기화할 안광·칼춤 계열과 남은 두 강화를 쓴 뒤 엽니다. 상위 레이드 로그는 정수 파쇄 구간과 초기화된 죽음의 휩쓸기까지 쓴 다음 복수의 퇴각 → 탈태로 넘어갔습니다.'};
    const auraRow = {skillId: '258920', label: '제물의 오라', note: '충전이 넘치기 전에 씁니다. 광역 적중이 보장될 때 우선도가 올라가고, 정수 파쇄 소비 구간을 불필요하게 차지하지 않습니다.'};
    for (const mode of [ald.singleTarget, ald.aoe]) {
      const rows = mode.priority;
      const out = [{...metaRow}];
      for (const r of rows) {
        out.push(r);
        if (r.skillId === '370965') out.push({...RETREAT});
        if (r.skillId === '198013') out.push({...auraRow});
      }
      mode.priority = out;
    }
    return m;
  },
};
