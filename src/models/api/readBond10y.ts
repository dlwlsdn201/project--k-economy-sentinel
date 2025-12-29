import {
  getEcosApiUrl,
  ECOS_API_STATISTIC_SEARCH_PATH,
} from '@models/api/ecosApiConfig';
import { baseApiModule } from '@app/index';

/**
 * ECOS API StatisticSearch 응답의 row 항목
 */
export interface StatisticSearchRow {
  STAT_CODE: string;
  STAT_NAME: string;
  ITEM_CODE1: string;
  ITEM_NAME1: string;
  ITEM_CODE2: string | null;
  ITEM_NAME2: string | null;
  ITEM_CODE3: string | null;
  ITEM_NAME3: string | null;
  ITEM_CODE4: string | null;
  ITEM_NAME4: string | null;
  UNIT_NAME: string;
  WGT: string | null;
  TIME: string; // YYYYMMDD 형식
  DATA_VALUE: string; // 숫자 값이지만 문자열로 제공됨 (예: "3.354")
}

/**
 * ECOS API StatisticSearch 응답 구조
 */
export interface StatisticSearchResponse {
  StatisticSearch: {
    list_total_count: number;
    row: StatisticSearchRow[];
  };
}

/**
 * 국고채 10년물 금리 조회 API 응답 타입
 */
export type ReadBond10yResponse = StatisticSearchResponse;

/**
 * @desc 국고채 10년 금리 조회
 * @param date - 조회할 날짜 (YYYYMMDD 형식)
 * @returns ECOS API 응답 데이터
 */
export const readBond10y = async ({
  date,
}: {
  date: string;
}): Promise<ReadBond10yResponse> => {
  const apiPath = `${ECOS_API_STATISTIC_SEARCH_PATH}/${import.meta.env.VITE_ECOS_OPEN_API_KEY}/json/kr/1/10/817Y002/D/${date}/${date}/010210000`;
  const url = getEcosApiUrl(apiPath);

  const response = await baseApiModule({
    url,
  });
  return response as ReadBond10yResponse;
};
