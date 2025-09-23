import { PlayerInfo, Tournament, GolfCourse } from '@/types';
import fs from 'fs/promises';
import path from 'path';

export interface ExportOptions {
  format: 'csv' | 'json' | 'both';
  outputDir?: string;
  filename?: string;
  includeMetadata?: boolean;
  encoding?: string;
}

export interface ExportResult {
  success: boolean;
  files: string[];
  errors: string[];
  metadata: {
    totalItems: number;
    exportTime: string;
    fileSizes: Record<string, number>;
  };
}

export class DataExporter {
  private outputDir: string;

  constructor(outputDir: string = 'data/exports') {
    this.outputDir = outputDir;
  }

  // 선수 데이터 내보내기
  async exportPlayers(
    players: PlayerInfo[], 
    options: ExportOptions = { format: 'both' }
  ): Promise<ExportResult> {
    const result: ExportResult = {
      success: false,
      files: [],
      errors: [],
      metadata: {
        totalItems: players.length,
        exportTime: new Date().toISOString(),
        fileSizes: {}
      }
    };

    try {
      await this.ensureOutputDir();

      const baseFilename = options.filename || `players_${this.getTimestamp()}`;
      
      if (options.format === 'csv' || options.format === 'both') {
        const csvFile = await this.exportToCSV(players, baseFilename, 'players');
        result.files.push(csvFile);
        result.metadata.fileSizes[csvFile] = await this.getFileSize(csvFile);
      }

      if (options.format === 'json' || options.format === 'both') {
        const jsonFile = await this.exportToJSON(players, baseFilename, 'players', options.includeMetadata);
        result.files.push(jsonFile);
        result.metadata.fileSizes[jsonFile] = await this.getFileSize(jsonFile);
      }

      result.success = true;
      console.log(`선수 데이터 내보내기 완료: ${result.files.length}개 파일`);

    } catch (error) {
      const errorMsg = `선수 데이터 내보내기 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      result.errors.push(errorMsg);
      console.error(errorMsg);
    }

    return result;
  }

  // 골프장 데이터 내보내기
  async exportGolfCourses(
    courses: GolfCourse[], 
    options: ExportOptions = { format: 'both' }
  ): Promise<ExportResult> {
    const result: ExportResult = {
      success: false,
      files: [],
      errors: [],
      metadata: {
        totalItems: courses.length,
        exportTime: new Date().toISOString(),
        fileSizes: {}
      }
    };

    try {
      await this.ensureOutputDir();

      const baseFilename = options.filename || `golf_courses_${this.getTimestamp()}`;
      
      if (options.format === 'csv' || options.format === 'both') {
        const csvFile = await this.exportToCSV(courses, baseFilename, 'golf_courses');
        result.files.push(csvFile);
        result.metadata.fileSizes[csvFile] = await this.getFileSize(csvFile);
      }

      if (options.format === 'json' || options.format === 'both') {
        const jsonFile = await this.exportToJSON(courses, baseFilename, 'golf_courses', options.includeMetadata);
        result.files.push(jsonFile);
        result.metadata.fileSizes[jsonFile] = await this.getFileSize(jsonFile);
      }

      result.success = true;
      console.log(`골프장 데이터 내보내기 완료: ${result.files.length}개 파일`);

    } catch (error) {
      const errorMsg = `골프장 데이터 내보내기 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      result.errors.push(errorMsg);
      console.error(errorMsg);
    }

    return result;
  }

  // 대회 데이터 내보내기
  async exportTournaments(
    tournaments: Tournament[], 
    options: ExportOptions = { format: 'both' }
  ): Promise<ExportResult> {
    const result: ExportResult = {
      success: false,
      files: [],
      errors: [],
      metadata: {
        totalItems: tournaments.length,
        exportTime: new Date().toISOString(),
        fileSizes: {}
      }
    };

    try {
      await this.ensureOutputDir();

      const baseFilename = options.filename || `tournaments_${this.getTimestamp()}`;
      
      if (options.format === 'csv' || options.format === 'both') {
        const csvFile = await this.exportToCSV(tournaments, baseFilename, 'tournaments');
        result.files.push(csvFile);
        result.metadata.fileSizes[csvFile] = await this.getFileSize(csvFile);
      }

      if (options.format === 'json' || options.format === 'both') {
        const jsonFile = await this.exportToJSON(tournaments, baseFilename, 'tournaments', options.includeMetadata);
        result.files.push(jsonFile);
        result.metadata.fileSizes[jsonFile] = await this.getFileSize(jsonFile);
      }

      result.success = true;
      console.log(`대회 데이터 내보내기 완료: ${result.files.length}개 파일`);

    } catch (error) {
      const errorMsg = `대회 데이터 내보내기 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      result.errors.push(errorMsg);
      console.error(errorMsg);
    }

    return result;
  }

  // CSV 내보내기
  private async exportToCSV<T>(data: T[], baseFilename: string, dataType: string): Promise<string> {
    if (data.length === 0) {
      throw new Error('내보낼 데이터가 없습니다');
    }

    const filename = `${baseFilename}.csv`;
    const filepath = path.join(this.outputDir, filename);

    // CSV 헤더 생성
    const headers = this.getCSVHeaders(data[0], dataType);
    const csvContent = this.convertToCSV(data, headers);

    // UTF-8 BOM 추가 (Excel 호환성)
    const bom = '\uFEFF';
    await fs.writeFile(filepath, bom + csvContent, 'utf-8');

    console.log(`CSV 파일 생성 완료: ${filepath}`);
    return filepath;
  }

  // JSON 내보내기
  private async exportToJSON<T>(
    data: T[], 
    baseFilename: string, 
    dataType: string, 
    includeMetadata: boolean = false
  ): Promise<string> {
    const filename = `${baseFilename}.json`;
    const filepath = path.join(this.outputDir, filename);

    const exportData: any = {
      dataType,
      totalItems: data.length,
      exportTime: new Date().toISOString(),
      data
    };

    if (includeMetadata) {
      exportData.metadata = {
        version: '1.0',
        source: 'Golf Data Scraper',
        encoding: 'UTF-8',
        format: 'JSON'
      };
    }

    await fs.writeFile(filepath, JSON.stringify(exportData, null, 2), 'utf-8');

    console.log(`JSON 파일 생성 완료: ${filepath}`);
    return filepath;
  }

  // CSV 헤더 생성
  private getCSVHeaders<T>(sample: T, dataType: string): string[] {
    const headers: string[] = [];

    if (dataType === 'players') {
      headers.push(
        '회원번호', '이름', '소속', '생년월일', '현재랭킹', 
        '총상금', '활성상태', '주요경력', '최고랭킹', '최저랭킹'
      );
    } else if (dataType === 'golf_courses') {
      headers.push(
        '골프장명', '지역', '주소', '전화번호', '홀수', 
        '파수', '그린피', '웹사이트', '설명'
      );
    } else if (dataType === 'tournaments') {
      headers.push(
        '대회명', '유형', '시작일', '종료일', '장소', 
        '상금', '상태', '주최', '설명'
      );
    }

    return headers;
  }

  // 데이터를 CSV로 변환
  private convertToCSV<T>(data: T[], headers: string[]): string {
    const rows: string[] = [headers.join(',')];

    for (const item of data) {
      const row: string[] = [];

      if ('memberId' in item) {
        // 선수 데이터
        const player = item as any;
        row.push(
          this.escapeCSV(player.memberId || ''),
          this.escapeCSV(player.name || ''),
          this.escapeCSV(player.association || ''),
          this.escapeCSV(player.birth || ''),
          this.escapeCSV(player.currentRanking?.toString() || ''),
          this.escapeCSV(player.totalPrize?.toString() || ''),
          this.escapeCSV(player.isActive ? '활성' : '비활성'),
          this.escapeCSV(player.career?.map((c: any) => c.title).join('; ') || ''),
          this.escapeCSV(player.ranking?.best?.toString() || ''),
          this.escapeCSV(player.ranking?.worst?.toString() || '')
        );
      } else if ('name' in item && 'region' in item) {
        // 골프장 데이터
        const course = item as any;
        row.push(
          this.escapeCSV(course.name || ''),
          this.escapeCSV(course.region || ''),
          this.escapeCSV(course.address || ''),
          this.escapeCSV(course.phone || ''),
          this.escapeCSV(course.holes?.toString() || ''),
          this.escapeCSV(course.par?.toString() || ''),
          this.escapeCSV(course.greenFee?.toString() || ''),
          this.escapeCSV(course.website || ''),
          this.escapeCSV(course.description || '')
        );
      } else if ('name' in item && 'type' in item) {
        // 대회 데이터
        const tournament = item as any;
        row.push(
          this.escapeCSV(tournament.name || ''),
          this.escapeCSV(tournament.type || ''),
          this.escapeCSV(tournament.startDate?.toString() || ''),
          this.escapeCSV(tournament.endDate?.toString() || ''),
          this.escapeCSV(tournament.location || ''),
          this.escapeCSV(tournament.prize?.toString() || ''),
          this.escapeCSV(tournament.status || ''),
          this.escapeCSV(tournament.organizer || ''),
          this.escapeCSV(tournament.description || '')
        );
      }

      rows.push(row.join(','));
    }

    return rows.join('\n');
  }

  // CSV 이스케이프 처리
  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  // 출력 디렉토리 생성
  private async ensureOutputDir(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('출력 디렉토리 생성 실패:', error);
      throw error;
    }
  }

  // 파일 크기 가져오기
  private async getFileSize(filepath: string): Promise<number> {
    try {
      const stats = await fs.stat(filepath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  // 타임스탬프 생성
  private getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }

  // 통합 데이터 내보내기
  async exportAllData(
    players: PlayerInfo[],
    courses: GolfCourse[],
    tournaments: Tournament[],
    options: ExportOptions = { format: 'both' }
  ): Promise<ExportResult> {
    const result: ExportResult = {
      success: false,
      files: [],
      errors: [],
      metadata: {
        totalItems: players.length + courses.length + tournaments.length,
        exportTime: new Date().toISOString(),
        fileSizes: {}
      }
    };

    try {
      // 각 데이터 타입별 내보내기
      const [playersResult, coursesResult, tournamentsResult] = await Promise.all([
        this.exportPlayers(players, options),
        this.exportGolfCourses(courses, options),
        this.exportTournaments(tournaments, options)
      ]);

      // 결과 통합
      result.files.push(...playersResult.files, ...coursesResult.files, ...tournamentsResult.files);
      result.errors.push(...playersResult.errors, ...coursesResult.errors, ...tournamentsResult.errors);
      result.success = playersResult.success && coursesResult.success && tournamentsResult.success;

      // 메타데이터 통합
      Object.assign(result.metadata.fileSizes, 
        playersResult.metadata.fileSizes,
        coursesResult.metadata.fileSizes,
        tournamentsResult.metadata.fileSizes
      );

      console.log(`전체 데이터 내보내기 완료: ${result.files.length}개 파일`);

    } catch (error) {
      const errorMsg = `전체 데이터 내보내기 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`;
      result.errors.push(errorMsg);
      console.error(errorMsg);
    }

    return result;
  }
}
