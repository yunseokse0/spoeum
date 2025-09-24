import { executeQuery, executeQueryOne } from '@/lib/database/connection';
import { UserType, UserStatus } from '@/types';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  profile_image?: string;
  user_type: UserType;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  profile_image?: string;
  user_type: UserType;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  profile_image?: string;
  status?: UserStatus;
}

export class UserModel {
  // 사용자 생성
  static async create(userData: CreateUserData): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash, name, phone, profile_image, user_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      userData.email,
      userData.password_hash,
      userData.name,
      userData.phone || null,
      userData.profile_image || null,
      userData.user_type
    ];
    
    const result = await executeQuery(query, params);
    return this.findById(result.insertId);
  }

  // ID로 사용자 조회
  static async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = ?';
    return executeQueryOne<User>(query, [id]);
  }

  // 이메일로 사용자 조회
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = ?';
    return executeQueryOne<User>(query, [email]);
  }

  // 사용자 타입별 조회
  static async findByUserType(userType: UserType): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE user_type = ? AND status = "active"';
    return executeQuery<User>(query, [userType]);
  }

  // 사용자 업데이트
  static async update(id: string, userData: UpdateUserData): Promise<User | null> {
    const fields = [];
    const params = [];
    
    if (userData.name !== undefined) {
      fields.push('name = ?');
      params.push(userData.name);
    }
    if (userData.phone !== undefined) {
      fields.push('phone = ?');
      params.push(userData.phone);
    }
    if (userData.profile_image !== undefined) {
      fields.push('profile_image = ?');
      params.push(userData.profile_image);
    }
    if (userData.status !== undefined) {
      fields.push('status = ?');
      params.push(userData.status);
    }
    
    if (fields.length === 0) {
      return this.findById(id);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);
    
    return this.findById(id);
  }

  // 사용자 삭제 (소프트 삭제)
  static async delete(id: string): Promise<boolean> {
    const query = 'UPDATE users SET status = "inactive" WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // 사용자 목록 조회 (페이지네이션)
  static async findMany(
    page: number = 1,
    limit: number = 10,
    userType?: UserType,
    status?: UserStatus
  ): Promise<{ users: User[]; total: number }> {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (userType) {
      whereClause += ' AND user_type = ?';
      params.push(userType);
    }
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    // 전체 개수 조회
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const countResult = await executeQueryOne<{ total: number }>(countQuery, params);
    const total = countResult?.total || 0;
    
    // 사용자 목록 조회
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM users 
      ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const users = await executeQuery<User>(query, [...params, limit, offset]);
    
    return { users, total };
  }

  // 사용자 검색
  static async search(
    searchTerm: string,
    userType?: UserType,
    limit: number = 10
  ): Promise<User[]> {
    let whereClause = 'WHERE (name LIKE ? OR email LIKE ?)';
    const params = [`%${searchTerm}%`, `%${searchTerm}%`];
    
    if (userType) {
      whereClause += ' AND user_type = ?';
      params.push(userType);
    }
    
    whereClause += ' AND status = "active"';
    
    const query = `
      SELECT * FROM users 
      ${whereClause} 
      ORDER BY name ASC 
      LIMIT ?
    `;
    
    return executeQuery<User>(query, [...params, limit]);
  }
}
