import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import heroBanner from '../assets/images/hero_luxury_travel_1792132430271.jpg';
import { Calendar, Compass, ShieldCheck, Sparkles, MapPin, Users, ArrowRight } from 'lucide-react';

interface HeroProps {
  onSearch: (destination: string, style: string) => void;
  onOpenItineraryBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onOpenItineraryBuilder }) => {
  const { setIsChatOpen, setChatInitialPrompt } = useTravel();
  const [selectedDest, setSelectedDest] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [guestCount, setGuestCount] = useState('2 Guests');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedDest, selectedStyle);
  };

  const handleAskConcierge = () => {
    setChatInitialPrompt(`I would like to plan a luxury bespoke journey for ${guestCount} to ${selectedDest === 'All' ? 'a premier global destination' : selectedDest}. Can you recommend the best options?`);
    setIsChatOpen(true);
  };

  return (
    <section className="relative w-full pt-6 pb-16 md:pb-24 overflow-hidden">
      {/* Hero Container */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Hero Card with High-Res Photography Backdrop */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl min-h-[580px] lg:min-h-[640px] flex flex-col justify-between">
          {/* Background Image with Measured Scrim */}
          <img
            src={heroBanner}
            alt="Mediterranean Luxury Yacht Charter and Coastal Cliffs at Golden Hour"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92]"
            referrerPolicy="no-referrer"
          />
          {/* Measured gradient scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/25" />
          <div className="absolute inset-0 bg-radial from-transparent via-zinc-950/30 to-zinc-950/80" />

          {/* Top Editorial Kicker & Direct Access */}
          <div className="relative z-10 p-6 md:p-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-amber-300 uppercase">
              <span>Bespoke Journeys</span>
              <span aria-hidden="true">·</span>
              <span>Private Aviation</span>
              <span aria-hidden="true">·</span>
              <span>Sanctuary Retreats</span>
            </div>
            <button
              onClick={handleAskConcierge}
              className="text-xs text-zinc-300 hover:text-amber-300 transition-colors flex items-center gap-1.5 bg-zinc-900/70 backdrop-blur-sm border border-zinc-700/60 rounded-lg px-3 py-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Talk to Private Travel Director</span>
            </button>
          </div>

          {/* Center / Bottom Hero Content */}
          <div className="relative z-10 px-6 md:px-12 pb-10 pt-16 max-w-4xl">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-zinc-50 leading-[1.15] tracking-tight mb-5"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                textWrap: 'balance',
              }}
            >
              Flight, Bus, Train and Holiday Bookings with Skype Tours and Travels.
            </h1>
            <p className="text-base sm:text-lg text-zinc-300/90 max-w-2xl font-normal leading-relaxed mb-8">
              Book flight tickets, bus tickets, train tickets, hotels, airport and local transport, visas and holiday packages. Enter your details and Skype Tours and Travels receives the request by email.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenItineraryBuilder}
                className="px-6 py-3.5 text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-zinc-950" />
                <span>Build Custom Itinerary</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>
              <a
                href="#services"
                className="px-6 py-3.5 text-sm font-medium text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 backdrop-blur-md rounded-xl transition-colors"
              >
                Book a Ticket or Tour
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Booking & Expedition Search Strip */}
        <div className="mt-6 bg-white border border-stone-200 rounded-2xl p-4 md:p-5 shadow-[0_12px_40px_rgba(28,25,23,0.08)]">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Field 1: Destination */}
            <div className="flex flex-col gap-1 px-3 py-2 bg-[#fbf9f6] rounded-xl border border-stone-200">
              <label className="text-[11px] font-medium text-stone-500 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>Destination</span>
              </label>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="bg-transparent text-sm font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-white text-stone-900">All Global Regions</option>
                <option value="Switzerland" className="bg-white text-stone-900">Switzerland (Alps & St. Moritz)</option>
                <option value="Maldives" className="bg-white text-stone-900">Maldives (Private Atolls)</option>
                <option value="Italy" className="bg-white text-stone-900">Italy (Amalfi Coast & Capri)</option>
                <option value="Kenya" className="bg-white text-stone-900">Kenya (Maasai Mara Sky Safari)</option>
                <option value="France" className="bg-white text-stone-900">French Riviera & Monaco</option>
              </select>
            </div>

            {/* Field 2: Travel Style */}
            <div className="flex flex-col gap-1 px-3 py-2 bg-[#fbf9f6] rounded-xl border border-stone-200">
              <label className="text-[11px] font-medium text-stone-500 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Expedition Style</span>
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="bg-transparent text-sm font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-white text-stone-900">All Travel Styles</option>
                <option value="Ultra-Luxury" className="bg-white text-stone-900">Ultra-Luxury Palace & Jet</option>
                <option value="Romantic Escape" className="bg-white text-stone-900">Romantic Lagoon & Villa</option>
                <option value="Wilderness Expedition" className="bg-white text-stone-900">Wilderness Safari & Trek</option>
              </select>
            </div>

            {/* Field 3: Travelers */}
            <div className="flex flex-col gap-1 px-3 py-2 bg-[#fbf9f6] rounded-xl border border-stone-200">
              <label className="text-[11px] font-medium text-stone-500 flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                <span>Travelers</span>
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="bg-transparent text-sm font-medium text-stone-900 focus:outline-none cursor-pointer"
              >
                <option value="1 Solo Voyager" className="bg-white text-stone-900">1 Solo Voyager</option>
                <option value="2 Guests (Couple)" className="bg-white text-stone-900">2 Guests (Couple)</option>
                <option value="Small Family (3-4)" className="bg-white text-stone-900">Small Family (3-4)</option>
                <option value="Private Entourage (5+)" className="bg-white text-stone-900">Private Entourage (5+)</option>
              </select>
            </div>

            {/* Action Search Button */}
            <div className="h-full flex items-center">
              <button
                type="submit"
                className="w-full h-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-sm rounded-xl transition-colors shadow-md shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                <span>Find Expeditions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* 4-Column KPI Trust Strip below hero */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-stone-200 shadow-sm rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-800 font-serif font-bold text-base">
              100%
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Bespoke Design</p>
              <p className="text-[11px] text-stone-500">Zero pre-packaged generic tours</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-stone-200 shadow-sm rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-800 font-serif font-bold text-base">
              50+
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Private Havens</p>
              <p className="text-[11px] text-stone-500">Palaces, private atolls & estates</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-stone-200 shadow-sm rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-800 font-serif font-bold text-base">
              24/7
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Dedicated Concierge</p>
              <p className="text-[11px] text-stone-500">Direct WhatsApp & live desk</p>
            </div>
          </div>

          <div className="p-4 bg-white border border-stone-200 shadow-sm rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-800 font-serif font-bold text-base">
              99.8%
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900">Client Satisfaction</p>
              <p className="text-[11px] text-stone-500">Independently audited 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
