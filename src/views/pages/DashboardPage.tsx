import { useDashboardVM } from '@viewmodels/index';
import { GaugeCard } from '@views/components/indicator/GaugeCard';
import { LoadingSpinner } from '@views/components/common/LoadingSpinner';
import { ErrorMessage } from '@views/components/common/ErrorMessage';
import { CrisisBanner } from '@views/components/crisis/CrisisBanner';
import { ActionPlan } from '@views/components/crisis/ActionPlan';
import { calculateCrisisLevel } from '@utils/crisisLogic';
import { useMemo } from 'react';

export const DashboardPage = () => {
  const { indicators, isLoading, error, refresh } = useDashboardVM();
  // 위기 레벨 계산 (레벨 + 근거)
  const crisisResult = useMemo(() => {
    if (indicators.length === 0) {
      return { level: 'STABLE' as const, reason: '지표 데이터가 없습니다.' };
    }
    return calculateCrisisLevel(indicators);
  }, [indicators]);

  const crisisLevel = crisisResult.level;
  const crisisReason = crisisResult.reason;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          경제 위기 감지 대시보드
        </h2>
        <p className="text-gray-600">
          6대 핵심 경제 지표를 실시간으로 모니터링합니다.
        </p>
      </div>

      {/* 위기 단계 배너 */}
      <CrisisBanner level={crisisLevel} reason={crisisReason} />

      {/* 지표 게이지 그리드 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          경제 지표 모니터링
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indicators.length > 0 ? (
            indicators.map((indicator) => (
              <GaugeCard key={indicator.id} indicator={indicator} />
            ))
          ) : (
            // 데이터가 없을 때 샘플 게이지 표시 (테스트용)
            <GaugeCard />
          )}
        </div>
      </div>

      {/* Action Plan 섹션 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          대응 행동 지침
        </h3>
        <ActionPlan level={crisisLevel} indicators={indicators} />
      </div>
    </div>
  );
};
