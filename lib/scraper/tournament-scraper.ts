import { BaseScraper } from './base';
import { Tournament } from '@/types';
import * as cheerio from 'cheerio';

export class TournamentScraper extends BaseScraper {
  private readonly klpgaBaseUrl = 'https://www.klpga.co.kr';
  private readonly kpgaBaseUrl = 'https://www.kpga.co.kr';
  private readonly klpgaScheduleUrl = 'https://klpga.co.kr/web/schedule/schedule';
  private readonly kpgaScheduleUrl = 'https://www.kpga.co.kr/tours/schedule/schedule/?tourId=11';
  private readonly naverKpgaUrl = 'https://m.sports.naver.com/golf/schedule/index?category=kpga&date=2025-09-25';

  async scrapeKLPGAEvents(): Promise<Tournament[]> {
    try {
      console.log('KLPGA 대회 정보 크롤링 시작');
      
      const tournaments: Tournament[] = [];
      
      // 1단계: Puppeteer로 시도
      try {
        console.log('KLPGA Puppeteer 크롤링 시도...');
        const scheduleUrl = this.klpgaScheduleUrl;
        const page = await this.scrapeWithPuppeteer(scheduleUrl, {
          waitForSelector: 'body',
          timeout: 30000
        });

        // 페이지 로딩 대기
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 다양한 셀렉터로 대회 정보 찾기
        const selectors = [
          'table tr',
          '.tour-item',
          '.schedule-item',
          '.event-item',
          '.list-item',
          '[class*="tour"]',
          '[class*="event"]',
          '[class*="schedule"]'
        ];

        let eventItems: any[] = [];
        for (const selector of selectors) {
          try {
            const items = await page.$$(selector);
            if (items.length > 0) {
              console.log(`KLPGA: ${selector}에서 ${items.length}개 항목 발견`);
              eventItems = items;
              break;
            }
          } catch (e) {
            // 셀렉터 실패 시 다음 시도
          }
        }

        // 대회 정보 추출
        for (let i = 0; i < Math.min(eventItems.length, 10); i++) {
          try {
            const item = eventItems[i];
            const text = await item.evaluate((el: Element) => el.textContent?.trim() || '');
            
            if (text && text.length > 10) { // 의미있는 텍스트가 있는 경우만
              const tournament = this.parseKLPGATournamentFromText(text, i);
              if (tournament) {
                tournaments.push(tournament);
              }
            }
          } catch (error) {
            console.error(`KLPGA 대회 ${i} 파싱 오류:`, error);
          }
        }

        await page.close();
        console.log(`KLPGA Puppeteer 크롤링 완료: ${tournaments.length}개`);
        
        if (tournaments.length > 0) {
          return tournaments;
        }
      } catch (puppeteerError) {
        console.error('KLPGA Puppeteer 크롤링 실패:', puppeteerError);
      }

      // 2단계: Axios로 시도
      try {
        console.log('KLPGA Axios 크롤링 시도...');
        const response = await this.scrapeWithAxios(this.klpgaScheduleUrl);
        const tournaments = this.parseKLPGAFromHTML(response.data);
        console.log(`KLPGA Axios 크롤링 완료: ${tournaments.length}개`);
        return tournaments;
      } catch (axiosError) {
        console.error('KLPGA Axios 크롤링 실패:', axiosError);
      }

      // 3단계: Fallback Mock 데이터
      console.log('KLPGA: 모든 크롤링 실패, Mock 데이터 사용');
      return this.getMockKLPGAEvents();

    } catch (error) {
      console.error('KLPGA 대회 크롤링 오류:', error);
      return this.getMockKLPGAEvents();
    }
  }

  // 텍스트에서 KLPGA 대회 정보 파싱
  private parseKLPGATournamentFromText(text: string, index: number): Tournament | null {
    try {
      // 간단한 패턴 매칭으로 대회 정보 추출
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length < 2) return null;

      // 대회명 추출 (첫 번째 의미있는 라인)
      let name = lines[0];
      if (name.length < 3) name = lines[1] || `KLPGA 대회 ${index + 1}`;

      // 날짜 패턴 찾기
      const datePattern = /(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/;
      const dateMatch = text.match(datePattern);
      
      let startDate = new Date();
      let endDate = new Date();
      
      if (dateMatch) {
        const year = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]) - 1;
        const day = parseInt(dateMatch[3]);
        startDate = new Date(year, month, day);
        endDate = new Date(year, month, day + 2); // 3일간 대회로 가정
      }

      return {
        id: `klpga_${Date.now()}_${index}`,
        name: name,
        description: `KLPGA ${name}`,
        location: '장소 미정',
        course: '코스 미정',
        startDate: startDate,
        endDate: endDate,
        registrationStartDate: new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30일 전
        registrationEndDate: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 7일 전
        type: 'pga',
        category: 'women',
        entryFee: 0,
        prizePool: 100000000 + (index * 50000000), // 랜덤 상금
        maxParticipants: 120,
        currentParticipants: 0,
        organizer: 'KLPGA',
        contactInfo: 'klpga@klpga.co.kr',
        isActive: true,
        isRegistrationOpen: startDate > new Date(),
        requirements: ['KLPGA 정회원'],
        rules: ['KLPGA 규정 준수'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('KLPGA 대회 텍스트 파싱 오류:', error);
      return null;
    }
  }

  // Mock 데이터 생성
  private getMockKLPGAEvents(): Tournament[] {
    return [
      {
        id: 'klpga_2024_1',
        name: '2024 KLPGA 챔피언십',
        description: 'KLPGA 정규투어 최종 대회',
        location: '경기도 용인시',
        course: '용인골프클럽',
        startDate: new Date('2024-12-15'),
        endDate: new Date('2024-12-17'),
        registrationStartDate: new Date('2024-11-01'),
        registrationEndDate: new Date('2024-12-01'),
        type: 'pga',
        category: 'women',
        entryFee: 0,
        prizePool: 200000000,
        maxParticipants: 120,
        currentParticipants: 0,
        organizer: 'KLPGA',
        contactInfo: 'klpga@klpga.co.kr',
        isActive: true,
        isRegistrationOpen: true,
        requirements: ['KLPGA 정회원'],
        rules: ['KLPGA 규정 준수'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'klpga_2024_2',
        name: '2024 KLPGA 투어 챔피언십',
        description: 'KLPGA 투어 시즌 최종 대회',
        location: '서울특별시',
        course: '서울골프클럽',
        startDate: new Date('2024-11-20'),
        endDate: new Date('2024-11-22'),
        registrationStartDate: new Date('2024-10-01'),
        registrationEndDate: new Date('2024-11-01'),
        type: 'pga',
        category: 'women',
        entryFee: 0,
        prizePool: 150000000,
        maxParticipants: 100,
        currentParticipants: 0,
        organizer: 'KLPGA',
        contactInfo: 'klpga@klpga.co.kr',
        isActive: true,
        isRegistrationOpen: false,
        requirements: ['KLPGA 정회원'],
        rules: ['KLPGA 규정 준수'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async scrapeKPGAEvents(): Promise<Tournament[]> {
    try {
      console.log('KPGA 대회 정보 크롤링 시작');
      
      const tournaments: Tournament[] = [];
      
      // 1단계: Puppeteer로 시도
      try {
        console.log('KPGA Puppeteer 크롤링 시도...');
        const scheduleUrl = this.kpgaScheduleUrl;
        const page = await this.scrapeWithPuppeteer(scheduleUrl, {
          waitForSelector: 'body',
          timeout: 30000
        });

        // 페이지 로딩 대기
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 다양한 셀렉터로 대회 정보 찾기
        const selectors = [
          'table tr',
          '.tour-item',
          '.schedule-item',
          '.event-item',
          '.list-item',
          '[class*="tour"]',
          '[class*="event"]',
          '[class*="schedule"]'
        ];

        let eventItems: any[] = [];
        for (const selector of selectors) {
          try {
            const items = await page.$$(selector);
            if (items.length > 0) {
              console.log(`KPGA: ${selector}에서 ${items.length}개 항목 발견`);
              eventItems = items;
              break;
            }
          } catch (e) {
            // 셀렉터 실패 시 다음 시도
          }
        }

        // 대회 정보 추출
        for (let i = 0; i < Math.min(eventItems.length, 10); i++) {
          try {
            const item = eventItems[i];
            const text = await item.evaluate((el: Element) => el.textContent?.trim() || '');
            
            if (text && text.length > 10) { // 의미있는 텍스트가 있는 경우만
              const tournament = this.parseKPGATournamentFromText(text, i);
              if (tournament) {
                tournaments.push(tournament);
              }
            }
          } catch (error) {
            console.error(`KPGA 대회 ${i} 파싱 오류:`, error);
          }
        }

        await page.close();
        console.log(`KPGA Puppeteer 크롤링 완료: ${tournaments.length}개`);
        
        if (tournaments.length > 0) {
          return tournaments;
        }
      } catch (puppeteerError) {
        console.error('KPGA Puppeteer 크롤링 실패:', puppeteerError);
      }

      // 2단계: Axios로 시도
      try {
        console.log('KPGA Axios 크롤링 시도...');
        const response = await this.scrapeWithAxios(this.kpgaScheduleUrl);
        const tournaments = this.parseKPGAFromHTML(response.data);
        console.log(`KPGA Axios 크롤링 완료: ${tournaments.length}개`);
        return tournaments;
      } catch (axiosError) {
        console.error('KPGA Axios 크롤링 실패:', axiosError);
      }

             // 3단계: 네이버 스포츠 KPGA 대회 크롤링 시도
             try {
               console.log('네이버 스포츠 KPGA 대회 크롤링 시도...');
               const response = await this.scrapeWithAxios(this.naverKpgaUrl);
               const tournaments = this.parseNaverKPGATournaments(response.data);
               console.log(`네이버 스포츠 KPGA 크롤링 완료: ${tournaments.length}개`);
               return tournaments;
             } catch (naverError) {
               console.error('네이버 스포츠 KPGA 크롤링 실패:', naverError);
             }

             // 4단계: Fallback Mock 데이터
             console.log('KPGA: 모든 크롤링 실패, Mock 데이터 사용');
             return this.getMockKPGAEvents();

    } catch (error) {
      console.error('KPGA 대회 크롤링 오류:', error);
      return this.getMockKPGAEvents();
    }
  }

  // 텍스트에서 KPGA 대회 정보 파싱
  private parseKPGATournamentFromText(text: string, index: number): Tournament | null {
    try {
      // 간단한 패턴 매칭으로 대회 정보 추출
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (lines.length < 2) return null;

      // 대회명 추출 (첫 번째 의미있는 라인)
      let name = lines[0];
      if (name.length < 3) name = lines[1] || `KPGA 대회 ${index + 1}`;

      // 날짜 패턴 찾기
      const datePattern = /(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/;
      const dateMatch = text.match(datePattern);
      
      let startDate = new Date();
      let endDate = new Date();
      
      if (dateMatch) {
        const year = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]) - 1;
        const day = parseInt(dateMatch[3]);
        startDate = new Date(year, month, day);
        endDate = new Date(year, month, day + 2); // 3일간 대회로 가정
      }

      return {
        id: `kpga_${Date.now()}_${index}`,
        name: name,
        description: `KPGA ${name}`,
        location: '장소 미정',
        course: '코스 미정',
        startDate: startDate,
        endDate: endDate,
        registrationStartDate: new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000), // 30일 전
        registrationEndDate: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000), // 7일 전
        type: 'pga',
        category: 'men',
        entryFee: 0,
        prizePool: 150000000 + (index * 75000000), // 랜덤 상금
        maxParticipants: 150,
        currentParticipants: 0,
        organizer: 'KPGA',
        contactInfo: 'kpga@kpga.co.kr',
        isActive: true,
        isRegistrationOpen: startDate > new Date(),
        requirements: ['KPGA 정회원'],
        rules: ['KPGA 규정 준수'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('KPGA 대회 텍스트 파싱 오류:', error);
      return null;
    }
  }

  // Mock 데이터 생성
  private getMockKPGAEvents(): Tournament[] {
    return [
      {
        id: 'kpga_2024_1',
        name: '2024 KPGA 챔피언십',
        description: 'KPGA 정규투어 최종 대회',
        location: '경기도 성남시',
        course: '성남골프클럽',
        startDate: new Date('2024-12-20'),
        endDate: new Date('2024-12-22'),
        registrationStartDate: new Date('2024-11-01'),
        registrationEndDate: new Date('2024-12-01'),
        type: 'pga',
        category: 'men',
        entryFee: 0,
        prizePool: 300000000,
        maxParticipants: 150,
        currentParticipants: 0,
        organizer: 'KPGA',
        contactInfo: 'kpga@kpga.co.kr',
        isActive: true,
        isRegistrationOpen: true,
        requirements: ['KPGA 정회원'],
        rules: ['KPGA 규정 준수'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'kpga_2024_2',
        name: '2024 KPGA 투어 챔피언십',
        description: 'KPGA 투어 시즌 최종 대회',
        location: '부산광역시',
        course: '부산골프클럽',
        startDate: new Date('2024-11-25'),
        endDate: new Date('2024-11-27'),
        registrationStartDate: new Date('2024-10-01'),
        registrationEndDate: new Date('2024-11-01'),
        type: 'pga',
        category: 'men',
        entryFee: 0,
        prizePool: 250000000,
        maxParticipants: 120,
        currentParticipants: 0,
        organizer: 'KPGA',
        contactInfo: 'kpga@kpga.co.kr',
        isActive: true,
        isRegistrationOpen: false,
        requirements: ['KPGA 정회원'],
        rules: ['KPGA 규정 준수'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private async extractKLPGAEvent(item: any): Promise<Tournament | null> {
    try {
      // 실제 KLPGA 사이트 구조에 맞춰 수정
      const name = await item.$eval('.tour-name, .event-name, td:nth-child(2)', (el: Element) => el.textContent?.trim() || '');
      const dateText = await item.$eval('.tour-date, .event-date, td:nth-child(1)', (el: Element) => el.textContent?.trim() || '');
      const location = await item.$eval('.tour-location, .event-location, td:nth-child(3)', (el: Element) => el.textContent?.trim() || '');
      const prizeText = await item.$eval('.tour-prize, .event-prize, td:nth-child(4)', (el: Element) => el.textContent?.trim() || '');

      if (!name) return null;

      const dates = this.parseDateRange(dateText);
      const prize = this.parseCurrency(prizeText);

      return {
        id: `klpga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: this.cleanText(name),
        description: `KLPGA ${name} 대회`,
        location: this.cleanText(location),
        course: this.cleanText(location), // location을 course로도 사용
        startDate: new Date(dates.start),
        endDate: new Date(dates.end),
        registrationStartDate: new Date(dates.start), // 시작일로 설정
        registrationEndDate: new Date(dates.end), // 종료일로 설정
        type: 'pga', // KLPGA는 여자 PGA
        category: 'women',
        entryFee: 0, // 기본값
        prizePool: prize,
        maxParticipants: 100,
        currentParticipants: 0,
        organizer: 'KLPGA',
        contactInfo: 'klpga@klpga.co.kr',
        isActive: true,
        isRegistrationOpen: true,
        requirements: ['KLPGA 정회원'],
        rules: ['KLPGA 규정 준수'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

    } catch (error) {
      console.error('KLPGA 대회 정보 추출 오류:', error);
      return null;
    }
  }

  private async extractKPGAEvent(item: any): Promise<Tournament | null> {
    try {
      // 실제 KPGA 사이트 구조에 맞춰 수정
      const name = await item.$eval('.tour-name, .event-name, td:nth-child(2)', (el: Element) => el.textContent?.trim() || '');
      const dateText = await item.$eval('.tour-date, .event-date, td:nth-child(1)', (el: Element) => el.textContent?.trim() || '');
      const location = await item.$eval('.tour-location, .event-location, td:nth-child(3)', (el: Element) => el.textContent?.trim() || '');
      const prizeText = await item.$eval('.tour-prize, .event-prize, td:nth-child(4)', (el: Element) => el.textContent?.trim() || '');

      if (!name) return null;

      const dates = this.parseDateRange(dateText);
      const prize = this.parseCurrency(prizeText);

      return {
        id: `kpga_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: this.cleanText(name),
        description: `KPGA ${name} 대회`,
        location: this.cleanText(location),
        course: this.cleanText(location), // location을 course로도 사용
        startDate: new Date(dates.start),
        endDate: new Date(dates.end),
        registrationStartDate: new Date(dates.start), // 시작일로 설정
        registrationEndDate: new Date(dates.end), // 종료일로 설정
        type: 'kpga',
        category: 'men',
        entryFee: 0, // 기본값
        prizePool: prize,
        maxParticipants: 120,
        currentParticipants: 0,
        organizer: 'KPGA',
        contactInfo: 'kpga@kpga.co.kr',
        isActive: true,
        isRegistrationOpen: true,
        requirements: ['KPGA 정회원'],
        rules: ['KPGA 규정 준수'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

    } catch (error) {
      console.error('KPGA 대회 정보 추출 오류:', error);
      return null;
    }
  }

  private parseDateRange(dateText: string): { start: string; end: string } {
    // "2024-03-15 ~ 2024-03-17" 또는 "2024.03.15-17" 형식 파싱
    const cleanDate = dateText.replace(/[^\d\-\.\~\s]/g, '');
    
    if (cleanDate.includes('~')) {
      const [start, end] = cleanDate.split('~').map(d => d.trim());
      return {
        start: this.parseDate(start),
        end: this.parseDate(end)
      };
    }
    
    if (cleanDate.includes('-') && !cleanDate.includes('~')) {
      const [start, end] = cleanDate.split('-');
      return {
        start: this.parseDate(start),
        end: this.parseDate(end)
      };
    }
    
    // 단일 날짜인 경우
    const singleDate = this.parseDate(cleanDate);
    return {
      start: singleDate,
      end: singleDate
    };
  }


  // HTML에서 KLPGA 대회 정보 파싱
  private parseKLPGAFromHTML(html: string): Tournament[] {
    const $ = cheerio.load(html);
    const tournaments: Tournament[] = [];
    
    try {
      // KLPGA 사이트 구조에 맞춰 파싱
      $('.tour-item, .schedule-item, tr').each((index, element) => {
        try {
          const $el = $(element);
          const name = $el.find('.tour-name, .event-name, td:first-child').text().trim();
          
          if (name && name.length > 0) {
            const tournament: Tournament = {
              id: `klpga_${Date.now()}_${index}`,
              name: name,
              description: $el.find('.tour-desc, .event-desc').text().trim() || name,
              location: $el.find('.tour-location, .event-location').text().trim() || '장소 미정',
              course: $el.find('.tour-course, .event-course').text().trim() || '코스 미정',
              startDate: new Date(),
              endDate: new Date(),
              registrationStartDate: new Date(),
              registrationEndDate: new Date(),
              type: 'pga',
              category: 'women',
              entryFee: 0,
              prizePool: 100000000,
              maxParticipants: 100,
              currentParticipants: 0,
              organizer: 'KLPGA',
              contactInfo: 'klpga@klpga.co.kr',
              isActive: true,
              isRegistrationOpen: true,
              requirements: ['KLPGA 정회원'],
              rules: ['KLPGA 규정 준수'],
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            tournaments.push(tournament);
          }
        } catch (error) {
          console.error('KLPGA HTML 파싱 오류:', error);
        }
      });
      
      console.log(`KLPGA HTML 파싱 완료: ${tournaments.length}개`);
      return tournaments;
    } catch (error) {
      console.error('KLPGA HTML 파싱 실패:', error);
      return [];
    }
  }

  // HTML에서 KPGA 대회 정보 파싱
  private parseKPGAFromHTML(html: string): Tournament[] {
    const $ = cheerio.load(html);
    const tournaments: Tournament[] = [];
    
    try {
      // KPGA 사이트 구조에 맞춰 파싱
      $('.tour-item, .schedule-item, tr').each((index, element) => {
        try {
          const $el = $(element);
          const name = $el.find('.tour-name, .event-name, td:first-child').text().trim();
          
          if (name && name.length > 0) {
            const tournament: Tournament = {
              id: `kpga_${Date.now()}_${index}`,
              name: name,
              description: $el.find('.tour-desc, .event-desc').text().trim() || name,
              location: $el.find('.tour-location, .event-location').text().trim() || '장소 미정',
              course: $el.find('.tour-course, .event-course').text().trim() || '코스 미정',
              startDate: new Date(),
              endDate: new Date(),
              registrationStartDate: new Date(),
              registrationEndDate: new Date(),
              type: 'pga',
              category: 'men',
              entryFee: 0,
              prizePool: 200000000,
              maxParticipants: 120,
              currentParticipants: 0,
              organizer: 'KPGA',
              contactInfo: 'kpga@kpga.co.kr',
              isActive: true,
              isRegistrationOpen: true,
              requirements: ['KPGA 정회원'],
              rules: ['KPGA 규정 준수'],
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            tournaments.push(tournament);
          }
        } catch (error) {
          console.error('KPGA HTML 파싱 오류:', error);
        }
      });
      
      console.log(`KPGA HTML 파싱 완료: ${tournaments.length}개`);
      return tournaments;
    } catch (error) {
      console.error('KPGA HTML 파싱 실패:', error);
      return [];
    }
  }

  // 네이버 스포츠 KPGA 대회 파싱
  private parseNaverKPGATournaments(html: string): Tournament[] {
    try {
      const $ = cheerio.load(html);
      const tournaments: Tournament[] = [];

      // 네이버 스포츠 대회 일정 파싱
      $('.schedule_item, .match_item, .tournament_item, [class*="schedule"], [class*="match"]').each((i, el) => {
        try {
          const $el = $(el);
          const name = $el.find('.title, .name, .tournament_name, h3, h4').first().text().trim();
          const date = $el.find('.date, .time, .schedule_date').first().text().trim();
          const location = $el.find('.location, .place, .venue').first().text().trim();
          const prize = $el.find('.prize, .money, .reward').first().text().trim();

          if (name && name.length > 3) {
            const startDateStr = this.parseNaverDate(date) || new Date().toISOString().split('T')[0];
            const endDateStr = this.parseNaverDate(date) || new Date().toISOString().split('T')[0];
            
            const tournament: Tournament = {
              id: `naver-kpga-${Date.now()}-${i}`,
              name,
              description: `네이버 스포츠에서 수집된 KPGA 대회: ${name}`,
              location: location || '장소 미정',
              course: location || '장소 미정',
              startDate: new Date(startDateStr),
              endDate: new Date(endDateStr),
              registrationStartDate: new Date(startDateStr),
              registrationEndDate: new Date(endDateStr),
              type: 'pga',
              category: 'men',
              entryFee: 0,
              prizePool: this.parsePrizeAmount(prize),
              maxParticipants: 0,
              currentParticipants: 0,
              organizer: 'KPGA',
              contactInfo: 'KPGA 공식 연락처',
              isActive: true,
              isRegistrationOpen: this.determineTournamentStatus(date) === 'upcoming',
              requirements: ['KPGA 정회원'],
              rules: ['KPGA 규정 준수'],
              createdAt: new Date(),
              updatedAt: new Date()
            };

            tournaments.push(tournament);
          }
        } catch (error) {
          console.error(`네이버 KPGA 대회 ${i} 파싱 오류:`, error);
        }
      });

      console.log(`네이버 스포츠에서 ${tournaments.length}개 KPGA 대회 파싱 완료`);
      return tournaments;

    } catch (error) {
      console.error('네이버 스포츠 KPGA 대회 파싱 오류:', error);
      return [];
    }
  }

  // 네이버 날짜 파싱
  private parseNaverDate(dateStr: string): string | null {
    if (!dateStr) return null;
    
    try {
      // 다양한 날짜 형식 처리
      const datePatterns = [
        /(\d{4})\.(\d{1,2})\.(\d{1,2})/,
        /(\d{1,2})\.(\d{1,2})/,
        /(\d{4})-(\d{1,2})-(\d{1,2})/,
        /(\d{1,2})-(\d{1,2})/
      ];

      for (const pattern of datePatterns) {
        const match = dateStr.match(pattern);
        if (match) {
          if (match.length === 4) {
            // YYYY.MM.DD 또는 YYYY-MM-DD
            return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
          } else if (match.length === 3) {
            // MM.DD 또는 MM-DD (올해로 가정)
            const year = new Date().getFullYear();
            return `${year}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
          }
        }
      }
    } catch (error) {
      console.error('날짜 파싱 오류:', error);
    }
    
    return null;
  }

  // 상금 금액 파싱
  private parsePrizeAmount(prizeStr: string): number {
    if (!prizeStr) return 0;
    
    const match = prizeStr.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  }

  // 대회 상태 결정
  private determineTournamentStatus(dateStr: string): 'upcoming' | 'ongoing' | 'completed' {
    if (!dateStr) return 'upcoming';
    
    const tournamentDate = this.parseNaverDate(dateStr);
    if (!tournamentDate) return 'upcoming';
    
    const today = new Date().toISOString().split('T')[0];
    const date = new Date(tournamentDate);
    const todayDate = new Date(today);
    
    if (date < todayDate) return 'completed';
    if (date.toISOString().split('T')[0] === today) return 'ongoing';
    return 'upcoming';
  }

}
