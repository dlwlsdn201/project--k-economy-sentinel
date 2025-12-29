import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import {
  INDICATOR_METADATA,
  determineStatus,
} from '@models/constants/indicatorConstants';

// 외국인 순매수 atom
const stockIndicatorAtom = atom<EconomicIndicator | null>(null);

/**
 * 외국인 순매수 지표 ViewModel Hook
 * API 호출 + 데이터 변환 + 상태 관리
 */
export const useStockIndicator = () => {
  const indicator = useAtomValue(stockIndicatorAtom);
  const setIndicator = useSetAtom(stockIndicatorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 외국인 순매수 데이터 조회
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetch = async (_date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 호출 구현 (ECOS API 802Y001)
      // const rawData = await readStockFlow({ date: _date });
      // const transformStockData = (rawData: unknown): EconomicIndicator => {
      //   const value = (rawData as { value?: number })?.value ?? 0;
      //   const metadata = INDICATOR_METADATA.stock;
      //   const status = determineStatus('stock', value);
      //   const now = new Date();
      //   return {
      //     id: 'stock',
      //     name: metadata.name,
      //     value,
      //     unit: metadata.unit,
      //     status,
      //     source: metadata.source,
      //     description: metadata.description,
      //     dataPeriod: metadata.dataPeriod,
      //     fetchedAt: now.toISOString(),
      //   };
      // };
      // const transformed = transformStockData(rawData);

      // 임시: 목업 데이터
      const mockValue = -2000; // 순매도 2,000억원
      const metadata = INDICATOR_METADATA.stock;
      const status = determineStatus('stock', mockValue);
      const now = new Date();

      const transformed: EconomicIndicator = {
        id: 'stock',
        name: metadata.name,
        value: mockValue,
        unit: metadata.unit,
        status,
        source: metadata.source,
        description: metadata.description,
        dataPeriod: metadata.dataPeriod,
        fetchedAt: now.toISOString(),
      };

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

    const metadata = INDICATOR_METADATA.stock;
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
