import type { CrisisLevel } from '@models/types/crisisTypes';
import { ACTION_PLANS } from '@utils/crisisLogic';
import { CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';

interface ActionPlanProps {
  level: CrisisLevel;
}

export const ActionPlan = ({ level }: ActionPlanProps) => {
  const plan = ACTION_PLANS[level];
  const isCritical = level === 'CRITICAL';

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
        <div className="flex items-start space-x-2 text-gray-700">
          <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-1">자산 운용 전략</p>
            <p className="text-sm">{plan.assetStrategy}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h4 className="font-semibold text-gray-900">구체적 행동 지침</h4>
        </div>
        <ul className="space-y-3">
          {plan.actionItems.map((item, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle2
                className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isCritical ? 'text-red-600' : 'text-green-600'}`}
              />
              <span className="text-gray-700 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
