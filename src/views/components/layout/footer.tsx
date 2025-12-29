export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center text-sm text-gray-500">
          <p>© {currentYear} K-Economy Sentinel. All rights reserved.</p>
          <p className="mt-1">한국 경제 파수꾼 - 5대 핵심 경제 지표 실시간 모니터링</p>
        </div>
      </div>
    </footer>
  );
};

