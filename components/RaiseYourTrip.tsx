import React, { useEffect, useState } from 'react';
import { AuthUser } from '../types';
import { CONTACT_DETAILS, COUNTRY_CODES, INTERNATIONAL_DESTINATIONS, DOMESTIC_DESTINATIONS } from '../constants';

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
  const [showRequests, setShowRequests] = useState(false);
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(current => current + 1);
      return;
    }

    const fullPhone = phone ? `${selectedCountry.code}${phone}` : '';
    const travelDate = form.travelDateMode === 'fixed'
      ? form.travelDate
      : form.flexibleDate;
    const destination = form.destinationPreference === 'Exploring options'
      ? form.destinationOptions.join(', ')
      : form.destination;
    const request: TripRequest = {
      id: Date.now().toString(),
      name: form.name,
      phone: fullPhone,
      email: form.email,
      leavingFrom: form.leavingFrom,
      destination,
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
      submittedAt: new Date().toLocaleString('en-GB'),
    };
    const updatedRequests = [request, ...requests];
    setRequests(updatedRequests);
    localStorage.setItem('raisedQueries', JSON.stringify(updatedRequests));

    const message = [
      '*Custom Trip Request - Way2GoHolidays*',
      `*Name:* ${request.name}`,
      fullPhone ? `*WhatsApp:* ${fullPhone}` : '',
      request.email ? `*Email:* ${request.email}` : '',
      `*Travelling from:* ${request.leavingFrom}`,
      `*Destination:* ${destination}`,
      `*Destination status:* ${request.destinationPreference}`,
      `*Duration:* ${request.noOfNights}`,
      `*Travellers:* ${request.tripType}`,
      `*Dates:* ${travelDate}`,
      `*Booking plan:* ${request.bookingWindow}`,
      `*Flight/train tickets:* ${request.ticketStatus}`,
      `*Hotel:* ${request.hotelCategory}`,
      `*Adults:* ${request.pax}`,
      `*Children:* ${request.children}`,
      request.childAges.length ? `*Children's ages:* ${request.childAges.join(', ')}` : '',
      `*Budget:* ${request.budgetRange}`,
    ].filter(Boolean).join('\n');
    const whatsappUrl = `https://wa.me/${CONTACT_DETAILS.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const OptionButton = ({ label, selected, onClick, icon }: { label: string; selected: boolean; onClick: () => void; icon?: string }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-2xl border-2 p-4 text-left font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
        selected ? 'border-blue-600 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
      }`}
    >
      {icon && <span className={`mb-2 block text-3xl ${selected ? 'scale-105' : ''} transition-transform`} aria-hidden="true">{icon}</span>}
      {label}
    </button>
  );

  const removeRequest = (id: string) => {
    const updatedRequests = requests.filter(request => request.id !== id);
    setRequests(updatedRequests);
    localStorage.setItem('raisedQueries', JSON.stringify(updatedRequests));
  };

  const stepTitles = ['Destination', 'Duration', 'Travellers', 'Travel dates', 'Hotel', 'Guests', 'Budget', 'Destination plans', 'Your details'];
  const tripSummary = [
    form.destination && { label: 'Going to', value: form.destination },
    form.noOfNights && { label: 'Duration', value: form.noOfNights },
    form.tripType && { label: 'Travelling as', value: form.tripType },
    form.hotelCategory && { label: 'Hotel', value: form.hotelCategory },
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center overflow-y-auto p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Raise your trip">
      <button type="button" className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} aria-label="Close trip planner" />
      <section className="relative my-auto flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-white/60">
        <header className="shrink-0 border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-orange-50 px-5 py-4 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                <span aria-hidden="true">✦</span> Raise Your Trip
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                {submitted ? 'Your trip request is ready' : showRequests ? 'Your trip requests' : 'Let’s plan a trip you’ll love'}
              </h2>
              {!submitted && !showRequests && (
                <p className="mt-1 text-sm text-slate-600">A few fun choices, one step at a time. No pressure — you can change your plans later.</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {visibleRequests.length > 0 && !submitted && (
                <button
                  type="button"
                  onClick={() => setShowRequests(value => !value)}
                  className="rounded-full bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                >
                  {showRequests ? 'New trip' : `Requests (${visibleRequests.length})`}
                </button>
              )}
              <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800" aria-label="Close">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" /></svg>
              </button>
            </div>
          </div>
          {!submitted && !showRequests && (
            <div className="mt-4">
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
          <div className="overflow-y-auto px-6 py-10 text-center sm:px-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Thanks, {form.name}!</h3>
            <p className="mx-auto mt-2 max-w-md text-slate-600">Your trip details have been saved. Continue in WhatsApp to send them to our travel team.</p>
            <button type="button" onClick={onClose} className="mt-7 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700">Done</button>
          </div>
        ) : showRequests ? (
          <div className="space-y-3 overflow-y-auto p-5 sm:p-8">
            {visibleRequests.length === 0 ? (
              <p className="py-10 text-center font-medium text-slate-500">No trip requests yet.</p>
            ) : visibleRequests.map(request => (
              <article key={request.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                <div>
                  <h3 className="font-black text-slate-900">{request.name} · {request.destination}</h3>
                  <p className="mt-1 text-sm text-slate-600">{request.noOfNights} · {request.tripType} · {request.travelDate}</p>
                  <p className="mt-1 text-xs text-slate-400">{request.submittedAt}</p>
                </div>
                {currentUser?.role !== 'customer' && (
                  <button type="button" onClick={() => removeRequest(request.id)} className="text-sm font-bold text-red-500 hover:text-red-700">Delete</button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="overflow-y-auto p-5 sm:p-8">
              {tripSummary.length > 0 && step > 0 && (
                <aside className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-blue-50 via-indigo-50 to-orange-50 p-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-wider text-indigo-700">Your trip so far</p>
                  <div className="flex flex-wrap gap-2">
                    {tripSummary.map(item => (
                      <span key={item.label} className="rounded-full border border-white bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                        <span className="text-slate-400">{item.label}:</span> {item.value}
                      </span>
                    ))}
                  </div>
                </aside>
              )}
              {step === 0 && (
                <div>
                  <h3 className="text-lg font-black text-slate-900">Where would you like to go?</h3>
                  <p className="mb-5 mt-1 text-sm text-slate-500">Tap a destination to select it.</p>
                  <div className="space-y-6">
                    {DESTINATION_GROUPS.map(group => (
                      <section key={group.label} aria-label={`${group.label} destinations`}>
                        <h4 className="mb-3 text-sm font-black uppercase tracking-wider text-slate-500">{group.label}</h4>
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                          {group.destinations.map(destination => (
                            <button
                              key={`${destination.type}-${destination.id}`}
                              type="button"
                              onClick={() => patchForm({ destination: destination.name })}
                              aria-pressed={form.destination === destination.name}
                              className={`group rounded-2xl border-2 p-2 text-center transition-all ${
                                form.destination === destination.name ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-transparent hover:border-slate-200'
                              }`}
                            >
                              <img src={destination.image} alt="" className="mx-auto aspect-square w-16 rounded-full object-cover ring-2 ring-white shadow sm:w-20" loading="lazy" />
                              <span className="mt-2 block line-clamp-2 text-xs font-bold text-slate-700">{destination.name}</span>
                            </button>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  {form.destination && (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white" aria-hidden="true">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Selected destination</p>
                        <p className="font-black text-slate-900">{form.destination}</p>
                      </div>
                    </div>
                  )}
                  {errors.destination && <p className="mt-3 text-sm font-semibold text-red-600">{errors.destination}</p>}
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="text-lg font-black text-slate-900">How long would you like to travel?</h3>
                  <p className="mb-5 mt-1 text-sm text-slate-500">Choose the number of nights. We’ll help with the itinerary.</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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
                  <h3 className="text-lg font-black text-slate-900">Who’s travelling?</h3>
                  <p className="mb-5 mt-1 text-sm text-slate-500">Pick the option that best describes your trip.</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {TRAVELLER_OPTIONS.map(option => (
                      <OptionButton key={option.label} label={option.label} icon={option.icon} selected={form.tripType === option.label} onClick={() => chooseOption('tripType', option.label)} />
                    ))}
                  </div>
                  {errors.tripType && <p className="mt-3 text-sm font-semibold text-red-600">{errors.tripType}</p>}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-7">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">When would you like to travel?</h3>
                    <label className="mt-4 block text-sm font-bold text-slate-700">
                      Choose a travel date
                      <input
                        type="date"
                        value={form.travelDate}
                        onChange={event => patchForm({ travelDate: event.target.value })}
                        className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800"
                      />
                    </label>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <OptionButton label="My date is fixed" selected={form.travelDateMode === 'fixed'} onClick={() => patchForm({ travelDateMode: 'fixed' })} />
                      <OptionButton label="My dates are flexible" selected={form.travelDateMode === 'flexible'} onClick={() => patchForm({ travelDateMode: 'flexible' })} />
                    </div>
                    {form.travelDateMode === 'flexible' && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {FLEXIBLE_DATES.map(option => <OptionButton key={option} label={option} selected={form.flexibleDate === option} onClick={() => patchForm({ flexibleDate: option })} />)}
                      </div>
                    )}
                    {errors.travelDateMode && <p className="mt-2 text-sm font-semibold text-red-600">{errors.travelDateMode}</p>}
                    {errors.travelDate && <p className="mt-2 text-sm font-semibold text-red-600">{errors.travelDate}</p>}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">When are you planning to book?</h3>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {BOOKING_WINDOWS.map(option => <OptionButton key={option} label={option} selected={form.bookingWindow === option} onClick={() => chooseOption('bookingWindow', option)} />)}
                    </div>
                    {errors.bookingWindow && <p className="mt-2 text-sm font-semibold text-red-600">{errors.bookingWindow}</p>}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Have you booked your flight or train tickets?</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {TICKET_OPTIONS.map(option => <OptionButton key={option} label={option} selected={form.ticketStatus === option} onClick={() => chooseOption('ticketStatus', option)} />)}
                    </div>
                    {errors.ticketStatus && <p className="mt-2 text-sm font-semibold text-red-600">{errors.ticketStatus}</p>}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 className="text-lg font-black text-slate-900">What hotel category do you prefer?</h3>
                  <p className="mb-5 mt-1 text-sm text-slate-500">Choose a starting point. You can refine this with our team.</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {HOTEL_OPTIONS.map(option => {
                      const starCount = Number(option.charAt(0));
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => chooseOption('hotelCategory', option)}
                          aria-pressed={form.hotelCategory === option}
                          className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-center font-bold transition-all hover:-translate-y-0.5 ${
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
                  <h3 className="text-lg font-black text-slate-900">How many people are travelling?</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-bold text-slate-700">Adults
                      <input type="number" min="1" max="20" value={form.pax} onChange={event => patchForm({ pax: event.target.value })} className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3" />
                    </label>
                    <label className="text-sm font-bold text-slate-700">Children
                      <input type="number" min="0" max="10" value={form.children} onChange={event => handleChildCount(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3" />
                    </label>
                  </div>
                  {Number(form.children) > 0 && (
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                  <h3 className="text-lg font-black text-slate-900">What’s your budget per person?</h3>
                  <p className="mb-5 mt-1 text-sm text-slate-500">This helps us suggest the right trip options.</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {BUDGET_OPTIONS.map(option => <OptionButton key={option} label={option} selected={form.budgetRange === option} onClick={() => chooseOption('budgetRange', option)} />)}
                  </div>
                  {errors.budgetRange && <p className="mt-3 text-sm font-semibold text-red-600">{errors.budgetRange}</p>}
                </div>
              )}

              {step === 7 && (
                <div>
                  <h3 className="text-lg font-black text-slate-900">Is {form.destination} your confirmed destination?</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <OptionButton label="Yes, this is my destination" selected={form.destinationPreference === 'Confirmed'} onClick={() => patchForm({ destinationPreference: 'Confirmed', destinationOptions: [] })} />
                    <OptionButton label="I have 2–3 destinations in mind" selected={form.destinationPreference === 'Exploring options'} onClick={() => patchForm({ destinationPreference: 'Exploring options', destinationOptions: form.destinationOptions.length ? form.destinationOptions : [form.destination] })} />
                  </div>
                  {form.destinationPreference === 'Exploring options' && (
                    <div className="mt-5">
                      <p className="mb-3 text-sm font-semibold text-slate-600">Choose up to three places you are considering.</p>
                      <div className="space-y-5">
                        {DESTINATION_GROUPS.map(group => (
                          <section key={group.label} aria-label={`${group.label} destinations`}>
                            <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">{group.label}</h4>
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
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
                  <h3 className="text-lg font-black text-slate-900">Where should we send your trip plan?</h3>
                  <p className="mb-5 mt-1 text-sm text-slate-500">We only need one way to reach you: phone or email.</p>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
              )}
            </div>

            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-gradient-to-r from-white to-blue-50/60 px-5 py-4 sm:px-8">
              <button type="button" onClick={() => step === 0 ? onClose() : setStep(current => current - 1)} className="rounded-xl px-5 py-3 font-bold text-slate-600 hover:bg-slate-100">
                {step === 0 ? 'Cancel' : 'Back'}
              </button>
              <div className="flex flex-col items-end">
                <button type="submit" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                  {step === TOTAL_STEPS - 1 ? 'Send my trip request' : 'Continue'}
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
