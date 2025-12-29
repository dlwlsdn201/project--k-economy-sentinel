import { Providers } from './providers';
import { DashboardPage } from '@views/pages/dashboard_page';
import { Header } from '@views/components/layout/header';
import { Footer } from '@views/components/layout/footer';

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

