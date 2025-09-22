import { Contract, ContractType, UserType } from '@/types';

export interface ContractTerms {
  // 기본 보수
  baseSalary: number; // 기본 급여 (원)
  
  // 계약 대회 건수
  tournamentCount: number; // 계약 기간 동안 참가할 대회 건수
  
  // 우승 보수
  winBonus: {
    percentage: number; // 우승 시 상금의 몇 %를 받을지
    minAmount?: number; // 최소 보수 금액
    maxAmount?: number; // 최대 보수 금액
  };
  
  // 대회별 보수
  tournamentBonus: {
    first: number; // 1위 시 보수
    second: number; // 2위 시 보수
    third: number; // 3위 시 보수
    top10: number; // Top 10 시 보수
    participation: number; // 참가 시 보수
  };
  
  // 비용 포함 여부
  expenses: {
    domestic: {
      transportation: boolean; // 교통비 포함 여부
      accommodation: boolean; // 숙박비 포함 여부
      meals: boolean; // 식비 포함 여부
    };
    jeju: {
      transportation: boolean; // 제주 항공료 포함 여부
      accommodation: boolean; // 제주 숙박비 포함 여부
      meals: boolean; // 제주 식비 포함 여부
    };
    overseas: {
      transportation: boolean; // 해외 항공료 포함 여부
      accommodation: boolean; // 해외 숙박비 포함 여부
      meals: boolean; // 해외 식비 포함 여부
      visa: boolean; // 비자비 포함 여부
    };
  };
  
  // 계약 조건
  contractConditions: {
    duration: number; // 계약 기간 (개월)
    noticePeriod: number; // 해지 통보 기간 (일)
    penaltyRate: number; // 위약금 비율 (%)
    renewalTerms: string; // 갱신 조건
  };
  
  // 특별 조건
  specialConditions: string[];
}

// 계약서 템플릿 생성기
export class ContractTemplateGenerator {
  
  // 투어프로 - 캐디 계약서 템플릿
  static generateTourProCaddyContract(
    tourPro: any,
    caddy: any,
    tournament: any,
    customTerms?: Partial<ContractTerms>
  ): Contract {
    
    const defaultTerms: ContractTerms = {
      baseSalary: 500000, // 기본 50만원
      tournamentCount: 10, // 계약 기간 동안 10개 대회 참가
      winBonus: {
        percentage: 10, // 우승 시 상금의 10%
        minAmount: 1000000, // 최소 100만원
        maxAmount: 10000000 // 최대 1천만원
      },
      tournamentBonus: {
        first: 10000000, // 1위 시 1천만원
        second: 5000000, // 2위 시 5백만원
        third: 3000000, // 3위 시 3백만원
        top10: 1000000, // Top 10 시 100만원
        participation: 500000 // 참가 시 50만원
      },
      expenses: {
        domestic: {
          transportation: true,
          accommodation: true,
          meals: true
        },
        jeju: {
          transportation: true, // 제주 항공료 포함
          accommodation: true,
          meals: true
        },
        overseas: {
          transportation: true, // 해외 항공료 포함
          accommodation: true,
          meals: true,
          visa: true
        }
      },
      contractConditions: {
        duration: 12, // 1년 계약
        noticePeriod: 30, // 30일 전 통보
        penaltyRate: 20, // 위약금 20%
        renewalTerms: '자동 갱신 (상호 합의 하에)'
      },
      specialConditions: [
        '캐디는 선수의 모든 라운드에 동반해야 함',
        '캐디는 선수의 컨디션과 코스 정보를 사전에 파악해야 함',
        '캐디는 선수의 심리적 지원을 제공해야 함',
        '비공개 정보는 계약 종료 후에도 유지해야 함'
      ]
    };

    const terms = { ...defaultTerms, ...customTerms };

    return {
      id: `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tourProId: tourPro.id,
      caddyId: caddy.id,
      tournamentId: tournament.id,
      type: 'tournament' as ContractType,
      status: 'pending',
      terms: JSON.stringify(terms),
      startDate: new Date(),
      endDate: new Date(Date.now() + terms.contractConditions.duration * 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      // 계약서 상세 내용
      contractDetails: {
        title: `${tournament.name} 대회 캐디 계약서`,
        parties: {
          tourPro: {
            name: tourPro.name,
            association: tourPro.tourProInfo?.association,
            memberId: tourPro.tourProInfo?.memberId
          },
          caddy: {
            name: caddy.name,
            experience: caddy.caddyInfo?.experience,
            mainGolfCourse: caddy.caddyInfo?.mainGolfCourse
          }
        },
        tournament: {
          name: tournament.name,
          location: tournament.location,
          startDate: tournament.startDate,
          endDate: tournament.endDate,
          prize: tournament.prize
        },
        terms: terms
      }
    };
  }

  // 투어프로 - 스폰서 계약서 템플릿
  static generateTourProSponsorContract(
    tourPro: any,
    sponsor: any,
    customTerms?: Partial<ContractTerms>
  ): Contract {
    
    const defaultTerms: ContractTerms = {
      baseSalary: 10000000, // 기본 1천만원
      tournamentCount: 20, // 계약 기간 동안 20개 대회 참가
      winBonus: {
        percentage: 5, // 우승 시 상금의 5%
        minAmount: 5000000, // 최소 5백만원
        maxAmount: 50000000 // 최대 5천만원
      },
      tournamentBonus: {
        first: 50000000, // 1위 시 5천만원
        second: 30000000, // 2위 시 3천만원
        third: 20000000, // 3위 시 2천만원
        top10: 10000000, // Top 10 시 1천만원
        participation: 5000000 // 참가 시 5백만원
      },
      expenses: {
        domestic: {
          transportation: false, // 스폰서는 교통비 부담 안함
          accommodation: false,
          meals: false
        },
        jeju: {
          transportation: false,
          accommodation: false,
          meals: false
        },
        overseas: {
          transportation: false,
          accommodation: false,
          meals: false,
          visa: false
        }
      },
      contractConditions: {
        duration: 24, // 2년 계약
        noticePeriod: 60, // 60일 전 통보
        penaltyRate: 30, // 위약금 30%
        renewalTerms: '상호 합의 하에 갱신'
      },
      specialConditions: [
        '스폰서 로고는 지정된 위치에 노출되어야 함',
        '스폰서 제품 사용 의무 (지정된 장비)',
        '스폰서 관련 미디어 활동 참여 의무',
        '경쟁사 제품 사용 금지',
        '스폰서 관련 SNS 활동 의무'
      ]
    };

    const terms = { ...defaultTerms, ...customTerms };

    return {
      id: `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tourProId: tourPro.id,
      sponsorId: sponsor.id,
      type: 'sponsorship' as ContractType,
      status: 'pending',
      terms: JSON.stringify(terms),
      startDate: new Date(),
      endDate: new Date(Date.now() + terms.contractConditions.duration * 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      contractDetails: {
        title: `${sponsor.sponsorInfo?.companyName} 스폰서십 계약서`,
        parties: {
          tourPro: {
            name: tourPro.name,
            association: tourPro.tourProInfo?.association,
            memberId: tourPro.tourProInfo?.memberId
          },
          sponsor: {
            name: sponsor.sponsorInfo?.companyName,
            representative: sponsor.sponsorInfo?.representativeName,
            industry: sponsor.sponsorInfo?.industry
          }
        },
        terms: terms
      }
    };
  }

  // 아마추어 - 캐디 계약서 템플릿
  static generateAmateurCaddyContract(
    amateur: any,
    caddy: any,
    customTerms?: Partial<ContractTerms>
  ): Contract {
    
    const defaultTerms: ContractTerms = {
      baseSalary: 200000, // 기본 20만원
      tournamentCount: 4, // 계약 기간 동안 4개 대회 참가
      winBonus: {
        percentage: 0, // 아마추어는 우승 보수 없음
        minAmount: 0,
        maxAmount: 0
      },
      tournamentBonus: {
        first: 0,
        second: 0,
        third: 0,
        top10: 0,
        participation: 100000 // 참가 시 10만원
      },
      expenses: {
        domestic: {
          transportation: true,
          accommodation: false, // 아마추어는 숙박비 별도
          meals: true
        },
        jeju: {
          transportation: true,
          accommodation: false,
          meals: true
        },
        overseas: {
          transportation: false, // 해외는 별도 협의
          accommodation: false,
          meals: false,
          visa: false
        }
      },
      contractConditions: {
        duration: 1, // 1개월 계약
        noticePeriod: 7, // 7일 전 통보
        penaltyRate: 10, // 위약금 10%
        renewalTerms: '매월 갱신'
      },
      specialConditions: [
        '캐디는 아마추어의 실력 향상에 도움을 줘야 함',
        '캐디는 기본적인 골프 지식을 전달해야 함',
        '캐디는 아마추어의 수준에 맞는 조언을 제공해야 함'
      ]
    };

    const terms = { ...defaultTerms, ...customTerms };

    return {
      id: `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amateurId: amateur.id,
      caddyId: caddy.id,
      type: 'training' as ContractType,
      status: 'pending',
      terms: JSON.stringify(terms),
      startDate: new Date(),
      endDate: new Date(Date.now() + terms.contractConditions.duration * 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      contractDetails: {
        title: `아마추어 골프 레슨 계약서`,
        parties: {
          amateur: {
            name: amateur.name,
            handicap: amateur.amateurInfo?.handicap,
            experience: amateur.amateurInfo?.golfExperience
          },
          caddy: {
            name: caddy.name,
            experience: caddy.caddyInfo?.experience,
            mainGolfCourse: caddy.caddyInfo?.mainGolfCourse
          }
        },
        terms: terms
      }
    };
  }

  // 계약서 템플릿 선택기
  static generateContract(
    userType1: UserType,
    userType2: UserType,
    user1: any,
    user2: any,
    tournament?: any,
    customTerms?: Partial<ContractTerms>
  ): Contract {
    
    // 투어프로 - 캐디 계약
    if (userType1 === 'tour_pro' && userType2 === 'caddy') {
      if (!tournament) {
        throw new Error('투어프로-캐디 계약에는 대회 정보가 필요합니다.');
      }
      return this.generateTourProCaddyContract(user1, user2, tournament, customTerms);
    }
    
    // 투어프로 - 스폰서 계약
    if (userType1 === 'tour_pro' && userType2 === 'sponsor') {
      return this.generateTourProSponsorContract(user1, user2, customTerms);
    }
    
    // 아마추어 - 캐디 계약
    if (userType1 === 'amateur' && userType2 === 'caddy') {
      return this.generateAmateurCaddyContract(user1, user2, customTerms);
    }
    
    // 지원하지 않는 계약 유형
    throw new Error(`지원하지 않는 계약 유형: ${userType1} - ${userType2}`);
  }

  // 계약서 요약 생성
  static generateContractSummary(contract: Contract): string {
    const details = contract.contractDetails;
    const terms = typeof contract.terms === 'string' ? JSON.parse(contract.terms) : contract.terms;
    
    let summary = `## ${details.title}\n\n`;
    
    // 당사자 정보
    summary += `### 당사자 정보\n`;
    if (details.parties.tourPro) {
      summary += `- 투어프로: ${details.parties.tourPro.name} (${details.parties.tourPro.association})\n`;
    }
    if (details.parties.caddy) {
      summary += `- 캐디: ${details.parties.caddy.name}\n`;
    }
    if (details.parties.sponsor) {
      summary += `- 스폰서: ${details.parties.sponsor.name}\n`;
    }
    if (details.parties.amateur) {
      summary += `- 아마추어: ${details.parties.amateur.name}\n`;
    }
    
    // 대회 정보 (해당하는 경우)
    if (details.tournament) {
      summary += `\n### 대회 정보\n`;
      summary += `- 대회명: ${details.tournament.name}\n`;
      summary += `- 장소: ${details.tournament.location}\n`;
      summary += `- 기간: ${details.tournament.startDate} ~ ${details.tournament.endDate}\n`;
      summary += `- 총상금: ${details.tournament.prize.toLocaleString()}원\n`;
    }
    
    // 보수 정보
    summary += `\n### 보수 정보\n`;
    summary += `- 기본 급여: ${terms.baseSalary.toLocaleString()}원\n`;
    summary += `- 계약 대회 건수: ${terms.tournamentCount}개 대회\n`;
    summary += `- 우승 보수: 상금의 ${terms.winBonus.percentage}%\n`;
    
    // 비용 포함 여부
    summary += `\n### 비용 포함 여부\n`;
    summary += `- 국내 대회: 교통비 ${terms.expenses.domestic.transportation ? '포함' : '별도'}, 숙박비 ${terms.expenses.domestic.accommodation ? '포함' : '별도'}\n`;
    summary += `- 제주 대회: 항공료 ${terms.expenses.jeju.transportation ? '포함' : '별도'}, 숙박비 ${terms.expenses.jeju.accommodation ? '포함' : '별도'}\n`;
    summary += `- 해외 대회: 항공료 ${terms.expenses.overseas.transportation ? '포함' : '별도'}, 숙박비 ${terms.expenses.overseas.accommodation ? '포함' : '별도'}\n`;
    
    // 계약 조건
    summary += `\n### 계약 조건\n`;
    summary += `- 계약 기간: ${terms.contractConditions.duration}개월\n`;
    summary += `- 해지 통보 기간: ${terms.contractConditions.noticePeriod}일\n`;
    summary += `- 위약금: ${terms.contractConditions.penaltyRate}%\n`;
    
    return summary;
  }
}

// 계약서 유효성 검사
export class ContractValidator {
  static validateContract(contract: Contract): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // 필수 필드 검사
    if (!contract.id) errors.push('계약 ID가 필요합니다.');
    if (!contract.type) errors.push('계약 유형이 필요합니다.');
    if (!contract.status) errors.push('계약 상태가 필요합니다.');
    if (!contract.startDate) errors.push('계약 시작일이 필요합니다.');
    if (!contract.endDate) errors.push('계약 종료일이 필요합니다.');
    if (!contract.terms) errors.push('계약 조건이 필요합니다.');
    
    // 날짜 유효성 검사
    if (contract.startDate >= contract.endDate) {
      errors.push('계약 시작일은 종료일보다 빨라야 합니다.');
    }
    
    // 보수 정보 검사 (terms가 문자열인 경우 파싱)
    const terms = typeof contract.terms === 'string' ? JSON.parse(contract.terms) : contract.terms;
    
    if (terms.baseSalary < 0) {
      errors.push('기본 급여는 0 이상이어야 합니다.');
    }
    
    if (terms.tournamentCount <= 0) {
      errors.push('계약 대회 건수는 1개 이상이어야 합니다.');
    }
    
    if (terms.winBonus.percentage < 0 || terms.winBonus.percentage > 100) {
      errors.push('우승 보수 비율은 0-100% 사이여야 합니다.');
    }
    
    // 계약 기간 검사
    if (terms.contractConditions.duration <= 0) {
      errors.push('계약 기간은 1개월 이상이어야 합니다.');
    }
    
    if (terms.contractConditions.penaltyRate < 0 || terms.contractConditions.penaltyRate > 100) {
      errors.push('위약금 비율은 0-100% 사이여야 합니다.');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
