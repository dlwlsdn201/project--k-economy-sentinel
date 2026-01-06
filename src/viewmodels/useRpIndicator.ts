import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import {
  INDICATOR_METADATA,
  determineStatus,
} from '@models/constants/indicatorConstants';
import { readRp, type ReadRpResponse } from '@models/api/readRp';
import { formatValueFloat } from '@utils/format';
import { isValidStatisticSearchResponse } from '@utils/apiValidation';
import dayjs, { Dayjs } from 'dayjs';

// 한국은행 RP 매입 규모 atom
export const rpIndicatorAtom = atom<EconomicIndicator | null>(null);

/**
 * 한국은행 RP 매입 규모 지표 ViewModel Hook
 * API 호출 + 데이터 변환 + 상태 관리
 */
export const useRpIndicator = () => {
  const [indicator, setIndicator] = useAtom(rpIndicatorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * API 응답을 EconomicIndicator로 변환
   * @param rawData - API 응답 데이터
   * @param actualDate - 실제 데이터 날짜 (YYYYMM 형식, 월별 데이터)
   */
  const transformRpData = (
    rawData: unknown,
    actualDate: string
  ): EconomicIndicator => {
    const data = rawData as ReadRpResponse;
    // DATA_VALUE는 문자열로 제공되므로 숫자로 변환
    // RP는 조 원 단위로 표시 (억 원이면 100으로 나눔)
    const dataValue = data?.StatisticSearch?.row?.[1]?.DATA_VALUE; // row[0] 은 RP 매입 '건'수 단위
    const valueInHundredMillion = dataValue ? parseFloat(dataValue) : 0;
    // 조 원 단위로 변환 (억 원 / 10000)
    const value = valueInHundredMillion / 10000;
    const metadata = INDICATOR_METADATA.rp;
    const status = determineStatus('rp', value);

    // 갱신 날짜는 현재 시간
    const fetchedAt = dayjs().toISOString();

    return {
      id: 'rp',
      name: metadata.name,
      value: formatValueFloat(value),
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
   * 한국은행 RP 매입 규모 데이터 조회 트리거 함수
   * 유효한 데이터가 나올 때까지 날짜를 -1개월씩 빼면서 재시도
   */
  const fetch = async (date?: Dayjs) => {
    setIsLoading(true);
    setError(null);

    try {
      const startDate = date ? dayjs(date) : dayjs();
      const maxRetries = 12; // 최대 12개월 전까지 재시도
      let currentDate = startDate;
      let rawData: ReadRpResponse | null = null;
      let actualDate = startDate.format('YYYYMM');

      // 유효한 데이터가 나올 때까지 날짜를 -1개월씩 빼면서 재시도
      for (let i = 0; i < maxRetries; i++) {
        const dateStr = currentDate.format('YYYYMM');

        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await readRp({ date: dateStr });

          // 응답이 유효한지 확인
          if (isValidStatisticSearchResponse(response)) {
            rawData = response;
            actualDate = dateStr;
            break;
          }
        } catch {
          // API 에러는 무시하고 이전 달로 재시도
          console.warn(
            `useRpIndicator: 날짜 ${dateStr}에서 데이터 조회 실패, 이전 달로 재시도`
          );
        }

        // 이전 달로 이동
        currentDate = currentDate.subtract(1, 'month');
      }

      if (!rawData) {
        throw new Error(
          `${maxRetries}개월 이내의 유효한 데이터를 찾을 수 없습니다.`
        );
      }

      const transformed = transformRpData(rawData, actualDate);
      setIndicator(transformed);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : '한국은행 RP 매입 규모 데이터 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('useRpIndicator fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 시뮬레이션 모드: 지표 값을 직접 설정 (개발용)
   */
  const setSimulationValue = (value: number) => {
    if (!indicator) return;

    const status = determineStatus('rp', value);

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
