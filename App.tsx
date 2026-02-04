
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingModal from './components/BookingModal';
import CreatePackageModal from './components/CreatePackageModal';
import DestinationsSection from './components/DestinationsSection';
import PackageSection from './components/PackageSection';
import GallerySection from './components/GallerySection';
import ContactExpertModal from './components/ContactExpertModal';
import LoginModal from './components/LoginModal';
import FullPageItinerary from './components/FullPageItinerary';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AiTravelAssistant from './components/AiTravelAssistant';
import { INTERNATIONAL_DESTINATIONS, DOMESTIC_DESTINATIONS, PACKAGES } from './constants';
import { Package } from './types';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'booking' | 'create' | 'expert' | 'login' | null>(null);
  const [viewingPackage, setViewingPackage] = useState<Package | null>(null);

  // Check URL for package parameter on load
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const pkgId = searchParams.get('package');
    if (pkgId) {
      const found = PACKAGES.find(p => p.id === pkgId);
      if (found) setViewingPackage(found);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const headings = document.querySelectorAll('.reveal-heading');
    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, [viewingPackage]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPackage = (pkg: Package) => {
    setViewingPackage(pkg);
    // Update URL without reloading to allow sharing links
    const url = new URL(window.location.href);
    url.searchParams.set('package', pkg.id);
    window.history.pushState({}, '', url.pathname + url.search);
  };

  const closePackageOverlay = () => {
    setViewingPackage(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('package');
    window.history.pushState({}, '', url.pathname + url.search);
  };

  const handleExploreDestination = (destName: string) => {
    // 1. Try to find an exact match first
    let found = PACKAGES.find(p => 
      p.destination.toLowerCase() === destName.toLowerCase() ||
      p.title.toLowerCase().includes(destName.toLowerCase())
    );

    // 2. Fallback to a partial match if no exact match found
    if (!found) {
      found = PACKAGES.find(p => 
        p.destination.toLowerCase().includes(destName.toLowerCase()) || 
        destName.toLowerCase().includes(p.destination.toLowerCase())
      );
    }

    if (found) {
      handleOpenPackage(found);
    } else {
      // If still nothing, let them design their own
      setActiveModal('create');
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        scrollTo={scrollTo} 
        onLogin={() => setActiveModal('login')} 
      />
      
      <main className="flex-grow pt-20">
        <Hero 
          onBookNow={() => setActiveModal('booking')} 
          onCreatePackage={() => setActiveModal('create')}
          onContactExpert={() => setActiveModal('expert')}
        />

        <AiTravelAssistant onBookNow={() => setActiveModal('booking')} />

        <div id="destinations" className="scroll-mt-24">
          <DestinationsSection 
            title="Popular International Destinations" 
            destinations={INTERNATIONAL_DESTINATIONS} 
            onExplore={handleExploreDestination}
          />
          <div className="bg-gray-100 h-px container mx-auto" />
          <DestinationsSection 
            title="Top Domestic Destinations" 
            destinations={DOMESTIC_DESTINATIONS} 
            onExplore={handleExploreDestination}
          />
        </div>

        <div id="packages" className="scroll-mt-24">
          <PackageSection onOpenPackage={handleOpenPackage} />
        </div>

        <div id="gallery" className="scroll-mt-24">
          <GallerySection />
        </div>

        <div id="about" className="scroll-mt-24">
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-black mb-10 text-gray-900 tracking-tighter">About Way2GoHolidays</h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8">
                At Way2GoHolidays, we believe that travel is more than just visiting a new place; it's about creating memories that last a lifetime. Based in the heart of New Delhi, we specialize in crafting bespoke travel experiences tailored to your dreams.
              </p>
              <p><b>Founder & CEO of Way2GoHolidays : Subodh Mandal</b></p>
              <p><centre>Founded at 22 Dec 2024</centre></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Modals */}
      {activeModal === 'booking' && <BookingModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'create' && <CreatePackageModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'expert' && <ContactExpertModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'login' && <LoginModal onClose={() => setActiveModal(null)} />}
      
      {/* FULL SCREEN POP UP PAGE */}
      {viewingPackage && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-white animate-in slide-in-from-bottom duration-500">
          <FullPageItinerary pkg={viewingPackage} onBack={closePackageOverlay} />
        </div>
      )}
    </div>
  );
};

export default App;
