import { executeQuery, executeQueryOne } from '@/lib/database/connection';

export interface GolfCourse {
  id: string;
  name: string;
  region: string;
  city: string;
  address?: string;
  phone?: string;
  website?: string;
  total_area?: number;
  holes: number;
  course_type: '회원제' | '대중제';
  owner?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateGolfCourseData {
  name: string;
  region: string;
  city: string;
  address?: string;
  phone?: string;
  website?: string;
  total_area?: number;
  holes?: number;
  course_type: '회원제' | '대중제';
  owner?: string;
}

export interface UpdateGolfCourseData {
  name?: string;
  region?: string;
  city?: string;
  address?: string;
  phone?: string;
  website?: string;
  total_area?: number;
  holes?: number;
  course_type?: '회원제' | '대중제';
  owner?: string;
}

export class GolfCourseModel {
  // 골프장 생성
  static async create(courseData: CreateGolfCourseData): Promise<GolfCourse> {
    const query = `
      INSERT INTO golf_courses (
        name, region, city, address, phone, website, 
        total_area, holes, course_type, owner
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      courseData.name,
      courseData.region,
      courseData.city,
      courseData.address || null,
      courseData.phone || null,
      courseData.website || null,
      courseData.total_area || null,
      courseData.holes || 18,
      courseData.course_type,
      courseData.owner || null
    ];
    
    const result = await executeQuery(query, params);
    const insertId = (result as any)[0]?.insertId;
    if (!insertId) {
      throw new Error('골프장 생성에 실패했습니다.');
    }
    const golfCourse = await this.findById(insertId);
    if (!golfCourse) {
      throw new Error('생성된 골프장을 찾을 수 없습니다.');
    }
    return golfCourse;
  }

  // ID로 골프장 조회
  static async findById(id: string): Promise<GolfCourse | null> {
    const query = 'SELECT * FROM golf_courses WHERE id = ?';
    return executeQueryOne<GolfCourse>(query, [id]);
  }

  // 이름으로 골프장 조회
  static async findByName(name: string): Promise<GolfCourse | null> {
    const query = 'SELECT * FROM golf_courses WHERE name = ?';
    return executeQueryOne<GolfCourse>(query, [name]);
  }

  // 지역별 골프장 조회
  static async findByRegion(region: string): Promise<GolfCourse[]> {
    const query = 'SELECT * FROM golf_courses WHERE region = ? ORDER BY name ASC';
    return executeQuery<GolfCourse>(query, [region]);
  }

  // 도시별 골프장 조회
  static async findByCity(city: string): Promise<GolfCourse[]> {
    const query = 'SELECT * FROM golf_courses WHERE city = ? ORDER BY name ASC';
    return executeQuery<GolfCourse>(query, [city]);
  }

  // 골프장 타입별 조회
  static async findByType(courseType: '회원제' | '대중제'): Promise<GolfCourse[]> {
    const query = 'SELECT * FROM golf_courses WHERE course_type = ? ORDER BY name ASC';
    return executeQuery<GolfCourse>(query, [courseType]);
  }

  // 골프장 업데이트
  static async update(id: string, courseData: UpdateGolfCourseData): Promise<GolfCourse | null> {
    const fields = [];
    const params = [];
    
    Object.entries(courseData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    });
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const query = `UPDATE golf_courses SET ${fields.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);
    
    return this.findById(id);
  }

  // 골프장 삭제
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM golf_courses WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return (result as any)[0]?.affectedRows > 0;
  }

  // 골프장 목록 조회 (페이지네이션)
  static async findMany(
    page: number = 1,
    limit: number = 10,
    region?: string,
    city?: string,
    courseType?: '회원제' | '대중제'
  ): Promise<{ courses: GolfCourse[]; total: number }> {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (region) {
      whereClause += ' AND region = ?';
      params.push(region);
    }
    
    if (city) {
      whereClause += ' AND city = ?';
      params.push(city);
    }
    
    if (courseType) {
      whereClause += ' AND course_type = ?';
      params.push(courseType);
    }
    
    // 전체 개수 조회
    const countQuery = `SELECT COUNT(*) as total FROM golf_courses ${whereClause}`;
    const countResult = await executeQueryOne<{ total: number }>(countQuery, params);
    const total = countResult?.total || 0;
    
    // 골프장 목록 조회
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM golf_courses 
      ${whereClause} 
      ORDER BY name ASC 
      LIMIT ? OFFSET ?
    `;
    
    const courses = await executeQuery<GolfCourse>(query, [...params, limit, offset]);
    
    return { courses, total };
  }

  // 골프장 검색
  static async search(
    searchTerm: string,
    region?: string,
    city?: string,
    courseType?: '회원제' | '대중제',
    limit: number = 20
  ): Promise<GolfCourse[]> {
    let whereClause = 'WHERE (name LIKE ? OR address LIKE ?)';
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];
    
    if (region) {
      whereClause += ' AND region = ?';
      params.push(region);
    }
    
    if (city) {
      whereClause += ' AND city = ?';
      params.push(city);
    }
    
    if (courseType) {
      whereClause += ' AND course_type = ?';
      params.push(courseType);
    }
    
    const query = `
      SELECT * FROM golf_courses 
      ${whereClause} 
      ORDER BY name ASC 
      LIMIT ?
    `;
    
    return executeQuery<GolfCourse>(query, [...params, limit]);
  }

  // 지역별 통계
  static async getRegionStats(): Promise<{ region: string; count: number }[]> {
    const query = `
      SELECT region, COUNT(*) as count 
      FROM golf_courses 
      GROUP BY region 
      ORDER BY count DESC
    `;
    return executeQuery<{ region: string; count: number }>(query);
  }

  // 골프장 타입별 통계
  static async getTypeStats(): Promise<{ course_type: string; count: number }[]> {
    const query = `
      SELECT course_type, COUNT(*) as count 
      FROM golf_courses 
      GROUP BY course_type 
      ORDER BY count DESC
    `;
    return executeQuery<{ course_type: string; count: number }>(query);
  }

  // 전체 통계
  static async getStats(): Promise<{
    total: number;
    averageHoles: number;
    averageArea: number;
    regionCount: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        AVG(holes) as averageHoles,
        AVG(total_area) as averageArea,
        COUNT(DISTINCT region) as regionCount
      FROM golf_courses
    `;
    
    const result = await executeQueryOne<{
      total: number;
      averageHoles: number;
      averageArea: number;
      regionCount: number;
    }>(query);
    
    return result || {
      total: 0,
      averageHoles: 0,
      averageArea: 0,
      regionCount: 0
    };
  }
}
