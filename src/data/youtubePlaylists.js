// 홈 화면의 유튜브 재생목록 줄. 'wowmeta 와우메타'(@wowmeta-kr) 채널에 공개된 전문화 가이드 영상 40편과 재생목록 4개다.
// 번호는 ai-hub outputs/pixel-guides/youtube-playlists.json(2026-10-22 공개 확인)과 같다. 영상을 바꾸면 여기와 그 파일을 함께 고친다.
// 영상 제목은 업로드 제목 규칙('한밤 2시즌 <패치> <전문화> 가이드')이라 가이드 목록(guideRegistry)에서 만든다.
// 검사: scripts/validate-home-videos.cjs

export const YOUTUBE_CHANNEL = {
  name: 'wowmeta 와우메타',
  url: 'https://www.youtube.com/@wowmeta-kr',
};

export const VIDEO_SEASON_LABEL = '한밤 2시즌';

export const youtubePlaylists = [
  {
    role: 'tanks',
    label: '탱커',
    title: '한밤 2시즌 12.1.5 탱커 가이드',
    playlistId: 'PLUQWmSVBM2iI',
    items: [
      ['warrior-protection', 'D-G0lqSucgs'],
      ['paladin-protection', 'kZSskiDAo6o'],
      ['deathknight-blood', '7HbtU4mu99c'],
      ['monk-brewmaster', 'mOS_Xg2CTqE'],
      ['druid-guardian', '825bprZVl6E'],
      ['demonhunter-vengeance', 'A4UPzfhFTAY'],
    ],
  },
  {
    role: 'healers',
    label: '힐러',
    title: '한밤 2시즌 12.1.5 힐러 가이드',
    playlistId: 'PLMbJNa3IdWoo',
    items: [
      ['paladin-holy', 'm6vtm8-fDb4'],
      ['priest-discipline', 'veXAaKuThj0'],
      ['priest-holy', '81Kg0R0KRm4'],
      ['shaman-restoration', 'go4VYLhNStQ'],
      ['monk-mistweaver', '356D18J0MB0'],
      ['druid-restoration', 'RtN3NKFibMA'],
      ['evoker-preservation', '5dvcr7RbgKA'],
    ],
  },
  {
    role: 'melee',
    label: '근딜',
    title: '한밤 2시즌 12.1.5 근딜 가이드',
    playlistId: 'PLDe9tZ-bId0Y',
    items: [
      ['warrior-arms', '9cRRD1pR714'],
      ['warrior-fury', 'zhfLQwO4oms'],
      ['paladin-retribution', 'kizl0s4_cv8'],
      ['rogue-assassination', 'FKYlere9xM8'],
      ['rogue-outlaw', 'fawuQO6Y4wY'],
      ['rogue-subtlety', 'zV_MNF4n9qM'],
      ['deathknight-frost', 'Ue4TGhGZ-fE'],
      ['deathknight-unholy', 'W7f5VzTJdjc'],
      ['monk-windwalker', 'E7E2bk-wF5s'],
      ['druid-feral', 'NhgNmWArlXk'],
      ['demonhunter-havoc', 'sN2NnShDDKQ'],
      ['shaman-enhancement', 'FAQ08MxAc-8'],
      ['hunter-survival', 'rHz7tAP-5DQ'],
    ],
  },
  {
    role: 'ranged',
    label: '원딜',
    title: '한밤 2시즌 12.1.5 원딜 가이드',
    playlistId: 'PLN70oRIwVO_c',
    items: [
      ['hunter-beastmastery', 'iF-E0vaPQ04'],
      ['hunter-marksmanship', 'VQD0JrtCIY0'],
      ['priest-shadow', 'B_xITeY9RW4'],
      ['demonhunter-devourer', 'Nn2Lv5eO4i8'],
      ['shaman-elemental', '4mEWcRJCyJg'],
      ['mage-arcane', 'shdTiGJmyYg'],
      ['mage-fire', 'VryKveYgh3E'],
      ['mage-frost', 'AZNhRLnrLWg'],
      ['warlock-affliction', 'hxEaAHzomt4'],
      ['warlock-demonology', 'YxLg3BZFmx4'],
      ['warlock-destruction', 'hMjHgejFGZA'],
      ['druid-balance', 'C88_MxxpPfY'],
      ['evoker-devastation', 'qkDCGOuyOjE'],
      ['evoker-augmentation', 'YkvKzuUkmU4'],
    ],
  },
];

export const playlistUrl = playlistId => `https://www.youtube.com/playlist?list=${playlistId}`;
export const watchUrl = (youtubeId, playlistId) =>
  `https://www.youtube.com/watch?v=${youtubeId}${playlistId ? `&list=${playlistId}` : ''}`;
export const thumbnailUrl = (youtubeId, size = 'mqdefault') => `https://i.ytimg.com/vi/${youtubeId}/${size}.jpg`;
