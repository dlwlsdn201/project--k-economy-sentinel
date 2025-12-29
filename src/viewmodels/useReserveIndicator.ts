import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import {
  INDICATOR_METADATA,
  determineStatus,
} from '@models/constants/indicatorConstants';

// 외환보유액 atom
const reserveIndicatorAtom = atom<EconomicIndicator | null>(null);

/**
 * 외환보유액 지표 ViewModel Hook
 * API 호출 + 데이터 변환 + 상태 관리
 */
export const useReserveIndicator = () => {
  const indicator = useAtomValue(reserveIndicatorAtom);
  const setIndicator = useSetAtom(reserveIndicatorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 외환보유액 데이터 조회
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetch = async (_date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 호출 구현
      // const rawData = await readReserve({ date: _date });
      // const transformReserveData = (rawData: unknown): EconomicIndicator => {
      //   const value = (rawData as { value?: number })?.value ?? 0;
      //   const metadata = INDICATOR_METADATA.reserve;
      //   const status = determineStatus('reserve', value);
      //   const now = new Date();
      //   return {
      //     id: 'reserve',
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
      // const transformed = transformReserveData(rawData);

      // 임시: 목업 데이터
      const mockValue = 4100;
      const metadata = INDICATOR_METADATA.reserve;
      const status = determineStatus('reserve', mockValue);
      const now = new Date();

      const transformed: EconomicIndicator = {
        id: 'reserve',
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
          : '외환보유액 데이터 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('useReserveIndicator fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 시뮬레이션 모드: 지표 값을 직접 설정 (개발용)
   */
  const setSimulationValue = (value: number) => {
    if (!indicator) return;
    
    const metadata = INDICATOR_METADATA.reserve;
    const status = determineStatus('reserve', value);
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
