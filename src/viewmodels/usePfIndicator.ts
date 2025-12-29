import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import {
  INDICATOR_METADATA,
  determineStatus,
} from '@models/constants/indicatorConstants';

// PF 대출 연체율 atom
const pfIndicatorAtom = atom<EconomicIndicator | null>(null);

/**
 * PF 대출 연체율 지표 ViewModel Hook
 * API 호출 + 데이터 변환 + 상태 관리
 */
export const usePfIndicator = () => {
  const indicator = useAtomValue(pfIndicatorAtom);
  const setIndicator = useSetAtom(pfIndicatorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * PF 대출 연체율 데이터 조회
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetch = async (_date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 호출 구현 (AI 자동 수집)
      // const rawData = await readPfDelinquency({ date: _date });
      // const transformPfData = (rawData: unknown): EconomicIndicator => {
      //   const value = (rawData as { value?: number })?.value ?? 0;
      //   const metadata = INDICATOR_METADATA.pf;
      //   const status = determineStatus('pf', value);
      //   const now = new Date();
      //   return {
      //     id: 'pf',
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
      // const transformed = transformPfData(rawData);

      // 임시: 목업 데이터
      const mockValue = 8.5;
      const metadata = INDICATOR_METADATA.pf;
      const status = determineStatus('pf', mockValue);
      const now = new Date();

      const transformed: EconomicIndicator = {
        id: 'pf',
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
          : 'PF 대출 연체율 데이터 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('usePfIndicator fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 시뮬레이션 모드: 지표 값을 직접 설정 (개발용)
   */
  const setSimulationValue = (value: number) => {
    if (!indicator) return;
    
    const metadata = INDICATOR_METADATA.pf;
    const status = determineStatus('pf', value);
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
