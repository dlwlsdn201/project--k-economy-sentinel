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
import { formatValueFloat } from '@utils/format';
import { isValidKeyStatisticListResponse } from '@utils/apiValidation';
import dayjs, { Dayjs } from 'dayjs';

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
   * @param rawData - API 응답 데이터
   * @param actualDate - 실제 데이터 날짜 (YYYYMMDD 형식)
   */
  const transformExchangeData = (
    rawData: unknown,
    actualDate: string
  ): EconomicIndicator => {
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
    const value = dataValue ? formatValueFloat(parseFloat(dataValue)) : 0;
    const metadata = INDICATOR_METADATA.exchange;
    const status = determineStatus('exchange', value);

    // 갱신 날짜는 현재 시간
    const fetchedAt = dayjs().toISOString();

    return {
      id: 'exchange',
      name: metadata.name,
      value,
      unit: metadata.unit,
      status,
      source: metadata.source,
      description: metadata.description,
      dataPeriod: metadata.dataPeriod,
      dataDate: actualDate, // 실제 데이터 날짜 (YYYYMMDD 형식)
      fetchedAt, // 갱신 날짜
    };
  };

  /**
   * 원/달러 환율 데이터 조회 트리거 함수
   * 유효한 데이터가 나올 때까지 날짜를 -1일씩 빼면서 재시도
   */
  const fetch = async (date?: Dayjs) => {
    setIsLoading(true);
    setError(null);

    try {
      const startDate = date ? dayjs(date) : dayjs();
      const maxRetries = 30; // 최대 30일 전까지 재시도
      let currentDate = startDate;
      let rawData: ReadExchangeRateResponse | null = null;
      let actualDate = startDate.format('YYYYMMDD');

      // 유효한 데이터가 나올 때까지 날짜를 -1일씩 빼면서 재시도
      for (let i = 0; i < maxRetries; i++) {
        const dateStr = currentDate.format('YYYYMMDD');

        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await readExchangeRate({ date: dateStr });

          // 응답이 유효한지 확인
          if (isValidKeyStatisticListResponse(response)) {
            rawData = response;
            actualDate = dateStr;
            break;
          }
        } catch {
          // API 에러는 무시하고 다음 날짜로 재시도
          console.warn(
            `useExchangeIndicator: 날짜 ${dateStr}에서 데이터 조회 실패, 이전 날짜로 재시도`
          );
        }

        // 이전 날짜로 이동 (주말/공휴일 제외하고 -1일)
        currentDate = currentDate.subtract(1, 'day');
      }

      if (!rawData) {
        throw new Error(
          `${maxRetries}일 이내의 유효한 데이터를 찾을 수 없습니다.`
        );
      }

      const transformed = transformExchangeData(rawData, actualDate);
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
