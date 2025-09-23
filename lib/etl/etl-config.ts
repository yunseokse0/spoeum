import { ETLConfig } from './etl-controller';

// 전문 ETL 설정
export const PROFESSIONAL_ETL_CONFIG: ETLConfig = {
  sources: {
    // KLPGA 선수 데이터 소스
    players: [
      {
        name: 'KLPGA 공식 사이트',
        url: 'https://klpga.co.kr/web/player/search',
        type: 'dynamic',
        selectors: {
          container: '.player-list-item, .player-item, [class*="player"]',
          fields: {
            memberId: '.member-id, .player-id, [class*="id"]',
            name: '.player-name, .name, h3, h4',
            association: '.association, .tour, [class*="tour"]',
            birth: '.birth-date, .birth, .date-of-birth',
            currentRanking: '.current-ranking, .ranking, .rank',
            totalPrize: '.total-prize, .prize-money, .earnings'
          }
        },
        pagination: {
          nextButton: '.pagination .next, .page-next, [class*="next"]',
          maxPages: 50
        },
        delay: 3000
      },
      {
        name: '네이버 스포츠 KLPGA',
        url: 'https://sports.naver.com/golf/player/ranking?category=klpga',
        type: 'static',
        selectors: {
          container: '.ranking_table tbody tr, .player_list .player_item',
          fields: {
            name: '.player_name, .name, td:nth-child(2)',
            currentRanking: '.ranking, .rank, td:nth-child(1)',
            totalPrize: '.prize, .money, td:nth-child(3)',
            association: 'KLPGA'
          }
        },
        delay: 2000
      }
    ],

    // KPGA 선수 데이터 소스 (고급 동적 로딩)
    kpga_players: [
      {
        name: 'KPGA 선수 목록 (고급)',
        url: 'https://kpga.co.kr/player/list',
        type: 'dynamic',
        selectors: {
          container: '.player_list li, .player_item, [class*="player"] li',
          fields: {
            name: '.name, .player_name, h3, h4, [class*="name"]',
            memberId: '[class*="id"], .member_id, .player_id',
            association: 'KPGA',
            birth: '.birth, .birth_date, [class*="birth"]',
            currentRanking: '.rank, .ranking, [class*="rank"]',
            totalPrize: '.prize, .money, [class*="prize"]'
          }
        },
        pagination: {
          nextButton: '.pagination .next, .page-next, [class*="next"]',
          maxPages: 50
        },
        delay: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      },
      {
        name: 'KPGA 공식 사이트 (기존)',
        url: 'https://www.kpga.co.kr/search/playerList/?orderType=memberId&sort=0&page=1&searchYn=N',
        type: 'dynamic',
        selectors: {
          container: '.player-list-item, .player-item, [class*="player"]',
          fields: {
            memberId: '.member-id, .player-id, [class*="id"]',
            name: '.player-name, .name, h3, h4',
            association: '.association, .tour, [class*="tour"]',
            birth: '.birth-date, .birth, .date-of-birth',
            currentRanking: '.current-ranking, .ranking, .rank',
            totalPrize: '.total-prize, .prize-money, .earnings'
          }
        },
        pagination: {
          nextButton: '.pagination .next, .page-next, [class*="next"]',
          maxPages: 30
        },
        delay: 3000
      },
      {
        name: '네이버 스포츠 KPGA',
        url: 'https://sports.naver.com/golf/player/ranking?category=kpga',
        type: 'static',
        selectors: {
          container: '.ranking_table tbody tr, .player_list .player_item',
          fields: {
            name: '.player_name, .name, td:nth-child(2)',
            currentRanking: '.ranking, .rank, td:nth-child(1)',
            totalPrize: '.prize, .money, td:nth-child(3)',
            association: 'KPGA'
          }
        },
        delay: 2000
      }
    ],

    // 골프장 데이터 소스
    golfCourses: [
      {
        name: '프렌즈 스크린',
        url: 'https://www.friendsscreen.kr/main/course',
        type: 'dynamic',
        selectors: {
          container: '.course-item, .golf-course-card, [class*="course"]',
          fields: {
            name: '.course-name, .golf-course-name, h3, h4, .title',
            region: '.course-region, .location, .area, .region',
            address: '.course-address, .address, .location-detail',
            phone: '.course-phone, .phone, .contact, .tel',
            holes: '.holes, .hole-count, [class*="hole"]',
            par: '.par, .par-count, [class*="par"]',
            greenFee: '.green-fee, .fee, .price, [class*="fee"]'
          }
        },
        delay: 5000
      },
      {
        name: '골프존 메인',
        url: 'https://www.golfzon.com/course/main',
        type: 'dynamic',
        selectors: {
          container: '.course-item, .golf-course-item, [class*="course"]',
          fields: {
            name: '.course-name, .golf-course-name, h3, h4, .title',
            region: '.course-region, .location, .area, .region',
            address: '.course-address, .address, .location-detail',
            phone: '.course-phone, .phone, .contact, .tel',
            holes: '.holes, .hole-count, [class*="hole"]',
            par: '.par, .par-count, [class*="par"]',
            greenFee: '.green-fee, .fee, .price, [class*="fee"]'
          }
        },
        delay: 3000
      },
      {
        name: '골프존 검색',
        url: 'https://www.golfzon.com/course/search',
        type: 'dynamic',
        selectors: {
          container: '.course-list-item, .course-item, [class*="course"]',
          fields: {
            name: '.course-title, .course-name, h3, h4, .title',
            region: '.course-location, .location, .region',
            address: '.course-address, .address, .addr',
            phone: '.course-phone, .phone, .contact, .tel',
            holes: '.holes, .hole-count, [class*="hole"]',
            par: '.par, .par-count, [class*="par"]',
            greenFee: '.green-fee, .fee, .price, [class*="fee"]'
          }
        },
        pagination: {
          nextButton: '.pagination .next, .page-next, [class*="next"]',
          maxPages: 20
        },
        delay: 3000
      }
    ],

    // 대회 데이터 소스
    tournaments: [
      {
        name: 'KLPGA 공식 대회',
        url: 'https://klpga.co.kr/web/schedule/schedule',
        type: 'dynamic',
        selectors: {
          container: '.schedule-item, .tournament-item, [class*="schedule"]',
          fields: {
            name: '.tournament-name, .schedule-title, h3, h4, .title',
            type: '.tournament-type, .schedule-type, [class*="type"]',
            startDate: '.start-date, .schedule-date, .date',
            endDate: '.end-date, .schedule-end-date, .end-date',
            location: '.location, .venue, .place, [class*="location"]',
            prize: '.prize, .prize-money, .money, [class*="prize"]',
            status: '.status, .state, [class*="status"]',
            organizer: '.organizer, .host, [class*="organizer"]'
          }
        },
        delay: 3000
      },
      {
        name: 'KPGA 공식 대회',
        url: 'https://www.kpga.co.kr/tours/schedule/schedule/?tourId=11',
        type: 'dynamic',
        selectors: {
          container: '.schedule-item, .tournament-item, [class*="schedule"]',
          fields: {
            name: '.tournament-name, .schedule-title, h3, h4, .title',
            type: '.tournament-type, .schedule-type, [class*="type"]',
            startDate: '.start-date, .schedule-date, .date',
            endDate: '.end-date, .schedule-end-date, .end-date',
            location: '.location, .venue, .place, [class*="location"]',
            prize: '.prize, .prize-money, .money, [class*="prize"]',
            status: '.status, .state, [class*="status"]',
            organizer: '.organizer, .host, [class*="organizer"]'
          }
        },
        delay: 3000
      },
      {
        name: '네이버 스포츠 골프 대회',
        url: 'https://m.sports.naver.com/golf/schedule/index?category=kpga&date=2025-09-25',
        type: 'static',
        selectors: {
          container: '.schedule_list .item, .tournament-item, [class*="schedule"]',
          fields: {
            name: '.tournament-name, .schedule-title, h3, h4, .title',
            type: '.tournament-type, .schedule-type, [class*="type"]',
            startDate: '.start-date, .schedule-date, .date',
            endDate: '.end-date, .schedule-end-date, .end-date',
            location: '.location, .venue, .place, [class*="location"]',
            prize: '.prize, .prize-money, .money, [class*="prize"]',
            status: '.status, .state, [class*="status"]',
            organizer: '.organizer, .host, [class*="organizer"]'
          }
        },
        delay: 2000
      }
    ]
  },

  validation: {
    enabled: true,
    strictMode: false
  },

  export: {
    format: 'both',
    outputDir: 'data/exports',
    includeMetadata: true,
    encoding: 'utf-8'
  },

  quality: {
    minCompleteness: 70,
    removeDuplicates: true
  }
};

// 간소화된 ETL 설정 (테스트용)
export const SIMPLE_ETL_CONFIG: ETLConfig = {
  sources: {
    players: [
      {
        name: 'KLPGA 간단 테스트',
        url: 'https://klpga.co.kr/web/player/search',
        type: 'dynamic',
        selectors: {
          container: '.player-list-item, .player-item',
          fields: {
            name: '.player-name, .name',
            association: 'KLPGA',
            memberId: '.member-id, .player-id'
          }
        },
        delay: 2000
      }
    ],
    golfCourses: [
      {
        name: '프렌즈 스크린 간단 테스트',
        url: 'https://www.friendsscreen.kr/main/course',
        type: 'dynamic',
        selectors: {
          container: '.course-item, .golf-course-card',
          fields: {
            name: '.course-name, .golf-course-name, h3, h4',
            region: '.course-region, .location',
            address: '.course-address, .address'
          }
        },
        delay: 3000
      }
    ],
    tournaments: [
      {
        name: 'KLPGA 대회 간단 테스트',
        url: 'https://klpga.co.kr/web/schedule/schedule',
        type: 'dynamic',
        selectors: {
          container: '.schedule-item, .tournament-item',
          fields: {
            name: '.tournament-name, .schedule-title, h3, h4',
            type: '.tournament-type, .schedule-type',
            startDate: '.start-date, .schedule-date'
          }
        },
        delay: 2000
      }
    ]
  },

  validation: {
    enabled: true,
    strictMode: false
  },

  export: {
    format: 'json',
    outputDir: 'data/exports',
    includeMetadata: true
  },

  quality: {
    minCompleteness: 50,
    removeDuplicates: true
  }
};
