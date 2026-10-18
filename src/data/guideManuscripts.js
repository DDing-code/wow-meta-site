// 전문화별 가이드 원고를 모으기만 하는 파일이다. 원고 내용은 ./manuscripts/<가이드 ID>.js 에 있다.
// 한 전문화만 고칠 때는 그 파일만 읽고 고친다. 전문화를 더하거나 뺄 때만 아래 import 와 목록을 함께 고친다.
import demonhunterHavoc from './manuscripts/demonhunter-havoc.js';
import demonhunterVengeance from './manuscripts/demonhunter-vengeance.js';
import demonhunterDevourer from './manuscripts/demonhunter-devourer.js';
import deathknightBlood from './manuscripts/deathknight-blood.js';
import deathknightFrost from './manuscripts/deathknight-frost.js';
import deathknightUnholy from './manuscripts/deathknight-unholy.js';
import druidGuardian from './manuscripts/druid-guardian.js';
import druidFeral from './manuscripts/druid-feral.js';
import druidBalance from './manuscripts/druid-balance.js';
import evokerDevastation from './manuscripts/evoker-devastation.js';
import evokerAugmentation from './manuscripts/evoker-augmentation.js';
import hunterBeastmastery from './manuscripts/hunter-beastmastery.js';
import hunterMarksmanship from './manuscripts/hunter-marksmanship.js';
import hunterSurvival from './manuscripts/hunter-survival.js';
import mageArcane from './manuscripts/mage-arcane.js';
import mageFire from './manuscripts/mage-fire.js';
import mageFrost from './manuscripts/mage-frost.js';
import warlockAffliction from './manuscripts/warlock-affliction.js';
import warlockDemonology from './manuscripts/warlock-demonology.js';
import warlockDestruction from './manuscripts/warlock-destruction.js';
import monkBrewmaster from './manuscripts/monk-brewmaster.js';
import monkWindwalker from './manuscripts/monk-windwalker.js';
import monkMistweaver from './manuscripts/monk-mistweaver.js';
import paladinProtection from './manuscripts/paladin-protection.js';
import paladinRetribution from './manuscripts/paladin-retribution.js';
import warriorProtection from './manuscripts/warrior-protection.js';
import warriorArms from './manuscripts/warrior-arms.js';
import warriorFury from './manuscripts/warrior-fury.js';
import rogueAssassination from './manuscripts/rogue-assassination.js';
import rogueOutlaw from './manuscripts/rogue-outlaw.js';
import rogueSubtlety from './manuscripts/rogue-subtlety.js';
import shamanEnhancement from './manuscripts/shaman-enhancement.js';
import shamanElemental from './manuscripts/shaman-elemental.js';
import shamanRestoration from './manuscripts/shaman-restoration.js';
import priestDiscipline from './manuscripts/priest-discipline.js';
import priestHoly from './manuscripts/priest-holy.js';
import priestShadow from './manuscripts/priest-shadow.js';
import druidRestoration from './manuscripts/druid-restoration.js';
import paladinHoly from './manuscripts/paladin-holy.js';
import evokerPreservation from './manuscripts/evoker-preservation.js';

export const guideManuscripts = {
  'demonhunter-havoc': demonhunterHavoc,
  'demonhunter-vengeance': demonhunterVengeance,
  'demonhunter-devourer': demonhunterDevourer,
  'deathknight-blood': deathknightBlood,
  'deathknight-frost': deathknightFrost,
  'deathknight-unholy': deathknightUnholy,
  'druid-guardian': druidGuardian,
  'druid-feral': druidFeral,
  'druid-balance': druidBalance,
  'evoker-devastation': evokerDevastation,
  'evoker-augmentation': evokerAugmentation,
  'hunter-beastmastery': hunterBeastmastery,
  'hunter-marksmanship': hunterMarksmanship,
  'hunter-survival': hunterSurvival,
  'mage-arcane': mageArcane,
  'mage-fire': mageFire,
  'mage-frost': mageFrost,
  'warlock-affliction': warlockAffliction,
  'warlock-demonology': warlockDemonology,
  'warlock-destruction': warlockDestruction,
  'monk-brewmaster': monkBrewmaster,
  'monk-windwalker': monkWindwalker,
  'monk-mistweaver': monkMistweaver,
  'paladin-protection': paladinProtection,
  'paladin-retribution': paladinRetribution,
  'warrior-protection': warriorProtection,
  'warrior-arms': warriorArms,
  'warrior-fury': warriorFury,
  'rogue-assassination': rogueAssassination,
  'rogue-outlaw': rogueOutlaw,
  'rogue-subtlety': rogueSubtlety,
  'shaman-enhancement': shamanEnhancement,
  'shaman-elemental': shamanElemental,
  'shaman-restoration': shamanRestoration,
  'priest-discipline': priestDiscipline,
  'priest-holy': priestHoly,
  'priest-shadow': priestShadow,
  'druid-restoration': druidRestoration,
  'paladin-holy': paladinHoly,
  'evoker-preservation': evokerPreservation,
};

export default guideManuscripts;
