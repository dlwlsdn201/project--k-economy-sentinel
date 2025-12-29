import {
  getEcosApiUrl,
  ECOS_API_STATISTIC_SEARCH_PATH,
} from '@models/api/ecosApiConfig';
import { baseApiModule } from '@app/index';
import type { StatisticSearchResponse } from './readBond10y';

/**
 * 외환보유액 조회 API 응답 타입
 */
export type ReadReserveResponse = StatisticSearchResponse;

/**
 * @desc 외환보유액 조회
 * @param date - 조회할 날짜 (YYYYMM 형식, Monthly 기간 조회만 지원)
 * @note - response data 단위는 `천 달러`
 * @returns ECOS API 응답 데이터
 */
export const readReserve = async ({
  date,
}: {
  date: string; // YYYYMM 형식 (예: "202512")
}): Promise<ReadReserveResponse> => {
  // Monthly 기간 조회만 지원 (M)
  // STAT_CODE: 732Y001, ITEM_CODE: 99
  const apiPath = `${ECOS_API_STATISTIC_SEARCH_PATH}/${import.meta.env.VITE_ECOS_OPEN_API_KEY}/json/kr/1/10/732Y001/M/${date}/${date}/99`;
  const url = getEcosApiUrl(apiPath);

  const response = await baseApiModule({
    url,
  });
  return response as ReadReserveResponse;
};
