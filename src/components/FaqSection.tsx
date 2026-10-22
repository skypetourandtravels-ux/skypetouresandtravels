import React, { useState } from 'react';
import { useTravel } from '../context/TravelContext';
import { ChevronDown, Sparkles, HelpCircle, ShieldCheck, Compass, MessageSquareCode } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'Booking & Portals' | 'Custom Itineraries' | 'Aviation & Concierge' | 'Pricing & Guarantees';
}

export const FaqSection: React.FC = () => {
  const { setIsChatOpen, setChatInitialPrompt } = useTravel();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FaqItem[] = [
    {
      category: 'Booking & Portals',
      question: 'How do I book a flight, bus, train, hotel or transport with Skype Tours and Travels?',
      answer: 'Open Our Services and choose flight ticket booking, bus ticket booking, train ticket booking, airport and local transport, hotel booking, a holiday package, or a visa service. Name and phone number are required. Email is optional. The form sends those details to shaji@skypetours.com, and our desk contacts you to confirm the booking. Destination cards and the trip planner work the same way.',
    },
    {
      category: 'Custom Itineraries',
      question: 'Can I customize every day of my travel itinerary using the builder?',
      answer: 'Absolutely. The Skype Tours Interactive Itinerary Builder enables you to architect your entire journey day-by-day. You can assign morning, afternoon, and evening experiences from our Curated Experience Catalog (such as private Matterhorn helicopter landings, vintage Riva charters in Capri, or sunrise balloon safaris), propose custom bespoke activities, select transport modes (Helicopter, Excellence Class rail, private chauffeur), and review real-time pricing and printable dossiers.',
    },
    {
      category: 'Pricing & Guarantees',
      question: 'How will Skype Tours and Travels contact me after I send a booking?',
      answer: 'Every booking form sends your name and phone number to shaji@skypetours.com. Add an email if you want a reply there as well. The travel desk contacts you by phone, or by email when you provided one, with availability and the fare in Indian Rupees. Nothing is confirmed until you hear back from the desk.',
    },
    {
      category: 'Aviation & Concierge',
      question: 'What privileges are included with Skype Tours private aviation charters?',
      answer: 'All private jet charters through Skype Private Air feature direct tarmac luxury vehicle transfers, zero commercial terminal queues, confidential CIP security protocols, master stateroom options, Michelin-trained in-flight chefs, and bespoke cellar vintages. Direct boarding is available across our fleet including Bombardier Global 7500 and Citation X aircraft.',
    },
    {
      category: 'Aviation & Concierge',
      question: 'How does the 24/7 real-time travel concierge support work?',
      answer: 'Open the booking chat and tell the bot what you need, such as a flight, bus, train, hotel, visa or document service. The bot replies on the page. To go further, enter your name and phone number. That chat is emailed to shaji@skypetours.com and the desk contacts you. Email is optional.',
    },
    {
      category: 'Pricing & Guarantees',
      question: 'What is the Skype Tours cancellation and client guarantee policy?',
      answer: 'All bespoke expeditions booked with Skype Tours and Travels feature 100% financial protection, zero cancellation fees up to 14 days prior to departure on standard itineraries, and guaranteed 24/7 in-destination support with a dedicated private butler liaison.',
    },
  ];

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === selectedCategory);

  const handleAskInChat = (questionText: string) => {
    setChatInitialPrompt(`I have a question: ${questionText}`);
    setIsChatOpen(true);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 bg-[#f7f4ee] border-t border-stone-200 relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Voyager Inquiries & Knowledge Base</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2 font-light">
            Everything you need to know about booking portals, itinerary customization, private aviation charters, and dedicated concierge assistance with Skype Tours and Travels.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {['All', 'Booking & Portals', 'Custom Itineraries', 'Aviation & Concierge', 'Pricing & Guarantees'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-zinc-950 font-semibold shadow-sm'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-stone-200 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-amber-50/60 transition-colors"
                >
                  <span className="text-sm sm:text-base font-serif font-semibold text-stone-900 flex-1">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-amber-700 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-amber-100' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200">
                    <p>{faq.answer}</p>
                    <div className="mt-3 pt-3 border-t border-stone-200 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">Category: {faq.category}</span>
                      <button
                        onClick={() => handleAskInChat(faq.question)}
                        className="text-xs text-amber-800 hover:text-amber-600 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquareCode className="w-3.5 h-3.5" />
                        <span>Ask Travel Director About This</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Concierge Assist Strip */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900">Have a specific or confidential inquiry?</h4>
              <p className="text-xs text-stone-500">Ask the booking bot, then leave your name and phone. We email the chat to the desk.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setChatInitialPrompt('I would like help planning a trip.');
              setIsChatOpen(true);
            }}
            className="px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shrink-0 shadow-md shadow-amber-500/15 cursor-pointer"
          >
            Open Live Concierge
          </button>
        </div>
      </div>
    </section>
  );
};
