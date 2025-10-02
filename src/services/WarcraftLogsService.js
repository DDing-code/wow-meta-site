// WarcraftLogs API 서비스
class WarcraftLogsService {
  constructor() {
    // API 설정
    this.clientId = process.env.REACT_APP_WARCRAFTLOGS_CLIENT_ID;
    this.clientSecret = process.env.REACT_APP_WARCRAFTLOGS_CLIENT_SECRET;
    this.apiUrl = 'https://www.warcraftlogs.com/api/v2';
    this.oauthUrl = 'https://www.warcraftlogs.com/oauth/token';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // OAuth 토큰 획득
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(this.oauthUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`OAuth failed: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      console.log('✅ WarcraftLogs 인증 성공');
      return this.accessToken;
    } catch (error) {
      console.error('❌ WarcraftLogs 인증 실패:', error);
      return null;
    }
  }

  // GraphQL 쿼리 실행
  async query(graphqlQuery, variables = {}) {
    const token = await this.getAccessToken();

    if (!token) {
      throw new Error('인증 토큰 획득 실패');
    }

    try {
      const response = await fetch(`${this.apiUrl}/client`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: graphqlQuery,
          variables
        })
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('GraphQL 쿼리 실패:', error);
      throw error;
    }
  }

  // 최신 레이드 로그 가져오기
  async getLatestRaidLogs(limit = 10) {
    const query = `
      query GetLatestRaidLogs($limit: Int!) {
        reportData {
          reports(
            limit: $limit
            zoneID: 38  # Nerub-ar Palace 레이드 ID
          ) {
            data {
              code
              title
              startTime
              endTime
              zone {
                name
              }
              rankings {
                data {
                  name
                  class
                  spec
                  amount
                  bracketData
                }
              }
            }
          }
        }
      }
    `;

    try {
      const result = await this.query(query, { limit });
      return this.processRaidLogs(result?.reportData?.reports?.data || []);
    } catch (error) {
      console.error('레이드 로그 가져오기 실패:', error);
      // 실패시 mock 데이터 반환
      return this.getMockRaidLogs(limit);
    }
  }

  // 특정 직업의 상위 로그 가져오기
  async getTopLogsForClass(className, spec, limit = 10) {
    const query = `
      query GetTopLogs($className: String!, $spec: String!, $limit: Int!) {
        reportData {
          reports(
            limit: $limit
            zoneID: 38
          ) {
            data {
              code
              rankings(
                playerMetric: dps
                className: $className
                specName: $spec
              ) {
                data {
                  name
                  total
                  bracketData
                  spec {
                    name
                  }
                  best {
                    amount
                    spec
                    report {
                      code
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const result = await this.query(query, { className, spec, limit });
      return this.processClassLogs(result?.reportData?.reports?.data || [], className, spec);
    } catch (error) {
      console.error(`${className} ${spec} 로그 가져오기 실패:`, error);
      return this.getMockClassLogs(className, spec, limit);
    }
  }

  // 레이드 로그 처리
  processRaidLogs(rawLogs) {
    return rawLogs.map(log => ({
      code: log.code,
      title: log.title,
      zone: log.zone?.name || 'Unknown',
      startTime: new Date(log.startTime),
      endTime: new Date(log.endTime),
      players: this.extractPlayers(log.rankings?.data || [])
    }));
  }

  // 플레이어 정보 추출
  extractPlayers(rankings) {
    return rankings.map(player => ({
      name: player.name,
      class: player.class,
      spec: player.spec,
      dps: player.amount,
      percentile: player.bracketData || 0
    }));
  }

  // 클래스별 로그 처리
  processClassLogs(rawLogs, className, spec) {
    const logs = [];

    rawLogs.forEach(report => {
      const rankings = report.rankings?.data || [];

      rankings.forEach(player => {
        if (player.best && player.best.amount > 0) {
          logs.push({
            logCode: report.code,
            playerName: player.name,
            class: className,
            spec: spec,
            dps: player.best.amount,
            percentile: player.bracketData || 0,
            reportCode: player.best.report?.code
          });
        }
      });
    });

    return logs;
  }

  // Mock 데이터 (API 연결 실패시 사용)
  getMockRaidLogs(limit) {
    const logs = [];
    const classes = ['warrior', 'paladin', 'deathknight', 'demonhunter', 'hunter', 'rogue',
                    'mage', 'warlock', 'priest', 'shaman', 'druid', 'monk', 'evoker'];
    const specs = {
      warrior: ['arms', 'fury', 'protection'],
      paladin: ['retribution', 'holy', 'protection'],
      deathknight: ['frost', 'unholy', 'blood'],
      demonhunter: ['havoc', 'vengeance'],
      hunter: ['beastmastery', 'marksmanship', 'survival'],
      rogue: ['assassination', 'outlaw', 'subtlety'],
      mage: ['frost', 'fire', 'arcane'],
      warlock: ['affliction', 'demonology', 'destruction'],
      priest: ['shadow', 'holy', 'discipline'],
      shaman: ['elemental', 'enhancement', 'restoration'],
      druid: ['balance', 'feral', 'guardian', 'restoration'],
      monk: ['windwalker', 'brewmaster', 'mistweaver'],
      evoker: ['devastation', 'preservation', 'augmentation']
    };

    for (let i = 0; i < limit; i++) {
      const className = classes[Math.floor(Math.random() * classes.length)];
      const classSpecs = specs[className];
      const spec = classSpecs[Math.floor(Math.random() * classSpecs.length)];

      logs.push({
        code: `MOCK${i}`,
        title: `Mock Raid Log ${i}`,
        zone: 'Nerub-ar Palace',
        startTime: new Date(),
        players: [{
          name: `Player${i}`,
          class: className,
          spec: spec,
          dps: 140000 + Math.random() * 30000,
          percentile: 50 + Math.random() * 50
        }]
      });
    }

    console.log('⚠️ WarcraftLogs API 연결 실패 - Mock 데이터 사용 중');
    return logs;
  }

  getMockClassLogs(className, spec, limit) {
    const logs = [];

    for (let i = 0; i < limit; i++) {
      logs.push({
        logCode: `MOCK${i}`,
        playerName: `TopPlayer${i}`,
        class: className,
        spec: spec,
        dps: 150000 + Math.random() * 20000,
        percentile: 90 + Math.random() * 10,
        reportCode: `REPORT${i}`
      });
    }

    return logs;
  }

  // 전투 분석 데이터 가져오기
  async getCombatAnalysis(reportCode, fightId) {
    const query = `
      query GetCombatAnalysis($code: String!, $fightID: Int!) {
        reportData {
          report(code: $code) {
            events(
              fightIDs: [$fightID]
              dataType: DamageDone
              limit: 1000
            ) {
              data
              nextPageTimestamp
            }
            table(
              fightIDs: [$fightID]
              dataType: DamageDone
            )
          }
        }
      }
    `;

    try {
      const result = await this.query(query, { code: reportCode, fightID: fightId });
      return result?.reportData?.report || null;
    } catch (error) {
      console.error('전투 분석 데이터 가져오기 실패:', error);
      return null;
    }
  }
}

export default new WarcraftLogsService();