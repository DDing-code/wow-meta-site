import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import warcraftLogsAPI from '../services/warcraftLogsAPI';

const Container = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ImportForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const InputGroup = styled.div`
  flex: 1;
  min-width: 300px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.subtext};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: ${props => props.theme.colors.secondary};
  border: 2px solid ${props => props.theme.colors.overlay};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.accent}22;
  }

  &::placeholder {
    color: ${props => props.theme.colors.subtext}66;
  }
`;

const Button = styled(motion.button)`
  padding: 0.8rem 2rem;
  background: ${props => props.disabled ? props.theme.colors.overlay : props.theme.colors.accent};
  color: ${props => props.disabled ? props.theme.colors.subtext : props.theme.colors.primary};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.warning};
    transform: translateY(-2px);
  }
`;

const StatusMessage = styled(motion.div)`
  padding: 1rem;
  background: ${props =>
    props.type === 'error' ? props.theme.colors.error + '22' :
    props.type === 'success' ? props.theme.colors.success + '22' :
    props.theme.colors.info + '22'
  };
  border: 2px solid ${props =>
    props.type === 'error' ? props.theme.colors.error :
    props.type === 'success' ? props.theme.colors.success :
    props.theme.colors.info
  };
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const RecentImports = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.overlay};
`;

const ImportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ImportItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: ${props => props.theme.colors.secondary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.theme.colors.overlay};
    transform: translateX(5px);
  }
`;

const ImportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const ImportTitle = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ImportMeta = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
`;

const LoadButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.theme.colors.warning};
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 3px solid ${props => props.theme.colors.accent}44;
  border-top: 3px solid ${props => props.theme.colors.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.secondary};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 1rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg,
    ${props => props.theme.colors.accent},
    ${props => props.theme.colors.warning}
  );
  border-radius: 4px;
`;

const HelpText = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.subtext};
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: 'ℹ️';
  }
`;

function LogImporter({ onLogImport }) {
  const [logUrl, setLogUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recentImports, setRecentImports] = useState(() => {
    const saved = localStorage.getItem('recentLogImports');
    return saved ? JSON.parse(saved) : [];
  });

  // URL에서 로그 코드 추출
  const extractLogCode = (url) => {
    const match = url.match(/warcraftlogs\.com\/reports\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  // 로그 가져오기
  const handleImport = async (e) => {
    e.preventDefault();

    const logCode = extractLogCode(logUrl);
    if (!logCode) {
      setStatus({
        type: 'error',
        message: '올바른 WarcraftLogs URL을 입력해주세요.'
      });
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatus({
      type: 'info',
      message: '로그 데이터를 가져오는 중...'
    });

    try {
      // 진행 상태 업데이트
      setProgress(20);
      const reportData = await warcraftLogsAPI.getReport(logCode);

      setProgress(40);
      setStatus({
        type: 'info',
        message: '전투 데이터 분석 중...'
      });

      // 전투 데이터 가져오기
      const fights = reportData.reportData.report.fights;
      const processedData = [];

      for (let i = 0; i < fights.length; i++) {
        const fight = fights[i];
        if (fight.kill || fight.bossPercentage < 10) {
          setProgress(40 + (i / fights.length) * 40);

          const fightAnalysis = await warcraftLogsAPI.getFightAnalysis(logCode, fight.id);
          const mechanicsData = await warcraftLogsAPI.getMechanicsAnalysis(logCode, fight.id);
          const deathData = await warcraftLogsAPI.getDeathLogs(logCode, fight.id);
          const consumableData = await warcraftLogsAPI.getConsumableUsage(logCode, fight.id);

          processedData.push({
            fight,
            analysis: fightAnalysis,
            mechanics: mechanicsData,
            deaths: deathData,
            consumables: consumableData
          });
        }
      }

      setProgress(90);

      // 최근 가져온 목록에 추가
      const importRecord = {
        code: logCode,
        title: reportData.reportData.report.title,
        zone: reportData.reportData.report.zone?.name,
        timestamp: Date.now(),
        url: logUrl
      };

      const updatedRecents = [importRecord, ...recentImports.slice(0, 4)];
      setRecentImports(updatedRecents);
      localStorage.setItem('recentLogImports', JSON.stringify(updatedRecents));

      setProgress(100);
      setStatus({
        type: 'success',
        message: '로그를 성공적으로 가져왔습니다!'
      });

      // 상위 컴포넌트에 데이터 전달
      if (onLogImport) {
        onLogImport({
          reportCode: logCode,
          reportData: reportData.reportData.report,
          processedData
        });
      }

      setLogUrl('');

    } catch (error) {
      console.error('로그 가져오기 실패:', error);
      setStatus({
        type: 'error',
        message: `로그 가져오기 실패: ${error.message}`
      });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // 최근 로그 다시 불러오기
  const handleReload = async (item) => {
    setLogUrl(item.url);
    // 자동으로 가져오기 시작
    setTimeout(() => {
      document.querySelector('form').requestSubmit();
    }, 100);
  };

  return (
    <Container>
      <Title>
        📊 WarcraftLogs 로그 가져오기
      </Title>

      <AnimatePresence>
        {status && (
          <StatusMessage
            type={status.type}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {status.message}
          </StatusMessage>
        )}
      </AnimatePresence>

      <ImportForm onSubmit={handleImport}>
        <InputGroup>
          <Label>WarcraftLogs URL</Label>
          <Input
            type="text"
            value={logUrl}
            onChange={(e) => setLogUrl(e.target.value)}
            placeholder="https://www.warcraftlogs.com/reports/..."
            disabled={loading}
          />
          <HelpText>
            WarcraftLogs 리포트 페이지의 URL을 입력하세요
          </HelpText>
        </InputGroup>

        <Button
          type="submit"
          disabled={loading || !logUrl}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              가져오는 중...
            </>
          ) : (
            <>
              📥 로그 가져오기
            </>
          )}
        </Button>
      </ImportForm>

      {progress > 0 && (
        <ProgressBar>
          <ProgressFill
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </ProgressBar>
      )}

      {recentImports.length > 0 && (
        <RecentImports>
          <Title style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            최근 가져온 로그
          </Title>
          <ImportList>
            {recentImports.map((item, index) => (
              <ImportItem
                key={item.code}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ImportInfo>
                  <ImportTitle>{item.title}</ImportTitle>
                  <ImportMeta>
                    {item.zone} • {new Date(item.timestamp).toLocaleDateString()}
                  </ImportMeta>
                </ImportInfo>
                <LoadButton onClick={() => handleReload(item)}>
                  다시 불러오기
                </LoadButton>
              </ImportItem>
            ))}
          </ImportList>
        </RecentImports>
      )}
    </Container>
  );
}

export default LogImporter;