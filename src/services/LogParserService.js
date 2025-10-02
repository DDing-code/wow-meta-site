// WarcraftLogs 파서 서비스
import axios from 'axios';

class LogParserService {
  constructor() {
    this.apiBase = 'https://www.warcraftlogs.com/api/v2';
    this.clientId = process.env.REACT_APP_WARCRAFTLOGS_CLIENT_ID || '';
    this.clientSecret = process.env.REACT_APP_WARCRAFTLOGS_CLIENT_SECRET || '';
    this.accessToken = null;
  }

  // OAuth2 토큰 가져오기
  async authenticate() {
    try {
      const response = await axios.post('https://www.warcraftlogs.com/oauth/token', {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret
      });

      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('인증 실패:', error);
      throw error;
    }
  }

  // 로그 코드로 전투 데이터 가져오기
  async fetchCombatLog(logCode) {
    if (!this.accessToken) {
      await this.authenticate();
    }

    const query = `
      query GetCombatLog($code: String!) {
        reportData {
          report(code: $code) {
            title
            startTime
            endTime
            fights {
              id
              name
              difficulty
              kill
              startTime
              endTime
              boss
              bossPercentage
            }
            masterData {
              actors {
                id
                name
                type
                subType
                server
              }
            }
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        {
          query,
          variables: { code: logCode }
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseLogData(response.data.data.reportData.report);
    } catch (error) {
      console.error('로그 가져오기 실패:', error);
      throw error;
    }
  }

  // 로그 데이터 파싱
  parseLogData(report) {
    if (!report) return null;

    const parsedData = {
      title: report.title,
      duration: (report.endTime - report.startTime) / 1000, // 초 단위
      fights: [],
      players: []
    };

    // 전투 정보 파싱
    if (report.fights) {
      parsedData.fights = report.fights.map(fight => ({
        id: fight.id,
        name: fight.name,
        difficulty: this.translateDifficulty(fight.difficulty),
        isKill: fight.kill,
        duration: (fight.endTime - fight.startTime) / 1000,
        bossHealth: fight.bossPercentage || 0
      }));
    }

    // 플레이어 정보 파싱
    if (report.masterData && report.masterData.actors) {
      parsedData.players = report.masterData.actors
        .filter(actor => actor.type === 'Player')
        .map(player => ({
          id: player.id,
          name: player.name,
          class: this.translateClass(player.subType),
          server: player.server
        }));
    }

    return parsedData;
  }

  // 플레이어별 상세 성능 데이터 가져오기
  async fetchPlayerPerformance(logCode, playerId, fightId) {
    const query = `
      query GetPlayerPerformance($code: String!, $playerId: Int!, $fightId: Int!) {
        reportData {
          report(code: $code) {
            events(
              sourceID: $playerId
              fightIDs: [$fightId]
              dataType: DamageDone
            ) {
              data
            }
            table(
              sourceID: $playerId
              fightIDs: [$fightId]
              dataType: DamageDone
            )
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        'https://www.warcraftlogs.com/api/v2/client',
        {
          query,
          variables: { code: logCode, playerId, fightId }
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parsePerformanceData(response.data.data.reportData.report);
    } catch (error) {
      console.error('성능 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 성능 데이터 파싱
  parsePerformanceData(data) {
    if (!data) return null;

    const performance = {
      totalDamage: 0,
      dps: 0,
      abilities: [],
      timeline: []
    };

    // 이벤트 데이터 처리
    if (data.events && data.events.data) {
      const events = JSON.parse(data.events.data);

      // 타임라인 생성
      performance.timeline = events.map(event => ({
        timestamp: event.timestamp,
        type: event.type,
        amount: event.amount || 0,
        ability: event.ability?.name || '알 수 없음'
      }));

      // 총 피해량 계산
      performance.totalDamage = events
        .filter(e => e.type === 'damage')
        .reduce((sum, e) => sum + (e.amount || 0), 0);
    }

    // 테이블 데이터 처리
    if (data.table) {
      const tableData = JSON.parse(data.table);

      if (tableData.entries) {
        performance.abilities = tableData.entries.map(entry => ({
          name: entry.name,
          total: entry.total,
          uses: entry.uses,
          average: entry.total / Math.max(entry.uses, 1)
        }));
      }

      performance.dps = tableData.totalDPS || 0;
    }

    return performance;
  }

  // 전투 분석 및 제안사항 생성
  async analyzeCombat(logCode, playerId, fightId, playerClass, playerSpec) {
    const performance = await this.fetchPlayerPerformance(logCode, playerId, fightId);

    if (!performance) {
      return { suggestions: [], score: 0 };
    }

    const suggestions = [];
    let score = 100;

    // 클래스별 분석
    const classAnalyzer = this.getClassAnalyzer(playerClass, playerSpec);
    const classResults = classAnalyzer(performance);

    suggestions.push(...classResults.suggestions);
    score -= classResults.penalties;

    // 일반적인 분석
    const generalResults = this.generalAnalysis(performance);
    suggestions.push(...generalResults.suggestions);
    score -= generalResults.penalties;

    return {
      suggestions: suggestions.sort((a, b) => {
        const severityOrder = { critical: 0, major: 1, minor: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }),
      score: Math.max(0, score),
      performance
    };
  }

  // 클래스별 분석기 가져오기
  getClassAnalyzer(playerClass, playerSpec) {
    const analyzers = {
      '전사': {
        '무기': this.analyzeArmsWarrior,
        '분노': this.analyzeFuryWarrior,
        '방어': this.analyzeProtectionWarrior
      },
      '성기사': {
        '신성': this.analyzeHolyPaladin,
        '보호': this.analyzeProtectionPaladin,
        '징벌': this.analyzeRetributionPaladin
      },
      '죽음의 기사': {
        '혈기': this.analyzeBloodDK,
        '냉기': this.analyzeFrostDK,
        '부정': this.analyzeUnholyDK
      }
    };

    return analyzers[playerClass]?.[playerSpec] || this.defaultAnalyzer;
  }

  // 무기 전사 분석
  analyzeArmsWarrior(performance) {
    const suggestions = [];
    let penalties = 0;

    // 치명타의 일격 사용 확인
    const mortalStrike = performance.abilities.find(a =>
      a.name === '치명타의 일격' || a.name === 'Mortal Strike'
    );

    if (mortalStrike && mortalStrike.uses < 20) {
      suggestions.push({
        severity: 'major',
        category: 'rotation',
        text: '치명타의 일격 사용 빈도가 낮습니다. 쿨마다 사용하세요.',
        impact: 8
      });
      penalties += 15;
    }

    // 칼날폭풍 사용 확인
    const bladestorm = performance.abilities.find(a =>
      a.name === '칼날폭풍' || a.name === 'Bladestorm'
    );

    if (!bladestorm || bladestorm.uses === 0) {
      suggestions.push({
        severity: 'minor',
        category: 'cooldowns',
        text: '칼날폭풍을 사용하지 않았습니다. 주요 쿨다운을 활용하세요.',
        impact: 5
      });
      penalties += 10;
    }

    return { suggestions, penalties };
  }

  // 분노 전사 분석
  analyzeFuryWarrior(performance) {
    const suggestions = [];
    let penalties = 0;

    // 격노 유지율 확인
    const enrage = performance.abilities.find(a =>
      a.name === '격노' || a.name === 'Enrage'
    );

    if (!enrage || enrage.uptime < 60) {
      suggestions.push({
        severity: 'critical',
        category: 'buffs',
        text: '격노 유지율이 낮습니다. 60% 이상 유지해야 합니다.',
        impact: 10
      });
      penalties += 20;
    }

    return { suggestions, penalties };
  }

  // 기본 분석기
  defaultAnalyzer(performance) {
    return { suggestions: [], penalties: 0 };
  }

  // 일반적인 성능 분석
  generalAnalysis(performance) {
    const suggestions = [];
    let penalties = 0;

    // DPS 체크
    if (performance.dps < 5000) {
      suggestions.push({
        severity: 'major',
        category: 'overall',
        text: 'DPS가 기대치보다 낮습니다. 로테이션을 개선하세요.',
        impact: 7
      });
      penalties += 15;
    }

    // 스킬 사용 빈도 체크
    if (performance.abilities.length < 5) {
      suggestions.push({
        severity: 'critical',
        category: 'rotation',
        text: '사용한 스킬 종류가 너무 적습니다. 모든 주요 스킬을 활용하세요.',
        impact: 9
      });
      penalties += 20;
    }

    return { suggestions, penalties };
  }

  // 난이도 번역
  translateDifficulty(difficulty) {
    const difficultyMap = {
      1: '공격대 찾기',
      3: '일반',
      4: '영웅',
      5: '신화'
    };
    return difficultyMap[difficulty] || '알 수 없음';
  }

  // 클래스 번역
  translateClass(className) {
    const classMap = {
      'Warrior': '전사',
      'Paladin': '성기사',
      'Hunter': '사냥꾼',
      'Rogue': '도적',
      'Priest': '사제',
      'Death Knight': '죽음의 기사',
      'Shaman': '주술사',
      'Mage': '마법사',
      'Warlock': '흑마법사',
      'Monk': '수도사',
      'Druid': '드루이드',
      'Demon Hunter': '악마사냥꾼',
      'Evoker': '기원사'
    };
    return classMap[className] || className;
  }

  // 무기 전사 분석
  analyzeProtectionWarrior(performance) {
    const suggestions = [];
    let penalties = 0;

    // 방패 막기 유지율 확인
    const shieldBlock = performance.abilities.find(a =>
      a.name === '방패 막기' || a.name === 'Shield Block'
    );

    if (shieldBlock && shieldBlock.uptime < 40) {
      suggestions.push({
        severity: 'critical',
        category: 'mitigation',
        text: '방패 막기 유지율이 낮습니다. 40% 이상 유지하세요.',
        impact: 10
      });
      penalties += 20;
    }

    return { suggestions, penalties };
  }

  // 신성 성기사 분석
  analyzeHolyPaladin(performance) {
    const suggestions = [];
    let penalties = 0;

    // 신성 충격 사용 확인
    const holyShock = performance.abilities.find(a =>
      a.name === '신성 충격' || a.name === 'Holy Shock'
    );

    if (holyShock && holyShock.uses < 30) {
      suggestions.push({
        severity: 'major',
        category: 'rotation',
        text: '신성 충격 사용이 부족합니다. 쿨마다 사용하세요.',
        impact: 8
      });
      penalties += 15;
    }

    return { suggestions, penalties };
  }

  // 나머지 분석 함수들...
  analyzeProtectionPaladin(performance) {
    return { suggestions: [], penalties: 0 };
  }

  analyzeRetributionPaladin(performance) {
    return { suggestions: [], penalties: 0 };
  }

  analyzeBloodDK(performance) {
    return { suggestions: [], penalties: 0 };
  }

  analyzeFrostDK(performance) {
    return { suggestions: [], penalties: 0 };
  }

  analyzeUnholyDK(performance) {
    return { suggestions: [], penalties: 0 };
  }
}

export default new LogParserService();