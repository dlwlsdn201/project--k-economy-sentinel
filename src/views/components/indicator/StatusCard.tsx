import type { EconomicIndicator, IndicatorStatus } from '@models/types/indicatorTypes';
import { AlertCircle, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface StatusCardProps {
  indicator: EconomicIndicator;
}

const STATUS_CONFIG: Record<
  IndicatorStatus,
  {
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  SAFE: {
    color: 'text-status-safe',
    bgColor: 'bg-green-50',
    borderColor: 'border-status-safe',
    icon: <CheckCircle2 className="h-6 w-6 text-status-safe" />,
    label: '정상',
  },
  WARNING: {
    color: 'text-status-warning',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-status-warning',
    icon: <AlertTriangle className="h-6 w-6 text-status-warning" />,
    label: '주의',
  },
  DANGER: {
    color: 'text-status-danger',
    bgColor: 'bg-red-50',
    borderColor: 'border-status-danger',
    icon: <AlertCircle className="h-6 w-6 text-status-danger" />,
    label: '위험',
  },
};

export const StatusCard = ({ indicator }: StatusCardProps) => {
  const config = STATUS_CONFIG[indicator.status];

  const formatValue = (value: number, unit: string): string => {
    if (unit === '억원' || unit === '억 달러') {
      return `${value.toLocaleString('ko-KR')} ${unit}`;
    }
    return `${value.toLocaleString('ko-KR')}${unit}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // 상대 시간 표시
    if (diffMins < 1) {
      return '방금 전';
    }
    if (diffMins < 60) {
      return `${diffMins}분 전`;
    }
    if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
    if (diffDays < 7) {
      return `${diffDays}일 전`;
    }

    // 7일 이상이면 절대 날짜 표시
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`
        rounded-lg border-2 p-6 transition-all hover:shadow-lg
        ${config.bgColor} ${config.borderColor}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {indicator.name}
          </h3>
          <p className="text-xs text-gray-500">{indicator.source}</p>
        </div>
        <div className="flex-shrink-0">{config.icon}</div>
      </div>

      {/* 데이터 수집 시간 표시 */}
      <div className="mb-4 flex items-center gap-1 text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        <span>업데이트: {formatDate(indicator.fetchedAt)}</span>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-bold ${config.color}`}>
            {formatValue(indicator.value, indicator.unit)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${config.color} ${config.bgColor} border ${config.borderColor}
          `}
        >
          {config.label}
        </span>
      </div>

      {indicator.description && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            {indicator.description}
          </p>
        </div>
      )}
    </div>
  );
};

