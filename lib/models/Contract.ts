import { executeQuery, executeQueryOne, executeTransaction } from '@/lib/database/connection';
import { ContractType, ContractStatus } from '@/types';

export interface Contract {
  id: string;
  contract_type: ContractType;
  status: ContractStatus;
  tour_pro_id?: string;
  caddy_id?: string;
  amateur_id?: string;
  sponsor_id?: string;
  base_salary: number;
  tournament_count: number;
  win_bonus_percentage: number;
  win_bonus_min_amount: number;
  win_bonus_max_amount: number;
  tournament_bonus_first: number;
  tournament_bonus_second: number;
  tournament_bonus_third: number;
  tournament_bonus_top10: number;
  tournament_bonus_participation: number;
  domestic_transportation: boolean;
  domestic_accommodation: boolean;
  domestic_meals: boolean;
  jeju_transportation: boolean;
  jeju_accommodation: boolean;
  jeju_meals: boolean;
  overseas_transportation: boolean;
  overseas_accommodation: boolean;
  overseas_meals: boolean;
  overseas_visa: boolean;
  duration_months: number;
  penalty_rate: number;
  termination_notice_period_days: number;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateContractData {
  contract_type: ContractType;
  tour_pro_id?: string;
  caddy_id?: string;
  amateur_id?: string;
  sponsor_id?: string;
  base_salary: number;
  tournament_count?: number;
  win_bonus_percentage?: number;
  win_bonus_min_amount?: number;
  win_bonus_max_amount?: number;
  tournament_bonus_first?: number;
  tournament_bonus_second?: number;
  tournament_bonus_third?: number;
  tournament_bonus_top10?: number;
  tournament_bonus_participation?: number;
  domestic_transportation?: boolean;
  domestic_accommodation?: boolean;
  domestic_meals?: boolean;
  jeju_transportation?: boolean;
  jeju_accommodation?: boolean;
  jeju_meals?: boolean;
  overseas_transportation?: boolean;
  overseas_accommodation?: boolean;
  overseas_meals?: boolean;
  overseas_visa?: boolean;
  duration_months?: number;
  penalty_rate?: number;
  termination_notice_period_days?: number;
  start_date: Date;
  end_date: Date;
}

export interface UpdateContractData {
  status?: ContractStatus;
  base_salary?: number;
  tournament_count?: number;
  win_bonus_percentage?: number;
  win_bonus_min_amount?: number;
  win_bonus_max_amount?: number;
  tournament_bonus_first?: number;
  tournament_bonus_second?: number;
  tournament_bonus_third?: number;
  tournament_bonus_top10?: number;
  tournament_bonus_participation?: number;
  domestic_transportation?: boolean;
  domestic_accommodation?: boolean;
  domestic_meals?: boolean;
  jeju_transportation?: boolean;
  jeju_accommodation?: boolean;
  jeju_meals?: boolean;
  overseas_transportation?: boolean;
  overseas_accommodation?: boolean;
  overseas_meals?: boolean;
  overseas_visa?: boolean;
  duration_months?: number;
  penalty_rate?: number;
  termination_notice_period_days?: number;
  start_date?: Date;
  end_date?: Date;
}

export class ContractModel {
  // 계약 생성
  static async create(contractData: CreateContractData): Promise<Contract> {
    const query = `
      INSERT INTO contracts (
        contract_type, tour_pro_id, caddy_id, amateur_id, sponsor_id,
        base_salary, tournament_count, win_bonus_percentage, win_bonus_min_amount, win_bonus_max_amount,
        tournament_bonus_first, tournament_bonus_second, tournament_bonus_third, 
        tournament_bonus_top10, tournament_bonus_participation,
        domestic_transportation, domestic_accommodation, domestic_meals,
        jeju_transportation, jeju_accommodation, jeju_meals,
        overseas_transportation, overseas_accommodation, overseas_meals, overseas_visa,
        duration_months, penalty_rate, termination_notice_period_days,
        start_date, end_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      contractData.contract_type,
      contractData.tour_pro_id || null,
      contractData.caddy_id || null,
      contractData.amateur_id || null,
      contractData.sponsor_id || null,
      contractData.base_salary,
      contractData.tournament_count || 0,
      contractData.win_bonus_percentage || 0,
      contractData.win_bonus_min_amount || 0,
      contractData.win_bonus_max_amount || 0,
      contractData.tournament_bonus_first || 0,
      contractData.tournament_bonus_second || 0,
      contractData.tournament_bonus_third || 0,
      contractData.tournament_bonus_top10 || 0,
      contractData.tournament_bonus_participation || 0,
      contractData.domestic_transportation || false,
      contractData.domestic_accommodation || false,
      contractData.domestic_meals || false,
      contractData.jeju_transportation || false,
      contractData.jeju_accommodation || false,
      contractData.jeju_meals || false,
      contractData.overseas_transportation || false,
      contractData.overseas_accommodation || false,
      contractData.overseas_meals || false,
      contractData.overseas_visa || false,
      contractData.duration_months || 1,
      contractData.penalty_rate || 20,
      contractData.termination_notice_period_days || 7,
      contractData.start_date,
      contractData.end_date
    ];
    
    const result = await executeQuery(query, params);
    return this.findById(result.insertId);
  }

  // ID로 계약 조회
  static async findById(id: string): Promise<Contract | null> {
    const query = 'SELECT * FROM contracts WHERE id = ?';
    return executeQueryOne<Contract>(query, [id]);
  }

  // 사용자별 계약 조회
  static async findByUserId(
    userId: string,
    userType: 'tour_pro' | 'caddy' | 'amateur' | 'sponsor'
  ): Promise<Contract[]> {
    let whereClause = '';
    switch (userType) {
      case 'tour_pro':
        whereClause = 'WHERE tour_pro_id = ?';
        break;
      case 'caddy':
        whereClause = 'WHERE caddy_id = ?';
        break;
      case 'amateur':
        whereClause = 'WHERE amateur_id = ?';
        break;
      case 'sponsor':
        whereClause = 'WHERE sponsor_id = ?';
        break;
    }
    
    const query = `SELECT * FROM contracts ${whereClause} ORDER BY created_at DESC`;
    return executeQuery<Contract>(query, [userId]);
  }

  // 계약 상태별 조회
  static async findByStatus(status: ContractStatus): Promise<Contract[]> {
    const query = 'SELECT * FROM contracts WHERE status = ? ORDER BY created_at DESC';
    return executeQuery<Contract>(query, [status]);
  }

  // 계약 타입별 조회
  static async findByType(contractType: ContractType): Promise<Contract[]> {
    const query = 'SELECT * FROM contracts WHERE contract_type = ? ORDER BY created_at DESC';
    return executeQuery<Contract>(query, [contractType]);
  }

  // 계약 업데이트
  static async update(id: string, contractData: UpdateContractData): Promise<Contract | null> {
    const fields = [];
    const params = [];
    
    Object.entries(contractData).forEach(([key, value]) => {
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
    
    const query = `UPDATE contracts SET ${fields.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);
    
    return this.findById(id);
  }

  // 계약 삭제
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM contracts WHERE id = ?';
    const result = await executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  // 계약 목록 조회 (페이지네이션)
  static async findMany(
    page: number = 1,
    limit: number = 10,
    contractType?: ContractType,
    status?: ContractStatus,
    userId?: string
  ): Promise<{ contracts: Contract[]; total: number }> {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (contractType) {
      whereClause += ' AND contract_type = ?';
      params.push(contractType);
    }
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    if (userId) {
      whereClause += ' AND (tour_pro_id = ? OR caddy_id = ? OR amateur_id = ? OR sponsor_id = ?)';
      params.push(userId, userId, userId, userId);
    }
    
    // 전체 개수 조회
    const countQuery = `SELECT COUNT(*) as total FROM contracts ${whereClause}`;
    const countResult = await executeQueryOne<{ total: number }>(countQuery, params);
    const total = countResult?.total || 0;
    
    // 계약 목록 조회
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM contracts 
      ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const contracts = await executeQuery<Contract>(query, [...params, limit, offset]);
    
    return { contracts, total };
  }

  // 계약 검색
  static async search(
    searchTerm: string,
    contractType?: ContractType,
    status?: ContractStatus,
    limit: number = 10
  ): Promise<Contract[]> {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (searchTerm) {
      whereClause += ' AND (id LIKE ? OR contract_type LIKE ?)';
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }
    
    if (contractType) {
      whereClause += ' AND contract_type = ?';
      params.push(contractType);
    }
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    const query = `
      SELECT * FROM contracts 
      ${whereClause} 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    
    return executeQuery<Contract>(query, [...params, limit]);
  }

  // 계약 통계
  static async getStats(userId?: string): Promise<{
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    totalEarnings: number;
  }> {
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (userId) {
      whereClause += ' AND (tour_pro_id = ? OR caddy_id = ? OR amateur_id = ? OR sponsor_id = ?)';
      params.push(userId, userId, userId, userId);
    }
    
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status = 'completed' THEN base_salary ELSE 0 END) as totalEarnings
      FROM contracts 
      ${whereClause}
    `;
    
    const result = await executeQueryOne<{
      total: number;
      active: number;
      completed: number;
      cancelled: number;
      totalEarnings: number;
    }>(query, params);
    
    return result || {
      total: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      totalEarnings: 0
    };
  }
}
