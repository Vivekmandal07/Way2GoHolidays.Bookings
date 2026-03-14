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

const serviceConfig = {
  Flights: {
    label: 'Enter route or city (e.g., DEL to BOM)',
    placeholder: 'Start city / destination',
    button: 'Search Flights',
  },
  Hotels: {
    label: 'Enter city or hotel name',
    placeholder: 'City or hotel name',
    button: 'Search Hotels',
  },
  Transfers: {
    label: 'Enter pickup location',
    placeholder: 'Pickup location',
    button: 'Book Transfer',
  },
};

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<'Flights' | 'Hotels' | 'Transfers' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedService) return;
    setResult(`${selectedService} request received: ${inputValue || '(no value entered)'}`);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tighter">
            Flights, Hotels & Transfers
          </h2>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">Click a card to open the right booking input.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="relative rounded-2xl overflow-hidden shadow-lg group h-72"
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={() => {
                  setSelectedService(card.serviceKey);
                  setInputValue('');
                  setResult('');
                }}
                className="absolute bottom-6 right-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl transition-transform duration-300 hover:scale-110 active:scale-95 shadow-lg"
              >
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>

        {selectedService && (
          <div className="mt-8 mx-auto max-w-3xl bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-bold">Selected Service</p>
                <h3 className="text-xl font-bold text-slate-900">{selectedService}</h3>
              </div>
              <span className="text-xs text-slate-500">Please enter your {selectedService.toLowerCase()} details</span>
            </div>
            <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{serviceConfig[selectedService as keyof typeof serviceConfig].label}</label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={serviceConfig[selectedService as keyof typeof serviceConfig].placeholder}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="self-end">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  {serviceConfig[selectedService as keyof typeof serviceConfig].button}
                </button>
              </div>
            </form>
            {result && <p className="mt-3 text-sm text-green-700">{result}</p>}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
