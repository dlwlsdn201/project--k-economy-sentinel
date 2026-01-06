import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import {
  INDICATOR_METADATA,
  determineStatus,
} from '@models/constants/indicatorConstants';
import { readReserve, type ReadReserveResponse } from '@models/api/readReserve';
import { formatValueFloat } from '@utils/format';
import dayjs, { Dayjs } from 'dayjs';

// 외환보유액 atom
export const reserveIndicatorAtom = atom<EconomicIndicator | null>(null);

/**
 * 외환보유액 지표 ViewModel Hook
 * API 호출 + 데이터 변환 + 상태 관리
 */
export const useReserveIndicator = () => {
  const [indicator, setIndicator] = useAtom(reserveIndicatorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * API 응답을 EconomicIndicator로 변환
   * @param rawData - API 응답 데이터
   * @param actualDate - 실제 데이터 날짜 (YYYYMM 형식)
   */
  const transformReserveData = (
    rawData: unknown,
    actualDate: string
  ): EconomicIndicator => {
    const data = rawData as ReadReserveResponse;
    // DATA_VALUE는 문자열로 제공되므로 숫자로 변환
    const dataValue = data?.StatisticSearch?.row?.[0]?.DATA_VALUE;
    const value = dataValue ? parseFloat(dataValue) : 0;
    const formattedValueForBillions = formatValueFloat(value / 100000); // 천 달러 단위인 raw data -> "억달러" 단위 변환
    const metadata = INDICATOR_METADATA.reserve;
    const status = determineStatus('reserve', formattedValueForBillions);
    
    // 갱신 날짜는 현재 시간
    const fetchedAt = dayjs().toISOString();

    return {
      id: 'reserve',
      name: metadata.name,
      value: formattedValueForBillions,
      unit: metadata.unit,
      status,
      source: metadata.source,
      description: metadata.description,
      dataPeriod: metadata.dataPeriod,
      dataDate: actualDate, // 실제 데이터 날짜 (YYYYMM 형식)
      fetchedAt, // 갱신 날짜
    };
  };

  /**
   * 외환보유액 데이터 조회 트리거 함수
   * Monthly 기간 조회만 지원하므로 YYYYMM 형식으로 변환
   */
  const fetch = async (date?: Dayjs) => {
    setIsLoading(true);
    setError(null);

    try {
      // Monthly 기간 조회만 지원하므로 YYYYMM 형식으로 변환
      const targetDate = date
        ? dayjs(date).subtract(1, 'month').format('YYYYMM')
        : dayjs().subtract(1, 'month').format('YYYYMM');

      const rawData = await readReserve({ date: targetDate });
      const transformed = transformReserveData(rawData, targetDate);
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

    const status = determineStatus('reserve', value);

    setIndicator({
      ...indicator,
      value,
      status,
      fetchedAt: dayjs().toISOString(),
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
