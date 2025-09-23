import { BaseScraper } from './base';
import { Tournament } from '@/types';
import * as cheerio from 'cheerio';

export class TournamentScraper extends BaseScraper {
  private readonly klpgaBaseUrl = 'https://www.klpga.co.kr';
  private readonly kpgaBaseUrl = 'https://www.kpga.co.kr';

  async scrapeKLPGAEvents(): Promise<Tournament[]> {
    try {
      console.log('KLPGA 대회 정보 크롤링 시작');
      
      const tournaments: Tournament[] = [];
      
      // 먼저 Puppeteer로 시도
      try {
        const scheduleUrl = `${this.klpgaBaseUrl}/web/tour/schedule.asp`;
        const page = await this.scrapeWithPuppeteer(scheduleUrl, {
          waitForSelector: 'body'
        });

        // 대회 목록 추출 (실제 KLPGA 사이트 구조에 맞춰 수정)
        const eventItems = await page.$$('.tour-item, .schedule-item, tr');
        
        for (const item of eventItems) {
          try {
            const tournament = await this.extractKLPGAEvent(item);
            if (tournament) {
              tournaments.push(tournament);
            }
          } catch (error) {
            console.error('KLPGA 대회 정보 추출 오류:', error);
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

      // Puppeteer 실패 시 Axios로 시도
      try {
        console.log('KLPGA Axios 크롤링 시도...');
        const response = await this.scrapeWithAxios(`${this.klpgaBaseUrl}/web/tour/schedule.asp`);
        const tournaments = this.parseKLPGAFromHTML(response.data);
        console.log(`KLPGA Axios 크롤링 완료: ${tournaments.length}개`);
        return tournaments;
      } catch (axiosError) {
        console.error('KLPGA Axios 크롤링 실패:', axiosError);
      }

      // 모든 크롤링 방법 실패 시 에러 발생
      throw new Error('KLPGA 크롤링 실패: Puppeteer와 Axios 모두 실패');

    } catch (error) {
      console.error('KLPGA 대회 크롤링 오류:', error);
      console.error('KLPGA 크롤링 실패 상세:', error instanceof Error ? error.message : '알 수 없는 오류');
      throw error; // Mock 데이터 반환 대신 에러를 다시 던짐
    }
  }

  async scrapeKPGAEvents(): Promise<Tournament[]> {
    try {
      console.log('KPGA 대회 정보 크롤링 시작');
      
      const tournaments: Tournament[] = [];
      
      // 먼저 Puppeteer로 시도
      try {
        const scheduleUrl = `${this.kpgaBaseUrl}/tour/schedule.asp`;
        const page = await this.scrapeWithPuppeteer(scheduleUrl, {
          waitForSelector: 'body'
        });

        // 대회 목록 추출 (실제 KPGA 사이트 구조에 맞춰 수정)
        const eventItems = await page.$$('.tour-item, .schedule-item, tr');
        
        for (const item of eventItems) {
          try {
            const tournament = await this.extractKPGAEvent(item);
            if (tournament) {
              tournaments.push(tournament);
            }
          } catch (error) {
            console.error('KPGA 대회 정보 추출 오류:', error);
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

      // Puppeteer 실패 시 Axios로 시도
      try {
        console.log('KPGA Axios 크롤링 시도...');
        const response = await this.scrapeWithAxios(`${this.kpgaBaseUrl}/tour/schedule.asp`);
        const tournaments = this.parseKPGAFromHTML(response.data);
        console.log(`KPGA Axios 크롤링 완료: ${tournaments.length}개`);
        return tournaments;
      } catch (axiosError) {
        console.error('KPGA Axios 크롤링 실패:', axiosError);
      }

      // 모든 크롤링 방법 실패 시 에러 발생
      throw new Error('KPGA 크롤링 실패: Puppeteer와 Axios 모두 실패');

    } catch (error) {
      console.error('KPGA 대회 크롤링 오류:', error);
      console.error('KPGA 크롤링 실패 상세:', error instanceof Error ? error.message : '알 수 없는 오류');
      throw error; // Mock 데이터 반환 대신 에러를 다시 던짐
    }
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

  // Mock 데이터 반환 (크롤링 실패 시)
  private getMockKLPGAEvents(): Tournament[] {
    return [
      {
        id: 'klpga_2024_01',
        name: 'KLPGA 투어 개막전',
        description: '2024 KLPGA 투어 개막전',
        location: '제주 블루원 골프클럽',
        course: '제주 블루원 골프클럽',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-17'),
        registrationStartDate: new Date('2024-03-01'),
        registrationEndDate: new Date('2024-03-10'),
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
      },
      {
        id: 'klpga_2024_02',
        name: '한국 여자 오픈',
        description: '한국 여자 오픈 챔피언십',
        location: '서울 골프클럽',
        course: '서울 골프클럽',
        startDate: new Date('2024-04-20'),
        endDate: new Date('2024-04-22'),
        registrationStartDate: new Date('2024-04-01'),
        registrationEndDate: new Date('2024-04-15'),
        type: 'pga',
        category: 'women',
        entryFee: 0,
        prizePool: 150000000,
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
      }
    ];
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
              type: 'kpga',
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

  private getMockKPGAEvents(): Tournament[] {
    return [
      {
        id: 'kpga_2024_01',
        name: 'KPGA 투어 개막전',
        description: '2024 KPGA 투어 개막전',
        location: '용평 골프클럽',
        course: '용평 골프클럽',
        startDate: new Date('2024-03-10'),
        endDate: new Date('2024-03-12'),
        registrationStartDate: new Date('2024-02-25'),
        registrationEndDate: new Date('2024-03-05'),
        type: 'kpga',
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
      },
      {
        id: 'kpga_2024_02',
        name: '한국 오픈',
        description: '한국 오픈 챔피언십',
        location: '부산 컨트리클럽',
        course: '부산 컨트리클럽',
        startDate: new Date('2024-04-25'),
        endDate: new Date('2024-04-28'),
        registrationStartDate: new Date('2024-04-01'),
        registrationEndDate: new Date('2024-04-20'),
        type: 'kpga',
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
      }
    ];
  }
}
