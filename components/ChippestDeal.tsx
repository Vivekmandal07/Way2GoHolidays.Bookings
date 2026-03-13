import React, { useEffect, useMemo, useState } from 'react';

const ChippestDeal: React.FC = () => {
  const chippestImages = useMemo(() => {
    const modules = import.meta.glob('../assets/image/ChippestDealImage/*.{png,jpg,jpeg,webp,svg}', { eager: true, as: 'url' }) as Record<string, string>;
    const urls = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b)).map(([, url]) => url);
    return urls.length > 0
      ? urls
      : ['https://via.placeholder.com/1200x700?text=Add+images+to+assets/image/ChippestDealImage'];
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState('00d 00h 00m 00s');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
      const diff = endOfMonth.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('00d 00h 00m 00s');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`);
    };

    updateTimer();
    const timerInterval = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % chippestImages.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [chippestImages.length]);

  return (
    <section id="chippest-deal" className="py-16 md:py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
      <style>{`@keyframes slideRightToLeft { from { transform: translateX(30%); opacity: 0.3; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex flex-col items-center">
            <span className="text-sm uppercase font-bold tracking-[0.22em] text-blue-600">Hot Pick Deal</span>
            <div className="mt-3 relative group inline-block">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Chippest Deals for Your Next Memorable Trip Escape</h2>
              <span className="absolute left-1/2 top-full mt-2 h-1 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </div>
          </div>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Discover the handpicked budget-friendly popular packages </p> 
        </div>
        <div className="relative rounded-3xl shadow-xl overflow-hidden border border-blue-100 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-transparent to-indigo-300/10" />
          <div className="relative p-4 md:p-6">
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 bg-gray-100">
              <img
                key={activeIndex}
                src={chippestImages[activeIndex]}
                alt={`Chippest deal ${activeIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                style={{ animation: 'slideRightToLeft 1.2s ease both' }}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold">Limited Time Offer</p>
                  <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg">Ends this month in {timeLeft}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">Best Value Travel Package</h3>
                <p className="mt-1 text-sm text-gray-600">Switching every 2 seconds so you never miss the latest deal.</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Image</p>
                <p className="text-2xl md:text-3xl font-extrabold text-blue-600">{activeIndex + 1}/{chippestImages.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChippestDeal;
