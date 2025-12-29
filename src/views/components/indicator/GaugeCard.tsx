import type { EconomicIndicator } from '@models/types/indicatorTypes';
import { Clock } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface GaugeCardProps {
  indicator?: EconomicIndicator;
}

/**
 * 샘플 mock 데이터 (테스트용)
 */
const SAMPLE_MOCK_INDICATOR: EconomicIndicator = {
  id: 'bond',
  name: '국고채 10년물 금리',
  value: 3.8,
  unit: '%',
  status: 'WARNING',
  source: '한국은행 ECOS',
  description:
    '이 금리가 4%를 넘어선다면 내부 시스템의 균열이 생각보다 훨씬 심각하다는 경고등으로 봐야함.',
  fetchedAt: new Date().toISOString(),
};

/**
 * 지표별 게이지 범위 설정
 */
const getGaugeRange = (indicatorId: string): { min: number; max: number } => {
  switch (indicatorId) {
    case 'bond':
      return { min: 2.0, max: 5.0 };
    case 'exchange':
      return { min: 1200, max: 1600 };
    case 'reserve':
      return { min: 3500, max: 4500 };
    case 'pf':
      return { min: 0, max: 15 };
    case 'stock':
      return { min: -10000, max: 5000 };
    default:
      return { min: 0, max: 100 };
  }
};

/**
 * 게이지 카드 컴포넌트
 * ECharts를 사용하여 반원형 게이지 시각화
 */
export const GaugeCard = ({ indicator }: GaugeCardProps) => {
  // indicator가 없으면 샘플 데이터 사용
  const displayIndicator = indicator ?? SAMPLE_MOCK_INDICATOR;
  const { min, max } = getGaugeRange(displayIndicator.id);

  const formatValue = (value: number, unit: string): string => {
    if (unit === '억원' || unit === '억 달러') {
      return `${value.toLocaleString('ko-KR')}${unit}`;
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

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ECharts Gauge 옵션 생성
  const value = displayIndicator.value;
  const normalizedValue = Math.max(min, Math.min(max, value));

  // 현재 값에 따른 색상 결정
  const statusColor =
    displayIndicator.status === 'DANGER'
      ? '#ef4444'
      : displayIndicator.status === 'WARNING'
        ? '#eab308'
        : '#22c55e';

  // ECharts Gauge 옵션
  const gaugeOption: EChartsOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min,
        max,
        splitNumber: 6,
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.33, '#22c55e'], // 초록 (하위 33%)
              [0.66, '#eab308'], // 노랑 (중간 33%)
              [1, '#ef4444'], // 빨강 (상위 34%)
            ],
          },
        },
        pointer: {
          icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
          length: '75%',
          width: 6,
          offsetCenter: [0, '5%'],
          itemStyle: {
            color: '#818181',
          },
        },
        axisTick: {
          length: 8,
          lineStyle: {
            color: 'auto',
            width: 1,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 2,
          },
        },
        axisLabel: {
          color: '#464646',
          fontSize: 10,
          distance: -40,
          rotate: 'tangential',
          formatter: (val: number) => {
            return val.toFixed(1);
          },
        },
        detail: {
          fontSize: 14,
          offsetCenter: [0, '25%'],
          valueAnimation: true,
          formatter: (value: number) => {
            return formatValue(value, displayIndicator.unit);
          },
          color: statusColor,
        },
        data: [
          {
            value: normalizedValue,
            // name: displayIndicator.name,
          },
        ],
      },
    ],
  };

  const isCritical = displayIndicator.status === 'DANGER';

  return (
    <div
      className={`
        rounded-lg border-2 p-6 transition-all hover:shadow-lg bg-white
        ${isCritical ? 'border-red-500 shadow-red-500/50 shadow-lg animate-pulse' : 'border-gray-200'}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {displayIndicator.name}
          </h3>
          <p className="text-xs text-gray-500">{displayIndicator.source}</p>
        </div>
      </div>

      {/* 데이터 수집 시간 표시 */}
      <div className="mb-4 flex items-center gap-1 text-xs text-gray-500">
        <Clock className="h-3 w-3" />
        <span>업데이트: {formatDate(displayIndicator.fetchedAt)}</span>
      </div>

      {/* ECharts 반원형 게이지 */}
      <div className="mb-4" style={{ height: '200px' }}>
        <ReactECharts
          option={gaugeOption}
          style={{ width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* 상태 배지 */}
      <div className="flex items-center justify-center">
        <span
          className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${isCritical ? 'bg-red-50 text-red-700 border border-red-300' : displayIndicator.status === 'WARNING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-300' : 'bg-green-50 text-green-700 border border-green-300'}
          `}
        >
          {displayIndicator.status === 'DANGER'
            ? '위험'
            : displayIndicator.status === 'WARNING'
              ? '주의'
              : '정상'}
        </span>
      </div>

      {displayIndicator.description && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            {displayIndicator.description}
          </p>
        </div>
      )}
    </div>
  );
};
