import { useDashboardVM } from '@viewmodels/useDashboardVM';
import type { EconomicIndicator } from '@models/types/indicatorTypes';
import { X, Sliders } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SimulationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationPanel = ({ isOpen, onClose }: SimulationPanelProps) => {
  const { indicators, setSimulationIndicators } = useDashboardVM();
  const [localIndicators, setLocalIndicators] = useState<EconomicIndicator[]>(
    []
  );

  // 패널이 열릴 때 indicators를 localIndicators로 초기화
  useEffect(() => {
    if (isOpen && indicators.length > 0) {
      setLocalIndicators([...indicators]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValueChange = (id: string, value: number) => {
    setLocalIndicators((prev) =>
      prev.map((ind) => (ind.id === id ? { ...ind, value } : ind))
    );
  };

  const handleApply = () => {
    setSimulationIndicators(localIndicators);
  };

  const handleReset = () => {
    setLocalIndicators(indicators);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">시뮬레이션 모드</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {localIndicators.map((indicator) => (
            <div key={indicator.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  {indicator.name}
                </label>
                <span className="text-sm text-gray-500">
                  {indicator.value.toLocaleString('ko-KR')} {indicator.unit}
                </span>
              </div>
              <input
                type="range"
                min={indicator.value * 0.5}
                max={indicator.value * 2}
                step={
                  indicator.unit === '%'
                    ? 0.1
                    : indicator.unit === '원'
                      ? 10
                      : 100
                }
                value={indicator.value}
                onChange={(e) =>
                  handleValueChange(indicator.id, parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{(indicator.value * 0.5).toFixed(1)}</span>
                <span>{(indicator.value * 2).toFixed(1)}</span>
              </div>
            </div>
          ))}

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              적용
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
