/**
 * 위기 단계 타입 정의
 */
export type CrisisLevel = 'STABLE' | 'CONCERN' | 'CAUTION' | 'CRITICAL';

/**
 * 위기 단계 메타데이터
 */
export interface CrisisLevelMetadata {
  level: CrisisLevel;
  label: string;
  color: string;
  description: string;
  reason?: string; // 위기 레벨 판정 근거
}

/**
 * Action Plan 구조
 */
export interface ActionPlan {
  title: string;
  assetStrategy: string;
  actionItems: string[];
}

/**
 * 지표 ID (PRD 기준)
 */
export type IndicatorIdPRD =
  | 'bond10y'
  | 'exchangeRate'
  | 'fxReserves'
  | 'pfDelinquency'
  | 'foreignerSell';
