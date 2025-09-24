import mysql from 'mysql2/promise';

// 데이터베이스 연결 설정
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'spoeum',
  charset: 'utf8mb4',
  timezone: '+09:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// 연결 풀 생성
let pool: mysql.Pool | null = null;

export const getPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

// 데이터베이스 연결 테스트
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getPool().getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ MySQL 데이터베이스 연결 성공');
    return true;
  } catch (error) {
    console.error('❌ MySQL 데이터베이스 연결 실패:', error);
    return false;
  }
};

// 쿼리 실행 헬퍼
export const executeQuery = async <T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> => {
  try {
    const [rows] = await getPool().execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('쿼리 실행 오류:', error);
    throw error;
  }
};

// 단일 행 조회
export const executeQueryOne = async <T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> => {
  try {
    const [rows] = await getPool().execute(query, params);
    const result = rows as T[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('쿼리 실행 오류:', error);
    throw error;
  }
};

// 트랜잭션 실행
export const executeTransaction = async <T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> => {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// 연결 종료
export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};
