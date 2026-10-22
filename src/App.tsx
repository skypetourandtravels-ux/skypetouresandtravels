import React, { useState } from 'react';
import { TravelProvider, useTravel } from './context/TravelContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DestinationShowcase } from './components/DestinationShowcase';
import { ItineraryBuilder } from './components/ItineraryBuilder/ItineraryBuilder';
import { LiveConciergeChat } from './components/LiveConciergeChat';
import { BookingLookupModal } from './components/BookingLookupModal';
import { FaqSection } from './components/FaqSection';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { Shield, Sparkles, Award, Star, Quote } from 'lucide-react';

function MainContent() {
  const [searchDest, setSearchDest] = useState('All');
  const [searchStyle, setSearchStyle] = useState('All');

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearch = (destination: string, style: string) => {
    setSearchDest(destination);
    setSearchStyle(style);
    const portalsEl = document.getElementById('destinations');
    portalsEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-stone-900 flex flex-col font-sans selection:bg-amber-200/70 selection:text-stone-900">
      <Header onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSearch={handleHeroSearch}
          onOpenItineraryBuilder={() => handleNavigate('itinerary-builder')}
        />

        {/* Signature Destinations Showcase */}
        <DestinationShowcase />

        {/* Core Feature 2: Bespoke Custom Itinerary Builder */}
        <ItineraryBuilder />

        {/* Trip Photo & Video Gallery */}
        <Gallery />

        {/* The Skype Distinction Section */}
        <section className="py-16 md:py-24 bg-[#f7f4ee] border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest block mb-2">
                Unrivaled Prestige
              </span>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                The Skype Tours & Travels Distinction
              </h2>
              <p className="text-stone-600 text-sm mt-2 font-light">
                Why heads of family offices, cultural connoisseurs, and private collectors entrust their global itineraries to our directorship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
                    Direct Tarmac & Discreet Security
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    Every private charter and first-class suite includes confidential baggage handling, private VIP CIP terminal escorts, and complete anonymity protocols.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 text-xs text-amber-800 font-medium">
                  Zero Commercial Queues Guaranteed
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
                    Key-Holder Access to Heritage Estates
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    Unlock private doors normally closed to the public: after-hours private tours of Versailles, private wine cellars in Ravello, and secluded atolls.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 text-xs text-amber-800 font-medium">
                  Exclusive Virtuoso Global Privileges
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-6">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
                    Dedicated 24/7 Senior Travel Director
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    You are never routed to an impersonal call center. Your assigned Director manages your voyage directly on WhatsApp, phone, and secure chat from departure to return.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-stone-200 text-xs text-amber-800 font-medium">
                  Average Response Time: Under 3 Minutes
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Testimonials Section */}
        <section className="py-16 md:py-24 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest block mb-2">
                Client Testimonials
              </span>
              <h2
                className="text-2xl sm:text-3xl font-serif font-bold text-stone-900"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Reflections from Our Voyagers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl bg-[#fbf9f6] border border-stone-200 shadow-sm relative">
                <Quote className="w-8 h-8 text-amber-700/20 absolute top-6 right-6" />
                <div className="flex items-center gap-1 text-amber-600 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 leading-relaxed italic mb-6">
                  "Our 8-day Swiss journey on the Glacier Express Excellence Class was choreographed with absolute perfection. From the moment our helicopter landed in Zermatt to the lakeside suite in St. Moritz, Skype Tours treated us like royalty. Eleanor's immediate support on chat gave us total peace of mind."
                </p>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Sir Charles & Lady Hawthorne</h4>
                  <p className="text-xs text-stone-500">Zurich & St. Moritz Expedition · London, UK</p>
                </div>
              </div>

              <div className="p-8 rounded-2xl bg-[#fbf9f6] border border-stone-200 shadow-sm relative">
                <Quote className="w-8 h-8 text-amber-700/20 absolute top-6 right-6" />
                <div className="flex items-center gap-1 text-amber-600 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-stone-700 leading-relaxed italic mb-6">
                  "The private water retreat in the Maldives was beyond our wildest dreams. Having our custom itinerary organized day-by-day—with the marine biologist dive and the sunset catamaran—saved us weeks of planning. The digital voucher portal worked seamlessly at the seaplane lounge."
                </p>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">David & Victoria Sterling</h4>
                  <p className="text-xs text-stone-500">Maldives Overwater Retreat · New York, USA</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Knowledge Base & Voyager FAQs */}
        <FaqSection />
      </main>

      {/* Core Feature 3: Real-Time Support Chat Integration ("Skype Concierge Live") */}
      <LiveConciergeChat />

      {/* Booking Voucher & Reservation Lookup Modal */}
      <BookingLookupModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <TravelProvider>
      <MainContent />
    </TravelProvider>
  );
}
