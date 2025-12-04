/**
 * WoW 전문화별 가이드 링크 데이터베이스
 * TWW 시즌 3 (11.2 패치) 기준
 *
 * 구조:
 * - 클래스 > 전문화 > 가이드 사이트별 링크
 * - 각 링크는 최신 업데이트 날짜 포함
 * - 한국어/영어 버전 구분
 */

const guideLinks = {
  deathknight: {
    frost: {
      name: '냉기 죽음의 기사',
      nameEng: 'Frost Death Knight',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://ko.wowhead.com/guide/classes/death-knight/frost/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/death-knight/frost/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/frost-death-knight-pve-dps-guide',
        maxroll: {
          raid: 'https://maxroll.gg/wow/class-guides/frost-death-knight-raid-guide',
          mythicPlus: 'https://maxroll.gg/wow/class-guides/frost-death-knight-mythic-plus-guide',
          leveling: 'https://maxroll.gg/wow/class-guides/frost-death-knight-leveling-guide'
        },
        archon: 'https://www.archon.gg/wow/builds/death-knight/frost',
        method: 'https://www.method.gg/guides/death-knight/frost'
      },
      updateDate: '2025-10-09'
    }
  },
  demonhunter: {
    havoc: {
      name: '파멸 악마사냥꾼',
      nameEng: 'Havoc Demon Hunter',
      role: 'DPS',
      links: {
        wowhead: {
          kr: 'https://www.wowhead.com/ko/guide/classes/demon-hunter/havoc/overview-pve-dps',
          en: 'https://www.wowhead.com/guide/classes/demon-hunter/havoc/overview-pve-dps'
        },
        icyVeins: 'https://www.icy-veins.com/wow/havoc-demon-hunter-pve-dps-guide',
        maxroll: {
          raid: 'https://maxroll.gg/wow/class-guides/havoc-demon-hunter-raid-guide',
          mythicPlus: 'https://maxroll.gg/wow/class-guides/havoc-demon-hunter-mythic-plus-guide',
          leveling: 'https://maxroll.gg/wow/class-guides/havoc-demon-hunter-leveling-guide'
        },
        archon: 'https://www.archon.gg/wow/builds/demon-hunter/havoc',
        method: 'https://www.method.gg/guides/demon-hunter/havoc'
      },
      updateDate: '2025-01-10',
      internalGuide: true,
      internalPath: '/guide/demonhunter/havoc'
    }
  }
};

// 유틸리티 함수들
export const getGuideLinks = (className, specName) => {
  return guideLinks[className]?.[specName] || null;
};

export const getAllClasses = () => {
  return Object.keys(guideLinks);
};

export const getSpecsByClass = (className) => {
  return Object.keys(guideLinks[className] || {});
};

export const getSpecsByRole = (role) => {
  const specs = [];
  Object.entries(guideLinks).forEach(([className, classSpecs]) => {
    Object.entries(classSpecs).forEach(([specName, specData]) => {
      if (specData.role === role) {
        specs.push({
          className,
          specName,
          ...specData
        });
      }
    });
  });
  return specs;
};

// 링크 유효성 검증 함수
export const validateLink = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`링크 검증 실패: ${url}`, error);
    return false;
  }
};

// 패치 버전 정보
export const patchInfo = {
  current: '11.2',
  season: 'TWW Season 3',
  lastUpdated: '2025-09-27'
};

export default guideLinks;