
// 전사 스킬 아이콘 매핑
const warriorIconMapping = {
  "772": {
    "name": "Rend",
    "korean": "분쇄",
    "icon": "ability_gouge"
  },
  "871": {
    "name": "Shield Wall",
    "korean": "방패의 벽",
    "icon": "ability_warrior_shieldwall"
  },
  "1160": {
    "name": "Demoralizing Shout",
    "korean": "사기의 외침",
    "icon": "ability_warrior_warcry"
  },
  "5302": {
    "name": "Revenge",
    "korean": "신봉대",
    "icon": "ability_warrior_revenge"
  },
  "5308": {
    "name": "Execute",
    "korean": "마무리 일격",
    "icon": "inv_sword_48"
  },
  "6572": {
    "name": "Revenge",
    "korean": "복수",
    "icon": "ability_warrior_revenge"
  },
  "12294": {
    "name": "Mortal Strike",
    "korean": "죽음의 일격",
    "icon": "ability_warrior_savageblow"
  },
  "23881": {
    "name": "Bloodthirst",
    "korean": "피의 갈증",
    "icon": "spell_nature_bloodlust"
  },
  "23922": {
    "name": "Shield Slam",
    "korean": "방패 밀쳐내기",
    "icon": "inv_shield_05"
  },
  "85288": {
    "name": "Raging Blow",
    "korean": "성난 일격",
    "icon": "warrior_wild_strike"
  },
  "107574": {
    "name": "Avatar",
    "korean": "투신",
    "icon": "warrior_talent_icon_avatar"
  },
  "152277": {
    "name": "Ravager",
    "korean": "파괴자",
    "icon": "ability_warrior_ravager"
  },
  "152278": {
    "name": "Anger Management",
    "korean": "분노 조절",
    "icon": "warrior_talent_icon_angermanagement"
  },
  "167105": {
    "name": "Colossus Smash",
    "korean": "거인의 강타",
    "icon": "ability_warrior_colossussmash"
  },
  "184364": {
    "name": "Enraged Regeneration",
    "korean": "격노의 재생력",
    "icon": "ability_warrior_focusedrage"
  },
  "184367": {
    "name": "Rampage",
    "korean": "광란",
    "icon": "ability_warrior_rampage"
  },
  "190411": {
    "name": "Whirlwind",
    "korean": "소용돌이",
    "icon": "ability_whirlwind"
  },
  "202612": {
    "name": "Vengeance",
    "korean": "백점블로",
    "icon": "ability_paladin_vengeance"
  },
  "206315": {
    "name": "Massacre",
    "korean": "대학살",
    "icon": "inv_sword_48"
  },
  "215571": {
    "name": "Frothing Berserker",
    "korean": "일격무쌍",
    "icon": "warrior_talent_icon_furyintheblood"
  },
  "228920": {
    "name": "Ravager",
    "korean": "파괴자",
    "icon": "warrior_talent_icon_ravager"
  },
  "260708": {
    "name": "Sweeping Strikes",
    "korean": "휩쓸기 일격",
    "icon": "ability_rogue_slicedice"
  },
  "262111": {
    "name": "Mastery: Deep Wounds",
    "korean": "목화: 저명상",
    "icon": "ability_backstab"
  },
  "262161": {
    "name": "Warbreaker",
    "korean": "전쟁파괴자",
    "icon": "inv_artifact_warswords"
  },
  "262231": {
    "name": "Deadly Calm",
    "korean": "죽음의 고요",
    "icon": "achievement_boss_kingymiron"
  },
  "275334": {
    "name": "Punish",
    "korean": "처구력 폰진",
    "icon": "ability_deathknight_sanguinfortitude"
  },
  "280001": {
    "name": "Demolish",
    "korean": "역전의 용사의 철퇴",
    "icon": "ability_warrior_devastate"
  },
  "280392": {
    "name": "Meat Cleaver",
    "korean": "고기칼",
    "icon": "ability_warrior_weaponmastery"
  },
  "280772": {
    "name": "Sudden Death",
    "korean": "급살",
    "icon": "ability_warrior_improveddisciplines"
  },
  "329038": {
    "name": "Bloodborne",
    "korean": "피의 각성",
    "icon": "ability_revendreth_warrior"
  },
  "337302": {
    "name": "Taste for Blood",
    "korean": "피의 맛",
    "icon": "ability_rogue_hungerforblood"
  },
  "383762": {
    "name": "Critical Thinking",
    "korean": "비판적 사고",
    "icon": "spell_nature_focusedmind"
  },
  "385840": {
    "name": "Crashing Thunder",
    "korean": "토템의 힘",
    "icon": "spell_shaman_crashlightning"
  },
  "385880": {
    "name": "Blood and Thunder",
    "korean": "죽음의 피뢰",
    "icon": "spell_nature_bloodlust"
  },
  "386071": {
    "name": "Thunder Blast",
    "korean": "천둥벼락",
    "icon": "spell_nature_thunderblast"
  },
  "390138": {
    "name": "Overwhelming Blades",
    "korean": "폭풍을 거두는 자",
    "icon": "ability_warrior_bladestorm"
  },
  "390677": {
    "name": "Heavy Repercussions",
    "korean": "묵직한 반격",
    "icon": "inv_shield_32"
  },
  "440987": {
    "name": "Colossal Might",
    "korean": "거인의 힘",
    "icon": "ability_warrior_colossussmash"
  },
  "444770": {
    "name": "Slayer's Dominance",
    "korean": "폭풍의 주전역",
    "icon": "ability_warrior_slayer"
  }
};

// 데이터베이스 업데이트
Object.keys(warriorIconMapping).forEach(id => {
  if (db[id]) {
    db[id].icon = warriorIconMapping[id].icon;
    if (!db[id].koreanName) {
      db[id].koreanName = warriorIconMapping[id].korean;
    }
  }
});
