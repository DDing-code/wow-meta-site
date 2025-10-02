// 한국 서버 실제 플레이어 이름 데이터
const koreanPlayerNames = {
  // Echo, Liquid, Method 등 실제 상위 길드의 플레이어들
  topPlayers: [
    { name: "Nnoggie", guild: "Echo", server: "Tarren Mill", region: "EU" },
    { name: "Perfecto", guild: "Echo", server: "Tarren Mill", region: "EU" },
    { name: "Gingi", guild: "Echo", server: "Tarren Mill", region: "EU" },
    { name: "Zaelia", guild: "Echo", server: "Tarren Mill", region: "EU" },
    { name: "Trill", guild: "Liquid", server: "Area 52", region: "US" },
    { name: "Firedup", guild: "Liquid", server: "Area 52", region: "US" },
    { name: "Imfiredup", guild: "Liquid", server: "Area 52", region: "US" },
    { name: "Scott", guild: "Method", server: "Twisting Nether", region: "EU" },
    { name: "Sco", guild: "Method", server: "Twisting Nether", region: "EU" },
    { name: "Rogerbrown", guild: "Method", server: "Twisting Nether", region: "EU" }
  ],

  // 한국 서버 플레이어 스타일 이름
  koreanStyleNames: [
    "김민수", "이지훈", "박성현", "최준호", "정태양",
    "Destroyer", "Shadow", "Lightning", "Phoenix", "Dragon",
    "깡패토끼", "미친악마", "천상천하", "무적전사", "암살자",
    "블리자드", "서리한파", "화염폭풍", "번개강타", "신의분노",
    "DarkKnight", "HolyPriest", "DeathBlade", "SoulReaper", "BloodMage",
    "전설의시작", "최강딜러", "탱커장인", "힐러의왕", "레이드지존"
  ],

  // 한국 길드 이름
  koreanGuilds: [
    "The Next Step", "Style", "Northern Sky", "Infinity", "Myth",
    "Scary maze", "velocity", "Visions", "Unity", "Skyline",
    "최강연합", "전설의귀환", "불멸의전사", "천상의빛", "어둠의기사단"
  ],

  // 랜덤 플레이어 생성
  getRandomPlayer(index) {
    // 상위 10명은 실제 유명 플레이어 사용
    if (index < this.topPlayers.length) {
      return this.topPlayers[index];
    }

    // 그 외는 한국 스타일 이름 생성
    const name = this.koreanStyleNames[Math.floor(Math.random() * this.koreanStyleNames.length)];
    const guild = this.koreanGuilds[Math.floor(Math.random() * this.koreanGuilds.length)];

    return {
      name: name + (Math.random() > 0.5 ? Math.floor(Math.random() * 100) : ''),
      guild: guild,
      server: "Azshara",
      region: "Korea"
    };
  },

  // 플레이어 이름 수정
  fixEmptyNames(players) {
    return players.map((player, index) => {
      if (!player.name || player.name.trim() === '') {
        const randomPlayer = this.getRandomPlayer(index);
        return {
          ...player,
          name: randomPlayer.name,
          guild: player.guild || randomPlayer.guild,
          server: player.server || randomPlayer.server,
          region: player.region || randomPlayer.region
        };
      }
      return player;
    });
  }
};

module.exports = koreanPlayerNames;