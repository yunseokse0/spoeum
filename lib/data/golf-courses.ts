import { GolfCourse } from '@/types';
import api from '@/lib/api';

// 한국 주요 골프장 데이터 (실제 운영 시 외부 DB 연동)
let golfCourses: GolfCourse[] = [
  // 서울/경기
  {
    id: 'gc_001',
    name: '서울골프클럽',
    region: '서울',
    city: '서울시',
    code: 'SGC',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    website: 'https://seoulgc.co.kr',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'gc_002',
    name: '경기골프리조트',
    region: '경기',
    city: '성남시',
    code: 'GGR',
    address: '경기도 성남시 분당구 판교로 456',
    phone: '031-2345-6789',
    website: 'https://ggr.co.kr',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'gc_003',
    name: '잠실골프클럽',
    region: '서울',
    city: '서울시',
    code: 'JGC',
    address: '서울시 송파구 올림픽로 789',
    phone: '02-3456-7890',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // 강원도
  {
    id: 'gc_004',
    name: '강원도 골프클럽',
    region: '강원',
    city: '춘천시',
    code: 'GWC',
    address: '강원도 춘천시 중앙로 101',
    phone: '033-4567-8901',
    website: 'https://gwc.co.kr',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'gc_005',
    name: '평창 골프리조트',
    region: '강원',
    city: '평창군',
    code: 'PGR',
    address: '강원도 평창군 진부면 오대산로 202',
    phone: '033-5678-9012',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // 제주도
  {
    id: 'gc_006',
    name: '제주 블루원',
    region: '제주',
    city: '서귀포시',
    code: 'JBO',
    address: '제주특별자치도 서귀포시 중문동 303',
    phone: '064-6789-0123',
    website: 'https://jejublueone.co.kr',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'gc_007',
    name: '제주 핀크스',
    region: '제주',
    city: '제주시',
    code: 'JPX',
    address: '제주특별자치도 제주시 애월읍 404',
    phone: '064-7890-1234',
    website: 'https://jejupinx.co.kr',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'gc_008',
    name: '제주 해비치',
    region: '제주',
    city: '서귀포시',
    code: 'JHC',
    address: '제주특별자치도 서귀포시 성산읍 505',
    phone: '064-8901-2345',
    website: 'https://jejuhaevichi.co.kr',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // 경상도
  {
    id: 'gc_009',
    name: '부산 골프클럽',
    region: '경남',
    city: '부산시',
    code: 'BGC',
    address: '부산광역시 해운대구 해운대로 606',
    phone: '051-9012-3456',
    website: 'https://busangc.co.kr',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'gc_010',
    name: '대구 골프리조트',
    region: '경북',
    city: '대구시',
    code: 'DGR',
    address: '대구광역시 달서구 성서로 707',
    phone: '053-0123-4567',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // 전라도
  {
    id: 'gc_011',
    name: '전주 골프클럽',
    region: '전북',
    city: '전주시',
    code: 'JJC',
    address: '전라북도 전주시 완산구 효자로 808',
    phone: '063-1234-5678',
    website: 'https://jeonjugc.co.kr',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'gc_012',
    name: '광주 골프리조트',
    region: '전남',
    city: '광주시',
    code: 'GJR',
    address: '광주광역시 서구 상무대로 909',
    phone: '062-2345-6789',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  // 충청도
  {
    id: 'gc_013',
    name: '청주 골프클럽',
    region: '충북',
    city: '청주시',
    code: 'CJC',
    address: '충청북도 청주시 상당구 상당로 1010',
    phone: '043-3456-7890',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'gc_014',
    name: '대전 골프리조트',
    region: '충남',
    city: '대전시',
    code: 'DJR',
    address: '대전광역시 유성구 대학로 1111',
    phone: '042-4567-8901',
    website: 'https://daejeongr.co.kr',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// 골프장 데이터 동기화
export async function syncGolfCoursesData(): Promise<void> {
  try {
    const response = await api.getGolfCourses();
    if (response.success && response.data) {
      golfCourses = response.data;
      console.log(`골프장 데이터 동기화 완료: ${golfCourses.length}개`);
    }
  } catch (error) {
    console.error('골프장 데이터 동기화 오류:', error);
  }
}

// 골프장 데이터 새로고침 (자동 동기화 실행)
export async function refreshGolfCoursesData(): Promise<void> {
  try {
    const response = await api.syncGolfCourses();
    if (response.success && response.data) {
      golfCourses = response.data.courses || [];
      console.log(`골프장 데이터 새로고침 완료: ${golfCourses.length}개`);
    }
  } catch (error) {
    console.error('골프장 데이터 새로고침 오류:', error);
  }
}

// 골프장 검색 함수
export function searchGolfCourses(query: string, region?: string): GolfCourse[] {
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) return [];

  return golfCourses
    .filter(course => {
      // 활성 상태인 골프장만
      if (!course.isActive) return false;
      
      // 지역 필터
      if (region && course.region !== region) return false;
      
      // 검색어 매칭 (이름, 지역, 도시, 코드)
      return (
        course.name.toLowerCase().includes(lowerQuery) ||
        course.region.toLowerCase().includes(lowerQuery) ||
        course.city.toLowerCase().includes(lowerQuery) ||
        course.code.toLowerCase().includes(lowerQuery)
      );
    })
    .sort((a, b) => {
      // 이름으로 시작하는 것을 우선순위
      const aStartsWith = a.name.toLowerCase().startsWith(lowerQuery);
      const bStartsWith = b.name.toLowerCase().startsWith(lowerQuery);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // 그 다음은 이름 순
      return a.name.localeCompare(b.name);
    });
}

// 지역별 골프장 조회
export function getGolfCoursesByRegion(region: string): GolfCourse[] {
  return golfCourses.filter(course => 
    course.isActive && course.region === region
  );
}

// 모든 지역 목록
export function getAllRegions(): string[] {
  const regions = new Set(golfCourses.map(course => course.region));
  return Array.from(regions).sort();
}

// 골프장 ID로 조회
export function getGolfCourseById(id: string): GolfCourse | undefined {
  return golfCourses.find(course => course.id === id);
}

// 골프장 이름으로 조회
export function getGolfCourseByName(name: string): GolfCourse | undefined {
  return golfCourses.find(course => course.name === name);
}
