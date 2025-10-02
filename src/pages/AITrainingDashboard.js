import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getKoreanTranslation } from '../data/koreanTranslations';

const Container = styled.div`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  min-height: 100vh;
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const StatusSection = styled.div`
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.9));
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatusTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #f4c430;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const StatusCard = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid ${props => props.error ? '#ff4444' : props.success ? '#4ecdc4' : '#444'};

  h3 {
    font-size: 0.9rem;
    color: #999;
    margin-bottom: 8px;
  }

  .value {
    font-size: 1.8rem;
    font-weight: bold;
    color: ${props => props.error ? '#ff4444' : props.success ? '#4ecdc4' : '#fff'};
  }

  .subtext {
    font-size: 0.8rem;
    color: #666;
    margin-top: 4px;
  }
`;

const TrainingSection = styled.div`
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.9));
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ClassSelector = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const ClassButton = styled.button`
  padding: 12px 20px;
  background: ${props => props.active ?
    'linear-gradient(135deg, #ff6b6b, #4ecdc4)' :
    'rgba(40, 40, 40, 0.8)'};
  color: #fff;
  border: 1px solid ${props => props.active ? '#4ecdc4' : '#444'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(78, 205, 196, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DataDisplay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
`;

const DataRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 15px;
  padding: 12px;
  margin-bottom: 8px;
  background: ${props => props.header ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 255, 255, 0.02)'};
  border-radius: 6px;
  border: 1px solid ${props => props.header ? '#4ecdc4' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  span {
    color: ${props => props.header ? '#4ecdc4' : '#fff'};
    font-weight: ${props => props.header ? 'bold' : 'normal'};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top: 3px solid #4ecdc4;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid #ff4444;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  color: #ff6666;
`;

const SuccessMessage = styled.div`
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid #4ecdc4;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  color: #4ecdc4;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #4ecdc4, #44a39f);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-right: 15px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AITrainingDashboard = () => {
  const [status, setStatus] = useState({
    totalLogs: 0,
    lastUpdate: null,
    activeTraining: false,
    dataSource: null
  });

  const [selectedClass, setSelectedClass] = useState('warrior');
  const [selectedSpec, setSelectedSpec] = useState('fury');
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [cacheTTL, setCacheTTL] = useState(0);

  const classes = [
    { id: 'warrior', name: '전사', specs: ['fury', 'arms', 'protection'] },
    { id: 'paladin', name: '성기사', specs: ['retribution', 'holy', 'protection'] },
    { id: 'hunter', name: '사냥꾼', specs: ['beastmastery', 'marksmanship', 'survival'] },
    { id: 'rogue', name: '도적', specs: ['assassination', 'outlaw', 'subtlety'] },
    { id: 'priest', name: '사제', specs: ['shadow', 'holy', 'discipline'] },
    { id: 'deathknight', name: '죽음의 기사', specs: ['unholy', 'frost', 'blood'] },
    { id: 'shaman', name: '주술사', specs: ['elemental', 'enhancement', 'restoration'] },
    { id: 'mage', name: '마법사', specs: ['arcane', 'fire', 'frost'] },
    { id: 'warlock', name: '흑마법사', specs: ['affliction', 'demonology', 'destruction'] },
    { id: 'monk', name: '수도사', specs: ['windwalker', 'brewmaster', 'mistweaver'] },
    { id: 'druid', name: '드루이드', specs: ['balance', 'feral', 'guardian', 'restoration'] },
    { id: 'demonhunter', name: '악마사냥꾼', specs: ['havoc', 'vengeance'] },
    { id: 'evoker', name: '기원사', specs: ['devastation', 'preservation', 'augmentation'] }
  ];

  const specTranslations = {
    // 전사
    fury: '분노',
    arms: '무기',
    protection: '방어',
    // 성기사
    retribution: '징벌',
    holy: '신성',
    // 사냥꾼
    beastmastery: '야수',
    marksmanship: '사격',
    survival: '생존',
    // 도적
    assassination: '암살',
    outlaw: '무법',
    subtlety: '잠행',
    // 사제
    shadow: '암흑',
    discipline: '수양',
    // 죽음의 기사
    unholy: '부정',
    frost: '냉기',
    blood: '혈기',
    // 주술사
    elemental: '정기',
    enhancement: '고양',
    restoration: '복원',
    // 마법사
    arcane: '비전',
    fire: '화염',
    // 흑마법사
    affliction: '고통',
    demonology: '악마',
    destruction: '파괴',
    // 수도사
    windwalker: '풍운',
    brewmaster: '양조',
    mistweaver: '운무',
    // 드루이드
    balance: '조화',
    feral: '야성',
    guardian: '수호',
    // 악마사냥꾼
    havoc: '파멸',
    vengeance: '복수',
    // 기원사
    devastation: '황폐',
    preservation: '보존',
    augmentation: '증강'
  };

  // 데이터 가져오기 (캐시 우선)
  const fetchTrainingData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 먼저 캐시된 데이터 확인
      const cacheKey = `training_${selectedClass}_${selectedSpec}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

      if (cachedData && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp);
        const cacheMaxAge = 5 * 60 * 1000; // 5분

        if (cacheAge < cacheMaxAge) {
          const data = JSON.parse(cachedData);
          setTrainingData(data.logs || []);
          setStatus({
            totalLogs: data.count || 0,
            lastUpdate: new Date(parseInt(cacheTimestamp)),
            activeTraining: false,
            dataSource: 'cache'
          });
          setCacheTTL(Math.floor((cacheMaxAge - cacheAge) / 1000));
          setSuccess(`캐시된 데이터 사용 중 (${Math.floor((cacheMaxAge - cacheAge) / 1000)}초 남음)`);
          setLoading(false);
          return;
        }
      }

      // 캐시가 없거나 만료된 경우 서버에서 가져오기
      const response = await fetch('http://localhost:5003/api/learning/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class: selectedClass,
          spec: selectedSpec,
          limit: 20
        })
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.logs) {
        setTrainingData(data.logs);
        setStatus({
          totalLogs: data.count || data.logs.length,
          lastUpdate: new Date(),
          activeTraining: false,
          dataSource: data.dataSource || 'unknown'
        });

        // 캐시에 저장
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());

        setSuccess(`${data.count || data.logs.length}개 학습 데이터 로드 완료 (${data.dataSource})`);
      } else {
        throw new Error(data.error || '데이터 로드 실패');
      }
    } catch (err) {
      console.error('학습 데이터 로드 오류:', err);
      setError(`데이터 로드 실패: ${err.message}`);

      // 오류 시 이전 캐시 데이터라도 사용
      const cacheKey = `training_${selectedClass}_${selectedSpec}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const data = JSON.parse(cachedData);
        setTrainingData(data.logs || []);
        setError(`서버 연결 실패. 이전 캐시 데이터 사용 중`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 캐시 지우기
  const clearCache = () => {
    const cacheKey = `training_${selectedClass}_${selectedSpec}`;
    localStorage.removeItem(cacheKey);
    localStorage.removeItem(`${cacheKey}_timestamp`);
    setSuccess('캐시가 삭제되었습니다');
    setCacheTTL(0);
  };

  // 모든 캐시 지우기
  const clearAllCache = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('training_')) {
        localStorage.removeItem(key);
      }
    });
    setSuccess('모든 캐시가 삭제되었습니다');
    setCacheTTL(0);
  };

  // 캐시 TTL 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      if (cacheTTL > 0) {
        setCacheTTL(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cacheTTL]);

  // 클래스 변경 시 첫 번째 특성 자동 선택
  useEffect(() => {
    const classData = classes.find(c => c.id === selectedClass);
    if (classData && classData.specs.length > 0) {
      setSelectedSpec(classData.specs[0]);
    }
  }, [selectedClass]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchTrainingData();
  }, []);

  return (
    <Container>
      <Header>AI 학습 대시보드</Header>

      <StatusSection>
        <StatusTitle>시스템 상태</StatusTitle>
        <StatusGrid>
          <StatusCard success={status.totalLogs > 0}>
            <h3>총 학습 데이터</h3>
            <div className="value">{status.totalLogs.toLocaleString()}</div>
            <div className="subtext">개 로그</div>
          </StatusCard>

          <StatusCard>
            <h3>마지막 업데이트</h3>
            <div className="value">
              {status.lastUpdate ?
                new Date(status.lastUpdate).toLocaleTimeString('ko-KR') :
                '-'}
            </div>
            <div className="subtext">
              {status.lastUpdate ?
                new Date(status.lastUpdate).toLocaleDateString('ko-KR') :
                '없음'}
            </div>
          </StatusCard>

          <StatusCard success={status.dataSource === 'cache'}>
            <h3>데이터 소스</h3>
            <div className="value">
              {status.dataSource === 'cache' ? '캐시' :
               status.dataSource === 'warcraftlogs-api-v2' ? 'API v2' :
               status.dataSource === 'warcraftlogs-puppeteer' ? 'Puppeteer' :
               status.dataSource || '-'}
            </div>
            <div className="subtext">
              {cacheTTL > 0 ? `${cacheTTL}초 유효` : '실시간'}
            </div>
          </StatusCard>

          <StatusCard>
            <h3>학습 상태</h3>
            <div className="value">
              {status.activeTraining ? '진행 중' : '대기'}
            </div>
            <div className="subtext">
              {loading ? '데이터 로딩 중...' : '준비 완료'}
            </div>
          </StatusCard>
        </StatusGrid>
      </StatusSection>

      <TrainingSection>
        <StatusTitle>학습 데이터 조회</StatusTitle>

        <ClassSelector>
          {classes.map(cls => (
            <ClassButton
              key={cls.id}
              active={selectedClass === cls.id}
              onClick={() => setSelectedClass(cls.id)}
              disabled={loading}
            >
              {cls.name}
            </ClassButton>
          ))}
        </ClassSelector>

        <ClassSelector>
          {classes.find(c => c.id === selectedClass)?.specs.map(spec => (
            <ClassButton
              key={spec}
              active={selectedSpec === spec}
              onClick={() => setSelectedSpec(spec)}
              disabled={loading}
            >
              {specTranslations[spec] || spec}
            </ClassButton>
          ))}
        </ClassSelector>

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <ActionButton onClick={fetchTrainingData} disabled={loading}>
            {loading ? '로딩 중...' : '데이터 가져오기'}
          </ActionButton>
          <ActionButton onClick={clearCache} disabled={loading}>
            현재 캐시 삭제
          </ActionButton>
          <ActionButton onClick={clearAllCache} disabled={loading}>
            모든 캐시 삭제
          </ActionButton>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        {loading ? (
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        ) : trainingData.length > 0 ? (
          <DataDisplay>
            <DataRow header>
              <span>플레이어</span>
              <span>DPS/HPS</span>
              <span>백분위</span>
              <span>길드</span>
              <span>보스</span>
            </DataRow>
            {trainingData.map((data, index) => (
              <DataRow key={index}>
                <span>{data.playerName || 'Unknown'}</span>
                <span>
                  {data.metricType === 'hps' ?
                    `${Math.round(data.hps / 1000)}k` :
                    `${Math.round(data.dps / 1000)}k`}
                </span>
                <span>{data.percentile || 0}%</span>
                <span>{data.guildName || '-'}</span>
                <span>{data.bossName || 'Unknown'}</span>
              </DataRow>
            ))}
          </DataDisplay>
        ) : (
          <DataDisplay>
            <p style={{ textAlign: 'center', color: '#666' }}>
              데이터가 없습니다. "데이터 가져오기" 버튼을 클릭하세요.
            </p>
          </DataDisplay>
        )}
      </TrainingSection>
    </Container>
  );
};

export default AITrainingDashboard;