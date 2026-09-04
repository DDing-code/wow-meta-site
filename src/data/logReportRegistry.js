export const logReports = [
  {
    id: 'priest-holy-jfkp1ny6zmcjkx3l-45',
    guideId: 'priest-holy',
    date: '2026-09-02',
    title: '조나사제 신성 사제 로그 분석',
    subject: '조나사제',
    encounter: '울라텍 일반',
    fights: '1개 전투',
    summary: '예언자 보조 치유, 순간 치유·축도 합산 회전, 절정 배치와 마나 사용을 같은 공격대 및 99점 로그와 비교했습니다.',
    path: '/guide/priest/holy/log-analysis',
  },
  {
    id: 'evoker-preservation-two-fights-2026-08-31',
    guideId: 'evoker-preservation',
    date: '2026-08-31',
    title: '코바야시네띵진 보존 기원사 로그 분석',
    subject: '코바야시네띵진',
    encounter: '울라텍·휘감긴 제단 영웅',
    fights: '2개 전투',
    summary: '메아리 회수, 메리스라의 축복, 정수 사용, 마나와 정지장 저장 순서를 같은 공격대 및 상위 로그와 비교했습니다.',
    path: '/guide/evoker/preservation/log-analysis',
  },
];

export function getLogReportsByGuideId(guideId) {
  return logReports.filter(report => report.guideId === guideId);
}
