import React, { useEffect, useRef, useState } from 'react';
import { AuthUser } from '../types';
import { CONTACT_DETAILS, COUNTRY_CODES, DESTINATION_CITIES, INTERNATIONAL_DESTINATIONS, DOMESTIC_DESTINATIONS } from '../constants';
import { createTripRequestToken, submitTripRequest } from '../services/tripRequests';
import type { TripRequestSubmission } from '../services/tripRequests';

const DESTINATIONS = [...INTERNATIONAL_DESTINATIONS, ...DOMESTIC_DESTINATIONS];
const prioritizeDestinations = (destinations: typeof DESTINATIONS, featuredNames: string[]) => {
  const featured = featuredNames.map(name =>
    destinations.find(destination => destination.name.toLowerCase().includes(name.toLowerCase()))
  ).filter((destination): destination is typeof DESTINATIONS[number] => Boolean(destination));
  const featuredIds = new Set(featured.map(destination => destination.id));
  return [...featured, ...destinations.filter(destination => !featuredIds.has(destination.id))];
};
const DESTINATION_GROUPS = [
  {
    label: 'Domestic',
    destinations: prioritizeDestinations(DOMESTIC_DESTINATIONS, ['Kerala', 'Sikkim', 'Goa']),
  },
  {
    label: 'International',
    destinations: prioritizeDestinations(INTERNATIONAL_DESTINATIONS, ['Europe', 'Thailand', 'Bali', 'Vietnam', 'Singapore', 'Malaysia']),
  },
];
const NIGHT_OPTIONS = Array.from({ length: 10 }, (_, index) => `${index + 1}N/${index + 2}D`);
const TRAVELLER_OPTIONS = [
  { label: 'Couple', icon: '💑' },
  { label: 'Friends', icon: '🧑‍🤝‍🧑' },
  { label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { label: 'Honeymoon', icon: '💍' },
  { label: 'Solo', icon: '🧳' },
  { label: 'Group', icon: '🎉' },
];
const HOTEL_OPTIONS = ['2 Star', '3 Star', '4 Star', '5 Star'];
const BOOKING_WINDOWS = ['In 1–3 days', 'This week', 'This month', 'Just checking prices'];
const TICKET_OPTIONS = ['Already booked', 'Not booked yet', 'Need help deciding'];
const FLEXIBLE_DATES = ['Next 1–3 months', 'In 3–6 months', 'Later this year', 'Dates are open'];
const BUDGET_OPTIONS = [
  '₹15K–₹25K', '₹25K–₹35K', '₹35K–₹50K', '₹50K–₹75K', '₹75K–₹1L',
  '₹1L–₹1.5L', '₹1.5L–₹2L', '₹2L–₹3L', '₹3L–₹5L', '₹5L+',
];
const TOTAL_STEPS = 9;

const formatTravelDate = (value: string) => {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

interface RaiseYourTripProps {
  onClose: () => void;
  currentUser: AuthUser | null;
  initialDestination?: string;
}

interface TripRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  leavingFrom: string;
  destination: string;
  destinationCities: string[];
  destinationPreference: string;
  destinationOptions: string[];
  pax: string;
  children: string;
  childAges: string[];
  travelDate: string;
  tripType: string;
  hotelCategory: string;
  noOfNights: string;
  budgetRange: string;
  bookingWindow: string;
  ticketStatus: string;
  submittedAt: string;
}

const RaiseYourTrip: React.FC<RaiseYourTripProps> = ({ onClose, currentUser, initialDestination = '' }) => {
  const suggestedDestination = DESTINATIONS.find(destination =>
    destination.name.toLowerCase() === initialDestination.toLowerCase() ||
    destination.name.toLowerCase().includes(initialDestination.toLowerCase()) ||
    initialDestination.toLowerCase().includes(destination.name.toLowerCase())
  )?.name || initialDestination;

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedTripId, setSubmittedTripId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [tripEmailSent, setTripEmailSent] = useState(true);
  const [emailRetryError, setEmailRetryError] = useState('');
  const [isRetryingEmail, setIsRetryingEmail] = useState(false);
  const submissionToken = useRef<string | null>(null);
  const savedSubmission = useRef<TripRequestSubmission | null>(null);
  const [showRequests, setShowRequests] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<TripRequest | null>(null);
  const [requests, setRequests] = useState<TripRequest[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState(currentUser?.phone?.replace(/\D/g, '') || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    destination: suggestedDestination,
    noOfNights: '',
    tripType: '',
    travelDateMode: '' as '' | 'fixed' | 'flexible',
    travelDate: '',
    flexibleDate: '',
    bookingWindow: '',
    ticketStatus: '',
    hotelCategory: '',
    pax: '2',
    children: '0',
    childAges: [] as string[],
    budgetRange: '',
    destinationPreference: '',
    destinationOptions: [] as string[],
    destinationCities: [] as string[],
    leavingFrom: '',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  useEffect(() => {
    const savedRequests = localStorage.getItem('raisedQueries');
    if (savedRequests) {
      try {
        setRequests(JSON.parse(savedRequests) as TripRequest[]);
      } catch (error) {
        console.error('Error loading trip requests:', error);
      }
    }
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const visibleRequests = currentUser?.role === 'customer'
    ? requests.filter(request => request.phone === (currentUser.phone || currentUser.identifier))
    : requests;

  const patchForm = (values: Partial<typeof form>) => {
    setForm(current => ({ ...current, ...values }));
    setErrors({});
  };

  const validateStep = () => {
    const nextErrors: Record<string, string> = {};
    if (step === 0 && !form.destination) nextErrors.destination = 'Choose a destination to continue.';
    if (step === 1 && !form.noOfNights) nextErrors.noOfNights = 'Choose your trip duration.';
    if (step === 2 && !form.tripType) nextErrors.tripType = 'Choose who is travelling.';
    if (step === 3) {
      if (!form.travelDateMode) nextErrors.travelDateMode = 'Choose whether your dates are fixed or flexible.';
      if (form.travelDateMode === 'fixed' && !form.travelDate) nextErrors.travelDate = 'Choose your travel date.';
      if (form.travelDateMode === 'flexible' && !form.flexibleDate) nextErrors.travelDate = 'Choose when you would like to travel.';
      if (!form.bookingWindow) nextErrors.bookingWindow = 'Choose when you are planning to book.';
      if (!form.ticketStatus) nextErrors.ticketStatus = 'Tell us about your flight or train tickets.';
    }
    if (step === 4 && !form.hotelCategory) nextErrors.hotelCategory = 'Choose a hotel category.';
    if (step === 5) {
      if (Number(form.pax) < 1) nextErrors.pax = 'At least one adult is required.';
      form.childAges.forEach((age, index) => {
        if (!age) nextErrors[`childAge${index}`] = `Add the age of child ${index + 1}.`;
      });
    }
    if (step === 6 && !form.budgetRange) nextErrors.budgetRange = 'Choose a budget range.';
    if (step === 7) {
      if (!form.destinationPreference) nextErrors.destinationPreference = 'Choose one of the options.';
      if (form.destinationPreference === 'Exploring options' && form.destinationOptions.length < 2) {
        nextErrors.destinationOptions = 'Choose at least two destinations you are considering.';
      }
    }
    if (step === 8) {
      if (!form.leavingFrom.trim()) nextErrors.leavingFrom = 'Enter your departure city.';
      if (!form.name.trim()) nextErrors.name = 'Enter your name.';
      if (!phone.trim() && !form.email.trim()) nextErrors.contact = 'Add a phone number or email so we can contact you.';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const chooseOption = (
    field: 'noOfNights' | 'tripType' | 'hotelCategory' | 'budgetRange' | 'bookingWindow' | 'ticketStatus',
    value: string
  ) => {
    patchForm({ [field]: value });
  };

  const toggleDestinationOption = (name: string) => {
    const current = form.destinationOptions;
    const updated = current.includes(name)
      ? current.filter(destination => destination !== name)
      : current.length < 3 ? [...current, name] : current;
    patchForm({ destinationOptions: updated });
  };

  const handleChildCount = (value: string) => {
    const count = Math.min(10, Math.max(0, Number(value) || 0));
    patchForm({
      children: String(count),
      childAges: Array.from({ length: count }, (_, index) => form.childAges[index] || ''),
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(current => current + 1);
      return;
    }

    const fullPhone = phone ? `${selectedCountry.code}${phone}` : '';
    const travelDate = form.travelDateMode === 'fixed'
      ? formatTravelDate(form.travelDate)
      : form.flexibleDate;
    const destination = form.destinationPreference === 'Exploring options'
      ? form.destinationOptions.join(', ')
      : form.destination;
    const request: TripRequestSubmission = {
      name: form.name,
      phone: fullPhone,
      email: form.email,
      leavingFrom: form.leavingFrom,
      destination,
      destinationCities: form.destinationCities,
      destinationPreference: form.destinationPreference,
      destinationOptions: form.destinationOptions,
      pax: form.pax,
      children: form.children,
      childAges: form.childAges,
      travelDate,
      tripType: form.tripType,
      hotelCategory: form.hotelCategory,
      noOfNights: form.noOfNights,
      budgetRange: form.budgetRange,
      bookingWindow: form.bookingWindow,
      ticketStatus: form.ticketStatus,
    };

    if (!submissionToken.current) submissionToken.current = createTripRequestToken();
    savedSubmission.current = request;
    const whatsappWindow = window.open('about:blank', '_blank');
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const result = await submitTripRequest(request, submissionToken.current);
      const savedRequest: TripRequest = {
        ...request,
        id: result.tripId,
        submittedAt: new Date(result.submittedAt).toLocaleString('en-GB'),
      };
      setSubmittedTripId(savedRequest.id);
      const updatedRequests = [savedRequest, ...requests];
      setRequests(updatedRequests);
      try {
        localStorage.setItem('raisedQueries', JSON.stringify(updatedRequests));
      } catch (error) {
        console.error('Unable to cache the saved trip request locally:', error);
      }
      setTripEmailSent(result.emailSent);
      if (result.emailSent) {
        submissionToken.current = null;
        savedSubmission.current = null;
      }

      const message = [
        '*Custom Trip Request - Way2GoHolidays*',
        `*Trip ID:* ${savedRequest.id}`,
        `*Name:* ${savedRequest.name}`,
        fullPhone ? `*WhatsApp:* ${fullPhone}` : '',
        savedRequest.email ? `*Email:* ${savedRequest.email}` : '',
        `*Travelling from:* ${savedRequest.leavingFrom}`,
        `*Destination:* ${destination}`,
        form.destinationCities.length ? `*Cities / places:* ${form.destinationCities.join(', ')}` : '',
        `*Destination status:* ${savedRequest.destinationPreference}`,
        `*Duration:* ${savedRequest.noOfNights}`,
        `*Travellers:* ${savedRequest.tripType}`,
        `*Dates:* ${savedRequest.travelDate}`,
        `*Booking plan:* ${savedRequest.bookingWindow}`,
        `*Flight/train tickets:* ${savedRequest.ticketStatus}`,
        `*Hotel:* ${savedRequest.hotelCategory}`,
        `*Adults:* ${savedRequest.pax}`,
        `*Children:* ${savedRequest.children}`,
        savedRequest.childAges.length ? `*Children's ages:* ${savedRequest.childAges.join(', ')}` : '',
        `*Budget:* ${savedRequest.budgetRange}`,
      ].filter(Boolean).join('\n');
      const whatsappUrl = `https://wa.me/${CONTACT_DETAILS.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.location.href = whatsappUrl;
      }
      setSubmitted(true);
    } catch (error) {
      whatsappWindow?.close();
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your trip request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const retryTripEmail = async () => {
    if (!savedSubmission.current || !submissionToken.current) return;
    setIsRetryingEmail(true);
    setEmailRetryError('');
    try {
      const result = await submitTripRequest(savedSubmission.current, submissionToken.current);
      setTripEmailSent(result.emailSent);
      if (result.emailSent) {
        submissionToken.current = null;
        savedSubmission.current = null;
      } else {
        setEmailRetryError('The email could not be sent yet. Please try again shortly.');
      }
    } catch (error) {
      setEmailRetryError(error instanceof Error ? error.message : 'Unable to retry the email notification.');
    } finally {
      setIsRetryingEmail(false);
    }
  };

  const OptionButton = ({ label, selected, onClick, icon }: { label: string; selected: boolean; onClick: () => void; icon?: string }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-2xl border-2 p-2.5 text-left text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:p-4 sm:text-base ${
        selected ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
      }`}
    >
      {icon && <span className={`mb-1 block text-2xl sm:mb-2 sm:text-3xl ${selected ? 'scale-105' : ''} transition-transform`} aria-hidden="true">{icon}</span>}
      {label}
    </button>
  );

  const removeRequest = (id: string) => {
    const updatedRequests = requests.filter(request => request.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem('raisedQueries', JSON.stringify(updatedRequests));
  };

  const startNewRequest = () => {
    submissionToken.current = null;
    savedSubmission.current = null;
    setSubmittedTripId('');
    setSubmitError('');
    setTripEmailSent(true);
    setEmailRetryError('');
    setForm({
      destination: suggestedDestination,
      noOfNights: '',
      tripType: '',
      travelDateMode: '',
      travelDate: '',
      flexibleDate: '',
      bookingWindow: '',
      ticketStatus: '',
      hotelCategory: '',
      pax: '2',
      children: '0',
      childAges: [],
      budgetRange: '',
      destinationPreference: '',
      destinationOptions: [],
      destinationCities: [],
      leavingFrom: '',
      name: currentUser?.name || '',
      email: currentUser?.email || '',
    });
    setPhone(currentUser?.phone?.replace(/\D/g, '') || '');
    setStep(0);
    setErrors({});
    setShowRequests(false);
    setViewingRequest(null);
    setSubmitted(false);
  };

  const stepTitles = ['Destination', 'Duration', 'Travellers', 'Travel dates', 'Hotel', 'Guests', 'Budget', 'Destination plans', 'Your details'];
  const tripSummary = [
    form.destination && { label: 'Going to', value: form.destination },
    form.destinationCities.length && { label: 'Places', value: form.destinationCities.join(', ') },
    form.noOfNights && { label: 'Duration', value: form.noOfNights },
    form.tripType && { label: 'Travelling as', value: form.tripType },
    form.hotelCategory && { label: 'Hotel', value: form.hotelCategory },
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return (
    <div className="trip-planner-viewport fixed inset-0 z-[220] flex items-end justify-center overflow-hidden sm:items-center sm:overflow-y-auto sm:p-6" role="dialog" aria-modal="true" aria-label="Raise your trip">
      <button type="button" className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} aria-label="Close trip planner" />
      <section className="trip-planner relative my-auto flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/60 sm:max-h-[94vh] sm:rounded-3xl">
        <header className="shrink-0 border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-orange-50 px-3 py-2 sm:px-8 sm:py-4">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                <span aria-hidden="true">✦</span> Raise Your Trip
              </p>
              <h2 className="mt-1 text-lg font-black text-slate-900 sm:text-2xl">
                {submitted ? 'Your trip request is ready' : showRequests ? 'Your trip requests' : 'Let’s plan a trip you’ll love'}
              </h2>
              {!submitted && !showRequests && (
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">A few fun choices, one step at a time. No pressure — you can change your plans later.</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {visibleRequests.length > 0 && !submitted && (
                <button
                  type="button"
                  onClick={() => setShowRequests(value => !value)}
                  className="min-h-11 rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                >
                  {showRequests ? 'New trip' : `Requests (${visibleRequests.length})`}
                </button>
              )}
              <button type="button" onClick={onClose} className="min-h-11 min-w-11 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800" aria-label="Close">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
          </div>
          {!submitted && !showRequests && (
            <div className="mt-2 sm:mt-4">
              <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                <span>Step {step + 1} of {TOTAL_STEPS}</span>
                <span className="rounded-full bg-white/80 px-3 py-1 text-blue-700 shadow-sm">{stepTitles[step]}</span>
              </div>
              <div className="flex gap-1.5" role="progressbar" aria-label="Trip planner progress" aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-valuenow={step + 1}>
                {stepTitles.map((title, index) => (
                  <span key={title} className={`h-2 flex-1 rounded-full transition-colors duration-300 ${index <= step ? 'bg-gradient-to-r from-blue-600 to-indigo-500' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>
          )}
        </header>

        {submitted ? (
          <div className="overflow-y-auto px-4 py-6 text-center sm:px-10 sm:py-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 sm:mb-5 sm:h-16 sm:w-16">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 sm:text-2xl">Trip request raised — thanks, {form.name}!</h3>
            {submittedTripId && <p className="mt-2 text-lg font-black text-blue-700">Trip ID: {submittedTripId}</p>}
            <p className="mx-auto mt-2 max-w-md text-slate-600">Your details are saved in Google Drive. You can view your raised trips or start another request.</p>
            {tripEmailSent && (
              <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-emerald-700" role="status">
                Trip details emailed to way2goholidays.bookings@gmail.com.
              </p>
            )}
            {!tripEmailSent && (
              <div className="mx-auto mt-2 max-w-md text-sm font-semibold text-amber-700" role="status">
                <p>Your request is saved, but the email notification has not been sent.</p>
                <button type="button" onClick={retryTripEmail} disabled={isRetryingEmail} className="mt-2 underline disabled:opacity-60">
                  {isRetryingEmail ? 'Retrying email...' : 'Retry email notification'}
                </button>
                {emailRetryError && <p className="mt-1 text-red-600">{emailRetryError}</p>}
              </div>
            )}
            <div className="mx-auto mt-5 flex max-w-lg flex-col justify-center gap-2 sm:mt-7 sm:flex-row sm:gap-3">
              <button type="button" onClick={() => { setSubmitted(false); setShowRequests(true); }} className="rounded-xl border-2 border-blue-200 bg-blue-50 px-6 py-3 font-bold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100">
                View Raised Trips
              </button>
              <button type="button" onClick={startNewRequest} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl">
                Raise New Trip Request
              </button>
            </div>
          </div>
        ) : showRequests ? (
          <div className="relative min-h-0 flex-1 overflow-y-auto p-3 sm:p-8">
            <div className="space-y-3">
              {visibleRequests.length === 0 ? (
                <p className="py-10 text-center font-medium text-slate-500">No trip requests yet.</p>
              ) : visibleRequests.map(request => (
                <article key={request.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 p-3 sm:gap-4 sm:p-4">
                  <div>
                    <h3 className="font-black text-slate-900">{request.name} · {request.destination}</h3>
                    <p className="mt-1 text-sm text-slate-600">{request.noOfNights} · {request.tripType} · {request.travelDate}</p>
                    <p className="mt-1 text-xs text-slate-400">{request.submittedAt}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button type="button" onClick={() => setViewingRequest(request)} className="text-sm font-bold text-blue-600 hover:text-blue-800">
                      View
                    </button>
                    {currentUser?.role !== 'customer' && (
                      <button type="button" onClick={() => removeRequest(request.id)} className="text-sm font-bold text-red-500 hover:text-red-700">Delete</button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {viewingRequest && (
              <div className="fixed inset-0 z-[230] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-1 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Raised trip details">
                <section className="trip-request-detail-panel my-auto flex w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                  <header className="flex items-start justify-between gap-3 border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-orange-50 px-3 py-3 sm:gap-4 sm:px-7 sm:py-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-blue-600">Raised trip details</p>
                      <h3 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">{viewingRequest.destination}</h3>
                      <p className="mt-1 text-sm text-slate-500">Requested by {viewingRequest.name}</p>
                    </div>
                    <button type="button" onClick={() => setViewingRequest(null)} className="shrink-0 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white" aria-label="Back to raised trips">
                      Back
                    </button>
                  </header>
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-7">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ['Destination', viewingRequest.destination],
                        ['Cities / places', viewingRequest.destinationCities?.length ? viewingRequest.destinationCities.join(', ') : 'Not selected'],
                        ['Destination plan', viewingRequest.destinationPreference],
                        ['Travelling from', viewingRequest.leavingFrom],
                        ['Travel date / timing', viewingRequest.travelDate],
                        ['Duration', viewingRequest.noOfNights],
                        ['Travelling as', viewingRequest.tripType],
                        ['Hotel category', viewingRequest.hotelCategory],
                        ['Booking plan', viewingRequest.bookingWindow],
                        ['Flight / train tickets', viewingRequest.ticketStatus],
                        ['Adults', viewingRequest.pax],
                        ['Children', viewingRequest.children],
                        ['Children’s ages', viewingRequest.childAges?.length ? viewingRequest.childAges.join(', ') : 'None'],
                        ['Budget', viewingRequest.budgetRange],
                        ['Phone / WhatsApp', viewingRequest.phone || 'Not provided'],
                        ['Email', viewingRequest.email || 'Not provided'],
                        ['Submitted', viewingRequest.submittedAt],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 sm:p-3">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
                          <p className="mt-1 break-words text-sm font-bold text-slate-800">{value || 'Not provided'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <footer className="shrink-0 border-t border-slate-100 px-3 py-3 text-right sm:px-7 sm:py-4">
                    <button type="button" onClick={() => setViewingRequest(null)} className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">
                      Back to Raised Trips
                    </button>
                  </footer>
                </section>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-8">
              {tripSummary.length > 0 && step > 0 && (
                <aside className="mb-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-orange-50 p-3 sm:mb-6 sm:p-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-wider text-indigo-700">Your trip so far</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {tripSummary.map(item => (
                      <span key={item.label} className="rounded-full border border-white bg-white/90 px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm sm:px-3">
                        <span className="text-slate-400">{item.label}:</span> {item.value}
                      </span>
                    ))}
                  </div>
                </aside>
              )}
              {step === 0 && (
                <div>
                  <h3 className="text-base font-black text-slate-900 sm:text-lg">Where would you like to go?</h3>
                  <p className="mb-3 mt-1 text-sm text-slate-500 sm:mb-5">Tap a destination to select it.</p>
                  <div className="space-y-4 sm:space-y-6">
                    {DESTINATION_GROUPS.map(group => (
                      <section key={group.label} aria-label={`${group.label} destinations`}>
                        <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500 sm:mb-3 sm:text-sm">{group.label}</h4>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5">
                          {group.destinations.map(destination => {
                            const isSelected = form.destination === destination.name;
                            const cities = DESTINATION_CITIES[destination.name] || [];
                            return (
                              <div
                                key={`${destination.type}-${destination.id}`}
                                className={`min-w-0 ${isSelected && cities.length > 0 ? 'col-span-full flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 sm:flex-row sm:items-start sm:gap-3 sm:p-2' : ''}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => patchForm({ destination: destination.name, destinationCities: [] })}
                                  aria-pressed={isSelected}
                                  aria-label={destination.name}
                                  className={`group block min-h-11 rounded-2xl border-2 p-1.5 text-center transition-all sm:p-2 ${
                                    isSelected ? 'flex w-full items-center gap-3 text-left sm:block sm:w-24 sm:shrink-0 sm:text-center' : 'mx-auto'
                                  } ${
                                    isSelected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-transparent hover:border-slate-200'
                                  }`}
                                >
                                  <img src={destination.image} alt="" className={`aspect-square rounded-full object-cover ring-2 ring-white shadow ${isSelected ? 'h-12 w-12 shrink-0 sm:mx-auto sm:h-16 sm:w-16' : 'mx-auto w-14 sm:w-20'}`} loading="lazy" />
                                  <span className={`block line-clamp-2 text-xs font-bold text-slate-700 ${isSelected ? 'mt-0 sm:mt-2' : 'mt-2'}`}>{destination.name}</span>
                                </button>
                                {isSelected && cities.length > 0 && (
                                  <fieldset className="min-w-0 flex-1">
                                    <legend className="mb-2 text-left text-xs font-bold leading-tight text-slate-600">Choose places</legend>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                      {cities.map(city => {
                                        const citySelected = form.destinationCities.includes(city);
                                        return (
                                          <button
                                            key={city}
                                            type="button"
                                            onClick={() => patchForm({
                                              destinationCities: citySelected
                                                ? form.destinationCities.filter(item => item !== city)
                                                : [...form.destinationCities, city],
                                            })}
                                            aria-pressed={citySelected}
                                            className={`flex min-h-11 w-full items-center rounded-xl border-2 px-3 py-2 text-left text-sm font-semibold leading-snug shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                                              citySelected ? 'border-orange-300 bg-orange-50 text-orange-800' : 'border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/50'
                                            }`}
                                          >
                                            {city}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </fieldset>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                  {errors.destination && <p className="mt-3 text-sm font-semibold text-red-600">{errors.destination}</p>}
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="text-base font-black text-slate-900 sm:text-lg">How long would you like to travel?</h3>
                  <p className="mb-3 mt-1 text-sm text-slate-500 sm:mb-5">Choose the number of nights. We’ll help with the itinerary.</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
                    {NIGHT_OPTIONS.map(option => {
                      const nights = option.split('N')[0];
                      return <OptionButton key={option} label={`${nights} ${nights === '1' ? 'Night' : 'Nights'}`} selected={form.noOfNights === option} onClick={() => chooseOption('noOfNights', option)} />;
                    })}
                  </div>
                  {errors.noOfNights && <p className="mt-3 text-sm font-semibold text-red-600">{errors.noOfNights}</p>}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-base font-black text-slate-900 sm:text-lg">Who’s travelling?</h3>
                  <p className="mb-3 mt-1 text-sm text-slate-500 sm:mb-5">Pick the option that best describes your trip.</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {TRAVELLER_OPTIONS.map(option => (
                      <OptionButton key={option.label} label={option.label} icon={option.icon} selected={form.tripType === option.label} onClick={() => chooseOption('tripType', option.label)} />
                    ))}
                  </div>
                  {errors.tripType && <p className="mt-3 text-sm font-semibold text-red-600">{errors.tripType}</p>}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 sm:space-y-7">
                  <div>
                    <h3 className="text-base font-black text-slate-900 sm:text-lg">When would you like to travel?</h3>
                    <label className="mt-4 block text-sm font-bold text-slate-700">
                      Choose a travel date
                      <input
                        type="date"
                        value={form.travelDate}
                        onChange={event => patchForm({ travelDate: event.target.value })}
                        onClick={event => {
                          if (typeof event.currentTarget.showPicker === 'function') {
                            event.currentTarget.showPicker();
                          }
                        }}
                        className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                      />
                      {form.travelDate && (
                        <span className="mt-2 block text-sm font-semibold text-blue-700">
                          Selected date: {formatTravelDate(form.travelDate)}
                        </span>
                      )}
                    </label>
                    <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
                      <OptionButton label="My date is fixed" selected={form.travelDateMode === 'fixed'} onClick={() => patchForm({ travelDateMode: 'fixed' })} />
                      <OptionButton label="My dates are flexible" selected={form.travelDateMode === 'flexible'} onClick={() => patchForm({ travelDateMode: 'flexible' })} />
                    </div>
                    {form.travelDateMode === 'flexible' && (
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
                        {FLEXIBLE_DATES.map(option => <OptionButton key={option} label={option} selected={form.flexibleDate === option} onClick={() => patchForm({ flexibleDate: option })} />)}
                      </div>
                    )}
                    {errors.travelDateMode && <p className="mt-2 text-sm font-semibold text-red-600">{errors.travelDateMode}</p>}
                    {errors.travelDate && <p className="mt-2 text-sm font-semibold text-red-600">{errors.travelDate}</p>}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">When are you planning to book? </h3>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                      {BOOKING_WINDOWS.map(option => <OptionButton key={option} label={option} selected={form.bookingWindow === option} onClick={() => chooseOption('bookingWindow', option)} />)}
                    </div>
                    {errors.bookingWindow && <p className="mt-2 text-sm font-semibold text-red-600">{errors.bookingWindow}</p>}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Have you booked your flight or train tickets?</h3>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3 sm:gap-3">
                      {TICKET_OPTIONS.map(option => <OptionButton key={option} label={option} selected={form.ticketStatus === option} onClick={() => chooseOption('ticketStatus', option)} />)}
                    </div>
                    {errors.ticketStatus && <p className="mt-2 text-sm font-semibold text-red-600">{errors.ticketStatus}</p>}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 className="text-base font-black text-slate-900 sm:text-lg">What hotel category do you prefer?</h3>
                  <p className="mb-3 mt-1 text-sm text-slate-500 sm:mb-5">Choose a starting point. You can refine this with our team.</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                    {HOTEL_OPTIONS.map(option => {
                      const starCount = Number(option.charAt(0));
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => chooseOption('hotelCategory', option)}
                          aria-pressed={form.hotelCategory === option}
                          className={`flex min-h-11 flex-col items-center justify-center rounded-2xl border-2 p-2.5 text-center text-sm font-bold transition-all hover:-translate-y-0.5 sm:p-4 sm:text-base ${
                            form.hotelCategory === option ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                          }`}
                        >
                          <span className="mb-2 text-2xl leading-none text-amber-400" aria-label={`${starCount} stars`}>
                            {'★'.repeat(starCount)}
                          </span>
                          <span>{option} hotels</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.hotelCategory && <p className="mt-3 text-sm font-semibold text-red-600">{errors.hotelCategory}</p>}
                </div>
              )}

              {step === 5 && (
                <div>
                  <h3 className="text-base font-black text-slate-900 sm:text-lg">How many people are travelling?</h3>
                  <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
                    <label className="text-sm font-bold text-slate-700">Adults
                      <input type="number" min="1" max="20" value={form.pax} onChange={event => patchForm({ pax: event.target.value })} className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3" />
                    </label>
                    <label className="text-sm font-bold text-slate-700">Children
                      <input type="number" min="0" max="10" value={form.children} onChange={event => handleChildCount(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3" />
                    </label>
                  </div>
                  {Number(form.children) > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-4 sm:gap-3">
                      {form.childAges.map((age, index) => (
                        <label key={index} className="text-sm font-bold text-slate-700">Child {index + 1} age
                          <input type="number" min="0" max="17" value={age} onChange={event => {
                            const childAges = [...form.childAges];
                            childAges[index] = event.target.value;
                            patchForm({ childAges });
                          }} className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3" />
                          {errors[`childAge${index}`] && <span className="mt-1 block text-xs text-red-600">{errors[`childAge${index}`]}</span>}
                        </label>
                      ))}
                    </div>
                  )}
                  {errors.pax && <p className="mt-3 text-sm font-semibold text-red-600">{errors.pax}</p>}
                </div>
              )}

              {step === 6 && (
                <div>
                  <h3 className="text-base font-black text-slate-900 sm:text-lg">What’s your budget per person?</h3>
                  <p className="mb-3 mt-1 text-sm text-slate-500 sm:mb-5">This helps us suggest the right trip options.</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {BUDGET_OPTIONS.map(option => <OptionButton key={option} label={option} selected={form.budgetRange === option} onClick={() => chooseOption('budgetRange', option)} />)}
                  </div>
                  {errors.budgetRange && <p className="mt-3 text-sm font-semibold text-red-600">{errors.budgetRange}</p>}
                </div>
              )}

              {step === 7 && (
                <div>
                  <h3 className="text-base font-black text-slate-900 sm:text-lg">Is {form.destination} your confirmed destination?</h3>
                  <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
                    <OptionButton label="Yes, this is my destination" selected={form.destinationPreference === 'Confirmed'} onClick={() => patchForm({ destinationPreference: 'Confirmed', destinationOptions: [] })} />
                    <OptionButton label="I have 2–3 destinations in mind" selected={form.destinationPreference === 'Exploring options'} onClick={() => patchForm({ destinationPreference: 'Exploring options', destinationOptions: form.destinationOptions.length ? form.destinationOptions : [form.destination] })} />
                  </div>
                  {form.destinationPreference === 'Exploring options' && (
                    <div className="mt-4 sm:mt-5">
                      <p className="mb-3 text-sm font-semibold text-slate-600">Choose up to three places you are considering.</p>
                      <div className="space-y-4 sm:space-y-5">
                        {DESTINATION_GROUPS.map(group => (
                          <section key={group.label} aria-label={`${group.label} destinations`}>
                            <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">{group.label}</h4>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
                              {group.destinations.map(destination => (
                                <button key={`${destination.type}-${destination.id}`} type="button" onClick={() => toggleDestinationOption(destination.name)} className={`rounded-xl border-2 p-2 text-center text-xs font-bold ${form.destinationOptions.includes(destination.name) ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-700'}`}>
                                  <img src={destination.image} alt="" className="mx-auto mb-2 aspect-square w-14 rounded-full object-cover" loading="lazy" />
                                  {destination.name}
                                </button>
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                      {errors.destinationOptions && <p className="mt-3 text-sm font-semibold text-red-600">{errors.destinationOptions}</p>}
                    </div>
                  )}
                  {errors.destinationPreference && <p className="mt-3 text-sm font-semibold text-red-600">{errors.destinationPreference}</p>}
                </div>
              )}

              {step === 8 && (
                <div>
                  <h3 className="text-base font-black text-slate-900 sm:text-lg">Where should we send your trip plan?</h3>
                  <p className="mb-3 mt-1 text-sm text-slate-500 sm:mb-5">We only need one way to reach you: phone or email.</p>
                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    <label className="text-sm font-bold text-slate-700">Travelling from
                      <input required value={form.leavingFrom} onChange={event => patchForm({ leavingFrom: event.target.value })} placeholder="e.g. New Delhi" className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3" />
                      {errors.leavingFrom && <span className="mt-1 block text-xs text-red-600">{errors.leavingFrom}</span>}
                    </label>
                    <label className="text-sm font-bold text-slate-700">Your name
                      <input required value={form.name} onChange={event => patchForm({ name: event.target.value })} placeholder="Full name" className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3" />
                      {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
                    </label>
                    <label className="text-sm font-bold text-slate-700">Email Address (optional if you add a phone)
                      <input type="email" value={form.email} onChange={event => patchForm({ email: event.target.value })} placeholder="you@example.com" className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3" />
                      {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
                    </label>
                    <label className="text-sm font-bold text-slate-700">Phone or WhatsApp Number
                      <span className="mt-2 flex overflow-hidden rounded-xl border border-slate-300">
                        <select aria-label="Country calling code" value={selectedCountry.code} onChange={event => {
                          const country = COUNTRY_CODES.find(item => item.code === event.target.value);
                          if (country) setSelectedCountry(country);
                        }} className="max-w-24 border-r border-slate-300 bg-slate-50 px-2 text-sm">
                          {COUNTRY_CODES.map(country => <option key={`${country.code}-${country.country}`} value={country.code}>{country.code}</option>)}
                        </select>
                        <input type="tel" value={phone} onChange={event => setPhone(event.target.value.replace(/\D/g, ''))} placeholder="Phone number" className="min-w-0 flex-1 px-4 py-3 outline-none" />
                      </span>
                    </label>
                  </div>
                  {errors.contact && <p className="mt-3 text-sm font-semibold text-red-600">{errors.contact}</p>}
                  {submitError && <p className="mt-3 text-sm font-semibold text-red-600" role="alert">{submitError}</p>}
                </div>
              )}
            </div>

            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-gradient-to-r from-white to-blue-50/60 px-3 py-2 sm:px-8 sm:py-4">
              <button type="button" onClick={() => step === 0 ? onClose() : setStep(current => current - 1)} className="min-h-11 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 sm:px-5 sm:py-3 sm:text-base">
                {step === 0 ? 'Cancel' : 'Back'}
              </button>
              <div className="flex min-w-0 flex-1 flex-col items-end sm:flex-none">
                <button type="submit" disabled={isSubmitting} className="min-h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:px-6 sm:py-3 sm:text-base">
                  {isSubmitting ? 'Saving trip...' : step === TOTAL_STEPS - 1 ? 'Send my trip request' : 'Continue'}
                </button>
                {step === TOTAL_STEPS - 1 && <span className="mt-1 text-[10px] text-slate-500">You can still review before sending</span>}
              </div>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
};

export default RaiseYourTrip;
