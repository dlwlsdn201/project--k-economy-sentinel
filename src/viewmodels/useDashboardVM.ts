import { useEffect, useMemo } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import { useBondIndicator } from './useBondIndicator';
import { useExchangeIndicator } from './useExchangeIndicator';
import { useReserveIndicator } from './useReserveIndicator';
import { usePfIndicator } from './usePfIndicator';
import { useStockIndicator } from './useStockIndicator';
import { useRpIndicator } from './useRpIndicator';
import dayjs, { Dayjs } from 'dayjs';

/**
 * 대시보드 ViewModel
 * 각 지표별 hook을 조합하여 전체 지표 배열을 제공
 *
 * 역할:
 * - 각 지표별 hook을 조합
 * - 전체 로딩/에러 상태 집계
 * - 모든 지표 데이터를 한 번에 새로고침
 */
export const useDashboardVM = () => {
  // 각 지표별 hook 호출
  const bondHook = useBondIndicator();
  const exchangeHook = useExchangeIndicator();
  const reserveHook = useReserveIndicator();
  const pfHook = usePfIndicator();
  const stockHook = useStockIndicator();
  const rpHook = useRpIndicator();

  // 전체 지표 배열 조합
  const indicators = useMemo<EconomicIndicator[]>(() => {
    const result: EconomicIndicator[] = [];

    if (bondHook.indicator) result.push(bondHook.indicator);
    if (exchangeHook.indicator) result.push(exchangeHook.indicator);
    if (reserveHook.indicator) result.push(reserveHook.indicator);
    if (pfHook.indicator) result.push(pfHook.indicator);
    if (stockHook.indicator) result.push(stockHook.indicator);
    if (rpHook.indicator) result.push(rpHook.indicator);

    return result;
  }, [bondHook, exchangeHook, reserveHook, pfHook, stockHook, rpHook]);

  // 전체 로딩 상태 (하나라도 로딩 중이면 true)
  const isLoading = useMemo(
    () =>
      bondHook.isLoading ||
      exchangeHook.isLoading ||
      reserveHook.isLoading ||
      pfHook.isLoading ||
      stockHook.isLoading ||
      rpHook.isLoading,
    [
      bondHook.isLoading,
      exchangeHook.isLoading,
      reserveHook.isLoading,
      pfHook.isLoading,
      stockHook.isLoading,
      rpHook.isLoading,
    ]
  );

  // 전체 에러 상태 (에러가 있는 hook의 에러 메시지 배열)
  const errors = useMemo<string[]>(() => {
    const errorList: string[] = [];
    if (bondHook.error) errorList.push(bondHook.error);
    if (exchangeHook.error) errorList.push(exchangeHook.error);
    if (reserveHook.error) errorList.push(reserveHook.error);
    if (pfHook.error) errorList.push(pfHook.error);
    if (stockHook.error) errorList.push(stockHook.error);
    if (rpHook.error) errorList.push(rpHook.error);
    return errorList;
  }, [
    bondHook.error,
    exchangeHook.error,
    reserveHook.error,
    pfHook.error,
    stockHook.error,
    rpHook.error,
  ]);

  // 첫 번째 에러 메시지 (또는 통합 메시지)
  const error = errors.length > 0 ? errors.join('; ') : null;

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      const initialDate = dayjs();

      await Promise.all([
        bondHook.fetch(initialDate),
        exchangeHook.fetch(initialDate),
        reserveHook.fetch(initialDate),
        pfHook.fetch(),
        stockHook.fetch(initialDate),
        rpHook.fetch(initialDate),
      ]);
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 마운트 시에만 실행

  // 모든 지표 데이터 새로고침
  const refresh = async (selectedDate?: Dayjs) => {
    await Promise.all([
      bondHook.fetch(selectedDate),
      exchangeHook.fetch(selectedDate),
      reserveHook.fetch(selectedDate),
      pfHook.fetch(),
      stockHook.fetch(selectedDate),
      rpHook.fetch(selectedDate),
    ]);
  };

  /**
   * 시뮬레이션 모드: 모든 지표 값을 한 번에 설정 (개발용)
   */
  const setSimulationIndicators = (newIndicators: EconomicIndicator[]) => {
    newIndicators.forEach((indicator) => {
      switch (indicator.id) {
        case 'bond':
          bondHook.setSimulationValue(indicator.value);
          break;
        case 'exchange':
          exchangeHook.setSimulationValue(indicator.value);
          break;
        case 'reserve':
          reserveHook.setSimulationValue(indicator.value);
          break;
        case 'pf':
          pfHook.setSimulationValue(indicator.value);
          break;
        case 'stock':
          stockHook.setSimulationValue(indicator.value);
          break;
        case 'rp':
          rpHook.setSimulationValue(indicator.value);
          break;
        default:
          // 알 수 없는 지표 ID는 무시
          break;
      }
    });
  };

  return {
    indicators,
    isLoading,
    error,
    refresh,
    setSimulationIndicators,
    // 개별 hook 접근 (필요시 사용)
    hooks: {
      bond: bondHook,
      exchange: exchangeHook,
      reserve: reserveHook,
      pf: pfHook,
      stock: stockHook,
      rp: rpHook,
    },
  };
};
