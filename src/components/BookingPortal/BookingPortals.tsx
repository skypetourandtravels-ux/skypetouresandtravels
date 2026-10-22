import React, { useState } from 'react';
import { useTravel } from '../../context/TravelContext';
import { TOUR_PACKAGES, FLIGHT_CATALOG, HOTEL_SUITES } from '../../data/travelData';
import { TourPackage, FlightOption, HotelSuite, TravelStyle } from '../../types/travel';
import { PackageDetailsModal } from './PackageDetailsModal';
import { BookingCheckoutModal } from './BookingCheckoutModal';
import { Plane, Building2, MapPin, Sparkles, Star, Calendar, Car, Shield, ArrowRight, Eye } from 'lucide-react';

interface BookingPortalsProps {
  searchFilterDest: string;
  searchFilterStyle: string;
}

export const BookingPortals: React.FC<BookingPortalsProps> = ({ searchFilterDest, searchFilterStyle }) => {
  const { formatPrice, setActivePackageModal, activePackageModal, setIsChatOpen, setChatInitialPrompt } = useTravel();

  const [activeTab, setActiveTab] = useState<'packages' | 'flights' | 'hotels' | 'transfers'>('packages');
  
  // Package filters
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');

  // Checkout modal state
  const [checkoutItem, setCheckoutItem] = useState<{
    itemType: 'Tour Package' | 'First Class Flight' | 'Luxury Suite' | 'Custom Itinerary';
    title: string;
    destination: string;
    basePriceUSD: number;
    initialGuests?: number;
  } | null>(null);

  // Transfers selection state
  const [transferType, setTransferType] = useState('airport');

  // Filter packages
  const filteredPackages = TOUR_PACKAGES.filter((pkg) => {
    const destMatch = searchFilterDest === 'All' || pkg.country.toLowerCase().includes(searchFilterDest.toLowerCase()) || pkg.title.toLowerCase().includes(searchFilterDest.toLowerCase());
    const styleMatch = searchFilterStyle === 'All' || pkg.travelStyle.toLowerCase().includes(searchFilterStyle.toLowerCase());
    const regionMatch = selectedRegion === 'All' || pkg.region === selectedRegion;
    const tabStyleMatch = selectedStyle === 'All' || pkg.travelStyle === selectedStyle;
    return destMatch && styleMatch && regionMatch && tabStyleMatch;
  });

  return (
    <section id="portals" className="py-16 md:py-24 bg-zinc-950 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
              <span>Bespoke Portals</span>
              <span aria-hidden="true">·</span>
              <span>Skype Tours & Travels</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-zinc-100 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Direct Reservation & Aviation Desks
            </h2>
            <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl font-light">
              Secure hotel stays, flight tickets, and holiday packages. Airport and local travel is in ordinary cars.
            </p>
          </div>

          {/* Interactive Portal Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-x-auto shrink-0 max-w-full">
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'packages'
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tour Packages</span>
            </button>
            <button
              onClick={() => setActiveTab('flights')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'flights'
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>Private & First Air</span>
            </button>
            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'hotels'
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Palaces & Suites</span>
            </button>
            <button
              onClick={() => setActiveTab('transfers')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'transfers'
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>VIP Transfers</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CURATED TOUR PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-8">
            {/* Filter toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-zinc-400 font-medium mr-1">Region:</span>
                {['All', 'Western Europe', 'Indian Ocean', 'Southern Europe', 'East Africa'].map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      selectedRegion === region
                        ? 'bg-zinc-800 text-amber-300 border border-zinc-700 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-400 font-medium">Style:</span>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-md px-2.5 py-1 text-xs cursor-pointer focus:outline-none"
                >
                  <option value="All">All Styles</option>
                  <option value="Ultra-Luxury">Ultra-Luxury</option>
                  <option value="Romantic Escape">Romantic Escape</option>
                  <option value="Wilderness Expedition">Wilderness Expedition</option>
                </select>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group rounded-2xl bg-zinc-900/70 border border-zinc-800/90 overflow-hidden hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-lg"
                >
                  {/* Image container */}
                  <div className="relative h-60 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={pkg.featuredImage}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    
                    {/* Top tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="bg-zinc-950/80 backdrop-blur-sm text-zinc-200 px-2.5 py-1 rounded-md border border-zinc-700/60 font-medium text-[11px]">
                        {pkg.country}
                      </span>
                      <span className="bg-amber-400/90 text-zinc-950 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {pkg.durationDays}D / {pkg.durationNights}N
                      </span>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-semibold text-zinc-100">{pkg.rating}</span>
                        <span className="text-zinc-400 text-[11px]">({pkg.reviewCount} reviews)</span>
                      </div>
                      <span className="text-[11px] text-zinc-400">{pkg.travelStyle}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1.5">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                        {pkg.subtitle}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-1.5 mb-5 border-t border-zinc-800/60 pt-3">
                        {pkg.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                            <span className="text-amber-400 font-bold">·</span>
                            <span className="line-clamp-1">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Price per guest</span>
                        <span className="text-base font-bold text-amber-400 tabular-nums">
                          {formatPrice(pkg.pricePerPersonUSD)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActivePackageModal(pkg)}
                          className="p-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
                          title="View day-by-day itinerary"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setCheckoutItem({
                              itemType: 'Tour Package',
                              title: pkg.title,
                              destination: pkg.country,
                              basePriceUSD: pkg.pricePerPersonUSD,
                              initialGuests: 2,
                            })
                          }
                          className="px-3.5 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Reserve</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FIRST CLASS & PRIVATE AVIATION */}
        {activeTab === 'flights' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-amber-400" />
                <span>Flight tickets are booked with commercial airlines. Ground transfers use ordinary cars, not private jets or premium cars.</span>
              </div>
              <button
                onClick={() => {
                  setChatInitialPrompt("I would like a flight ticket quote. Can you check availability?");
                  setIsChatOpen(true);
                }}
                className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-4 cursor-pointer"
              >
                Inquire on a Flight Ticket
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {FLIGHT_CATALOG.map((flight) => (
                <div
                  key={flight.id}
                  className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-3 mb-4">
                      <div>
                        <span className="text-[11px] font-semibold text-amber-400 block">{flight.cabinClass}</span>
                        <h3 className="text-base font-semibold text-zinc-100">{flight.airline}</h3>
                      </div>
                      <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                        {flight.aircraft}
                      </span>
                    </div>

                    {/* Flight route visual */}
                    <div className="flex items-center justify-between gap-4 py-2">
                      <div className="text-left">
                        <span className="text-xl font-bold font-mono text-zinc-100 block">{flight.origin.code}</span>
                        <span className="text-xs text-zinc-400">{flight.origin.city}</span>
                        <span className="text-xs text-amber-400/90 block mt-1">{flight.departureTime}</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center px-4">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{flight.duration}</span>
                        <div className="w-full h-0.5 bg-zinc-800 relative my-2">
                          <Plane className="w-3.5 h-3.5 text-amber-400 absolute left-1/2 -top-1.5 -translate-x-1/2 rotate-90" />
                        </div>
                        <span className="text-[10px] text-zinc-400">
                          {flight.stops === 0 ? 'Direct Nonstop' : `${flight.stops} Luxury Stop`}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xl font-bold font-mono text-zinc-100 block">{flight.destination.code}</span>
                        <span className="text-xs text-zinc-400">{flight.destination.city}</span>
                        <span className="text-xs text-amber-400/90 block mt-1">{flight.arrivalTime}</span>
                      </div>
                    </div>

                    {/* Perks */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/60">
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1.5">Suite Amenities</span>
                      <div className="flex flex-wrap gap-1.5">
                        {flight.perks.slice(0, 3).map((perk, i) => (
                          <span key={i} className="text-[11px] bg-zinc-950 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded">
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Fares starting at</span>
                      <span className="text-lg font-bold text-amber-400 tabular-nums">
                        {formatPrice(flight.priceUSD)}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setCheckoutItem({
                          itemType: 'First Class Flight',
                          title: `${flight.airline} (${flight.origin.code} → ${flight.destination.code})`,
                          destination: `${flight.origin.city} to ${flight.destination.city}`,
                          basePriceUSD: flight.priceUSD,
                          initialGuests: 1,
                        })
                      }
                      className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Reserve Flight</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PALACES & SUITES */}
        {activeTab === 'hotels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOTEL_SUITES.map((hotel) => (
              <div
                key={hotel.id}
                className="rounded-2xl bg-zinc-900/70 border border-zinc-800/90 overflow-hidden flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-lg"
              >
                <div className="relative h-56 w-full">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-sm text-zinc-200 text-xs px-2.5 py-1 rounded-md border border-zinc-700">
                    {hotel.location}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-300 bg-zinc-950/80 px-2 py-0.5 rounded">
                      {hotel.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 bg-zinc-950/80 px-2 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="font-bold text-zinc-100">{hotel.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-zinc-100 mb-1">{hotel.name}</h3>
                    <p className="text-xs text-amber-400 font-medium mb-3">{hotel.roomType}</p>

                    {/* Virtuoso/Skype Perks */}
                    <div className="p-3 rounded-xl bg-zinc-950/80 border border-amber-500/20 mb-4">
                      <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-widest block mb-1">
                        Exclusive Skype Tours Amenities
                      </span>
                      <ul className="space-y-1 text-xs text-zinc-300">
                        {hotel.exclusivePerks.slice(0, 2).map((perk, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px]">
                            <span className="text-amber-400">✦</span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Nightly rate from</span>
                      <span className="text-base font-bold text-amber-400 tabular-nums">
                        {formatPrice(hotel.pricePerNightUSD)}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        setCheckoutItem({
                          itemType: 'Luxury Suite',
                          title: `${hotel.name} — ${hotel.roomType}`,
                          destination: hotel.location,
                          basePriceUSD: hotel.pricePerNightUSD,
                          initialGuests: 2,
                        })
                      }
                      className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Reserve Suite</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ORDINARY CAR TRANSFERS */}
        {activeTab === 'transfers' && (
          <div className="p-6 md:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-6">
            <div className="max-w-2xl">
              <h3 className="text-xl font-serif font-bold text-zinc-100 mb-2">
                Airport and Local Car Transfers
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Pickup, drop-off and local trips use ordinary cars. Standard cars only, not private jets and not premium cars such as Rolls-Royce.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setTransferType('airport')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  transferType === 'airport'
                    ? 'bg-amber-500/10 border-amber-400/80 text-zinc-100'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-amber-400 mb-3 font-bold text-xs">
                  01
                </div>
                <h4 className="font-semibold text-sm text-zinc-100 mb-1">Airport Pickup</h4>
                <p className="text-xs text-zinc-400">A standard car from the airport to your hotel or home.</p>
              </div>

              <div
                onClick={() => setTransferType('local')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  transferType === 'local'
                    ? 'bg-amber-500/10 border-amber-400/80 text-zinc-100'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-amber-400 mb-3 font-bold text-xs">
                  02
                </div>
                <h4 className="font-semibold text-sm text-zinc-100 mb-1">Local Car</h4>
                <p className="text-xs text-zinc-400">City travel in an ordinary car for the day.</p>
              </div>

              <div
                onClick={() => setTransferType('drop')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  transferType === 'drop'
                    ? 'bg-amber-500/10 border-amber-400/80 text-zinc-100'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-amber-400 mb-3 font-bold text-xs">
                  03
                </div>
                <h4 className="font-semibold text-sm text-zinc-100 mb-1">Drop-off</h4>
                <p className="text-xs text-zinc-400">A standard car from your stay back to the airport or station.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() =>
                  setCheckoutItem({
                    itemType: 'Custom Itinerary',
                    title: `Car transfer (${transferType})`,
                    destination: 'Airport or local address',
                    basePriceUSD: 40,
                    initialGuests: 2,
                  })
                }
                className="px-6 py-2.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Book This Transfer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Package Detail Modal */}
      <PackageDetailsModal
        pkg={activePackageModal}
        onClose={() => setActivePackageModal(null)}
        onBookNow={(pkg) => {
          setActivePackageModal(null);
          setCheckoutItem({
            itemType: 'Tour Package',
            title: pkg.title,
            destination: pkg.country,
            basePriceUSD: pkg.pricePerPersonUSD,
            initialGuests: 2,
          });
        }}
      />

      {/* Checkout Modal */}
      {checkoutItem && (
        <BookingCheckoutModal
          itemType={checkoutItem.itemType}
          title={checkoutItem.title}
          destination={checkoutItem.destination}
          basePriceUSD={checkoutItem.basePriceUSD}
          initialGuests={checkoutItem.initialGuests}
          onClose={() => setCheckoutItem(null)}
        />
      )}
    </section>
  );
};
