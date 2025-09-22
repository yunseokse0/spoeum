'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  PenTool, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Shield,
  Calendar,
  User,
  DollarSign,
  MapPin
} from 'lucide-react';

interface ContractSigningProps {
  contractId: string;
  className?: string;
}

export function ContractSigning({ contractId, className }: ContractSigningProps) {
  const [isSigned, setIsSigned] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState('');

  // Mock 계약 데이터
  const contractData = {
    id: contractId,
    title: 'KLPGA 투어 캐디 매칭 계약',
    parties: {
      client: '김골퍼',
      provider: '이캐디'
    },
    terms: {
      duration: '2024-03-15 ~ 2024-03-17',
      location: '제주 블루원 CC',
      baseRate: 500000,
      additionalServices: ['클럽 정리', '코스 가이드', '심리 코칭']
    },
    conditions: [
      '대회 전일 사전 연습 참관',
      '경기 중 클럽 및 코스 관리',
      '선수와의 원활한 소통',
      '경기 후 정리 및 피드백 제공'
    ],
    penalties: {
      cancellationFee: 100000,
      noShowFee: 200000
    },
    status: 'pending_signature'
  };

  const handleSign = () => {
    setShowSignature(true);
  };

  const handleSignatureComplete = (signatureData: string) => {
    setSignature(signatureData);
    setIsSigned(true);
    setShowSignature(false);
  };

  const handleDownload = () => {
    // PDF 다운로드 로직
    console.log('계약서 다운로드');
  };

  const handleSubmit = () => {
    if (!isSigned) {
      alert('전자서명을 완료해주세요.');
      return;
    }
    
    // 계약 제출 로직
    console.log('계약 제출:', contractData);
    alert('계약이 성공적으로 제출되었습니다.');
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className || ''}`}>
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-golf-dark-700 flex items-center">
              📑 계약서 서명
            </h1>
            <p className="text-golf-dark-600 mt-2">
              전자서명으로 계약을 완료하세요
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleDownload} className="border-golf-green-300">
              <Download className="w-4 h-4 mr-2" />
              PDF 다운로드
            </Button>
            <Badge variant={isSigned ? 'success' : 'warning'} className="text-sm">
              {isSigned ? '서명 완료' : '서명 대기'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 계약서 내용 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 계약 기본 정보 */}
          <Card className="border-golf-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-golf-green-500 to-golf-green-600 text-white">
              <h2 className="text-xl font-semibold">계약 기본 정보</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-golf-dark-700 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    계약 당사자
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-golf-dark-600">의뢰인:</span>
                      <span className="font-medium">{contractData.parties.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-golf-dark-600">캐디:</span>
                      <span className="font-medium">{contractData.parties.provider}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-golf-dark-700 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    계약 조건
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-golf-dark-600">기간:</span>
                      <span className="font-medium">{contractData.terms.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-golf-dark-600">장소:</span>
                      <span className="font-medium">{contractData.terms.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-golf-dark-600">기본 수수료:</span>
                      <span className="font-display font-bold text-golf-green-600">
                        {contractData.terms.baseRate.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 서비스 내용 */}
          <Card className="border-golf-sky-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-golf-sky-500 to-golf-sky-600 text-white">
              <h2 className="text-xl font-semibold">서비스 내용</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-golf-dark-700 mb-3">포함 서비스</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {contractData.terms.additionalServices.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-golf-dark-600">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-golf-dark-700 mb-3">주요 조건</h3>
                  <div className="space-y-2">
                    {contractData.conditions.map((condition, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-golf-sky-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-golf-dark-600">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 위약금 및 기타 조건 */}
          <Card className="border-golf-sand-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-golf-sand-500 to-golf-sand-600 text-white">
              <h2 className="text-xl font-semibold">위약금 및 기타 조건</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    위약금 조건
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-600">계약 취소 시:</span>
                      <span className="font-medium">{contractData.penalties.cancellationFee.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">무단 불참 시:</span>
                      <span className="font-medium">{contractData.penalties.noShowFee.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    보안 및 개인정보
                  </h3>
                  <p className="text-sm text-blue-600">
                    본 계약서는 전자서명법에 따라 법적 효력을 가지며, 
                    개인정보는 관련 법령에 따라 보호됩니다.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 서명 패널 */}
        <div className="space-y-6">
          {/* 전자서명 */}
          <Card className="border-golf-green-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-golf-green-500 to-golf-green-600 text-white">
              <h2 className="text-xl font-semibold">전자서명</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                {!isSigned ? (
                  <>
                    <div className="text-center">
                      <PenTool className="w-16 h-16 text-golf-green-500 mx-auto mb-4" />
                      <p className="text-golf-dark-600 mb-4">
                        계약서 내용을 확인하신 후 전자서명을 진행해주세요.
                      </p>
                      <Button 
                        onClick={handleSign}
                        className="w-full bg-golf-green-600 hover:bg-golf-green-700"
                      >
                        <PenTool className="w-4 h-4 mr-2" />
                        전자서명 시작
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-green-600 font-semibold mb-4">
                      서명이 완료되었습니다!
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-green-600">
                        서명 일시: {new Date().toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* 계약 제출 */}
          <Card className="border-golf-sky-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-golf-sky-500 to-golf-sky-600 text-white">
              <h2 className="text-xl font-semibold">계약 제출</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-golf-sky-600" />
                  <span className="text-sm text-golf-dark-600">계약서 내용 확인</span>
                  <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                </div>
                <div className="flex items-center space-x-2">
                  <PenTool className="w-4 h-4 text-golf-sky-600" />
                  <span className="text-sm text-golf-dark-600">전자서명 완료</span>
                  {isSigned ? (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500 ml-auto" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-golf-sky-600" />
                  <span className="text-sm text-golf-dark-600">법적 효력 확인</span>
                  <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  disabled={!isSigned}
                  className={`w-full ${
                    isSigned 
                      ? 'bg-golf-sky-600 hover:bg-golf-sky-700' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isSigned ? '계약 제출하기' : '서명을 완료해주세요'}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* 도움말 */}
          <Card className="border-golf-sand-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-golf-sand-500 to-golf-sand-600 text-white">
              <h2 className="text-xl font-semibold">도움말</h2>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-golf-sand-500 rounded-full mt-2"></div>
                  <span className="text-golf-dark-600">
                    전자서명은 법적 효력을 가지며, 계약 취소 시 위약금이 발생할 수 있습니다.
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-golf-sand-500 rounded-full mt-2"></div>
                  <span className="text-golf-dark-600">
                    계약서는 PDF로 다운로드하여 보관하실 수 있습니다.
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-golf-sand-500 rounded-full mt-2"></div>
                  <span className="text-golf-dark-600">
                    문의사항이 있으시면 고객센터로 연락해주세요.
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* 서명 모달 (간단한 구현) */}
      {showSignature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-[90vw]">
            <CardHeader>
              <h3 className="text-lg font-semibold">전자서명</h3>
            </CardHeader>
            <CardBody className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-golf-dark-600">
                  아래 체크박스를 선택하여 전자서명을 완료하세요.
                </p>
                <div className="border-2 border-dashed border-golf-green-300 rounded-lg p-8 text-center">
                  <p className="text-golf-dark-500">전자서명 영역</p>
                  <p className="text-xs text-golf-dark-400 mt-2">
                    실제 구현에서는 터치/마우스 서명 기능이 제공됩니다.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="agree" 
                    className="rounded border-golf-green-300"
                  />
                  <label htmlFor="agree" className="text-sm text-golf-dark-600">
                    계약 조건에 동의하며 전자서명을 진행합니다.
                  </label>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSignature(false)}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button 
                    onClick={() => handleSignatureComplete('signed')}
                    className="flex-1 bg-golf-green-600 hover:bg-golf-green-700"
                  >
                    서명 완료
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
