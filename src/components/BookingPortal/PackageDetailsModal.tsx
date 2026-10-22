import React from 'react';
import { TourPackage } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { X, Check, Calendar, MapPin, Users, Shield, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface PackageDetailsModalProps {
  pkg: TourPackage | null;
  onClose: () => void;
  onBookNow: (pkg: TourPackage) => void;
}

export const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({ pkg, onClose, onBookNow }) => {
  const { formatPrice, setIsChatOpen, setChatInitialPrompt } = useTravel();

  if (!pkg) return null;

  const handleAskAboutThis = () => {
    setChatInitialPrompt(`I am interested in "${pkg.title}" (${pkg.country}). Can you tell me more about custom dates and private flight add-ons?`);
    onClose();
    setIsChatOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header / Hero Cover */}
        <div className="relative h-64 md:h-80 w-full shrink-0 overflow-hidden">
          <img
            src={pkg.featuredImage}
            alt={pkg.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-zinc-950/80 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700/80 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
              <span>{pkg.region}</span>
              <span aria-hidden="true">·</span>
              <span>{pkg.travelStyle}</span>
              <span aria-hidden="true">·</span>
              <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
              {pkg.title}
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-2xl font-light">
              {pkg.subtitle}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y border-zinc-800/80 text-xs">
            <div>
              <span className="text-zinc-400 block">Pricing from</span>
              <span className="text-lg font-bold text-amber-400 tabular-nums">
                {formatPrice(pkg.pricePerPersonUSD)}
              </span>
              <span className="text-zinc-400 text-[11px] block">per guest</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Best Season</span>
              <span className="text-zinc-200 font-medium">{pkg.bestTimeToVisit}</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Party Size</span>
              <span className="text-zinc-200 font-medium">Up to {pkg.groupSizeLimit} Guests (Private)</span>
            </div>
            <div>
              <span className="text-zinc-400 block">Expedition Status</span>
              <span className="text-emerald-400 font-medium">{pkg.availability}</span>
            </div>
          </div>

          {/* Signature Highlights */}
          <div>
            <h3 className="text-base font-serif font-semibold text-zinc-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Curated Expedition Highlights</span>
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {pkg.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/50">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Day-by-Day Itinerary Program */}
          <div>
            <h3 className="text-base font-serif font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Day-by-Day Journey Itinerary</span>
            </h3>
            <div className="space-y-4">
              {pkg.dailyProgram.map((day) => (
                <div key={day.day} className="flex gap-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/70">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-sm">
                    {day.day}
                  </div>
                  <div className="space-y-1 text-xs flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-semibold text-zinc-100 text-sm">{day.title}</h4>
                      <span className="text-zinc-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" /> {day.location}
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed pt-1">{day.description}</p>
                    <div className="pt-2 text-[11px] text-amber-300/80 font-medium">
                      Accommodations: {day.stay}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/80">
            <div>
              <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Skype Tours Privileges Included</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {pkg.inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-2">
                <span>Not Included / Optional Upgrades</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                {pkg.exclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-zinc-500 font-bold">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 md:p-6 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-xs text-zinc-400">Total Price from</div>
            <div className="text-xl md:text-2xl font-serif font-bold text-amber-400 tabular-nums">
              {formatPrice(pkg.pricePerPersonUSD)} <span className="text-xs text-zinc-400 font-sans font-normal">/ person</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAskAboutThis}
              className="px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl transition-colors"
            >
              Ask Travel Concierge
            </button>
            <button
              onClick={() => onBookNow(pkg)}
              className="px-6 py-2.5 text-xs md:text-sm font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
            >
              <span>Reserve Expedition</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
