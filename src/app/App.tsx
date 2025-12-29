import { useState } from 'react';
import { Providers } from './Providers';
import { DashboardPage } from '@views/pages/DashboardPage';
import { Header } from '@views/components/layout/Header';
import { Footer } from '@views/components/layout/Footer';
import { SimulationPanel } from '@views/components/simulation/SimulationPanel';
import { Sliders } from 'lucide-react';

export const App = () => {
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 relative">
          <DashboardPage />
          {/* Simulation Mode 버튼 (개발용) */}
          {import.meta.env.DEV && (
            <button
              onClick={() => setIsSimulationOpen(true)}
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
              title="시뮬레이션 모드"
            >
              <Sliders className="h-6 w-6" />
            </button>
          )}
        </main>
        <Footer />
        <SimulationPanel
          isOpen={isSimulationOpen}
          onClose={() => setIsSimulationOpen(false)}
        />
      </div>
    </Providers>
  );
};
