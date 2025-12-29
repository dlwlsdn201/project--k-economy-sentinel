import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import {
  INDICATOR_METADATA,
  determineStatus,
} from '@models/constants/indicatorConstants';
import { readStock, type ReadStockResponse } from '@models/api/readStock';
import { formatValueFloat } from '@utils/format';
import dayjs, { Dayjs } from 'dayjs';

// 외국인 순매수 atom
export const stockIndicatorAtom = atom<EconomicIndicator | null>(null);

/**
 * 외국인 순매수 지표 ViewModel Hook
 * API 호출 + 데이터 변환 + 상태 관리
 */
export const useStockIndicator = () => {
  const [indicator, setIndicator] = useAtom(stockIndicatorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * API 응답을 EconomicIndicator로 변환
   */
  const transformStockData = (rawData: unknown): EconomicIndicator => {
    const data = rawData as ReadStockResponse;
    // DATA_VALUE는 문자열로 제공되므로 숫자로 변환
    // ECOS API 802Y001: 양수 = 순매수, 음수 = 순매도
    const dataValue = data?.StatisticSearch?.row?.[0]?.DATA_VALUE;
    const value = dataValue ? formatValueFloat(parseFloat(dataValue)) : 0;
    const metadata = INDICATOR_METADATA.stock;
    const status = determineStatus('stock', value);
    const now = new Date();

    return {
      id: 'stock',
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
   * 외국인 순매수 데이터 조회 트리거 함수
   */
  const fetch = async (date?: Dayjs) => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDate = date
        ? dayjs(date).format('YYYYMMDD')
        : dayjs().format('YYYYMMDD');
      const rawData = await readStock({ date: targetDate });
      const transformed = transformStockData(rawData);
      setIndicator(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '외국인 순매수 데이터 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('useStockIndicator fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 시뮬레이션 모드: 지표 값을 직접 설정 (개발용)
   */
  const setSimulationValue = (value: number) => {
    if (!indicator) return;

    const status = determineStatus('stock', value);
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
