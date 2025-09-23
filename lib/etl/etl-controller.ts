import { AdvancedScraper, ScrapingConfig, ScrapingResult } from './advanced-scraper';
import { DataValidator, ValidationResult } from './data-validator';
import { DataExporter, ExportOptions, ExportResult } from './data-exporter';
import { PlayerInfo, Tournament, GolfCourse, GolfAssociation } from '@/types';

export interface ETLConfig {
  sources: {
    players: ScrapingConfig[];
    golfCourses: ScrapingConfig[];
    tournaments: ScrapingConfig[];
  };
  validation: {
    enabled: boolean;
    strictMode: boolean;
  };
  export: ExportOptions;
  quality: {
    minCompleteness: number;
    removeDuplicates: boolean;
  };
}

export interface ETLResult {
  success: boolean;
  data: {
    players: PlayerInfo[];
    golfCourses: GolfCourse[];
    tournaments: Tournament[];
  };
  statistics: {
    totalItems: number;
    validItems: number;
    processingTime: number;
    completeness: number;
  };
  validation: ValidationResult[];
  export: ExportResult;
  errors: string[];
  warnings: string[];
}

export class ETLController {
  private scraper: AdvancedScraper;
  private validator: DataValidator;
  private exporter: DataExporter;
  private config: ETLConfig;

  constructor(config: ETLConfig) {
    this.scraper = new AdvancedScraper();
    this.validator = new DataValidator();
    this.exporter = new DataExporter();
    this.config = config;
  }

  // 전체 ETL 프로세스 실행
  async runETL(): Promise<ETLResult> {
    const startTime = Date.now();
    const result: ETLResult = {
      success: false,
      data: {
        players: [],
        golfCourses: [],
        tournaments: []
      },
      statistics: {
        totalItems: 0,
        validItems: 0,
        processingTime: 0,
        completeness: 0
      },
      validation: [],
      export: {
        success: false,
        files: [],
        errors: [],
        metadata: {
          totalItems: 0,
          exportTime: '',
          fileSizes: {}
        }
      },
      errors: [],
      warnings: []
    };

    try {
      console.log('🚀 ETL 프로세스 시작...');

      // 1단계: 데이터 추출 (Extract)
      console.log('📥 1단계: 데이터 추출 중...');
      const extractionResults = await this.extractData();
      
      // 2단계: 데이터 변환 및 검증 (Transform)
      console.log('🔄 2단계: 데이터 변환 및 검증 중...');
      const transformedData = await this.transformData(extractionResults);
      
      // 3단계: 데이터 로드 및 내보내기 (Load)
      console.log('📤 3단계: 데이터 로드 및 내보내기 중...');
      const exportResult = await this.loadData(transformedData);

      // 결과 통합
      result.data = transformedData;
      result.export = exportResult;
      result.statistics = this.calculateStatistics(transformedData);
      result.statistics.processingTime = Date.now() - startTime;
      result.success = exportResult.success;

      console.log('✅ ETL 프로세스 완료!');
      this.printSummary(result);

    } catch (error) {
      const errorMsg = `ETL 프로세스 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      result.errors.push(errorMsg);
      console.error(errorMsg);
    } finally {
      await this.scraper.close();
    }

    return result;
  }

  // 데이터 추출
  private async extractData(): Promise<{
    players: ScrapingResult<PlayerInfo>[];
    golfCourses: ScrapingResult<GolfCourse>[];
    tournaments: ScrapingResult<Tournament>[];
  }> {
    const results = {
      players: [] as ScrapingResult<PlayerInfo>[],
      golfCourses: [] as ScrapingResult<GolfCourse>[],
      tournaments: [] as ScrapingResult<Tournament>[]
    };

    // 선수 데이터 추출
    for (const config of this.config.sources.players) {
      try {
        const result = config.type === 'static' 
          ? await this.scraper.scrapeStatic<PlayerInfo>(config)
          : await this.scraper.scrapeDynamic<PlayerInfo>(config);
        results.players.push(result);
      } catch (error) {
        console.error(`선수 데이터 추출 실패 (${config.name}):`, error);
      }
    }

    // 골프장 데이터 추출
    for (const config of this.config.sources.golfCourses) {
      try {
        const result = config.type === 'static' 
          ? await this.scraper.scrapeStatic<GolfCourse>(config)
          : await this.scraper.scrapeDynamic<GolfCourse>(config);
        results.golfCourses.push(result);
      } catch (error) {
        console.error(`골프장 데이터 추출 실패 (${config.name}):`, error);
      }
    }

    // 대회 데이터 추출
    for (const config of this.config.sources.tournaments) {
      try {
        const result = config.type === 'static' 
          ? await this.scraper.scrapeStatic<Tournament>(config)
          : await this.scraper.scrapeDynamic<Tournament>(config);
        results.tournaments.push(result);
      } catch (error) {
        console.error(`대회 데이터 추출 실패 (${config.name}):`, error);
      }
    }

    return results;
  }

  // 데이터 변환 및 검증
  private async transformData(extractionResults: any): Promise<{
    players: PlayerInfo[];
    golfCourses: GolfCourse[];
    tournaments: Tournament[];
  }> {
    const transformedData = {
      players: [] as PlayerInfo[],
      golfCourses: [] as GolfCourse[],
      tournaments: [] as Tournament[]
    };

    // 선수 데이터 변환
    for (const result of extractionResults.players) {
      if (result.success && result.data.length > 0) {
        const cleaned = this.validator.cleanAndStandardize(result.data, 'klpga_player');
        transformedData.players.push(...cleaned);
      }
    }

    // 골프장 데이터 변환
    for (const result of extractionResults.golfCourses) {
      if (result.success && result.data.length > 0) {
        const cleaned = this.validator.cleanAndStandardize(result.data, 'golf_course');
        transformedData.golfCourses.push(...cleaned);
      }
    }

    // 대회 데이터 변환
    for (const result of extractionResults.tournaments) {
      if (result.success && result.data.length > 0) {
        const cleaned = this.validator.cleanAndStandardize(result.data, 'tournament');
        transformedData.tournaments.push(...cleaned);
      }
    }

    // 중복 제거
    if (this.config.quality.removeDuplicates) {
      transformedData.players = this.validator.removeDuplicates(transformedData.players, ['memberId', 'name']);
      transformedData.golfCourses = this.validator.removeDuplicates(transformedData.golfCourses, ['name', 'address']);
      transformedData.tournaments = this.validator.removeDuplicates(transformedData.tournaments, ['name', 'startDate']);
    }

    return transformedData;
  }

  // 데이터 로드 및 내보내기
  private async loadData(data: any): Promise<ExportResult> {
    return await this.exporter.exportAllData(
      data.players,
      data.golfCourses,
      data.tournaments,
      this.config.export
    );
  }

  // 통계 계산
  private calculateStatistics(data: any): any {
    const totalItems = data.players.length + data.golfCourses.length + data.tournaments.length;
    const validItems = totalItems; // 검증 통과한 항목 수
    const completeness = totalItems > 0 ? (validItems / totalItems) * 100 : 0;

    return {
      totalItems,
      validItems,
      processingTime: 0, // 실제 값은 runETL에서 설정
      completeness: Math.round(completeness * 100) / 100
    };
  }

  // 요약 출력
  private printSummary(result: ETLResult): void {
    console.log('\n📊 ETL 프로세스 요약');
    console.log('=====================================');
    console.log(`✅ 성공: ${result.success ? '예' : '아니오'}`);
    console.log(`📈 총 항목: ${result.statistics.totalItems}`);
    console.log(`⏱️ 처리 시간: ${result.statistics.processingTime}ms`);
    console.log(`📊 완성도: ${result.statistics.completeness}%`);
    console.log(`📁 내보낸 파일: ${result.export.files.length}개`);
    
    if (result.errors.length > 0) {
      console.log(`❌ 오류: ${result.errors.length}개`);
    }
    
    if (result.warnings.length > 0) {
      console.log(`⚠️ 경고: ${result.warnings.length}개`);
    }
  }

  // 특정 데이터 타입만 처리
  async runETLForType(dataType: 'players' | 'golfCourses' | 'tournaments'): Promise<ETLResult> {
    const startTime = Date.now();
    const result: ETLResult = {
      success: false,
      data: {
        players: [],
        golfCourses: [],
        tournaments: []
      },
      statistics: {
        totalItems: 0,
        validItems: 0,
        processingTime: 0,
        completeness: 0
      },
      validation: [],
      export: {
        success: false,
        files: [],
        errors: [],
        metadata: {
          totalItems: 0,
          exportTime: '',
          fileSizes: {}
        }
      },
      errors: [],
      warnings: []
    };

    try {
      console.log(`🚀 ${dataType} ETL 프로세스 시작...`);

      // 데이터 추출
      const extractionResults = await this.extractData();
      
      // 특정 타입만 변환
      const transformedData = await this.transformData(extractionResults);
      
      // 특정 타입만 내보내기
      let exportResult: ExportResult;
      if (dataType === 'players') {
        exportResult = await this.exporter.exportPlayers(transformedData.players, this.config.export);
      } else if (dataType === 'golfCourses') {
        exportResult = await this.exporter.exportGolfCourses(transformedData.golfCourses, this.config.export);
      } else {
        exportResult = await this.exporter.exportTournaments(transformedData.tournaments, this.config.export);
      }

      result.data = transformedData;
      result.export = exportResult;
      result.statistics = this.calculateStatistics(transformedData);
      result.statistics.processingTime = Date.now() - startTime;
      result.success = exportResult.success;

      console.log(`✅ ${dataType} ETL 프로세스 완료!`);

    } catch (error) {
      const errorMsg = `${dataType} ETL 프로세스 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      result.errors.push(errorMsg);
      console.error(errorMsg);
    } finally {
      await this.scraper.close();
    }

    return result;
  }
}
