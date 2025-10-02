import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Avatar, LinearProgress, Divider, Paper, List, ListItem, ListItemIcon, ListItemText, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
// Material-UI 아이콘 import 주석 처리 (서버 시작 문제 해결을 위해)
// import PetsIcon from '@mui/icons-material/Pets';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import SecurityIcon from '@mui/icons-material/Security';
// import FlashOnIcon from '@mui/icons-material/FlashOn';
// import BuildIcon from '@mui/icons-material/Build';
// import StarIcon from '@mui/icons-material/Star';
// import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
// import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

// 커스텀 스타일 컴포넌트
const GuideHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  color: 'white',
  marginBottom: theme.spacing(3),
}));

const SkillCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatBar = styled(LinearProgress)(({ theme }) => ({
  height: 24,
  borderRadius: 12,
  '& .MuiLinearProgress-bar': {
    borderRadius: 12,
  },
}));

const TierBadge = styled(Chip)(({ theme, tier }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  padding: theme.spacing(2),
  backgroundColor: tier === 'S' ? '#ff6b6b' : tier === 'A' ? '#4ecdc4' : '#45b7d1',
  color: 'white',
}));

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const BeastMasteryHunterGuide = () => {
  const [tabValue, setTabValue] = React.useState(0);

  // 스킬 아이콘 베이스 URL
  const iconUrl = (iconName) => `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;

  // 핵심 스킬 데이터
  const coreSkills = [
    {
      id: 19574,
      name: '야수의 격노',
      icon: 'ability_druid_ferociousbite',
      description: '25% 공격력 증가',
      cooldown: '90초',
      type: 'burst'
    },
    {
      id: 193530,
      name: '야생의 부름',
      icon: 'ability_hunter_callofthewild',
      description: '모든 펫 소환',
      cooldown: '3분',
      type: 'burst'
    },
    {
      id: 217200,
      name: '가시 사격',
      icon: 'ability_hunter_barbedshot',
      description: '펫 광기 부여',
      cooldown: '충전식 2회',
      type: 'core'
    },
    {
      id: 34026,
      name: '살상 명령',
      icon: 'ability_hunter_killcommand',
      description: '주 딜링 스킬',
      cooldown: '7.5초',
      type: 'core'
    },
    {
      id: 193455,
      name: '코브라 사격',
      icon: 'ability_hunter_cobrashot',
      description: '집중 소모 필러',
      cooldown: '즉시',
      type: 'filler'
    },
    {
      id: 2643,
      name: '멀티샷',
      icon: 'ability_upgrademoonglaive',
      description: '광역 딜링',
      cooldown: '즉시',
      type: 'aoe'
    }
  ];

  // 스탯 우선순위
  const statPriority = [
    { stat: '가속', value: 100, color: '#f39c12', description: '30-40%까지 최우선' },
    { stat: '특화', value: 85, color: '#e74c3c', description: '펫 데미지 증가' },
    { stat: '치명타', value: 85, color: '#3498db', description: '안정적 DPS' },
    { stat: '유연성', value: 70, color: '#9b59b6', description: '생존력 향상' },
    { stat: '민첩', value: 65, color: '#2ecc71', description: '기본 스탯' }
  ];

  // BIS 장신구
  const trinkets = [
    { name: '불굴의 네더프리즘', dps: 100, source: '마지막 보스', tier: 'S' },
    { name: '광신자의 반지', dps: 92, source: '던전 드랍', tier: 'A' },
    { name: '정크마에스트로의 초자석', dps: 88, source: '제작', tier: 'A' }
  ];

  // 영웅특성
  const heroTalents = [
    {
      name: '무리의 지도자',
      specs: ['야수', '생존'],
      description: '펫 시너지 극대화',
      icon: 'ability_hunter_packleader',
      builds: ['레이드', '신화+']
    },
    {
      name: '어둠 순찰자',
      specs: ['야수', '사격'],
      description: '어둠 피해 특화',
      icon: 'ability_hunter_darkranger',
      builds: ['PvP', '특정 보스']
    }
  ];

  return (
    <Box sx={{ maxWidth: 1400, margin: '0 auto', padding: 3 }}>
      {/* 헤더 섹션 */}
      <GuideHeader>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              <span style={{ fontSize: 48, verticalAlign: 'middle', marginRight: 16 }}>🐾</span>
              야수 사냥꾼 가이드
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
              TWW 시즌3 (11.2 패치) - 무리의 지도자
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <TierBadge label="S티어 (M+)" tier="S" />
              <TierBadge label="A티어 (레이드)" tier="A" />
            </Box>
          </Grid>
        </Grid>
      </GuideHeader>

      {/* 빠른 요약 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">난이도</Typography>
              <Typography variant="h4">★★☆☆☆</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>초보자 추천</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">주 역할</Typography>
              <Typography variant="h4">원거리 딜러</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>100% 이동딜</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">핵심 메커니즘</Typography>
              <Typography variant="h4">펫 광기</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>3중첩 유지</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">가속 소프트캡</Typography>
              <Typography variant="h4">30-40%</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>브레이크포인트 없음</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 탭 섹션 */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth">
          <Tab label="⚡ 핵심 스킬" />
          <Tab label="📊 스탯 우선순위" />
          <Tab label="🔄 로테이션" />
          <Tab label="🔨 장비 & 소모품" />
          <Tab label="⭐ 영웅특성" />
        </Tabs>

        {/* 핵심 스킬 탭 */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            {coreSkills.map((skill) => (
              <Grid item xs={12} sm={6} md={4} key={skill.id}>
                <SkillCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={iconUrl(skill.icon)}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">{skill.name}</Typography>
                        <Chip
                          label={skill.type}
                          size="small"
                          color={skill.type === 'burst' ? 'error' : skill.type === 'core' ? 'primary' : 'default'}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {skill.description}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      재사용: {skill.cooldown}
                    </Typography>
                  </CardContent>
                </SkillCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* 스탯 우선순위 탭 */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            스탯 우선순위 (무리의 지도자)
          </Typography>
          <Box sx={{ mt: 3 }}>
            {statPriority.map((stat, index) => (
              <Box key={stat.stat} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">
                    {index + 1}. {stat.stat}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.description}
                  </Typography>
                </Box>
                <StatBar
                  variant="determinate"
                  value={stat.value}
                  sx={{
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stat.color,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" gutterBottom>
              Pawn String (TWW3)
            </Typography>
            <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
              ( Pawn: v1: "BM_Hunter_TWW3": Agility=0.65, CritRating=0.85, HasteRating=1.0, MasteryRating=0.80, Versatility=0.70 )
            </Typography>
          </Paper>
        </TabPanel>

        {/* 로테이션 탭 */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                오프닝 시퀀스
              </Typography>
              <List>
                {[
                  { step: 1, action: '야수의 격노', desc: '전투 시작' },
                  { step: 2, action: '야생의 부름', desc: '즉시' },
                  { step: 3, action: '피의 갈증', desc: '있다면' },
                  { step: 4, action: '살상 명령', desc: '첫 GCD' },
                  { step: 5, action: '가시 사격', desc: '광기 생성' },
                  { step: 6, action: '코브라 사격', desc: '집중 소모' }
                ].map((item) => (
                  <ListItem key={item.step}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32 }}>
                        {item.step}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.action}
                      secondary={item.desc}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                우선순위 시스템
              </Typography>
              <List>
                {[
                  { priority: '최우선', action: '광기 3중첩 유지', color: '#e74c3c' },
                  { priority: '높음', action: '살상 명령 쿨마다', color: '#f39c12' },
                  { priority: '중간', action: '가시 사격 (1.5초 이하)', color: '#3498db' },
                  { priority: '낮음', action: '코브라 사격 (집중 70+)', color: '#2ecc71' }
                ].map((item) => (
                  <ListItem key={item.priority}>
                    <ListItemIcon>
                      <span style={{ color: item.color, fontSize: 24 }}>🔥</span>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.action}
                      secondary={item.priority}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        {/* 장비 & 소모품 탭 */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            BIS 장신구 (TWW 시즌3)
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>순위</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>DPS 기여도</TableCell>
                  <TableCell>획득처</TableCell>
                  <TableCell>티어</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trinkets.map((trinket, index) => (
                  <TableRow key={trinket.name}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{trinket.name}</TableCell>
                    <TableCell>
                      <LinearProgress
                        variant="determinate"
                        value={trinket.dps}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </TableCell>
                    <TableCell>{trinket.source}</TableCell>
                    <TableCell>
                      <Chip label={trinket.tier} color={trinket.tier === 'S' ? 'error' : 'primary'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  강화 & 보석
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="무기" secondary="빛의 권위" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="가슴" secondary="흐르는 빛의 저장고" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="반지" secondary="저주받은 가속 x2" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="보석" secondary="치밀한 가속 보석" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  소모품
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="영약" secondary="궁극의 힘의 영약" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="음식" secondary="최고급 잔치" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="룬" secondary="드라코닉 증강의 룬" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="오일" secondary="알가리 마나 오일" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* 영웅특성 탭 */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            {heroTalents.map((talent) => (
              <Grid item xs={12} md={6} key={talent.name}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={iconUrl(talent.icon)}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h5">{talent.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {talent.specs.join(' / ')}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" paragraph>
                      {talent.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {talent.builds.map((build) => (
                        <Chip key={build} label={build} variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              특성 코드 (무리의 지도자 - 레이드)
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: 'break-all' }}>
                C0PAAAAAAAAAAAAAAAAAAAAAAYMbDMgBMbsFyYBAAAAAAzY2GmlZGMjZMzyYmZGMjZyMmxMjZGmZYgxMzAzY2WmhZDAAAAAAmB
              </Typography>
            </Paper>
          </Box>
        </TabPanel>
      </Paper>

      {/* 중요 팁 섹션 */}
      <Paper sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
        <Typography variant="h5" gutterBottom>
          💡 핵심 팁
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              • TWW3에서 가속 브레이크포인트가 제거됨
            </Typography>
            <Typography variant="body1">
              • 30-40% 가속에서 점감 시작 (약 19,800 레이팅)
            </Typography>
            <Typography variant="body1">
              • 광기 1.5초 이하에서 갱신이 최적
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              • 집중 70 이상에서 코브라 사격 사용
            </Typography>
            <Typography variant="body1">
              • 야생의 부름은 야격과 함께 사용
            </Typography>
            <Typography variant="body1">
              • 멀티샷으로 야수 칼날 활성화 유지
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BeastMasteryHunterGuide;