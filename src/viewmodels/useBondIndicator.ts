import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import {
  INDICATOR_METADATA,
  determineStatus,
} from '@models/constants/indicatorConstants';
import { readBond10y, type ReadBond10yResponse } from '@models/api/readBond10y';

// 국고채 10년물 금리 atom
export const bondIndicatorAtom = atom<EconomicIndicator | null>(null);

/**
 * 국고채 10년물 금리 지표 ViewModel Hook
 * API 호출 + 데이터 변환 + 상태 관리
 */
export const useBondIndicator = () => {
  const [indicator, setIndicator] = useAtom(bondIndicatorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * API 응답을 EconomicIndicator로 변환
   */
  const transformBondData = (rawData: unknown): EconomicIndicator => {
    const data = rawData as ReadBond10yResponse;
    // DATA_VALUE는 문자열로 제공되므로 숫자로 변환
    const dataValue = data?.StatisticSearch?.row?.[0]?.DATA_VALUE;
    const value = dataValue ? Number(parseFloat(dataValue).toFixed(1)) : 0;
    const metadata = INDICATOR_METADATA.bond;
    const status = determineStatus('bond', value);
    const now = new Date();

    return {
      id: 'bond',
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
   * 국고채 10년물 금리 데이터 조회 트리거 함수
   */
  const fetch = async (date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const targetDate =
        date ?? new Date().toISOString().split('T')[0].replace(/-/g, '');
      const rawData = await readBond10y({ date: targetDate });
      const transformed = transformBondData(rawData);
      setIndicator(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '국고채 10년물 금리 데이터 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('useBondIndicator fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 시뮬레이션 모드: 지표 값을 직접 설정 (개발용)
   */
  const setSimulationValue = (value: number) => {
    if (!indicator) return;

    const status = determineStatus('bond', value);
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
