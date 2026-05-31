export default function WeatherSkeleton() {
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen animate-pulse">
      {/* Navbar */}
      <div className="h-16 bg-white shadow-sm px-6 flex items-center">
        <div className="h-8 w-40 bg-gray-300 rounded-md" />
      </div>

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today's Weather */}
        <section className="space-y-4">
          {/* Date */}
          <div className="space-y-4">
            <div className="h-8 w-56 bg-gray-300 rounded" />

            {/* Main Weather Card */}
            <div className="bg-white rounded-2xl p-6 shadow flex flex-col md:flex-row gap-8">
              {/* Temperature */}
              <div className="flex flex-col gap-3">
                <div className="h-14 w-24 bg-gray-300 rounded" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
                <div className="h-4 w-32 bg-gray-300 rounded" />
              </div>

              {/* Hourly Forecast */}
              <div className="flex gap-8 overflow-hidden flex-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-3 min-w-15"
                  >
                    <div className="h-4 w-12 bg-gray-300 rounded" />
                    <div className="h-10 w-10 bg-gray-300 rounded-full" />
                    <div className="h-4 w-8 bg-gray-300 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weather Description + Details */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left Card */}
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 w-full lg:w-56">
              <div className="h-4 w-24 bg-gray-300 rounded" />
              <div className="h-20 w-20 bg-gray-300 rounded-full" />
            </div>

            {/* Right Card */}
            <div className="bg-white rounded-2xl p-6 flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                    <div className="h-6 w-16 bg-gray-300 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5-Day Forecast */}
        <section className="flex flex-col gap-4">
          <div className="h-8 w-48 bg-gray-300 rounded" />

          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                  <div className="h-4 w-20 bg-gray-300 rounded" />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="h-4 w-12 bg-gray-300 rounded" />
                <div className="h-4 w-12 bg-gray-300 rounded" />
                <div className="h-4 w-12 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}