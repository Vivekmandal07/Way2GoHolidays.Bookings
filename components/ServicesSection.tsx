import React from 'react';

interface ServiceCard {
  title: string;
  img: string;
  buttonText: string;
  onClick?: () => void;
}

const cards: ServiceCard[] = [
  {
    title: 'Flights',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Book Flight',
  },
  {
    title: 'Hotels',
    img: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Find Hotels',
  },
  {
    title: 'Transfers',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    buttonText: 'Arrange Transfer',
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tighter">
            Flights, Hotels & Transfers
          </h2>
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
                onClick={card.onClick}
                className="absolute bottom-6 right-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl transition-transform duration-300 hover:scale-110 active:scale-95 shadow-lg"
              >
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
