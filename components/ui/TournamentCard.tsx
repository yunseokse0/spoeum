import React from 'react';
import { Tournament } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  DollarSign,
  Clock,
  ExternalLink,
  Star
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

interface TournamentCardProps {
  tournament: Tournament;
  onViewDetails?: (tournament: Tournament) => void;
  onRegister?: (tournament: Tournament) => void;
  showActions?: boolean;
  className?: string;
}

export function TournamentCard({
  tournament,
  onViewDetails,
  onRegister,
  showActions = true,
  className
}: TournamentCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pga':
        return 'primary';
      case 'kpga':
        return 'success';
      case 'amateur':
        return 'warning';
      case 'corporate':
        return 'secondary';
      case 'charity':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pga':
        return 'PGA 투어';
      case 'kpga':
        return 'KPGA 투어';
      case 'amateur':
        return '아마추어';
      case 'corporate':
        return '기업';
      case 'charity':
        return '자선';
      default:
        return type;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'men':
        return '남성';
      case 'women':
        return '여성';
      case 'senior':
        return '시니어';
      case 'junior':
        return '주니어';
      case 'mixed':
        return '혼성';
      default:
        return category;
    }
  };

  const isRegistrationOpen = () => {
    const now = new Date();
    return tournament.isRegistrationOpen && 
           tournament.registrationStartDate <= now && 
           tournament.registrationEndDate >= now;
  };

  const isTournamentActive = () => {
    const now = new Date();
    return tournament.startDate <= now && tournament.endDate >= now;
  };

  const isTournamentUpcoming = () => {
    const now = new Date();
    return tournament.startDate > now;
  };

  const isTournamentCompleted = () => {
    const now = new Date();
    return tournament.endDate < now;
  };

  const getStatusBadge = () => {
    if (isTournamentCompleted()) {
      return <Badge variant="secondary">종료</Badge>;
    } else if (isTournamentActive()) {
      return <Badge variant="success">진행중</Badge>;
    } else if (isTournamentUpcoming()) {
      return <Badge variant="primary">예정</Badge>;
    } else {
      return <Badge variant="secondary">대기</Badge>;
    }
  };

  const getRegistrationBadge = () => {
    if (isRegistrationOpen()) {
      return <Badge variant="success">접수중</Badge>;
    } else if (tournament.registrationEndDate < new Date()) {
      return <Badge variant="error">접수마감</Badge>;
    } else {
      return <Badge variant="warning">접수예정</Badge>;
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${className}`}>
      <CardBody>
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={getTypeColor(tournament.type)}>
                {getTypeLabel(tournament.type)}
              </Badge>
              <Badge variant="outline">
                {getCategoryLabel(tournament.category)}
              </Badge>
              {getStatusBadge()}
              {getRegistrationBadge()}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {tournament.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {tournament.description}
            </p>
          </div>
          {tournament.imageUrl && (
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg ml-4 flex-shrink-0">
              <img
                src={tournament.imageUrl}
                alt={tournament.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* 대회 정보 */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(tournament.startDate)} ~ {formatDate(tournament.endDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{tournament.location} • {tournament.course}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 mr-2" />
            <span>{tournament.currentParticipants} / {tournament.maxParticipants}명</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>참가비: {formatCurrency(tournament.entryFee)}</span>
            {tournament.prizePool > 0 && (
              <span className="ml-4">상금: {formatCurrency(tournament.prizePool)}</span>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Trophy className="h-4 w-4 mr-2" />
            <span>{tournament.organizer}</span>
          </div>
        </div>

        {/* 접수 기간 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
            <Clock className="h-4 w-4 mr-2" />
            <span>접수 기간</span>
          </div>
          <p className="text-sm text-gray-900 dark:text-white">
            {formatDate(tournament.registrationStartDate)} ~ {formatDate(tournament.registrationEndDate)}
          </p>
        </div>

        {/* 액션 버튼 */}
        {showActions && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(tournament)}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              자세히 보기
            </Button>
            
            {isRegistrationOpen() && (
              <Button
                size="sm"
                onClick={() => onRegister?.(tournament)}
                className="flex-1"
              >
                <Star className="h-4 w-4 mr-1" />
                접수하기
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
