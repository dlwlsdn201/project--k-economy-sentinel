import type { StatisticSearchResponse } from '@models/api/readBond10y';
import type { KeyStatisticListResponse } from '@models/api/readExchangeRate';

/**
 * StatisticSearch API 응답이 유효한지 확인
 * @param response - API 응답 데이터
 * @returns 유효한 데이터가 있으면 true, 없으면 false
 */
export const isValidStatisticSearchResponse = (
  response: unknown
): response is StatisticSearchResponse => {
  const data = response as StatisticSearchResponse;
  const row = data?.StatisticSearch?.row?.[0];

  // row가 없거나, DATA_VALUE가 없거나, 빈 문자열이거나 null이면 유효하지 않음
  if (!row || !row.DATA_VALUE || row.DATA_VALUE.trim() === '') {
    return false;
  }

  return true;
};

/**
 * KeyStatisticList API 응답이 유효한지 확인
 * @param response - API 응답 데이터
 * @returns 유효한 데이터가 있으면 true, 없으면 false
 */
export const isValidKeyStatisticListResponse = (
  response: unknown
): response is KeyStatisticListResponse => {
  const data = response as KeyStatisticListResponse;
  const row = data?.KeyStatisticList?.row?.[0];

  // row가 없거나, DATA_VALUE가 없거나, 빈 문자열이거나 null이면 유효하지 않음
  if (!row || !row.DATA_VALUE || row.DATA_VALUE.trim() === '') {
    return false;
  }

  return true;
};


