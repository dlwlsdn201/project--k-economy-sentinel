import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import {
  INDICATOR_METADATA,
  determineStatus,
} from '@models/constants/indicatorConstants';
import {
  readExchangeRate,
  type ReadExchangeRateResponse,
} from '@models/api/readExchangeRate';

// 원/달러 환율 atom
export const exchangeIndicatorAtom = atom<EconomicIndicator | null>(null);

/**
 * 원/달러 환율 지표 ViewModel Hook
 * API 호출 + 데이터 변환 + 상태 관리
 */
export const useExchangeIndicator = () => {
  const [indicator, setIndicator] = useAtom(exchangeIndicatorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * API 응답을 EconomicIndicator로 변환
   */
  const transformExchangeData = (rawData: unknown): EconomicIndicator => {
    const data = rawData as ReadExchangeRateResponse;
    // KeyStatisticList API 응답에서 환율 데이터 추출
    // 환율은 보통 첫 번째 row에 있거나, KEYSTAT_NAME으로 필터링 필요
    const exchangeRow =
      data?.KeyStatisticList?.row?.find(
        (row) =>
          row.KEYSTAT_NAME?.includes('환율') ||
          row.KEYSTAT_NAME?.includes('원/달러')
      ) || data?.KeyStatisticList?.row?.[0];

    // DATA_VALUE는 문자열로 제공되므로 숫자로 변환
    const dataValue = exchangeRow?.DATA_VALUE;
    const value = dataValue ? Number(parseFloat(dataValue).toFixed(1)) : 0;
    const metadata = INDICATOR_METADATA.exchange;
    const status = determineStatus('exchange', value);
    const now = new Date();

    return {
      id: 'exchange',
      name: metadata.name,
      value,
      unit: metadata.unit,
      status,
      source: metadata.source,
      description: metadata.description,
      dataPeriod: metadata.dataPeriod,
      fetchedAt: now.toISOString(),
    };
  };

  /**
   * 원/달러 환율 데이터 조회 트리거 함수
   */
  const fetch = async (date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDate =
        date ?? new Date().toISOString().split('T')[0].replace(/-/g, '');
      const rawData = await readExchangeRate({ date: targetDate });
      const transformed = transformExchangeData(rawData);
      setIndicator(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '원/달러 환율 데이터 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('useExchangeIndicator fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 시뮬레이션 모드: 지표 값을 직접 설정 (개발용)
   */
  const setSimulationValue = (value: number) => {
    if (!indicator) return;

    const status = determineStatus('exchange', value);
    const now = new Date();

    setIndicator({
      ...indicator,
      value,
      status,
      fetchedAt: now.toISOString(),
    });
  };

  return {
    indicator,
    isLoading,
    error,
    fetch,
    setSimulationValue,
  };
};
