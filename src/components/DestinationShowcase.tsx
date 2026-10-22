import React, { useState } from 'react';
import {
  Plane,
  Hotel,
  Bus,
  TrainFront,
  ShieldCheck,
  FileCheck2,
  Stamp,
  Stethoscope,
  BadgeCheck,
  Ticket,
  Globe2,
  Package,
  Banknote,
  Palmtree,
  Car,
  MapPin,
  Send,
  Loader2,
  CheckCircle,
  X,
} from 'lucide-react';
import { Destination, DOMESTIC, INTERNATIONAL, SERVICE_NAMES, enquiryFailureMessage, sendEnquiry } from '../data/skypeData';
import { ServiceEnquiryModal } from './ServiceEnquiryModal';

const SERVICE_ICONS = [Palmtree, Hotel, Plane, Bus, TrainFront, Car, ShieldCheck, FileCheck2, Globe2, Stethoscope, Stamp, Ticket, BadgeCheck, Package, Banknote];
const SERVICES = SERVICE_NAMES.map((title, i) => ({ title, icon: SERVICE_ICONS[i] }));

type SendState = 'idle' | 'sending' | 'sent' | 'error';

const DestinationCard: React.FC<{ dest: Destination }> = ({ dest }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', travelDate: '', travellers: '', message: '' });
  const [state, setState] = useState<SendState>('idle');
  const [errorText, setErrorText] = useState('');

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    const subject = `New enquiry: ${dest.name} (${dest.kind === 'International' ? 'International' : 'Domestic'})`;
    try {
      await sendEnquiry(subject, {
        Destination: dest.name,
        Category: dest.kind,
        Name: form.name,
        Phone: form.phone,
        ...(form.email ? { email: form.email } : {}),
        'Travel Date': form.travelDate || '-',
        Travellers: form.travellers || '-',
        Message: form.message || '-',
      });
      setState('sent');
      setForm({ name: '', phone: '', email: '', travelDate: '', travellers: '', message: '' });
    } catch (err) {
      setErrorText(enquiryFailureMessage(err));
      setState('error');
    }
  };

  const inputCls =
    'w-full bg-white border border-stone-300 focus:border-amber-600 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 outline-none transition-colors';

  return (
    <div
      className="group relative h-80 rounded-2xl border border-stone-200 hover:border-amber-500 overflow-hidden bg-stone-100 shadow-sm hover:shadow-lg transition-all duration-300"
      onClick={() => setOpen(true)}
    >
      <img
        src={dest.image}
        alt={dest.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/55 to-zinc-950/20" />

      {/* Front face */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="bg-zinc-950/70 text-amber-300 border border-amber-500/30 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
            {dest.kind}
          </span>
          {dest.kind === 'International' ? (
            <Plane className="w-5 h-5 text-amber-400/70" />
          ) : (
            <MapPin className="w-5 h-5 text-amber-400/70" />
          )}
        </div>
        <div>
          <h3
            className="text-2xl font-serif font-bold text-white mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {dest.name}
          </h3>
          <p className="text-xs text-zinc-300 font-light">{dest.tagline}</p>
          <p className="text-[11px] text-amber-400/80 mt-4 font-medium">Hover or tap to enquire →</p>
        </div>
      </div>

      {/* Contact overlay: shown on hover, while typing (focus-within), or after tap */}
      <div
        className={`absolute inset-0 bg-white/96 backdrop-blur-sm p-4 flex flex-col transition-opacity duration-300 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-amber-800">Contact Us · {dest.name}</h4>
          {open && (
            <button
              type="button"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="text-stone-400 hover:text-stone-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {state === 'sent' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
            <p className="text-sm text-stone-900 font-medium">Thank you!</p>
            <p className="text-xs text-stone-500">Your enquiry has been sent. Our team will contact you shortly.</p>
            <button
              type="button"
              onClick={() => setState('idle')}
              className="text-xs text-amber-400 hover:underline mt-1 cursor-pointer"
            >
              Send another enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-1.5">
            <input required placeholder="Your name *" value={form.name} onChange={update('name')} className={inputCls} />
            <input
              required
              type="tel"
              placeholder="Phone number *"
              pattern="[0-9+\-\s]{7,}"
              value={form.phone}
              onChange={update('phone')}
              className={inputCls}
            />
            <input type="email" placeholder="Email (optional)" value={form.email} onChange={update('email')} className={inputCls} />
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Travel date"
                onFocus={(e) => (e.target.type = 'date')}
                value={form.travelDate}
                onChange={update('travelDate')}
                className={inputCls}
              />
              <input
                type="number"
                min={1}
                placeholder="Travellers"
                value={form.travellers}
                onChange={update('travellers')}
                className={inputCls}
              />
            </div>
            <textarea
              rows={2}
              placeholder="Message / requirements"
              value={form.message}
              onChange={update('message')}
              className={`${inputCls} resize-none flex-1`}
            />
            {state === 'error' && <p className="text-[11px] text-rose-200">{errorText}</p>}
            <button
              type="submit"
              disabled={state === 'sending'}
              className="mt-1 w-full py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {state === 'sending' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{state === 'sending' ? 'Sending…' : 'Send Enquiry'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const DestinationGrid: React.FC<{ id: string; eyebrow: string; title: string; subtitle: string; items: Destination[] }> = ({
  id,
  eyebrow,
  title,
  subtitle,
  items,
}) => (
  <div id={id} className="mb-16 last:mb-0 scroll-mt-24">
    <div className="mb-8">
      <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest block mb-2">{eyebrow}</span>
      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {title}
      </h2>
      <p className="text-stone-600 text-sm md:text-base mt-2 max-w-2xl font-light">{subtitle}</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((dest) => (
        <DestinationCard key={dest.name} dest={dest} />
      ))}
    </div>
  </div>
);

const BOOKING_COPY = [
  {
    title: 'Flight ticket booking',
    text: 'Share your route, travel date and passenger names. Skype Tours and Travels emails the request to our desk and comes back with domestic and international flight options.',
  },
  {
    title: 'Bus ticket booking',
    text: 'Tell us the boarding point, destination and departure date. We arrange bus tickets and send the confirmation details to you by email and phone.',
  },
  {
    title: 'Train ticket booking',
    text: 'Send the train route, class and travel date. Our team checks availability and replies with the booking plan by email.',
  },
  {
    title: 'Transport booking',
    text: 'Airport pickup, drop-off and local transport are booked the same way. Enter your flight time and address, and we email the request straight to the travel desk.',
  },
  {
    title: 'Hotel and holiday packages',
    text: 'Hotel stays, domestic tours and international packages use the same enquiry. Your name, phone, email and travel dates are emailed to Skype Tours and Travels.',
  },
  {
    title: 'Visa, attestation and other services',
    text: 'Visa services, visa stamping, visiting visas, passport police clearance, certificate attestation, GCC medical appointments, immigration clearance, courier and money transfer requests are emailed with the details you enter.',
  },
];

export const DestinationShowcase: React.FC = () => {
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <section id="destinations" className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Our Services */}
        <div id="services" className="mb-20 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest block mb-2">What We Do</span>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Flight, Bus, Train and Transport Booking
            </h2>
            <p className="text-stone-600 text-sm mt-2 font-light">
              Flight, bus, train, hotel, transport, visa and documentation. Tap a service, enter your details, and we email the request to our travel desk.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map(({ title, icon: Icon }) => (
              <button
                key={title}
                type="button"
                onClick={() => setActiveService(title)}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all text-left cursor-pointer"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm text-stone-800 font-medium leading-snug">{title}</span>
              </button>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {BOOKING_COPY.map((item) => (
              <article key={item.title} className="rounded-2xl border border-stone-200 bg-[#fbf9f6] p-5">
                <h3 className="text-lg font-serif font-bold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
        {activeService && <ServiceEnquiryModal service={activeService} onClose={() => setActiveService(null)} />}

        <DestinationGrid
          id="domestic-packages"
          eyebrow="Incredible India"
          title="Domestic Tour Packages"
          subtitle="Explore India's finest states, hill stations, wildlife reserves and pilgrim centres. Hover over a destination to send us an enquiry."
          items={DOMESTIC}
        />

        <DestinationGrid
          id="international-packages"
          eyebrow="Beyond Borders"
          title="International Tour Packages"
          subtitle="Handpicked holidays across Asia, the Middle East and Europe. Hover over a destination to send us an enquiry."
          items={INTERNATIONAL}
        />
      </div>
    </section>
  );
};
