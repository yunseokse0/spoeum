import fs from 'fs';
import path from 'path';

export interface StoredData {
  tournaments: any;
  golfCourses: any;
  players: any;
  lastUpdated: string;
  version: number;
}

export class DataStorage {
  private dataDir = path.join(process.cwd(), 'data');
  private dataFile = path.join(this.dataDir, 'scraped-data.json');

  constructor() {
    // 데이터 디렉토리 생성
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  // 데이터 저장
  async saveData(data: Partial<StoredData>): Promise<void> {
    try {
      const existingData = await this.loadData();
      const newData: StoredData = {
        tournaments: data.tournaments || existingData?.tournaments || null,
        golfCourses: data.golfCourses || existingData?.golfCourses || null,
        players: data.players || existingData?.players || null,
        lastUpdated: new Date().toISOString(),
        version: (existingData?.version || 0) + 1
      };

      fs.writeFileSync(this.dataFile, JSON.stringify(newData, null, 2));
      console.log('데이터 저장 완료:', newData.lastUpdated);
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      throw error;
    }
  }

  // 데이터 로드
  async loadData(): Promise<StoredData | null> {
    try {
      if (!fs.existsSync(this.dataFile)) {
        return null;
      }

      const data = fs.readFileSync(this.dataFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      return null;
    }
  }

  // 특정 데이터 타입만 로드
  async loadDataType(type: 'tournaments' | 'golfCourses' | 'players'): Promise<any> {
    const data = await this.loadData();
    return data?.[type] || null;
  }

  // 데이터 존재 여부 확인
  async hasData(): Promise<boolean> {
    const data = await this.loadData();
    return data !== null && (
      data.tournaments !== null ||
      data.golfCourses !== null ||
      data.players !== null
    );
  }

  // 마지막 업데이트 시간 확인
  async getLastUpdated(): Promise<string | null> {
    const data = await this.loadData();
    return data?.lastUpdated || null;
  }

  // 데이터 버전 확인
  async getVersion(): Promise<number> {
    const data = await this.loadData();
    return data?.version || 0;
  }

  // 데이터 삭제
  async clearData(): Promise<void> {
    try {
      if (fs.existsSync(this.dataFile)) {
        fs.unlinkSync(this.dataFile);
        console.log('데이터 삭제 완료');
      }
    } catch (error) {
      console.error('데이터 삭제 실패:', error);
      throw error;
    }
  }

  // 데이터 백업
  async backupData(): Promise<string> {
    try {
      const data = await this.loadData();
      if (!data) {
        throw new Error('백업할 데이터가 없습니다');
      }

      const backupFile = path.join(this.dataDir, `backup-${Date.now()}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
      
      console.log('데이터 백업 완료:', backupFile);
      return backupFile;
    } catch (error) {
      console.error('데이터 백업 실패:', error);
      throw error;
    }
  }
}

export const dataStorage = new DataStorage();
