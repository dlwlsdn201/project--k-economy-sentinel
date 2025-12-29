import type { IndicatorId, IndicatorStatus } from '../types/indicatorTypes';

// 국고채 10년물 금리 기준값
export const THRESHOLD_BOND_RATE_SAFE = 3.5;
export const THRESHOLD_BOND_RATE_WARNING = 3.9;
export const THRESHOLD_BOND_RATE_DANGER = 4.0;

// 원/달러 환율 기준값
export const THRESHOLD_EXCHANGE_RATE_SAFE = 1350;
export const THRESHOLD_EXCHANGE_RATE_WARNING = 1450;
export const THRESHOLD_EXCHANGE_RATE_DANGER = 1470;

// 외환보유액 기준값 (억 달러)
export const THRESHOLD_RESERVE_SAFE = 4200;
export const THRESHOLD_RESERVE_WARNING = 4000;
export const THRESHOLD_RESERVE_DANGER = 4000;

// PF 연체율 기준값 (%)
export const THRESHOLD_PF_RATE_SAFE = 5;
export const THRESHOLD_PF_RATE_WARNING = 9;
export const THRESHOLD_PF_RATE_DANGER = 10;

// 외국인 순매수 기준값 (억원)
// ECOS API 802Y001: 양수 = 순매수, 음수 = 순매도
// 데이터 기준: 일일 기준 (일별 거래 데이터)
// - 음수면 순매도 (나쁨), 양수면 순매수 (좋음)
export const THRESHOLD_STOCK_FLOW_SAFE = 0; // 순매수 지속 (0 이상)
export const THRESHOLD_STOCK_FLOW_WARNING = -1000; // 순매도 1,000억원 이상 (주의)
export const THRESHOLD_STOCK_FLOW_DANGER = -5000; // 순매도 5,000억원 이상 (위험)

// 지표 메타데이터
export const INDICATOR_METADATA: Record<
  IndicatorId,
  {
    name: string;
    unit: string;
    description: string;
    source: string;
    dataPeriod: string; // 데이터 산출 기준 (예: '실시간', '당일', '전월 말')
  }
> = {
  bond: {
    name: '국고채 10년물 금리',
    unit: '%',
    description:
      '이 금리가 4%를 넘어선다면 내부 시스템의 균열이 생각보다 훨씬 심각하다는 경고등으로 봐야함.',
    source: '한국은행 ECOS',
    dataPeriod: '당일 종가 기준',
  },
  exchange: {
    name: '원/달러 환율',
    unit: '원',
    description:
      '한국시장에서 돈을 빼서 달러로 바꿔나가기 시작하면 환율은 치솟게됨. 환율 1,500원 달성 시 강력한 위기 신호.',
    source: '한국은행 ECOS',
    dataPeriod: '당일 종가 기준',
  },
  reserve: {
    name: '외환보유액',
    unit: '억 달러',
    description:
      '환율 방어 작전에 쓰이는 총알. 현재 4,300억 달러 수준의 외환보유고가 급격히 줄어들기 시작한다면 이는 우리 방어선이 빠르게 소진되고 있다는 신호임.',
    source: '한국은행 ECOS',
    dataPeriod: '전월 말 기준',
  },
  pf: {
    name: 'PF 대출 연체율',
    unit: '%',
    description:
      '취약 업권(저축은행 등)의 연체율이 10%에 육박하면 뇌관 폭발 직전. 전체 평균이 아닌 취약 수치를 봐야 함.',
    source: 'AI 자동 수집',
    dataPeriod: '전월 말 기준',
  },
  stock: {
    name: '외국인 순매수',
    unit: '억원',
    description:
      '외국인이 주식/채권을 꾸준히 팔아치우면(Sell Korea) 위기 감지의 증거.',
    source: '한국은행 ECOS',
    dataPeriod: '당일 기준',
  },
};

/**
 * 지표 값에 따른 위험도 판별 함수
 */
export const determineStatus = (
  indicatorId: IndicatorId,
  value: number
): IndicatorStatus => {
  switch (indicatorId) {
    case 'bond': {
      if (value >= THRESHOLD_BOND_RATE_DANGER) return 'DANGER';
      if (value >= THRESHOLD_BOND_RATE_WARNING) return 'WARNING';
      return 'SAFE';
    }
    case 'exchange': {
      if (value >= THRESHOLD_EXCHANGE_RATE_DANGER) return 'DANGER';
      if (value >= THRESHOLD_EXCHANGE_RATE_WARNING) return 'WARNING';
      return 'SAFE';
    }
    case 'reserve': {
      if (value < THRESHOLD_RESERVE_DANGER) return 'DANGER';
      if (value < THRESHOLD_RESERVE_WARNING) return 'WARNING';
      return 'SAFE';
    }
    case 'pf': {
      if (value >= THRESHOLD_PF_RATE_DANGER) return 'DANGER';
      if (value >= THRESHOLD_PF_RATE_WARNING) return 'WARNING';
      return 'SAFE';
    }
    case 'stock': {
      if (value <= THRESHOLD_STOCK_FLOW_DANGER) return 'DANGER';
      if (value <= THRESHOLD_STOCK_FLOW_WARNING) return 'WARNING';
      return 'SAFE';
    }
    default:
      return 'SAFE';
  }
};
