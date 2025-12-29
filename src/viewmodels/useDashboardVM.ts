import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import { INDICATOR_METADATA, determineStatus } from '@models/constants/indicatorConstants';

// 지표 데이터 atom
export const indicatorsAtom = atom<EconomicIndicator[]>([]);

// 로딩 상태 atom
export const isLoadingAtom = atom<boolean>(false);

// 에러 상태 atom
export const errorAtom = atom<string | null>(null);

/**
 * 대시보드 ViewModel
 * 지표 데이터 상태 관리 및 위험도 판별 로직 제공
 */
export const useDashboardVM = () => {
  const indicators = useAtomValue(indicatorsAtom);
  const isLoading = useAtomValue(isLoadingAtom);
  const error = useAtomValue(errorAtom);
  const setIndicators = useSetAtom(indicatorsAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const setError = useSetAtom(errorAtom);

  // 초기 데이터 로드 (목업 데이터)
  useEffect(() => {
    const loadInitialData = () => {
      setIsLoading(true);
      setError(null);

      try {
        // 목업 데이터 생성
        const mockData = createMockIndicators();
        setIndicators(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터 로드 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [setIndicators, setIsLoading, setError]);

  // 향후 API 연동 시 사용할 데이터 새로고침 함수
  const refresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: API 연동 시 실제 데이터 fetch
      // const data = await fetchIndicators();
      // setIndicators(data);
      const mockData = createMockIndicators();
      setIndicators(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 새로고침 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    indicators,
    isLoading,
    error,
    refresh,
  };
};

/**
 * 목업 데이터 생성 함수 (개발용)
 */
export const createMockIndicators = (): EconomicIndicator[] => {
  const indicatorIds: Array<keyof typeof INDICATOR_METADATA> = [
    'bond',
    'exchange',
    'reserve',
    'pf',
    'stock',
  ];

  // 목업 값 (문서 기준)
  const mockValues: Record<string, number> = {
    bond: 3.8, // WARNING
    exchange: 1380, // WARNING
    reserve: 4100, // WARNING
    pf: 8.5, // WARNING
    stock: -2000, // WARNING
  };

  // 현재 시간을 기준으로 목업 데이터 생성
  const now = new Date();
  const fetchedAt = now.toISOString();

  return indicatorIds.map((id) => {
    const value = mockValues[id] ?? 0;
    const metadata = INDICATOR_METADATA[id];
    const status = determineStatus(id, value);

    return {
      id,
      name: metadata.name,
      value,
      unit: metadata.unit,
      status,
      source: metadata.source,
      description: metadata.description,
      fetchedAt,
    };
  });
};

