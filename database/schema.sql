-- 스포이음(SPOEUM) 데이터베이스 스키마
-- MySQL 8.0+ 호환

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS spoeum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE spoeum;

-- 사용자 테이블
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_image VARCHAR(500),
    user_type ENUM('tour_pro', 'caddy', 'amateur', 'sponsor', 'agency') NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_status (status)
);

-- 골프장 테이블
CREATE TABLE golf_courses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) NOT NULL,
    region VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    website VARCHAR(500),
    total_area DECIMAL(10, 2), -- 면적 (제곱미터)
    holes INT DEFAULT 18,
    course_type ENUM('회원제', '대중제') NOT NULL,
    owner VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_region (region),
    INDEX idx_city (city),
    INDEX idx_course_type (course_type)
);

-- 투어프로 프로필 테이블
CREATE TABLE tour_pro_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    association ENUM('KPGA', 'KLPGA', 'PGA', 'LPGA') NOT NULL,
    member_id VARCHAR(50),
    career_years INT DEFAULT 0,
    achievements JSON, -- JSON 배열로 수상 이력 저장
    rating DECIMAL(3, 2) DEFAULT 0.00,
    followers INT DEFAULT 0,
    location VARCHAR(100),
    bio TEXT,
    specialties JSON, -- 전문 분야 배열
    hourly_rate DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user (user_id),
    INDEX idx_association (association),
    INDEX idx_rating (rating)
);

-- 캐디 프로필 테이블
CREATE TABLE caddy_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    golf_course_id VARCHAR(36),
    experience_years INT DEFAULT 0,
    specialties JSON, -- 전문 분야 배열
    rating DECIMAL(3, 2) DEFAULT 0.00,
    cut_off_rate DECIMAL(10, 2), -- 컷오프시 금액
    cut_pass_rate DECIMAL(10, 2), -- 컷통과시 금액
    bio TEXT,
    availability JSON, -- 가용 시간 JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (golf_course_id) REFERENCES golf_courses(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user (user_id),
    INDEX idx_golf_course (golf_course_id),
    INDEX idx_rating (rating)
);

-- 아마추어 프로필 테이블
CREATE TABLE amateur_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    handicap DECIMAL(3, 1),
    experience_years INT DEFAULT 0,
    preferred_golf_course_id VARCHAR(36),
    goals JSON, -- 목표 설정 JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (preferred_golf_course_id) REFERENCES golf_courses(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user (user_id),
    INDEX idx_handicap (handicap)
);

-- 스폰서 프로필 테이블
CREATE TABLE sponsor_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    company_name VARCHAR(200),
    industry VARCHAR(100),
    budget_range JSON, -- 예산 범위 JSON
    target_audience JSON, -- 타겟 오디언스 JSON
    contact_person VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user (user_id),
    INDEX idx_company (company_name)
);

-- 대회 테이블
CREATE TABLE tournaments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) NOT NULL,
    association ENUM('KPGA', 'KLPGA', 'PGA', 'LPGA', '기타') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    location VARCHAR(200),
    golf_course_id VARCHAR(36),
    prize_money DECIMAL(15, 2),
    max_participants INT,
    registration_deadline DATE,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (golf_course_id) REFERENCES golf_courses(id) ON DELETE SET NULL,
    INDEX idx_association (association),
    INDEX idx_start_date (start_date),
    INDEX idx_status (status)
);

-- 계약 테이블
CREATE TABLE contracts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    contract_type ENUM('tournament', 'annual', 'training', 'sponsorship') NOT NULL,
    status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    
    -- 계약 당사자들
    tour_pro_id VARCHAR(36),
    caddy_id VARCHAR(36),
    amateur_id VARCHAR(36),
    sponsor_id VARCHAR(36),
    
    -- 계약 조건
    base_salary DECIMAL(12, 2) NOT NULL,
    tournament_count INT DEFAULT 0,
    
    -- 보너스 조건
    win_bonus_percentage DECIMAL(5, 2) DEFAULT 0.00,
    win_bonus_min_amount DECIMAL(10, 2) DEFAULT 0.00,
    win_bonus_max_amount DECIMAL(10, 2) DEFAULT 0.00,
    
    -- 대회 보너스
    tournament_bonus_first DECIMAL(10, 2) DEFAULT 0.00,
    tournament_bonus_second DECIMAL(10, 2) DEFAULT 0.00,
    tournament_bonus_third DECIMAL(10, 2) DEFAULT 0.00,
    tournament_bonus_top10 DECIMAL(10, 2) DEFAULT 0.00,
    tournament_bonus_participation DECIMAL(10, 2) DEFAULT 0.00,
    
    -- 경비 지원
    domestic_transportation BOOLEAN DEFAULT FALSE,
    domestic_accommodation BOOLEAN DEFAULT FALSE,
    domestic_meals BOOLEAN DEFAULT FALSE,
    jeju_transportation BOOLEAN DEFAULT FALSE,
    jeju_accommodation BOOLEAN DEFAULT FALSE,
    jeju_meals BOOLEAN DEFAULT FALSE,
    overseas_transportation BOOLEAN DEFAULT FALSE,
    overseas_accommodation BOOLEAN DEFAULT FALSE,
    overseas_meals BOOLEAN DEFAULT FALSE,
    overseas_visa BOOLEAN DEFAULT FALSE,
    
    -- 계약 조건
    duration_months INT DEFAULT 1,
    penalty_rate DECIMAL(5, 2) DEFAULT 20.00,
    termination_notice_period_days INT DEFAULT 7,
    
    -- 계약 기간
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- 메타데이터
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 외래키 제약조건
    FOREIGN KEY (tour_pro_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (caddy_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (amateur_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sponsor_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- 인덱스
    INDEX idx_contract_type (contract_type),
    INDEX idx_status (status),
    INDEX idx_tour_pro (tour_pro_id),
    INDEX idx_caddy (caddy_id),
    INDEX idx_amateur (amateur_id),
    INDEX idx_sponsor (sponsor_id),
    INDEX idx_start_date (start_date)
);

-- 스폰서십 제안 테이블
CREATE TABLE sponsorship_proposals (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    sponsor_id VARCHAR(36) NOT NULL,
    player_id VARCHAR(36) NOT NULL,
    tournament_id VARCHAR(36),
    
    -- 제안 내용
    message TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    is_tournament_based BOOLEAN DEFAULT FALSE,
    exposure_items JSON NOT NULL, -- 노출 부위 배열
    
    -- 제안 조건
    start_date DATE,
    end_date DATE,
    terms TEXT,
    
    -- 상태
    status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
    
    -- 메타데이터
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 외래키
    FOREIGN KEY (sponsor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE SET NULL,
    
    -- 인덱스
    INDEX idx_sponsor (sponsor_id),
    INDEX idx_player (player_id),
    INDEX idx_status (status),
    INDEX idx_tournament (tournament_id)
);

-- 스폰서십 계약 테이블
CREATE TABLE sponsorship_contracts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    proposal_id VARCHAR(36) NOT NULL,
    sponsor_id VARCHAR(36) NOT NULL,
    player_id VARCHAR(36) NOT NULL,
    tournament_id VARCHAR(36),
    
    -- 계약 내용
    amount DECIMAL(12, 2) NOT NULL,
    is_tournament_based BOOLEAN DEFAULT FALSE,
    exposure_items JSON NOT NULL,
    terms TEXT,
    
    -- 계약 기간
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- 상태
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    
    -- 메타데이터
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- 외래키
    FOREIGN KEY (proposal_id) REFERENCES sponsorship_proposals(id) ON DELETE CASCADE,
    FOREIGN KEY (sponsor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE SET NULL,
    
    -- 인덱스
    INDEX idx_proposal (proposal_id),
    INDEX idx_sponsor (sponsor_id),
    INDEX idx_player (player_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status)
);

-- 계약 파기 요청 테이블
CREATE TABLE contract_cancellations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    contract_id VARCHAR(36) NOT NULL,
    who_cancelled ENUM('tour_pro', 'caddy', 'amateur', 'sponsor') NOT NULL,
    reason TEXT NOT NULL,
    penalty_percent DECIMAL(5, 2) NOT NULL,
    penalty_amount DECIMAL(12, 2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    INDEX idx_contract (contract_id),
    INDEX idx_status (status)
);

-- 알림 테이블
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type ENUM('contract', 'sponsorship', 'payment', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data JSON, -- 추가 데이터
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- 결제 테이블
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    contract_id VARCHAR(36),
    sponsorship_contract_id VARCHAR(36),
    payer_id VARCHAR(36) NOT NULL,
    payee_id VARCHAR(36) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_type ENUM('contract', 'sponsorship', 'penalty', 'refund') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('card', 'bank_transfer', 'virtual_account') NOT NULL,
    transaction_id VARCHAR(200),
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (sponsorship_contract_id) REFERENCES sponsorship_contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (payee_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_contract (contract_id),
    INDEX idx_sponsorship_contract (sponsorship_contract_id),
    INDEX idx_payer (payer_id),
    INDEX idx_payee (payee_id),
    INDEX idx_status (status),
    INDEX idx_payment_type (payment_type)
);
