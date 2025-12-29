import { useDashboardVM } from '@viewmodels/use_dashboard_vm';
import { StatusCard } from '@views/components/indicator/status_card';
import { LoadingSpinner } from '@views/components/common/loading_spinner';
import { ErrorMessage } from '@views/components/common/error_message';

export const DashboardPage = () => {
  const { indicators, isLoading, error, refresh } = useDashboardVM();

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
          5대 핵심 경제 지표를 실시간으로 모니터링합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indicators.map((indicator) => (
          <StatusCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {indicators.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">표시할 지표 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

