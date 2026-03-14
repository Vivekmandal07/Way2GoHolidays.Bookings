import React, { useEffect, useMemo, useState } from 'react';

const TravelersReview: React.FC = () => {
  // Load all traveler images from the folder. Add new images to this folder and they appear automatically.
  const travelerModules = import.meta.glob('../assets/image/travelersReview/*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });
  const travelerImages = useMemo(() => Object.values(travelerModules) as string[], [travelerModules]);

  const reviews = [
    { quote: 'The planning was spot-on. Every hotel and transfer was perfect.', name: 'Aarti P.', role: 'Family Traveler' },
    { quote: 'Amazing customer support and beautiful itinerary. We felt taken care of.', name: 'Rohan K.', role: 'Couple Trip' },
    { quote: 'This was our first solo adventure. Everything was safe, smooth, and memorable.', name: 'Neha T.', role: 'Solo Traveler' },
    { quote: 'Our group had a blast. Great guides and excellent local experiences.', name: 'Karan M.', role: 'Group Tour' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reviews.length === 0) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

  if (!travelerImages.length) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500">No traveler images found yet. Add image files to <code>assets/image/travellers/</code> to display them here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-blue-600 uppercase tracking-[0.2em] text-xs font-bold">Traveler Reviews</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">Happy Travels, Real Stories</h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
            We show all traveler images from the assets folder, and reviews slide automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-blue-600 font-bold">Gallery Frame</p>
                <p className="text-sm text-slate-500">Auto-displays all images from travelers folder</p>
              </div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{travelerImages.length} images</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {travelerImages.slice(0, 3).map((img, index) => (
                <div key={index} className="rounded-2xl overflow-hidden h-24 md:h-28 border border-slate-200">
                  <img src={img} alt={`Traveler ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {travelerImages.slice(3, 9).map((img, index) => (
                <div key={index} className="rounded-xl overflow-hidden h-20 border border-slate-200">
                  <img src={img} alt={`Traveler ${index + 4}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-3 text-sm text-slate-700">
              Add new images to <code className="bg-white px-1 py-0.5 rounded">assets/image/travellers/</code> and they appear automatically.
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-bold mb-3">Sliding Review</p>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/95 text-white p-4 h-60 md:h-64">
              <div
                className="flex h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)`, width: `${reviews.length * 100}%` }}
              >
                {reviews.map((review, idx) => (
                  <div key={idx} className="w-full flex-shrink-0 flex flex-col justify-between gap-3 h-full">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold uppercase">{review.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-semibold">{review.name}</p>
                        <p className="text-xs text-blue-200">{review.role}</p>
                      </div>
                    </div>
                    <p className="text-sm md:text-base leading-6 text-slate-100">“{review.quote}”</p>
                    <div className="flex justify-center gap-2">
                      {reviews.map((_, bullet) => (
                        <button
                          key={bullet}
                          onClick={() => setActiveIndex(bullet)}
                          className={`w-2.5 h-2.5 rounded-full ${activeIndex === bullet ? 'bg-white' : 'bg-white/40'}`}
                          aria-label={`Go to review ${bullet + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelersReview;
