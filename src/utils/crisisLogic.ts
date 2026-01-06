import type { CrisisLevel, ActionPlan } from '@models/types/crisisTypes';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import { determineStatus } from '@models/constants/indicatorConstants';
import { CRITICAL_POINT } from 'src/config';

/**
 * 위기 단계별 메타데이터
 */
export const CRISIS_LEVEL_METADATA: Record<
  CrisisLevel,
  {
    label: string;
    color: string;
    description: string;
  }
> = {
  STABLE: {
    label: '양호',
    color: '#22c55e', // green-500
    description: '경제 지표가 안정적인 상태입니다.',
  },
  CONCERN: {
    label: '관심',
    color: '#eab308', // yellow-500
    description: '일부 지표에서 주의가 필요한 상황입니다.',
  },
  CAUTION: {
    label: '주의',
    color: '#f97316', // orange-500
    description: '경제 위기 징후가 가시화되고 있습니다.',
  },
  CRITICAL: {
    label: '위험',
    color: '#ef4444', // red-500
    description: '경제 시스템 붕괴 직전의 위험 상태입니다.',
  },
};

/**
 * 위기 레벨 계산 결과 (레벨 + 근거)
 */
export interface CrisisLevelResult {
  level: CrisisLevel;
  reason: string;
}

/**
 * 5개 지표를 기반으로 종합 위기 단계를 계산하는 함수
 * 지표 개수 기반 로직 포함
 *
 * @param indicators - 5개 경제 지표 배열
 * @returns 계산된 위기 단계와 근거
 */
export const calculateCrisisLevel = (
  indicators: EconomicIndicator[]
): CrisisLevelResult => {
  if (indicators.length === 0) {
    return {
      level: 'STABLE',
      reason: '지표 데이터가 없습니다.',
    };
  }

  // 각 지표의 상태 계산
  const indicatorStatuses = indicators.map((indicator) => ({
    indicator,
    status: determineStatus(indicator.id, indicator.value),
  }));

  // 상태별 개수 집계
  const dangerCount = indicatorStatuses.filter(
    (s) => s.status === 'DANGER'
  ).length;
  const warningCount = indicatorStatuses.filter(
    (s) => s.status === 'WARNING'
  ).length;
  const safeCount = indicatorStatuses.filter((s) => s.status === 'SAFE').length;

  // 위험 지표 목록
  const dangerIndicators = indicatorStatuses
    .filter((s) => s.status === 'DANGER')
    .map((s) => s.indicator.name);
  const warningIndicators = indicatorStatuses
    .filter((s) => s.status === 'WARNING')
    .map((s) => s.indicator.name);

  // 지표를 ID로 매핑 (기존 로직 호환성)
  const indicatorMap = new Map<string, EconomicIndicator>();
  indicators.forEach((indicator) => {
    indicatorMap.set(indicator.id, indicator);
  });

  const bond10y = indicatorMap.get('bond');
  const exchangeRate = indicatorMap.get('exchange');
  const fxReserves = indicatorMap.get('reserve');
  const pfDelinquency = indicatorMap.get('pf');
  const foreignerSell = indicatorMap.get('stock');
  const rpLiquidity = indicatorMap.get('rp');

  // Level 4: 위험 (Critical)
  // 조건 1: 위험 지표가 2개 이상
  // 조건 2: 환율 > 1,500원 (PRD 업데이트: IMF급 위기)
  // 조건 3: RP > 5조 원 (PRD 업데이트: 비상 상황)
  // 조건 4: 외환보유액 < 3,800억 달러 (급감)
  if (dangerCount >= 2) {
    return {
      level: 'CRITICAL',
      reason: `위험 지표 ${dangerCount}개: ${dangerIndicators.join(', ')}`,
    };
  }

  if (exchangeRate && exchangeRate.value >= CRITICAL_POINT.exchangeRate) {
    return {
      level: 'CRITICAL',
      reason: `환율이 ${exchangeRate.value.toLocaleString('ko-KR')}원으로 IMF급 위기 수준입니다.`,
    };
  }

  if (rpLiquidity && rpLiquidity.value >= CRITICAL_POINT.rp) {
    return {
      level: 'CRITICAL',
      reason: `한국은행 RP 매입 규모가 ${rpLiquidity.value.toLocaleString('ko-KR')}조 원으로 비상 상황입니다.`,
    };
  }

  if (fxReserves && fxReserves.value < CRITICAL_POINT.fxReserves) {
    return {
      level: 'CRITICAL',
      reason: `외환보유액이 ${fxReserves.value.toLocaleString('ko-KR')}억 달러로 급감했습니다.`,
    };
  }

  // Level 3: 주의 (Caution)
  // 조건 1: 위험 지표 1개 + 주의 지표 2개 이상
  // 조건 2: 주의 및 위험 지표 합계 3개 이상
  // 조건 3: 국채금리 > 3.7% (PRD 업데이트)
  // 조건 4: 환율 > 1,450원 (PRD 업데이트)
  // 조건 5: 환율 > 1,400원 AND 외국인 순매수 > 1,000억원 (자본 이탈 가시화)
  if (dangerCount === 1 && warningCount >= 2) {
    return {
      level: 'CAUTION',
      reason: `위험 지표 1개(${dangerIndicators.join(', ')})와 주의 지표 ${warningCount}개(${warningIndicators.join(', ')})가 동시에 발생했습니다.`,
    };
  }

  if (dangerCount + warningCount >= 3) {
    return {
      level: 'CAUTION',
      reason: `주의 및 위험 지표가 총 ${dangerCount + warningCount}개로 경제 위기 징후가 가시화되고 있습니다.`,
    };
  }

  if (bond10y && bond10y.value > 3.7) {
    return {
      level: 'CAUTION',
      reason: `국고채 10년물 금리가 ${bond10y.value.toFixed(1)}%로 긴급 대응이 필요합니다.`,
    };
  }

  if (exchangeRate && exchangeRate.value > 1450) {
    return {
      level: 'CAUTION',
      reason: `환율이 ${exchangeRate.value.toLocaleString('ko-KR')}원으로 긴급 대응이 필요합니다.`,
    };
  }

  if (
    exchangeRate &&
    exchangeRate.value > 1400 &&
    foreignerSell &&
    foreignerSell.value < -1000
  ) {
    return {
      level: 'CAUTION',
      reason: `환율 ${exchangeRate.value.toLocaleString('ko-KR')}원과 외국인 순매수 ${Math.abs(foreignerSell.value).toLocaleString('ko-KR')}억원으로 자본 이탈이 가시화되고 있습니다.`,
    };
  }

  // Level 2: 관심 (Concern)
  // 조건 1: 주의 지표가 2개 이상
  // 조건 2: 위험 지표 1개
  // 조건 3: 국채금리 > 3.4% (PRD 업데이트: 조기 경보)
  // 조건 4: PF 연체율 > 8% (내부 균열 징후)
  if (warningCount >= 2) {
    return {
      level: 'CONCERN',
      reason: `주의 지표 ${warningCount}개: ${warningIndicators.join(', ')}`,
    };
  }

  if (dangerCount === 1) {
    return {
      level: 'CONCERN',
      reason: `위험 지표 1개: ${dangerIndicators.join(', ')}`,
    };
  }

  if (bond10y && bond10y.value > 3.4) {
    return {
      level: 'CONCERN',
      reason: `국고채 10년물 금리가 ${bond10y.value.toFixed(1)}%로 조기 경보 신호입니다.`,
    };
  }

  if (pfDelinquency && pfDelinquency.value > 8.0) {
    return {
      level: 'CONCERN',
      reason: `PF 대출 연체율이 ${pfDelinquency.value.toFixed(1)}%로 내부 균열 징후가 나타나고 있습니다.`,
    };
  }

  // Level 1: 양호 (Stable)
  return {
    level: 'STABLE',
    reason: `모든 지표가 안정적인 범위 내에 있습니다. (안전: ${safeCount}개, 주의: ${warningCount}개)`,
  };
};

/**
 * 지표 값에 따른 동적 Action Plan 생성 함수
 * PRD 업데이트: 구체적인 수치 기반 가이드 제공
 */
export const generateActionPlan = (
  level: CrisisLevel,
  indicators: EconomicIndicator[]
): ActionPlan => {
  // 지표를 ID로 매핑
  const indicatorMap = new Map<string, EconomicIndicator>();
  indicators.forEach((indicator) => {
    indicatorMap.set(indicator.id, indicator);
  });

  const bond10y = indicatorMap.get('bond');
  const exchangeRate = indicatorMap.get('exchange');
  const rpLiquidity = indicatorMap.get('rp');

  switch (level) {
    case 'STABLE':
      return {
        title: '현재 안정적인 상태입니다',
        assetStrategy:
          '기존 자산 배분 유지, 여유 자금은 단기 채권이나 예금에 보관',
        actionItems: [
          '정기적인 경제 지표 모니터링',
          '긴급 자금 비상금 확보 (생활비 3~6개월분)',
          '변동금리 대출 상환 계획 수립',
        ],
      };

    case 'CONCERN': {
      const actionItems: string[] = [
        '변동금리 대출 점검 및 고정금리 전환 검토',
        '불필요한 지출 차단',
        '비상금을 현금 또는 단기 채권으로 전환',
      ];

      // PRD 업데이트: 국채금리 > 3.4% 시 구체적 가이드
      if (bond10y && bond10y.value > 3.4) {
        actionItems.unshift('📢 달러 자산 비중을 20%까지 늘리세요.');
      }

      return {
        title: '안전벨트를 매세요',
        assetStrategy: '현금 비중을 20~30%로 확대, 변동성 자산 비중 축소',
        actionItems,
      };
    }

    case 'CAUTION': {
      const actionItems: string[] = [
        '모든 변동금리 대출 즉시 고정금리 전환',
        '비필수 지출 전면 중단',
        '가계 부채 상환 계획 수립',
      ];

      // PRD 업데이트: 국채금리 > 3.7% OR 환율 > 1,450원 시 구체적 가이드
      if (bond10y && bond10y.value > 3.7) {
        actionItems.unshift(
          '📢 부동산 매도 타이밍을 검토하고, 해외 자산 50% 확대를 추천합니다.'
        );
      } else if (exchangeRate && exchangeRate.value > 1450) {
        actionItems.unshift(
          '📢 부동산 매도 타이밍을 검토하고, 해외 자산 50% 확대를 추천합니다.'
        );
      } else {
        actionItems.unshift('투자 자산의 50% 이상을 현금화');
        actionItems.push('외화 자산 비중 확대 검토');
      }

      return {
        title: '긴급 대응이 필요합니다',
        assetStrategy: '현금 비중 40~50%로 확대, 리스크 자산 대폭 축소',
        actionItems,
      };
    }

    case 'CRITICAL': {
      const actionItems: string[] = [
        '모든 투자 자산 즉시 현금화',
        '비상금을 외화(달러)로 전환',
        '모든 대출 조기 상환 또는 재조정',
        '생활 필수품 비축',
        '소득원 다각화 검토',
        '전문가 상담 및 자산 보호 전략 수립',
      ];

      // PRD 업데이트: RP > 5조 원 OR 환율 > 1,500원 시 구체적 가이드
      if (rpLiquidity && rpLiquidity.value >= 5) {
        actionItems.unshift(
          '📢 비상 상황입니다. 예금 5천만 원 분산 및 현금 흐름 확보 최우선!'
        );
      } else if (exchangeRate && exchangeRate.value >= 1500) {
        actionItems.unshift(
          '📢 비상 상황입니다. 예금 5천만 원 분산 및 현금 흐름 확보 최우선!'
        );
      }

      return {
        title: '비상 상황입니다',
        assetStrategy: '현금 비중 70% 이상, 모든 리스크 자산 매도',
        actionItems,
      };
    }

    default:
      return {
        title: '현재 안정적인 상태입니다',
        assetStrategy: '기존 자산 배분 유지',
        actionItems: ['정기적인 경제 지표 모니터링'],
      };
  }
};

/**
 * 위기 단계별 기본 Action Plan 데이터 (레거시 호환성)
 * @deprecated generateActionPlan 사용 권장
 */
export const ACTION_PLANS: Record<CrisisLevel, ActionPlan> = {
  STABLE: {
    title: '현재 안정적인 상태입니다',
    assetStrategy: '기존 자산 배분 유지, 여유 자금은 단기 채권이나 예금에 보관',
    actionItems: [
      '정기적인 경제 지표 모니터링',
      '긴급 자금 비상금 확보 (생활비 3~6개월분)',
      '변동금리 대출 상환 계획 수립',
    ],
  },
  CONCERN: {
    title: '안전벨트를 매세요',
    assetStrategy: '현금 비중을 20~30%로 확대, 변동성 자산 비중 축소',
    actionItems: [
      '변동금리 대출 점검 및 고정금리 전환 검토',
      '불필요한 지출 차단',
      '비상금을 현금 또는 단기 채권으로 전환',
      '투자 포트폴리오 리밸런싱',
    ],
  },
  CAUTION: {
    title: '긴급 대응이 필요합니다',
    assetStrategy: '현금 비중 40~50%로 확대, 리스크 자산 대폭 축소',
    actionItems: [
      '모든 변동금리 대출 즉시 고정금리 전환',
      '비필수 지출 전면 중단',
      '투자 자산의 50% 이상을 현금화',
      '외화 자산 비중 확대 검토',
      '가계 부채 상환 계획 수립',
    ],
  },
  CRITICAL: {
    title: '비상 상황입니다',
    assetStrategy: '현금 비중 70% 이상, 모든 리스크 자산 매도',
    actionItems: [
      '모든 투자 자산 즉시 현금화',
      '비상금을 외화(달러)로 전환',
      '모든 대출 조기 상환 또는 재조정',
      '생활 필수품 비축',
      '소득원 다각화 검토',
      '전문가 상담 및 자산 보호 전략 수립',
    ],
  },
};
