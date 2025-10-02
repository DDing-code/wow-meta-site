const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 }); // 1시간 캐시

// Blizzard API 설정
const CLIENT_ID = process.env.BLIZZARD_CLIENT_ID || '9fe7662d-2131-44d5-bc10-45b90f40c810';
const CLIENT_SECRET = process.env.BLIZZARD_CLIENT_SECRET || 'EYBxja8uU907i5DUIkWNFqnczX65L8358qewqH0s';
const REGION = 'kr';
const LOCALE = 'ko_KR';

let accessToken = null;
let tokenExpiry = null;

// 액세스 토큰 획득
async function getAccessToken() {
  // 토큰이 유효한 경우 재사용
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken;
  }

  try {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(
      `https://${REGION}.battle.net/oauth/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    accessToken = response.data.access_token;
    // 토큰 만료 시간 설정 (보통 24시간)
    tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000) - 60000); // 1분 여유

    console.log('✅ Blizzard API 토큰 획득 성공');
    return accessToken;
  } catch (error) {
    console.error('❌ Blizzard API 토큰 획득 실패:', error.response?.data || error.message);
    throw error;
  }
}

// API 요청 헬퍼
async function makeBlizzardRequest(endpoint, params = {}) {
  const token = await getAccessToken();
  const url = `https://${REGION}.api.blizzard.com${endpoint}`;

  try {
    const response = await axios.get(url, {
      params: {
        locale: LOCALE,
        ...params
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Blizzard API 요청 실패: ${endpoint}`, error.response?.data || error.message);
    throw error;
  }
}

// 특성 트리 전체 인덱스
router.get('/talent-tree/index', async (req, res) => {
  const cacheKey = 'talent-tree-index';
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await makeBlizzardRequest('/data/wow/talent-tree/index');
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '특성 트리 인덱스를 가져오는데 실패했습니다.' });
  }
});

// 특정 특성 트리 조회
router.get('/talent-tree/:treeId', async (req, res) => {
  const { treeId } = req.params;
  const cacheKey = `talent-tree-${treeId}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await makeBlizzardRequest(`/data/wow/talent-tree/${treeId}`);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `특성 트리 ${treeId}를 가져오는데 실패했습니다.` });
  }
});

// 특성 정보 조회
router.get('/talent/:talentId', async (req, res) => {
  const { talentId } = req.params;
  const cacheKey = `talent-${talentId}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await makeBlizzardRequest(`/data/wow/talent/${talentId}`);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `특성 ${talentId}를 가져오는데 실패했습니다.` });
  }
});

// 스킬/주문 정보 조회
router.get('/spell/:spellId', async (req, res) => {
  const { spellId } = req.params;
  const cacheKey = `spell-${spellId}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await makeBlizzardRequest(`/data/wow/spell/${spellId}`);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `스킬 ${spellId}를 가져오는데 실패했습니다.` });
  }
});

// 미디어 정보 조회 (아이콘 등)
router.get('/media/spell/:spellId', async (req, res) => {
  const { spellId } = req.params;
  const cacheKey = `media-spell-${spellId}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await makeBlizzardRequest(`/data/wow/media/spell/${spellId}`);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `스킬 미디어 ${spellId}를 가져오는데 실패했습니다.` });
  }
});

// 플레이어블 클래스 목록
router.get('/playable-class/index', async (req, res) => {
  const cacheKey = 'playable-class-index';
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await makeBlizzardRequest('/data/wow/playable-class/index');
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '클래스 목록을 가져오는데 실패했습니다.' });
  }
});

// 특정 클래스 정보
router.get('/playable-class/:classId', async (req, res) => {
  const { classId } = req.params;
  const cacheKey = `playable-class-${classId}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await makeBlizzardRequest(`/data/wow/playable-class/${classId}`);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `클래스 ${classId}를 가져오는데 실패했습니다.` });
  }
});

// 전문화 정보
router.get('/playable-specialization/:specId', async (req, res) => {
  const { specId } = req.params;
  const cacheKey = `playable-spec-${specId}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    const data = await makeBlizzardRequest(`/data/wow/playable-specialization/${specId}`);
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `전문화 ${specId}를 가져오는데 실패했습니다.` });
  }
});

// 야수 사냥꾼 특성 트리 빌드 (하드코딩된 ID)
router.get('/beast-mastery/talent-build', async (req, res) => {
  const cacheKey = 'beast-mastery-talent-build';
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  try {
    // 사냥꾼 클래스 ID: 3, 야수 전문화 ID: 253
    const classData = await makeBlizzardRequest('/data/wow/playable-class/3');
    const specData = await makeBlizzardRequest('/data/wow/playable-specialization/253');

    // 특성 트리 ID는 일반적으로 클래스와 전문화에 따라 결정됨
    // 실제 ID는 talent-tree/index에서 찾아야 함
    const talentTreeIndex = await makeBlizzardRequest('/data/wow/talent-tree/index');

    // 야수 사냥꾼 관련 트리 찾기
    const beastMasteryTrees = talentTreeIndex.spec_trees?.filter(tree =>
      tree.name?.ko_KR?.includes('야수') || tree.name?.en_US?.includes('Beast')
    );

    const result = {
      class: classData,
      specialization: specData,
      talentTrees: beastMasteryTrees || [],
      message: '야수 사냥꾼 특성 데이터'
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: '야수 사냥꾼 특성 빌드를 가져오는데 실패했습니다.' });
  }
});

// 테스트용 엔드포인트
router.get('/test', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({
      success: true,
      message: 'Blizzard API 연결 성공',
      token: token.substring(0, 10) + '...' // 보안상 일부만 표시
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Blizzard API 연결 실패',
      error: error.message
    });
  }
});

module.exports = router;