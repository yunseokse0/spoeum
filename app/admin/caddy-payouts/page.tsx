'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  DollarSign, 
  Trophy, 
  Users,
  CheckCircle,
  Clock,
  Calculator,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  association: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface Payout {
  id: string;
  tournament_id: string;
  player_name: string;
  rank: number;
  prize_amount: number;
  caddy_name: string;
  payout_rate: number;
  payout_amount: number;
  paid_status: boolean;
  paid_date: string | null;
}

export default function CaddyPayoutsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 대회 목록 로드
  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      if (data.success) {
        setTournaments(data.tournaments || []);
      }
    } catch (err) {
      console.error('대회 목록 로드 실패:', err);
    }
  };

  // 정산 내역 로드
  const loadPayouts = async (tournamentId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payouts/${tournamentId}`);
      const data = await res.json();
      if (data.success) {
        setPayouts(data.payouts || []);
      } else {
        setError(data.error || '정산 내역을 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('정산 내역 로드 중 오류가 발생했습니다.');
      console.error('정산 내역 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 캐디 정산 계산
  const handleCalculate = async () => {
    if (!selectedTournament) return;

    setIsCalculating(true);
    setError(null);
    try {
      const res = await fetch(`/api/payouts/calculate?tournamentId=${selectedTournament.id}`, {
        method: 'POST'
      });
      const data = await res.json();
      
      if (data.success) {
        setPayouts(data.payouts || []);
        alert(`✅ ${data.payouts?.length || 0}건의 캐디 정산이 계산되었습니다.`);
      } else {
        setError(data.error || '정산 계산에 실패했습니다.');
      }
    } catch (err) {
      setError('정산 계산 중 오류가 발생했습니다.');
      console.error('정산 계산 실패:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  // 정산 완료 처리
  const handleConfirmPayout = async (payoutId: string) => {
    if (!confirm('이 정산을 완료 처리하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/payouts/confirm/${payoutId}`, {
        method: 'POST'
      });
      const data = await res.json();
      
      if (data.success) {
        // 정산 내역 새로고침
        if (selectedTournament) {
          loadPayouts(selectedTournament.id);
        }
        alert('✅ 정산이 완료되었습니다.');
      } else {
        alert('❌ 정산 완료 처리에 실패했습니다.');
      }
    } catch (err) {
      console.error('정산 완료 처리 실패:', err);
      alert('오류가 발생했습니다.');
    }
  };

  // 대회 선택
  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    loadPayouts(tournament.id);
  };

  // 통계 계산
  const stats = {
    total: payouts.length,
    paid: payouts.filter(p => p.paid_status).length,
    pending: payouts.filter(p => !p.paid_status).length,
    totalAmount: payouts.reduce((sum, p) => sum + p.payout_amount, 0),
    paidAmount: payouts.filter(p => p.paid_status).reduce((sum, p) => sum + p.payout_amount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <DollarSign className="h-8 w-8 mr-3 text-green-500" />
                캐디 정산 관리
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                대회 결과 기반 캐디 수당 자동 계산 시스템
              </p>
            </div>
            <Button
              onClick={() => router.push('/admin')}
              variant="outline"
            >
              ← 관리자 홈
            </Button>
          </div>
        </div>

        {/* 대회 선택 */}
        <Card className="mb-6">
          <CardBody className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              대회 선택
            </h2>
            <select
              value={selectedTournament?.id || ''}
              onChange={(e) => {
                const tournament = tournaments.find(t => t.id === e.target.value);
                if (tournament) handleTournamentSelect(tournament);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">대회를 선택하세요</option>
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>
                  [{t.association}] {t.name} ({t.start_date})
                </option>
              ))}
            </select>

            {selectedTournament && (
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      계산 중...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      캐디 정산 계산하기
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => loadPayouts(selectedTournament.id)}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  새로고침
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* 통계 카드 */}
        {selectedTournament && payouts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">총 정산</p>
                    <p className="text-2xl font-bold">{stats.total}건</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">완료</p>
                    <p className="text-2xl font-bold text-green-600">{stats.paid}건</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">대기중</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}건</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 지급액</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.totalAmount.toLocaleString()}원
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">지급 완료</p>
                  <p className="text-lg font-bold text-green-600">
                    {stats.paidAmount.toLocaleString()}원
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* 오류 메시지 */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardBody className="p-4">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            </CardBody>
          </Card>
        )}

        {/* 정산 테이블 */}
        {selectedTournament && (
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  정산 내역
                </h2>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  엑셀 다운로드
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">정산 내역을 불러오는 중...</p>
                </div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">정산 내역이 없습니다.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    "캐디 정산 계산하기" 버튼을 클릭하여 정산을 생성하세요.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">순위</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">선수명</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">상금</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">캐디</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">지급율</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold">지급액</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">상태</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold">액션</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {payouts.map((payout) => (
                        <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-3 text-sm font-medium">{payout.rank}위</td>
                          <td className="px-4 py-3 text-sm">{payout.player_name}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            {payout.prize_amount.toLocaleString()}원
                          </td>
                          <td className="px-4 py-3 text-sm">{payout.caddy_name}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            {payout.payout_rate}%
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                            {payout.payout_amount.toLocaleString()}원
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            {payout.paid_status ? (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                ✅ 완료
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                ⏳ 대기
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {!payout.paid_status && (
                              <Button
                                onClick={() => handleConfirmPayout(payout.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                완료
                              </Button>
                            )}
                            {payout.paid_status && payout.paid_date && (
                              <span className="text-xs text-gray-500">
                                {new Date(payout.paid_date).toLocaleDateString('ko-KR')}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* 시스템 정보 */}
        <Card className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardBody className="p-6">
            <h3 className="text-lg font-bold mb-3 text-blue-900 dark:text-blue-100">
              💡 캐디 정산 시스템 안내
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
              <div>
                <h4 className="font-semibold mb-2">🎯 정산 규칙</h4>
                <ul className="space-y-1 text-xs">
                  <li>• 1위~10위: 상금의 10%</li>
                  <li>• 11위~30위: 상금의 7%</li>
                  <li>• 31위~50위: 상금의 5%</li>
                  <li>• 51위 이상: 상금의 3%</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔄 프로세스</h4>
                <ul className="space-y-1 text-xs">
                  <li>1. 대회 선택</li>
                  <li>2. "캐디 정산 계산하기" 클릭</li>
                  <li>3. 정산 내역 확인</li>
                  <li>4. 개별 정산 완료 처리</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

