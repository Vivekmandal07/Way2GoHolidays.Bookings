import { FormEvent, useState } from 'react';

interface ServiceCard {
  title: string;
  img: string;
  buttonText: string;
  serviceKey: 'Flights' | 'Hotels' | 'Transfers';
}

const cards: ServiceCard[] = [
  {
    title: 'Flights',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Book Flight',
    serviceKey: 'Flights',
  },
  {
    title: 'Hotels',
    img: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Find Hotels',
    serviceKey: 'Hotels',
  },
  {
    title: 'Transfers',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Arrange Transfer',
    serviceKey: 'Transfers',
  },
];

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<ServiceCard['serviceKey'] | null>('Flights');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState<string[]>([]);
  const [result, setResult] = useState('');

  const updateChildren = (value: number) => {
    const safe = Math.max(0, Math.min(9, value));
    setChildren(safe);
    setChildAges((prev) => {
      const newAges = [...prev];
      if (newAges.length < safe) {
        return [...newAges, ...Array(safe - newAges.length).fill('')];
      }
      return newAges.slice(0, safe);
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!from || !to || !departDate) {
      setResult('Please fill From, To, and Depart date.');
      return;
    }

    if (children > 0 && childAges.some((age) => age.trim() === '')) {
      setResult('Please enter all child ages.');
      return;
    }

    setResult(
      `Search request: ${from} → ${to} on ${departDate} · ${adults} adult(s), ${children} child(ren)${
        children > 0 ? ' (ages: ' + childAges.join(', ') + ')' : ''
      }`
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Search Flights & Travel Services</h2>
          <p className="mt-2 text-slate-500 max-w-2xl mx-auto">Quickly search flights and choose passenger counts with child age inputs.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={() => setSelectedService(card.serviceKey)}
              className={`rounded-2xl p-4 border transition-all text-left ${selectedService === card.serviceKey ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-300'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{card.title}</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{card.buttonText}</h3>
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img src={card.img} alt={card.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-4xl bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm">
          {selectedService === 'Flights' ? (
            <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-5 items-end">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">From</label>
                <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="City or airport" className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">To</label>
                <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="City or airport" className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Depart on</label>
                <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 outline-none" />
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Adults</label>
                  <input type="number" min={1} max={9} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Children</label>
                  <input type="number" min={0} max={9} value={children} onChange={(e) => updateChildren(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none" />
                </div>
              </div>

              <div className="lg:col-span-1 flex justify-end">
                <button type="submit" className="rounded-xl bg-blue-600 text-white font-bold px-5 py-2.5 hover:bg-blue-700 transition">Search Flights</button>
              </div>

              {children > 0 && (
                <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {childAges.map((age, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[10px] font-semibold uppercase text-slate-500">Child {idx + 1} age</label>
                      <input type="number" min={0} max={17} value={age} onChange={(e) => setChildAges((prev) => {
                        const next = [...prev];
                        next[idx] = e.target.value;
                        return next;
                      })} className="w-full rounded-xl border border-slate-300 px-2 py-2 outline-none" />
                    </div>
                  ))}
                </div>
              )}
            </form>
          ) : (
            <div className="text-center py-8 text-slate-500">Selected service has a simplified form. Please choose Flights for advanced search.</div>
          )}
          {result && <p className="mt-3 text-sm text-green-700 font-semibold">{result}</p>}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
