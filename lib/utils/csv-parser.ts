import fs from 'fs';
import path from 'path';

export interface GolfCourseData {
  region: string;
  name: string;
  owner: string;
  address: string;
  totalArea: number;
  holes: number;
  type: '회원제' | '대중제';
}

export class CSVParser {
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  static parseGolfCourseCSV(filePath: string): GolfCourseData[] {
    try {
      const csvContent = fs.readFileSync(filePath, 'utf-8');
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      // 헤더 제거 (첫 번째 줄)
      const dataLines = lines.slice(1);
      
      const golfCourses: GolfCourseData[] = [];
      
      for (const line of dataLines) {
        if (!line.trim()) continue;
        
        const columns = this.parseCSVLine(line);
        
        if (columns.length >= 7) {
          const golfCourse: GolfCourseData = {
            region: columns[0]?.trim() || '',
            name: columns[1]?.trim() || '',
            owner: columns[2]?.trim() || '',
            address: columns[3]?.trim() || '',
            totalArea: this.parseNumber(columns[4]?.trim() || '0'),
            holes: this.parseNumber(columns[5]?.trim() || '0'),
            type: (columns[6]?.trim() === '회원제') ? '회원제' : '대중제'
          };
          
          // 유효한 데이터만 추가
          if (golfCourse.name && golfCourse.address) {
            golfCourses.push(golfCourse);
          }
        }
      }
      
      console.log(`CSV에서 ${golfCourses.length}개의 골프장 데이터를 파싱했습니다.`);
      return golfCourses;
      
    } catch (error) {
      console.error('CSV 파일 파싱 오류:', error);
      return [];
    }
  }

  private static parseNumber(value: string): number {
    // 쉼표 제거하고 숫자로 변환
    const cleanValue = value.replace(/,/g, '').replace(/[^\d.-]/g, '');
    const num = parseFloat(cleanValue);
    return isNaN(num) ? 0 : num;
  }

  static saveAsJSON(data: GolfCourseData[], outputPath: string): void {
    try {
      const jsonData = {
        golfCourses: data,
        totalCount: data.length,
        lastUpdated: new Date().toISOString(),
        source: 'golfcourse.csv'
      };
      
      fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`골프장 데이터를 JSON으로 저장했습니다: ${outputPath}`);
    } catch (error) {
      console.error('JSON 저장 오류:', error);
    }
  }
}
