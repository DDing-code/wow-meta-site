// 사이트가 다루는 게임 버전(리테일·포에버)과 상단 토글이 쓰는 주소 규칙.
// 버전은 저장해 두지 않고 주소로만 정한다(/forever 아래는 포에버, 나머지는 리테일).
// 그래야 공유한 링크를 누가 열어도 같은 버전의 같은 자료가 나온다.
// 포에버 자료는 리테일 KB·kb-skills.json과 섞지 않는다(주문 번호 하나로 색인해서 서로 덮어쓴다).

export const FOREVER_ROOT = '/forever';

export const EDITIONS = [
  { id: 'retail', label: '리테일', home: '/' },
  { id: 'forever', label: '포에버', home: FOREVER_ROOT },
];

// 두 버전에서 서로 짝이 되는 페이지. 토글을 누르면 짝 페이지로 가고, 짝이 없으면 그 버전의 홈으로 간다.
const PAGE_PAIRS = [
  ['/', FOREVER_ROOT],
  ['/beginner', `${FOREVER_ROOT}/start`],
];

function normalizePath(pathname) {
  const path = String(pathname || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return path || '/';
}

export function getEdition(pathname) {
  const path = normalizePath(pathname);
  return path === FOREVER_ROOT || path.startsWith(`${FOREVER_ROOT}/`) ? 'forever' : 'retail';
}

export function getEditionSwitchPath(pathname, targetId) {
  const path = normalizePath(pathname);
  if (getEdition(path) === targetId) return path;
  const pair = PAGE_PAIRS.find(([retail, forever]) => (targetId === 'forever' ? retail : forever) === path);
  if (pair) return targetId === 'forever' ? pair[1] : pair[0];
  return EDITIONS.find(edition => edition.id === targetId).home;
}
