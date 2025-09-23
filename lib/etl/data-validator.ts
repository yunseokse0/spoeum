import { PlayerInfo, Tournament, GolfCourse, GolfAssociation } from '@/types';

export interface ValidationRule<T> {
  field: keyof T;
  type: 'required' | 'format' | 'range' | 'custom';
  message: string;
  validator?: (value: any) => boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  statistics: {
    totalItems: number;
    validItems: number;
    invalidItems: number;
    completeness: number;
  };
}

export class DataValidator {
  private rules: Map<string, ValidationRule<any>[]> = new Map();

  constructor() {
    this.initializeRules();
  }

  // 검증 규칙 초기화
  private initializeRules(): void {
    // KLPGA 선수 데이터 검증 규칙
    this.rules.set('klpga_player', [
      {
        field: 'memberId',
        type: 'required',
        message: '회원번호는 필수입니다'
      },
      {
        field: 'name',
        type: 'required',
        message: '이름은 필수입니다'
      },
      {
        field: 'name',
        type: 'format',
        message: '이름은 2-10자 한글이어야 합니다',
        pattern: /^[가-힣]{2,10}$/
      },
      {
        field: 'association',
        type: 'required',
        message: '소속은 필수입니다'
      },
      {
        field: 'birth',
        type: 'format',
        message: '생년월일은 YYYY-MM-DD 형식이어야 합니다',
        pattern: /^\d{4}-\d{2}-\d{2}$/
      },
      {
        field: 'currentRanking',
        type: 'range',
        message: '현재 랭킹은 1-1000 사이여야 합니다',
        min: 1,
        max: 1000
      }
    ]);

    // KPGA 선수 데이터 검증 규칙
    this.rules.set('kpga_player', [
      {
        field: 'memberId',
        type: 'required',
        message: '회원번호는 필수입니다'
      },
      {
        field: 'name',
        type: 'required',
        message: '이름은 필수입니다'
      },
      {
        field: 'name',
        type: 'format',
        message: '이름은 2-10자 한글이어야 합니다',
        pattern: /^[가-힣]{2,10}$/
      },
      {
        field: 'association',
        type: 'required',
        message: '소속은 필수입니다'
      },
      {
        field: 'birth',
        type: 'format',
        message: '생년월일은 YYYY-MM-DD 형식이어야 합니다',
        pattern: /^\d{4}-\d{2}-\d{2}$/
      }
    ]);

    // 골프장 데이터 검증 규칙
    this.rules.set('golf_course', [
      {
        field: 'name',
        type: 'required',
        message: '골프장명은 필수입니다'
      },
      {
        field: 'region',
        type: 'required',
        message: '지역은 필수입니다'
      },
      {
        field: 'address',
        type: 'required',
        message: '주소는 필수입니다'
      },
      {
        field: 'phone',
        type: 'format',
        message: '전화번호는 올바른 형식이어야 합니다',
        pattern: /^[\d-()+\s]+$/
      }
    ]);

    // 대회 데이터 검증 규칙
    this.rules.set('tournament', [
      {
        field: 'name',
        type: 'required',
        message: '대회명은 필수입니다'
      },
      {
        field: 'type',
        type: 'required',
        message: '대회 유형은 필수입니다'
      },
      {
        field: 'startDate',
        type: 'required',
        message: '시작일은 필수입니다'
      },
      {
        field: 'endDate',
        type: 'required',
        message: '종료일은 필수입니다'
      }
    ]);
  }

  // 데이터 검증 실행
  validate<T>(data: T[], dataType: string): ValidationResult {
    const rules = this.rules.get(dataType) || [];
    const errors: string[] = [];
    const warnings: string[] = [];
    let validItems = 0;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let itemValid = true;

      for (const rule of rules) {
        const value = (item as any)[rule.field];
        const isValid = this.validateField(value, rule);

        if (!isValid) {
          const error = `항목 ${i + 1}: ${rule.message}`;
          errors.push(error);
          itemValid = false;
        }
      }

      if (itemValid) {
        validItems++;
      }
    }

    // 데이터 품질 경고
    const completeness = (validItems / data.length) * 100;
    if (completeness < 80) {
      warnings.push(`데이터 완성도가 낮습니다: ${completeness.toFixed(1)}%`);
    }

    if (data.length === 0) {
      warnings.push('데이터가 없습니다');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      statistics: {
        totalItems: data.length,
        validItems,
        invalidItems: data.length - validItems,
        completeness: Math.round(completeness * 100) / 100
      }
    };
  }

  // 필드별 검증
  private validateField(value: any, rule: ValidationRule<any>): boolean {
    switch (rule.type) {
      case 'required':
        return value !== null && value !== undefined && value !== '';

      case 'format':
        if (rule.pattern) {
          return typeof value === 'string' && rule.pattern.test(value);
        }
        return true;

      case 'range':
        if (typeof value === 'number') {
          if (rule.min !== undefined && value < rule.min) return false;
          if (rule.max !== undefined && value > rule.max) return false;
        }
        return true;

      case 'custom':
        return rule.validator ? rule.validator(value) : true;

      default:
        return true;
    }
  }

  // 데이터 정리 및 표준화
  cleanAndStandardize<T>(data: T[], dataType: string): T[] {
    return data.map(item => {
      const cleaned = { ...item } as any;

      // 공통 정리
      for (const key in cleaned) {
        if (typeof cleaned[key] === 'string') {
          // 공백 정리
          cleaned[key] = cleaned[key].trim().replace(/\s+/g, ' ');
          
          // 특수 문자 정리
          cleaned[key] = cleaned[key].replace(/[\r\n\t]/g, '');
        }
      }

      // 데이터 타입별 특수 처리
      if (dataType === 'klpga_player' || dataType === 'kpga_player') {
        this.cleanPlayerData(cleaned);
      } else if (dataType === 'golf_course') {
        this.cleanGolfCourseData(cleaned);
      } else if (dataType === 'tournament') {
        this.cleanTournamentData(cleaned);
      }

      return cleaned as T;
    });
  }

  // 선수 데이터 정리
  private cleanPlayerData(data: any): void {
    // 이름 정리
    if (data.name) {
      data.name = data.name.replace(/[^\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\s]/g, '');
    }

    // 생년월일 정리
    if (data.birth) {
      data.birth = this.standardizeDate(data.birth);
    }

    // 랭킹 정리
    if (data.currentRanking) {
      data.currentRanking = parseInt(data.currentRanking.toString().replace(/\D/g, '')) || 0;
    }

    // 상금 정리
    if (data.totalPrize) {
      data.totalPrize = parseInt(data.totalPrize.toString().replace(/[^\d]/g, '')) || 0;
    }
  }

  // 골프장 데이터 정리
  private cleanGolfCourseData(data: any): void {
    // 전화번호 정리
    if (data.phone) {
      data.phone = data.phone.replace(/[^\d-()+\s]/g, '');
    }

    // 주소 정리
    if (data.address) {
      data.address = data.address.replace(/\s+/g, ' ').trim();
    }
  }

  // 대회 데이터 정리
  private cleanTournamentData(data: any): void {
    // 날짜 정리
    if (data.startDate) {
      data.startDate = this.standardizeDate(data.startDate);
    }
    if (data.endDate) {
      data.endDate = this.standardizeDate(data.endDate);
    }

    // 상금 정리
    if (data.prize) {
      data.prize = parseInt(data.prize.toString().replace(/[^\d]/g, '')) || 0;
    }
  }

  // 날짜 표준화
  private standardizeDate(dateStr: string): string {
    if (!dateStr) return '';

    // YYYY-MM-DD 형식으로 변환
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    return date.toISOString().split('T')[0];
  }

  // 중복 데이터 제거
  removeDuplicates<T>(data: T[], keyFields: (keyof T)[]): T[] {
    const seen = new Set<string>();
    const unique: T[] = [];

    for (const item of data) {
      const key = keyFields.map(field => (item as any)[field]).join('|');
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    return unique;
  }

  // 데이터 품질 리포트 생성
  generateQualityReport<T>(data: T[], dataType: string): string {
    const validation = this.validate(data, dataType);
    const cleaned = this.cleanAndStandardize(data, dataType);
    const unique = this.removeDuplicates(cleaned, ['name'] as (keyof T)[]);

    let report = `\n📊 데이터 품질 리포트 - ${dataType.toUpperCase()}\n`;
    report += `=====================================\n`;
    report += `📈 통계:\n`;
    report += `  • 총 항목: ${validation.statistics.totalItems}\n`;
    report += `  • 유효 항목: ${validation.statistics.validItems}\n`;
    report += `  • 무효 항목: ${validation.statistics.invalidItems}\n`;
    report += `  • 완성도: ${validation.statistics.completeness}%\n`;
    report += `  • 중복 제거 후: ${unique.length}\n\n`;

    if (validation.errors.length > 0) {
      report += `❌ 오류 (${validation.errors.length}개):\n`;
      validation.errors.slice(0, 10).forEach(error => {
        report += `  • ${error}\n`;
      });
      if (validation.errors.length > 10) {
        report += `  • ... 및 ${validation.errors.length - 10}개 더\n`;
      }
      report += `\n`;
    }

    if (validation.warnings.length > 0) {
      report += `⚠️ 경고 (${validation.warnings.length}개):\n`;
      validation.warnings.forEach(warning => {
        report += `  • ${warning}\n`;
      });
      report += `\n`;
    }

    report += `✅ 데이터 품질: ${validation.isValid ? '양호' : '개선 필요'}\n`;

    return report;
  }
}
