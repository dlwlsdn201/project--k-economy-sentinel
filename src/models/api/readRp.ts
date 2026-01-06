import {
  getEcosApiUrl,
  ECOS_API_STATISTIC_SEARCH_PATH,
} from '@models/api/ecosApiConfig';
import { baseApiModule } from '@app/index';
import type { StatisticSearchResponse } from './readBond10y';

/**
 * 한국은행 RP(환매조건부채권) 매입 규모 조회 API 응답 타입
 *
 * 참고: 실제 ECOS API 통계 코드는 확인 필요
 * 일단 구조만 만들어두고, 실제 API 엔드포인트는 추후 조정
 */
export type ReadRpResponse = StatisticSearchResponse;

/**
 * @desc 한국은행 RP 매입 규모 조회
 * @param date - 조회할 날짜 (YYYYMMDD 형식)
 * @returns ECOS API 응답 데이터
 *
 * TODO: 실제 ECOS API 통계 코드 확인 후 업데이트 필요
 * 현재는 구조만 정의 (mock 데이터 사용 가능)
 */
export const readRp = async ({
  date,
}: {
  date: string;
}): Promise<ReadRpResponse> => {
  // TODO: 실제 ECOS API 통계 코드로 교체 필요
  // 예시: const apiPath = `${ECOS_API_STATISTIC_SEARCH_PATH}/${import.meta.env.VITE_ECOS_OPEN_API_KEY}/json/kr/1/10/{STAT_CODE}/M/{date}/{date}/{ITEM_CODE}`;
  const apiPath = `${ECOS_API_STATISTIC_SEARCH_PATH}/${import.meta.env.VITE_ECOS_OPEN_API_KEY}/json/kr/1/10/603Y001/M/${date}/${date}/O44000`;
  const url = getEcosApiUrl(apiPath);

  const response = await baseApiModule({
    url,
  });
  return response as ReadRpResponse;
};
