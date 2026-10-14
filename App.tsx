
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingModal from './components/BookingModal';
import RaiseYourTrip from './components/RaiseYourTrip';
import DestinationsSection from './components/DestinationsSection';
import PackageSection from './components/PackageSection';
import GallerySection from './components/GallerySection';
import ServicesSection from './components/ServicesSection';
import ContactExpertModal from './components/ContactExpertModal';
import LoginModal from './components/LoginModal';
import FullPageItinerary from './components/FullPageItinerary';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AiTravelAssistant from './components/AiTravelAssistant';
import ChippestDeal from './components/ChippestDeal';
import TravelersReview from './components/TravelersReview';
import { INTERNATIONAL_DESTINATIONS, DOMESTIC_DESTINATIONS, PACKAGES } from './constants';
import { Package, AuthUser } from './types';
import PaymentModal from './components/PaymentModal';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'booking' | 'create' | 'expert' | 'login' | 'payment' | null>(null);
  const [viewingPackage, setViewingPackage] = useState<Package | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [tripDestination, setTripDestination] = useState('');
  const [showHomepageTripPrompt, setShowHomepageTripPrompt] = useState(false);
  const [dismissedHomepageTripPrompt, setDismissedHomepageTripPrompt] = useState(false);

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
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Unable to parse saved user:', error);
      }
    }

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

  useEffect(() => {
    if (viewingPackage || activeModal || dismissedHomepageTripPrompt) return;

    const promptTimer = window.setTimeout(() => setShowHomepageTripPrompt(true), 2000);
    return () => window.clearTimeout(promptTimer);
  }, [activeModal, dismissedHomepageTripPrompt, viewingPackage]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPackage = (pkg: Package) => {
    setShowHomepageTripPrompt(false);
    setDismissedHomepageTripPrompt(true);
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

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setActiveModal(null);
  };

  const handleOpenRaiseYourTrip = (destination = '') => {
    setShowHomepageTripPrompt(false);
    setDismissedHomepageTripPrompt(true);
    setTripDestination(destination);
    setActiveModal('create');
  };

  const dismissHomepageTripPrompt = () => {
    setShowHomepageTripPrompt(false);
    setDismissedHomepageTripPrompt(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
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
      handleOpenRaiseYourTrip(destName);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar 
        scrollTo={scrollTo} 
        onLogin={() => setActiveModal('login')} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow pt-20">
        <Hero 
          onBookNow={() => setActiveModal('booking')} 
          onCreatePackage={() => handleOpenRaiseYourTrip()}
          onContactExpert={() => setActiveModal('expert')}
        />

        <AiTravelAssistant onBookNow={() => setActiveModal('booking')} />
        <ChippestDeal />

        {/* services cards section inserted between hero/search and destinations */}
        <ServicesSection />

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

        <div id="travelers-review" className="scroll-mt-24">
          <TravelersReview />
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
              <p><b>Founder & CEO of Way2GoHolidays : Way2Go Holidays</b></p>
              <p className="text-center">Founded at 01-Jan 2024</p>
            </div>
          </section>
        </div>
      </main>


      <Footer />
      <WhatsAppButton />

      {showHomepageTripPrompt && !viewingPackage && !activeModal && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Plan your next trip">
          <section className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl animate-in zoom-in duration-300 sm:p-9">
            <button type="button" onClick={dismissHomepageTripPrompt} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800" aria-label="Dismiss trip suggestion">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl" aria-hidden="true">✈️</div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-blue-600">Your trip, your way</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Where would you love to go?</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
              Answer a few quick questions, one step at a time, and we’ll help plan a trip that fits you.
            </p>
            <button type="button" onClick={() => handleOpenRaiseYourTrip()} className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
              Raise Your Trip
            </button>
            <button type="button" onClick={dismissHomepageTripPrompt} className="mt-3 px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800">
              Maybe later
            </button>
          </section>
        </div>
      )}

      {/* Modals */}
      {activeModal === 'booking' && <BookingModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'create' && <RaiseYourTrip onClose={() => setActiveModal(null)} currentUser={currentUser} initialDestination={tripDestination} />}
      {activeModal === 'expert' && <ContactExpertModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'login' && <LoginModal onClose={() => setActiveModal(null)} onLoginSuccess={handleLoginSuccess} />}
      {activeModal === 'payment' && <PaymentModal isOpen={activeModal === 'payment'} onClose={() => setActiveModal(null)} />}



      {/* FULL SCREEN POP UP PAGE View*/}
      {viewingPackage && createPortal(
        <div className="fixed inset-0 z-[150] h-screen overflow-y-auto bg-white animate-in slide-in-from-bottom duration-500">
          <FullPageItinerary pkg={viewingPackage} onBack={closePackageOverlay} onRaiseYourTrip={handleOpenRaiseYourTrip} />
        </div>,
        document.body
      )}
    </div>
  );
};

export default App;
