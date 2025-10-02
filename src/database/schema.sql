-- WoW Meta Site Database Schema
-- 전투 기록 분석 데이터베이스 스키마

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    battle_tag VARCHAR(50) UNIQUE NOT NULL,
    region VARCHAR(10) NOT NULL, -- KR, US, EU, CN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_battle_tag (battle_tag)
);

-- 캐릭터 테이블
CREATE TABLE IF NOT EXISTS characters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(50) NOT NULL,
    realm VARCHAR(50) NOT NULL,
    region VARCHAR(10) NOT NULL,
    class VARCHAR(20) NOT NULL, -- warrior, paladin, hunter, etc
    spec VARCHAR(20) NOT NULL, -- protection, arms, fury, etc
    level INT NOT NULL,
    item_level INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_character (name, realm, region),
    INDEX idx_user_characters (user_id),
    INDEX idx_class_spec (class, spec)
);

-- 전투 기록 테이블
CREATE TABLE IF NOT EXISTS combat_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_code VARCHAR(20) UNIQUE NOT NULL, -- WarcraftLogs code
    character_id INT,
    encounter_name VARCHAR(100) NOT NULL,
    raid_name VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- LFR, Normal, Heroic, Mythic
    fight_duration INT NOT NULL, -- in seconds
    kill_or_wipe BOOLEAN NOT NULL, -- true for kill, false for wipe
    recorded_at TIMESTAMP NOT NULL,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_character_logs (character_id),
    INDEX idx_encounter (encounter_name),
    INDEX idx_recorded_date (recorded_at)
);

-- 성능 메트릭 테이블
CREATE TABLE IF NOT EXISTS performance_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_id INT NOT NULL,
    character_id INT NOT NULL,
    dps DECIMAL(10, 2), -- 초당 피해량
    hps DECIMAL(10, 2), -- 초당 치유량
    dtps DECIMAL(10, 2), -- 초당 받은 피해량 (탱커용)
    damage_done BIGINT,
    healing_done BIGINT,
    damage_taken BIGINT,
    deaths INT DEFAULT 0,
    interrupts INT DEFAULT 0,
    dispels INT DEFAULT 0,
    parse_percentage INT, -- 0-100 percentile
    ilvl_parse_percentage INT, -- 아이템 레벨 기준 percentile
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES combat_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_log_metrics (log_id),
    INDEX idx_character_performance (character_id),
    INDEX idx_parse_rankings (parse_percentage)
);

-- 스킬 사용 통계 테이블
CREATE TABLE IF NOT EXISTS ability_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_id INT NOT NULL,
    character_id INT NOT NULL,
    ability_name VARCHAR(100) NOT NULL,
    ability_id INT NOT NULL,
    total_casts INT NOT NULL,
    total_damage BIGINT,
    total_healing BIGINT,
    avg_damage DECIMAL(10, 2),
    avg_healing DECIMAL(10, 2),
    cpm DECIMAL(5, 2), -- casts per minute
    uptime_percentage DECIMAL(5, 2), -- for buffs/debuffs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES combat_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_log_abilities (log_id),
    INDEX idx_character_abilities (character_id, ability_name)
);

-- 재사용 대기시간 사용 테이블
CREATE TABLE IF NOT EXISTS cooldown_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_id INT NOT NULL,
    character_id INT NOT NULL,
    cooldown_name VARCHAR(100) NOT NULL,
    cooldown_id INT NOT NULL,
    total_uses INT NOT NULL,
    expected_uses INT NOT NULL, -- based on fight duration
    efficiency_percentage DECIMAL(5, 2), -- (total_uses / expected_uses) * 100
    avg_delay DECIMAL(5, 2), -- average delay in seconds after cooldown available
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES combat_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_log_cooldowns (log_id),
    INDEX idx_character_cooldowns (character_id)
);

-- 개선 제안사항 테이블
CREATE TABLE IF NOT EXISTS improvement_suggestions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_id INT NOT NULL,
    character_id INT NOT NULL,
    category VARCHAR(50) NOT NULL, -- rotation, cooldowns, positioning, etc
    severity VARCHAR(20) NOT NULL, -- minor, major, critical
    suggestion_text TEXT NOT NULL,
    suggestion_text_kr TEXT NOT NULL, -- 한국어 번역
    impact_score INT, -- 1-10, how much this affects performance
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES combat_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    INDEX idx_log_suggestions (log_id),
    INDEX idx_character_suggestions (character_id),
    INDEX idx_severity (severity)
);

-- 클래스별 가이드 테이블
CREATE TABLE IF NOT EXISTS class_guides (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class VARCHAR(20) NOT NULL,
    spec VARCHAR(20) NOT NULL,
    patch_version VARCHAR(10) NOT NULL,
    rotation_priority TEXT NOT NULL,
    rotation_priority_kr TEXT NOT NULL,
    stat_priority VARCHAR(200) NOT NULL,
    stat_priority_kr VARCHAR(200) NOT NULL,
    talent_builds TEXT,
    talent_builds_kr TEXT,
    tips_and_tricks TEXT,
    tips_and_tricks_kr TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_guide (class, spec, patch_version),
    INDEX idx_class_spec_guide (class, spec)
);

-- 순위표 (티어 리스트) 테이블
CREATE TABLE IF NOT EXISTS tier_rankings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class VARCHAR(20) NOT NULL,
    spec VARCHAR(20) NOT NULL,
    content_type VARCHAR(20) NOT NULL, -- raid, m_plus, pvp
    tier_rank VARCHAR(2) NOT NULL, -- S, A, B, C, D
    score DECIMAL(5, 2),
    sample_size INT, -- number of logs analyzed
    patch_version VARCHAR(10) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_ranking (class, spec, content_type, patch_version),
    INDEX idx_content_rankings (content_type, tier_rank)
);

-- 분석 캐시 테이블 (빠른 로딩을 위한)
CREATE TABLE IF NOT EXISTS analysis_cache (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_code VARCHAR(20) UNIQUE NOT NULL,
    analysis_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_log_code (log_code),
    INDEX idx_expiry (expires_at)
);

-- 뷰: 최근 분석 기록
CREATE VIEW recent_analyses AS
SELECT
    cl.log_code,
    c.name AS character_name,
    c.realm,
    c.class,
    c.spec,
    cl.encounter_name,
    cl.difficulty,
    pm.dps,
    pm.hps,
    pm.parse_percentage,
    cl.recorded_at
FROM combat_logs cl
JOIN characters c ON cl.character_id = c.id
LEFT JOIN performance_metrics pm ON cl.id = pm.log_id
WHERE cl.recorded_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY cl.recorded_at DESC;

-- 뷰: 클래스별 평균 성능
CREATE VIEW class_performance_avg AS
SELECT
    c.class,
    c.spec,
    cl.difficulty,
    AVG(pm.dps) AS avg_dps,
    AVG(pm.hps) AS avg_hps,
    AVG(pm.parse_percentage) AS avg_parse,
    COUNT(DISTINCT cl.id) AS total_logs
FROM characters c
JOIN combat_logs cl ON c.id = cl.character_id
JOIN performance_metrics pm ON cl.id = pm.log_id
WHERE cl.recorded_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY c.class, c.spec, cl.difficulty;