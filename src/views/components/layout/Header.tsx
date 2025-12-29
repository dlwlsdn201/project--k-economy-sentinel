export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">
              K-Economy Sentinel
            </h1>
            <span className="text-sm text-gray-500">경제 위기 감지 대시보드</span>
          </div>
        </div>
      </div>
    </header>
  );
};

