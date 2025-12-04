// 파멸 악마사냥꾼 실전 팁 데이터
// TWW 시즌 3 (11.2 패치) 기준
// 영웅 특성 무관, 전문화 전체에 적용되는 팁

export const havocPracticalTips = {
  commonMistakes: [
    {
      title: '격노 낭비',
      description: `<strong>120 격노에 도달하면 추가 생성이 모두 낭비</strong>됩니다.
        악마의 이빨이나 지옥 돌진을 사용할 때 격노가 가득 차 있으면 생성된 격노가 사라지므로,
        80+ 격노에서는 혼돈 일격이나 칼춤으로 먼저 소모하세요.`
    },
    {
      title: '탈태 변신 지연',
      description: `탈태 변신은 <strong>3분 쿨다운</strong>입니다. 완벽한 타이밍을 기다리다가 전투가 끝나면
        큰 DPS 손실이 발생합니다. <strong>전투 시작 10-15초 후</strong>에는 사용하는 것이 좋으며,
        레이드에서는 블러드러스트 타이밍에 맞추세요.`
    },
    {
      title: '안광 채널링 중 이동',
      description: `안광은 <strong>2초 채널링</strong> 동안 이동이 불가능합니다. 채널링 중 이동하면 즉시 중단되므로,
        사용 전 위치를 확인하고 메커니즘이 없는 타이밍에 사용하세요. 특히 보스 전투에서는
        <strong>예상 가능한 메커니즘 직전/직후</strong>에 사용하는 것이 안전합니다.`
    },
    {
      title: '화염 감옥 미사용',
      description: `화염 감옥은 <strong>1분 쿨다운</strong>이지만 많은 플레이어가 잊고 사용하지 않습니다.
        15초 동안 <strong>지속적으로 격노를 생성</strong>하는 핵심 스킬이므로,
        <strong>재사용 대기시간마다 반드시 사용</strong>해야 합니다. WeakAuras로 알림을 설정하는 것을 권장합니다.`
    },
    {
      title: '복수의 후퇴 오용',
      description: `복수의 후퇴는 <strong>25야드 후방 도약</strong>이므로, 잘못 사용하면 절벽으로 떨어지거나
        메커니즘에 걸릴 수 있습니다. <strong>사용 전 후방 확인</strong> 필수이며,
        긴급 상황이 아니라면 지옥 돌진만으로 위치 조정하는 것이 더 안전합니다.`
    }
  ],
  advancedTips: [
    {
      title: '격노 80-100 스위트 스팟 유지',
      content: `<strong>80-100 격노 범위</strong>를 유지하면 버스트 윈도우에 즉시 대응할 수 있습니다.
        <ul>
          <li><strong>80 미만</strong>: 생성 스킬 우선 (악마의 이빨, 화염 감옥)</li>
          <li><strong>80-100</strong>: 이상적인 범위, 소모/생성 균형</li>
          <li><strong>100 이상</strong>: 소모 스킬 우선 (혼돈 일격, 칼춤)</li>
          <li><strong>탈태 변신 15초 전</strong>: 100+ 격노 달성 목표</li>
        </ul>`
    },
    {
      title: '탈태 변신 전 체크리스트',
      content: `탈태 변신 사용 전 다음 3가지를 확인하세요:
        <ul>
          <li><strong>100+ 격노 확보</strong> - 즉시 소멸 연속 사용을 위해</li>
          <li><strong>화염 감옥 재사용 가능</strong> - 탈태 시 초기화되므로 미리 사용 금지</li>
          <li><strong>지옥 돌진 2회 충전</strong> (지옥상흔 빌드) - 중첩 유지를 위해</li>
          <li><strong>안광 재사용 가능</strong> - 탈태 직후 즉시 사용</li>
          <li><strong>보스 메커니즘 타이밍</strong> - 이동 메커니즘 직전 사용 금지</li>
        </ul>`
    },
    {
      title: '생존기 선제 사용',
      content: `파멸 악마사냥꾼의 생존기는 <strong>체력이 낮아진 후</strong>가 아닌 <strong>메커니즘 직전</strong>에 사용하세요:
        <ul>
          <li><strong>흐림 (1분 쿨)</strong>: 예상 가능한 큰 피해 직전 (보스 강타, 광역 피해)</li>
          <li><strong>어둠 (3분 쿨)</strong>: 레이드 전체 피해 메커니즘 (파티원 보호 포함)</li>
          <li><strong>황천걸음 (3분 쿨)</strong>: 긴급 상황 전용 (체력 30% 이하 + 다른 생존기 없을 때)</li>
          <li><strong>복수의 후퇴</strong>: 즉시 위험 회피 (25야드 후방 도약)</li>
        </ul>`
    },
    {
      title: '쐐기돌 풀링 최적화',
      content: `쐐기돌에서는 <strong>풀 크기에 따라 스킬 사용을 조정</strong>하세요:
        <ul>
          <li><strong>작은 풀 (2-4마리)</strong>: 단일 대상 우선순위 유지, 안광만 사용</li>
          <li><strong>중간 풀 (5-7마리)</strong>: 안광 → 칼춤 → 혼돈 일격 순서</li>
          <li><strong>큰 풀 (8+마리)</strong>: 안광 → 칼춤 연속 사용, 혼돈 일격 생략</li>
          <li><strong>보스 + 쫄</strong>: 보스 우선 타겟, 광역 스킬로 쫄 동시 정리</li>
          <li><strong>탈태 변신</strong>: 보스 또는 큰 풀(8+)에만 사용</li>
        </ul>`
    },
    {
      title: '활공 활용 극대화',
      content: `<strong>활공 (Glide)</strong>은 무한 지속시간 낙하 감속 스킬로, 다양한 상황에서 활용 가능합니다:
        <ul>
          <li><strong>낙하 메커니즘 무시</strong>: 점프 후 즉시 활공으로 낙하 피해 방지</li>
          <li><strong>먼 거리 이동</strong>: 높은 곳에서 활공 + 지옥 돌진 조합으로 빠른 이동</li>
          <li><strong>전투 중 공중 회피</strong>: 바닥 메커니즘 회피 용도</li>
          <li><strong>시야 확보</strong>: 레이드에서 높은 시점으로 메커니즘 파악</li>
          <li><strong>쐐기돌 지름길</strong>: 절벽 활용 시간 단축</li>
        </ul>`
    },
    {
      title: '격노 생성 우선순위 암기',
      content: `효율적인 격노 생성을 위해 <strong>생성량과 쿨다운</strong>을 암기하세요:
        <ul>
          <li><strong>화염 감옥 (1위)</strong>: 15초간 총 45-75 격노, 1분 쿨 - 최우선</li>
          <li><strong>지옥 돌진 (2위)</strong>: 15 격노, 10초마다 충전 - 빈번히 사용</li>
          <li><strong>악마의 이빨 (3위)</strong>: 20-30 격노, 쿨 없음 - 필러</li>
          <li><strong>조합 예시</strong>: 화염 감옥 + 지옥 돌진 2회 + 악마의 이빨 3회 = 약 100 격노</li>
          <li><strong>탈태 전 30초</strong>: 위 조합으로 100 격노 빠르게 확보</li>
        </ul>`
    },
    {
      title: '약간의 힐 (Demon Hide)',
      content: `<strong>악마의 가죽 (Demon Hide)</strong> 패시브는 모든 피해의 <strong>일부를 자동 흡수</strong>합니다:
        <ul>
          <li><strong>항상 활성</strong>: 추가 조작 없이 자동 적용</li>
          <li><strong>지속 생존력</strong>: 작은 피해를 계속 흡수하여 힐러 부담 감소</li>
          <li><strong>탈태 변신 중</strong>: 체력 증가와 함께 더 강력한 흡수</li>
          <li><strong>전략</strong>: 이 흡수량을 믿고 불필요한 생존기 사용 자제</li>
          <li><strong>주의</strong>: 큰 피해는 흡수 불가, 생존기 필수</li>
        </ul>`
    },
    {
      title: 'WeakAuras 필수 설정',
      content: `다음 WeakAuras를 설정하여 실수를 줄이세요:
        <ul>
          <li><strong>격노 추적</strong>: 80/100/120 구간 색상 구분</li>
          <li><strong>화염 감옥 쿨다운</strong>: 재사용 가능 시 큰 알림</li>
          <li><strong>탈태 변신 남은 시간</strong>: 5초 전 경고</li>
          <li><strong>파괴자의 글레이브 중첩</strong> (알드라치): 중첩 수와 남은 시간</li>
          <li><strong>지옥상흔 중첩</strong> (지옥상흔): 중첩 수와 남은 시간</li>
          <li><strong>안광/지옥 돌진 쿨다운</strong>: 재사용 가능 시 알림</li>
        </ul>`
    }
  ]
};
