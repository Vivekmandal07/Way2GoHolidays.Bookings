import React, { useEffect, useMemo, useState } from 'react';

const TravelersReview: React.FC = () => {
  const travelerModules = import.meta.glob('../assets/image/travelersReview/*.{png,jpg,jpeg}', { eager: true, as: 'url' });
  const travelerImages = useMemo(() => Object.values(travelerModules) as string[], [travelerModules]);

  const reviews = useMemo(() => {
    const base = [
      { quote: 'The trip was absolutely amazing, and everything was handled professionally.', name: 'Aarti P.', role: 'Family Trip' },
      { quote: 'Exceptional service and flawless planning. The itinerary was perfect for us.', name: 'Rohan S.', role: 'Couple Getaway' },
      { quote: 'From flights to hotels, every detail was taken care of. Highly recommended.', name: 'Neha T.', role: 'Solo Traveler' },
      { quote: 'We made memories for life. Great support and quick responses throughout.', name: 'Karan M.', role: 'Group Travel' },
      { quote: 'Smooth booking and excellent local guides. I will book again.', name: 'Priya D.', role: 'Adventure Travel' },
    ];

    return base.map((r, idx) => ({ ...r, img: travelerImages[idx % travelerImages.length] || '' }));
  }, [travelerImages]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reviews.length === 0) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [reviews.length]);

  if (!travelerImages.length) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-blue-600 uppercase tracking-[0.2em] text-xs font-bold">Travelers' Voice</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">Travelers Review</h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
            Real customer stories from our travel community. Slide through our reviews to feel the trust.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-blue-600 font-bold">Photo Frame</p>
                <p className="text-sm text-slate-500">3 images in one frame</p>
              </div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{travelerImages.length}+ photos</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {travelerImages.slice(0, 3).map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 h-24 md:h-28">
                  <img src={img} alt={`Traveler ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="grid grid-cols-2 gap-2">
                {travelerImages.slice(3, 9).map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-slate-200 h-20">
                    <img src={img} alt={`Traveler ${i + 4}`} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-700 font-semibold">Traveler Highlights</p>
              <p className="mt-1 text-sm text-slate-600">See more reviews and photos from our guests around the world.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-bold mb-2">Review Slider</p>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/95 text-white p-4 h-56 md:h-64">
              <div
                className="h-full flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)`, width: `${reviews.length * 100}%` }}
              >
                {reviews.map((review, idx) => (
                  <div key={idx} className="h-full w-full shrink-0 flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {review.img ? (
                        <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-white" loading="lazy" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-700" />
                      )}
                      <div>
                        <p className="text-sm font-bold">{review.name}</p>
                        <p className="text-xs text-blue-100">{review.role}</p>
                      </div>
                    </div>
                    <p className="text-sm md:text-base leading-6 text-slate-100">“{review.quote}”</p>
                    <div className="flex items-center gap-2 justify-center">
                      {reviews.map((_, dot) => (
                        <button
                          key={dot}
                          onClick={() => setActiveIndex(dot)}
                          className={`w-2.5 h-2.5 rounded-full ${activeIndex === dot ? 'bg-white' : 'bg-white/40'}`}
                          aria-label={`Go to review ${dot + 1}`}
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
