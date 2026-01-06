export type IndicatorStatus = 'SAFE' | 'WARNING' | 'DANGER';

export type IndicatorId = 'bond' | 'exchange' | 'reserve' | 'pf' | 'stock' | 'rp';

export interface EconomicIndicator {
  id: IndicatorId;
  name: string;
  value: number;
  unit: string;
  status: IndicatorStatus;
  source: string;
  description?: string;
  dataPeriod?: string; // 데이터 산출 기준 (예: '실시간', '당일', '전월 말') - 레거시 필드
  dataDate?: string; // 실제 데이터 날짜 (YYYYMMDD 또는 YYYYMM 형식)
  fetchedAt: string; // ISO 8601 형식의 날짜 문자열 (갱신 날짜)
}

