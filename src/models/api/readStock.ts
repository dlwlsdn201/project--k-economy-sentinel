import {
  getEcosApiUrl,
  ECOS_API_STATISTIC_SEARCH_PATH,
} from '@models/api/ecosApiConfig';
import { baseApiModule } from '@app/index';
import type { StatisticSearchResponse } from './readBond10y';

/**
 * 외국인 순매수 동향 조회 API 응답 타입
 */
export type ReadStockResponse = StatisticSearchResponse;

/**
 * @desc 외국인 순매수 동향 조회 (코스피 지수)
 * @param date - 조회할 날짜 (YYYYMM 형식)
 * @returns ECOS API 응답 데이터
 */
export const readStock = async ({
  date,
}: {
  date: string; // YYYYMM 형식
}): Promise<ReadStockResponse> => {
  // Monthly 기간 조회 (M)
  // STAT_CODE: 802Y001, ITEM_CODE: 0030000 (코스피 지수)
  const apiPath = `${ECOS_API_STATISTIC_SEARCH_PATH}/${import.meta.env.VITE_ECOS_OPEN_API_KEY}/json/kr/1/10/802Y001/D/${date}/${date}/0030000`;
  const url = getEcosApiUrl(apiPath);

  const response = await baseApiModule({
    url,
  });
  return response as ReadStockResponse;
};
