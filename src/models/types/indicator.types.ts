export type IndicatorStatus = 'SAFE' | 'WARNING' | 'DANGER';

export type IndicatorId = 'bond' | 'exchange' | 'reserve' | 'pf' | 'stock';

export interface EconomicIndicator {
  id: IndicatorId;
  name: string;
  value: number;
  unit: string;
  status: IndicatorStatus;
  source: string;
  description?: string;
  fetchedAt: string; // ISO 8601 형식의 날짜 문자열
}

