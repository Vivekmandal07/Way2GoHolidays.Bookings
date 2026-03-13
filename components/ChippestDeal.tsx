import React, { useEffect, useState } from 'react';

const ChippestDeal: React.FC = () => {
  const chippestImages = [
    new URL('../assets/image/packege-1 pattaya beach.png', import.meta.url).href,
    new URL('../assets/image/packege-2 burjkhalifa.png', import.meta.url).href,
    new URL('../assets/image/packege-3 bali.png', import.meta.url).href,
    new URL('../assets/image/packege-4 pattaya city.png', import.meta.url).href,
    new URL('../assets/image/packege-5 vietnam train street.png', import.meta.url).href,
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % chippestImages.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [chippestImages.length]);

  return (
    <section id="chippest-deal" className="py-16 md:py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <span className="text-sm uppercase font-bold tracking-[0.22em] text-blue-600">Hot Picks</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">Chippest Deals for Your Next Escape</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">Discover handpicked budget-friendly packages updated every 2 seconds.</p>
        </div>

        <div className="relative rounded-3xl shadow-xl overflow-hidden border border-blue-100 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-transparent to-indigo-300/10" />
          <div className="relative p-4 md:p-6">
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 bg-gray-100">
              <img
                src={chippestImages[activeIndex]}
                alt={`Chippest deal ${activeIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold">Limited Time Offer</p>
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
