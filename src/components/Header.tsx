import React from 'react';
import { useTravel } from '../context/TravelContext';
import { Compass, MessageSquareCode, Phone } from 'lucide-react';
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from '../data/skypeData';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { setIsChatOpen } = useTravel();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 xl:px-6 py-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0"
          aria-label="Skype Tours & Travels"
        >
          <span className="flex items-center gap-2">
            <img src="/images/skype-logo-mark.jpg" alt="" className="h-12 xl:h-14 w-auto" />
            <img src="/images/skype-logo-wordmark.jpg" alt="Skype Tours Travels" className="h-5 sm:h-7 xl:h-8 w-auto" />
          </span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden xl:flex items-center gap-2.5 text-sm font-medium text-zinc-700">
          <button
            onClick={() => onNavigate('services')}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Bookings
          </button>
          <button
            onClick={() => onNavigate('destinations')}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Destinations
          </button>
          <button
            onClick={() => onNavigate('domestic-packages')}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Domestic Packages
          </button>
          <button
            onClick={() => onNavigate('international-packages')}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            International Packages
          </button>
          <button
            onClick={() => onNavigate('gallery')}
            className="hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Gallery
          </button>
          <button
            onClick={() => onNavigate('itinerary-builder')}
            className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-amber-700 font-semibold flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            Plan My Trip
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-zinc-700"
          >
            <MessageSquareCode className="w-4 h-4 text-amber-600" />
            Live Concierge
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 hover:text-amber-700 whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-amber-700" />
            {CONTACT_PHONE}
          </a>
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            aria-label={`Call ${CONTACT_PHONE}`}
            className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-stone-200 text-amber-700"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => onNavigate('itinerary-builder')}
            className="px-4 py-2 text-xs md:text-sm font-medium text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-lg hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/15 transition-all whitespace-nowrap shrink-0 font-semibold"
          >
            Plan a Journey
          </button>
        </div>
      </div>
    </header>
  );
};
