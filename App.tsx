
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
import sendEmail from './mailer/agent';

const TRIP_PROMPT_DISMISSALS_KEY = 'raiseYourTripPromptDismissals';
const TRIP_PROMPT_SNOOZE_UNTIL_KEY = 'raiseYourTripPromptSnoozeUntil';
const TRIP_PROMPT_INTERVAL_MS = 5000;
const TRIP_PROMPT_DISMISSAL_LIMIT = 3;
const TRIP_PROMPT_SNOOZE_MS = 2 * 60 * 1000;

const getTripPromptDismissalCount = () => {
  const savedDismissals = Number(sessionStorage.getItem(TRIP_PROMPT_DISMISSALS_KEY) || 0);
  if (!Number.isFinite(savedDismissals)) {
    console.error('Invalid Raise Your Trip prompt dismissal count in session storage.');
    return 0;
  }
  return Math.max(0, Math.floor(savedDismissals));
};


const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'booking' | 'create' | 'expert' | 'login' | 'payment' | null>(null);
  const [viewingPackage, setViewingPackage] = useState<Package | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [tripDestination, setTripDestination] = useState('');
  const [showHomepageTripPrompt, setShowHomepageTripPrompt] = useState(false);
  const [tripPromptSchedule, setTripPromptSchedule] = useState(0);

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
    if (activeModal || showHomepageTripPrompt) return;

    const snoozeUntil = Number(sessionStorage.getItem(TRIP_PROMPT_SNOOZE_UNTIL_KEY) || 0);
    const remainingSnooze = tripPromptSchedule === 0 ? 0 : Math.max(0, snoozeUntil - Date.now());
    const promptTimer = window.setTimeout(() => {
      if (snoozeUntil && remainingSnooze === 0) {
        sessionStorage.removeItem(TRIP_PROMPT_SNOOZE_UNTIL_KEY);
        sessionStorage.setItem(TRIP_PROMPT_DISMISSALS_KEY, '0');
      }
      setShowHomepageTripPrompt(true);
    }, remainingSnooze > 0 ? remainingSnooze : TRIP_PROMPT_INTERVAL_MS);
    return () => window.clearTimeout(promptTimer);
  }, [activeModal, showHomepageTripPrompt, tripPromptSchedule]);

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

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setActiveModal(null);
  };

  const handleOpenRaiseYourTrip = (destination = '') => {
    setShowHomepageTripPrompt(false);
    setTripDestination(destination);
    setActiveModal('create');
  };

  const dismissHomepageTripPrompt = () => {
    const dismissals = getTripPromptDismissalCount() + 1;
    if (dismissals > TRIP_PROMPT_DISMISSAL_LIMIT) {
      sessionStorage.setItem(TRIP_PROMPT_SNOOZE_UNTIL_KEY, String(Date.now() + TRIP_PROMPT_SNOOZE_MS));
    } else {
      sessionStorage.setItem(TRIP_PROMPT_DISMISSALS_KEY, String(dismissals));
    }
    setShowHomepageTripPrompt(false);
    setTripPromptSchedule(schedule => schedule + 1);
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

      {showHomepageTripPrompt && !activeModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm"
          style={{
            minHeight: '100dvh',
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Plan your next trip"
        >
          <button type="button" className="absolute inset-0 cursor-default" onClick={dismissHomepageTripPrompt} aria-label="Dismiss trip suggestion" />
          <section
            className="relative my-auto max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 text-center shadow-2xl animate-in zoom-in duration-300 sm:p-9"
            style={{ maxHeight: 'calc(100dvh - 2rem)' }}
          >
            <button type="button" onClick={dismissHomepageTripPrompt} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800" aria-label="Dismiss trip suggestion">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl" aria-hidden="true">✈️</div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-blue-600">Your trip, your way</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Where would you love to Travel?</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
              Answer a few quick questions, one step at a time, and we’ll help plan a trip that fits you.
            </p>
            <button
              type="button"
              onClick={() => handleOpenRaiseYourTrip(viewingPackage?.destination || '')}
              className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-4 font-black text-white shadow-lg shadow-blue-200 transition duration-300 hover:scale-[1.01] hover:bg-blue-700 active:scale-[0.99] animate-wave-out"
            >
              <span className="relative z-10">Raise Your Trip</span>
            </button>
          </section>
        </div>,
        document.body
      )}

      {/* Modals */}
      {activeModal === 'booking' && <BookingModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'create' && <RaiseYourTrip onClose={() => setActiveModal(null)} currentUser={currentUser} initialDestination={tripDestination} />}
      {activeModal === 'expert' && <ContactExpertModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'login' && <LoginModal onClose={() => setActiveModal(null)} onLoginSuccess={handleLoginSuccess} />}
      {activeModal === 'payment' && <PaymentModal isOpen={activeModal === 'payment'} onClose={() => setActiveModal(null)} />}



      {/* FULL SCREEN POP UP PAGE View*/}
      {viewingPackage && createPortal(
        <div className="itinerary-print-container fixed inset-0 z-[150] h-screen overflow-y-auto bg-white animate-in slide-in-from-bottom duration-500">
          <FullPageItinerary pkg={viewingPackage} onBack={closePackageOverlay} onRaiseYourTrip={handleOpenRaiseYourTrip} />
        </div>,
        document.body
      )}
    </div>
  );
};

export default App;
