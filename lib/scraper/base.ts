import puppeteer, { Browser, Page } from 'puppeteer';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PlayerInfo, GolfAssociation } from '@/types';

export interface ScrapingOptions {
  timeout?: number;
  waitForSelector?: string;
  userAgent?: string;
}

export class BaseScraper {
  protected browser: Browser | null = null;
  protected defaultOptions: ScrapingOptions = {
    timeout: 30000,
    waitForSelector: '.player-info',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  async initBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
    }
    return this.browser;
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapeWithAxios(url: string): Promise<cheerio.CheerioAPI> {
    try {
      const response = await axios.get(url, {
        timeout: this.defaultOptions.timeout,
        headers: {
          'User-Agent': this.defaultOptions.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      return cheerio.load(response.data);
    } catch (error) {
      console.error('Axios scraping error:', error);
      throw new Error(`Failed to scrape with axios: ${error}`);
    }
  }

  async scrapeWithPuppeteer(url: string, options?: ScrapingOptions): Promise<Page> {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      
      await page.setUserAgent(options?.userAgent || this.defaultOptions.userAgent || '');
      await page.setViewport({ width: 1920, height: 1080 });
      
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: options?.timeout || this.defaultOptions.timeout 
      });

      if (options?.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, { timeout: 10000 });
      }

      return page;
    } catch (error) {
      console.error('Puppeteer scraping error:', error);
      throw new Error(`Failed to scrape with puppeteer: ${error}`);
    }
  }

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected parseDate(dateStr: string): string {
    // 다양한 날짜 형식을 파싱
    const cleanDate = dateStr.replace(/[^\d-]/g, '');
    
    if (cleanDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return cleanDate;
    }
    
    if (cleanDate.match(/^\d{4}\d{2}\d{2}$/)) {
      return cleanDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    }
    
    if (cleanDate.match(/^\d{4}\.\d{2}\.\d{2}$/)) {
      return cleanDate.replace(/\./g, '-');
    }
    
    return dateStr;
  }

  protected parseNumber(text: string): number {
    return parseInt(text.replace(/[^\d]/g, '')) || 0;
  }

  protected parseCurrency(text: string): number {
    // "1,234만원" -> 12340000
    const cleanText = text.replace(/[^\d,.]/g, '');
    const number = parseFloat(cleanText.replace(/,/g, ''));
    
    if (text.includes('억')) {
      return number * 100000000;
    }
    if (text.includes('만')) {
      return number * 10000;
    }
    if (text.includes('천')) {
      return number * 1000;
    }
    
    return number;
  }

  protected cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }
}
