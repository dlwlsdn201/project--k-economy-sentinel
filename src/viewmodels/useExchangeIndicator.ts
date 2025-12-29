import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import { INDICATOR_METADATA, determineStatus } from '@models/constants/indicatorConstants';

// 원/달러 환율 atom
const exchangeIndicatorAtom = atom<EconomicIndicator | null>(null);

/**
 * 원/달러 환율 지표 ViewModel Hook
 * API 호출 + 데이터 변환 + 상태 관리
 */
export const useExchangeIndicator = () => {
  const indicator = useAtomValue(exchangeIndicatorAtom);
  const setIndicator = useSetAtom(exchangeIndicatorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * API 응답을 EconomicIndicator로 변환
   */
  const transformExchangeData = (rawData: unknown): EconomicIndicator => {
    // TODO: 실제 API 응답 구조에 맞게 파싱 로직 구현
    const value = (rawData as { value?: number })?.value ?? 0;
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
   * 원/달러 환율 데이터 조회
   */
  const fetch = async (_date?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 API 호출 구현
      // const rawData = await readExchangeRate({ date: _date });
      // const transformed = transformExchangeData(rawData);
      
      // 임시: 목업 데이터
      const mockValue = 1380;
      const metadata = INDICATOR_METADATA.exchange;
      const status = determineStatus('exchange', mockValue);
      const now = new Date();

      const transformed: EconomicIndicator = {
        id: 'exchange',
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
      const errorMessage = err instanceof Error ? err.message : '원/달러 환율 데이터 조회 중 오류가 발생했습니다.';
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
    
    const metadata = INDICATOR_METADATA.exchange;
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

