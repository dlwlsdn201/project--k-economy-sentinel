import { Providers } from './Providers';
import { DashboardPage } from '@views/pages/DashboardPage';
import { Header } from '@views/components/layout/Header';
import { Footer } from '@views/components/layout/Footer';

export const App = () => {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <DashboardPage />
        </main>
        <Footer />
      </div>
    </Providers>
  );
};
