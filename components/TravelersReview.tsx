import React, { useEffect, useMemo, useState } from 'react';

const TravelersReview: React.FC = () => {
  // Load all traveler images from TravelersReview folder. Add new images to this folder and they appear automatically.
  const travelerModules = import.meta.glob('../assets/image/TravelersReview/*.{png,jpg,jpeg,webp}', { eager: true, as: 'url' });
  const travelerImages = useMemo(() => Object.values(travelerModules) as string[], [travelerModules]);

  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!travelerImages.length) return;
    const id = window.setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % travelerImages.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [travelerImages.length]);

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
            Scroll through traveler images and reviews. 3 images show at once in a sliding carousel.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-blue-600 font-bold">Traveler Images</p>
                <p className="text-sm text-slate-500">Image carousel with top-left star rating overlay</p>
              </div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{travelerImages.length} images</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 h-72">
              <div className="absolute top-3 left-3 bg-black/70 text-white rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 z-10">
                <span className="text-yellow-300">★ ★ ★ ★ ★</span>
                <span className="text-slate-100">4.9</span>
              </div>

              <div className="h-full w-full flex items-stretch gap-1">
                {Array.from({ length: Math.min(3, travelerImages.length) }, (_, slideIndex) => {
                  const imageIndex = (galleryIndex + slideIndex) % travelerImages.length;
                  return (
                    <div key={imageIndex} className="h-full w-1/3 transition-all duration-700">
                      <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-200">
                        <img
                          src={travelerImages[imageIndex]}
                          alt={`Traveler ${imageIndex + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-black/70 text-white rounded-full px-2 py-1 text-[10px] font-semibold flex items-center gap-1">
                          <span className="text-yellow-300">★ ★ ★ ★ ★</span>
                          <span className="text-[10px]">5</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex justify-center gap-2">
              {travelerImages.slice(0, Math.min(8, travelerImages.length)).map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to gallery ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full ${galleryIndex === i ? 'bg-blue-600' : 'bg-slate-300'}`}
                  onClick={() => setGalleryIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelersReview;
