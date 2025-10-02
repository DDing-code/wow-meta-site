// Blizzard API 서비스
// WoW Game Data API를 통해 특성 트리 데이터를 가져옵니다

const BLIZZARD_API_BASE = 'https://us.api.blizzard.com';
const BLIZZARD_OAUTH = 'https://oauth.battle.net/token';

// 기존에 있는 API 키 사용
const CLIENT_ID = '9fd242c3-d0ad-490d-9dcd-0f0c7fbd79e9';
const CLIENT_SECRET = 'qbH1Rw2FqPLiQlGGdTtijCxeLpQRkw9jEaFhXvHi';

class BlizzardAPIService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // OAuth 토큰 획득
  async getAccessToken() {
    try {
      // 토큰이 있고 만료되지 않았으면 재사용
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const credentials = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
      const response = await fetch(BLIZZARD_OAUTH, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // 토큰 만료 시간 설정 (보통 24시간, 안전하게 23시간으로 설정)
      this.tokenExpiry = Date.now() + (data.expires_in * 1000 * 0.95);

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  // API 요청 헬퍼
  async makeAPIRequest(endpoint, params = {}) {
    try {
      const token = await this.getAccessToken();
      const url = new URL(`${BLIZZARD_API_BASE}${endpoint}`);

      // 기본 파라미터 추가
      url.searchParams.append('namespace', params.namespace || 'static-us');
      url.searchParams.append('locale', params.locale || 'ko_KR');

      // 추가 파라미터
      Object.keys(params).forEach(key => {
        if (key !== 'namespace' && key !== 'locale') {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // 클래스 목록 가져오기
  async getPlayableClasses() {
    try {
      const data = await this.makeAPIRequest('/data/wow/playable-class/index');
      return data.classes;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  // 특정 클래스 정보 가져오기
  async getClass(classId) {
    try {
      const data = await this.makeAPIRequest(`/data/wow/playable-class/${classId}`);
      return data;
    } catch (error) {
      console.error('Error fetching class:', error);
      throw error;
    }
  }

  // 전문화 목록 가져오기
  async getPlayableSpecializations() {
    try {
      const data = await this.makeAPIRequest('/data/wow/playable-specialization/index');
      return data.character_specializations;
    } catch (error) {
      console.error('Error fetching specializations:', error);
      throw error;
    }
  }

  // 특정 전문화 정보 가져오기
  async getSpecialization(specId) {
    try {
      const data = await this.makeAPIRequest(`/data/wow/playable-specialization/${specId}`);
      return data;
    } catch (error) {
      console.error('Error fetching specialization:', error);
      throw error;
    }
  }

  // 특성 트리 인덱스 가져오기
  async getTalentTreeIndex() {
    try {
      const data = await this.makeAPIRequest('/data/wow/talent-tree/index');
      return data.talent_trees;
    } catch (error) {
      console.error('Error fetching talent trees:', error);
      throw error;
    }
  }

  // 특정 특성 트리 가져오기
  async getTalentTree(treeId) {
    try {
      // 특성 트리 기본 정보
      const treeData = await this.makeAPIRequest(`/data/wow/talent-tree/${treeId}`);

      // 특성 트리 노드 정보
      const nodesData = await this.makeAPIRequest(`/data/wow/talent-tree/${treeId}/nodes`);

      return {
        tree: treeData,
        nodes: nodesData
      };
    } catch (error) {
      console.error('Error fetching talent tree:', error);
      throw error;
    }
  }

  // 사냥꾼 야수 전문화 특성 트리 가져오기
  async getBeastMasteryTalentTree() {
    try {
      // 먼저 모든 전문화 목록을 가져와서 야수 사냥꾼의 ID를 찾습니다
      const specs = await this.getPlayableSpecializations();
      const beastMastery = specs.find(spec =>
        spec.name && spec.name.includes('Beast Mastery')
      );

      if (!beastMastery) {
        console.log('Beast Mastery spec not found, using default ID');
        // 야수 사냥꾼의 기본 ID (253)
        return await this.getSpecializationTalentTree(253);
      }

      return await this.getSpecializationTalentTree(beastMastery.id);
    } catch (error) {
      console.error('Error fetching Beast Mastery talent tree:', error);
      throw error;
    }
  }

  // 전문화별 특성 트리 가져오기
  async getSpecializationTalentTree(specId) {
    try {
      // 전문화 정보 가져오기
      const specData = await this.getSpecialization(specId);

      // 특성 트리 정보 수집
      const talentData = {
        spec: specData,
        classTalents: null,
        specTalents: null,
        heroTalents: []
      };

      // 클래스 특성 트리와 전문화 특성 트리 가져오기
      if (specData.talent_trees) {
        for (const tree of specData.talent_trees) {
          const treeData = await this.getTalentTree(tree.id);

          if (tree.tree_type === 'CLASS') {
            talentData.classTalents = treeData;
          } else if (tree.tree_type === 'SPEC') {
            talentData.specTalents = treeData;
          } else if (tree.tree_type === 'HERO') {
            talentData.heroTalents.push(treeData);
          }
        }
      }

      return talentData;
    } catch (error) {
      console.error('Error fetching specialization talent tree:', error);
      throw error;
    }
  }

  // 특성 정보 가져오기
  async getTalent(talentId) {
    try {
      const data = await this.makeAPIRequest(`/data/wow/talent/${talentId}`);
      return data;
    } catch (error) {
      console.error('Error fetching talent:', error);
      throw error;
    }
  }

  // 주문 정보 가져오기 (특성의 상세 정보)
  async getSpell(spellId) {
    try {
      const data = await this.makeAPIRequest(`/data/wow/spell/${spellId}`);
      return data;
    } catch (error) {
      console.error('Error fetching spell:', error);
      throw error;
    }
  }

  // 미디어 정보 가져오기 (아이콘 등)
  async getMedia(mediaId) {
    try {
      const data = await this.makeAPIRequest(`/data/wow/media/spell/${mediaId}`);
      return data;
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  }

  // 야수 사냥꾼 전체 특성 데이터 구성
  async buildBeastMasteryTalentData() {
    try {
      console.log('Building Beast Mastery talent data from API...');

      // 기본 특성 트리 구조 가져오기
      const talentData = await this.getBeastMasteryTalentTree();

      // 각 특성의 상세 정보 추가
      const enhancedData = {
        ...talentData,
        classTalentsDetailed: {},
        specTalentsDetailed: {},
        heroTalentsDetailed: []
      };

      // 클래스 특성 상세 정보
      if (talentData.classTalents && talentData.classTalents.nodes) {
        for (const node of talentData.classTalents.nodes) {
          try {
            const talentDetails = await this.getTalent(node.talent_id);
            const spellDetails = talentDetails.spell ?
              await this.getSpell(talentDetails.spell.id) : null;

            enhancedData.classTalentsDetailed[node.id] = {
              ...node,
              talent: talentDetails,
              spell: spellDetails
            };
          } catch (err) {
            console.error(`Error fetching details for talent ${node.talent_id}:`, err);
          }
        }
      }

      // 전문화 특성 상세 정보
      if (talentData.specTalents && talentData.specTalents.nodes) {
        for (const node of talentData.specTalents.nodes) {
          try {
            const talentDetails = await this.getTalent(node.talent_id);
            const spellDetails = talentDetails.spell ?
              await this.getSpell(talentDetails.spell.id) : null;

            enhancedData.specTalentsDetailed[node.id] = {
              ...node,
              talent: talentDetails,
              spell: spellDetails
            };
          } catch (err) {
            console.error(`Error fetching details for talent ${node.talent_id}:`, err);
          }
        }
      }

      // 영웅 특성 상세 정보
      for (const heroTree of talentData.heroTalents) {
        const detailedHeroTree = {
          ...heroTree,
          nodesDetailed: {}
        };

        if (heroTree.nodes) {
          for (const node of heroTree.nodes) {
            try {
              const talentDetails = await this.getTalent(node.talent_id);
              const spellDetails = talentDetails.spell ?
                await this.getSpell(talentDetails.spell.id) : null;

              detailedHeroTree.nodesDetailed[node.id] = {
                ...node,
                talent: talentDetails,
                spell: spellDetails
              };
            } catch (err) {
              console.error(`Error fetching details for talent ${node.talent_id}:`, err);
            }
          }
        }

        enhancedData.heroTalentsDetailed.push(detailedHeroTree);
      }

      console.log('Talent data build complete:', enhancedData);
      return enhancedData;
    } catch (error) {
      console.error('Error building talent data:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스
const blizzardAPI = new BlizzardAPIService();
export default blizzardAPI;