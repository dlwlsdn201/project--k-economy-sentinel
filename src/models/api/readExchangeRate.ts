import { getEcosApiUrl } from '@models/api/ecosApiConfig';
import { baseApiModule } from '@app/index';

/**
 * ECOS API KeyStatisticList 응답의 row 항목
 */
export interface KeyStatisticListRow {
  KEYSTAT_NAME: string;
  DATA_VALUE: string; // 숫자 값이지만 문자열로 제공됨
  TIME: string; // YYYYMMDD 형식
  CYCLE: string; // 데이터 주기 (D: 일별, M: 월별 등)
  [key: string]: string | null; // 기타 필드들
}

/**
 * ECOS API KeyStatisticList 응답 구조
 */
export interface KeyStatisticListResponse {
  KeyStatisticList: {
    list_total_count: number;
    row: KeyStatisticListRow[];
  };
}

/**
 * 원/달러 환율 조회 API 응답 타입
 */
export type ReadExchangeRateResponse = KeyStatisticListResponse;

/**
 * @desc 원/달러 환율 조회
 * @param date - 조회할 날짜 (YYYYMMDD 형식)
 * @returns ECOS API 응답 데이터
 */
export const readExchangeRate = async ({
  date,
}: {
  date: string;
}): Promise<ReadExchangeRateResponse> => {
  // KeyStatisticList API 사용
  // 환율은 주요 통계 항목이므로 KeyStatisticList API 사용
  const apiPath = `/api/KeyStatisticList/${import.meta.env.VITE_ECOS_OPEN_API_KEY}/json/kr/1/4/D/${date}/${date}`;
  const url = getEcosApiUrl(apiPath);

  const response = await baseApiModule({
    url,
  });
  return response as ReadExchangeRateResponse;
};

