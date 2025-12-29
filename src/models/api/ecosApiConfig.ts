/**
 * ECOS API 설정 및 유틸리티
 *
 * CORS 문제 해결을 위해:
 * - 개발 환경: Vite 프록시를 통해 호출 (/api/ecos)
 * - 프로덕션 환경: 직접 호출 또는 Vercel Serverless Functions 사용
 */

/**
 * ECOS API 기본 URL 생성
 * @param path - API 경로 (예: /api/StatisticSearch/...)
 * @returns 환경에 맞는 전체 URL
 */
export const getEcosApiUrl = (path: string): string => {
  // 개발 환경에서는 프록시 경로 사용
  if (import.meta.env.DEV) {
    return `${path}`;
  }
  // 프로덕션 환경에서는 직접 호출 (또는 Serverless Functions 사용)
  return `https://ecos.bok.or.kr${path}`;
};

/**
 * ECOS API 기본 경로
 */
export const ECOS_API_BASE_PATH = '/api';

/**
 * ECOS API StatisticSearch 경로
 */
export const ECOS_API_STATISTIC_SEARCH_PATH = `${ECOS_API_BASE_PATH}/StatisticSearch`;
