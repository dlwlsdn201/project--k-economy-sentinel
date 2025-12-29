import type { CrisisLevel } from '@models/types/crisisTypes';
import { CRISIS_LEVEL_METADATA } from '@utils/crisisLogic';
import { AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface CrisisBannerProps {
  level: CrisisLevel;
  reason?: string;
}

const LEVEL_ICONS = {
  STABLE: CheckCircle2,
  CONCERN: Info,
  CAUTION: AlertTriangle,
  CRITICAL: AlertCircle,
};

export const CrisisBanner = ({ level, reason }: CrisisBannerProps) => {
  const metadata = CRISIS_LEVEL_METADATA[level];
  const Icon = LEVEL_ICONS[level];
  const isCritical = level === 'CRITICAL';

  return (
    <div
      className={`
        rounded-lg border-2 p-6 mb-6 transition-all
        ${isCritical ? 'border-red-500 bg-red-50 animate-pulse' : level === 'CAUTION' ? 'border-orange-500 bg-orange-50' : level === 'CONCERN' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}
      `}
      style={{
        backgroundColor: `${metadata.color}15`, // 15 = 약 8% 투명도
        borderColor: metadata.color,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Icon
            className={`h-12 w-12 ${isCritical ? 'text-red-600 animate-pulse' : ''}`}
            style={{ color: metadata.color }}
          />
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span
                className="text-2xl font-bold"
                style={{ color: metadata.color }}
              >
                {metadata.label}
              </span>
              <span className="text-sm text-gray-600">
                (Level{' '}
                {level === 'STABLE'
                  ? 1
                  : level === 'CONCERN'
                    ? 2
                    : level === 'CAUTION'
                      ? 3
                      : 4}
                )
              </span>
            </div>
            <p className="text-gray-700">{metadata.description}</p>
            {reason && (
              <p className="text-sm text-gray-600 mt-2 font-medium">
                📊 판정 근거: {reason}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
