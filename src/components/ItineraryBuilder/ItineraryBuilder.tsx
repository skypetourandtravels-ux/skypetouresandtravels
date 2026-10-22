import React, { useState } from 'react';
import { Compass, MapPin, Plane, Send, Loader2, CheckCircle, Check } from 'lucide-react';
import { DOMESTIC, INTERNATIONAL, SERVICE_NAMES, ENQUIRY_EMAIL, sendEnquiry } from '../../data/skypeData';

type TripType = 'Domestic' | 'International';
type SendState = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY_CONTACT = { name: '', phone: '', email: '', city: '', startDate: '', nights: '', adults: '2', children: '0', notes: '' };

const Chip: React.FC<{ label: string; selected: boolean; onToggle: () => void; image?: string }> = ({
  label,
  selected,
  onToggle,
  image,
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
      selected
        ? 'bg-amber-400 text-zinc-950 border-amber-400'
        : 'bg-white text-stone-700 border-stone-300 hover:border-amber-500'
    }`}
  >
    {image && <img src={image} alt="" className="w-5 h-5 rounded object-cover shrink-0" />}
    {selected && <Check className="w-3 h-3" />}
    {label}
  </button>
);

export const ItineraryBuilder: React.FC = () => {
  const [tripType, setTripType] = useState<TripType>('Domestic');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>(['Domestic & International Holiday Packages']);
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [state, setState] = useState<SendState>('idle');
  const [error, setError] = useState('');

  const options = tripType === 'Domestic' ? DOMESTIC : INTERNATIONAL;

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const update = (field: keyof typeof EMPTY_CONTACT) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setContact((c) => ({ ...c, [field]: e.target.value }));

  const switchTripType = (t: TripType) => {
    setTripType(t);
    setDestinations([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (destinations.length === 0) {
      setError('Please select at least one destination.');
      return;
    }
    setError('');
    setState('sending');
    try {
      await sendEnquiry(`Trip plan request: ${tripType} – ${destinations.join(', ')}`, {
        'Trip Type': tripType,
        Destinations: destinations.join(', '),
        'Services Required': services.join(', ') || '-',
        'Start Date': contact.startDate || '-',
        'No. of Nights': contact.nights || '-',
        Adults: contact.adults || '-',
        Children: contact.children || '-',
        Name: contact.name,
        Phone: contact.phone,
        ...(contact.email ? { email: contact.email } : {}),
        'City / Departure From': contact.city || '-',
        'Special Requirements': contact.notes || '-',
      });
      setState('sent');
      setContact(EMPTY_CONTACT);
      setDestinations([]);
    } catch {
      setState('error');
    }
  };

  const inputCls =
    'w-full bg-white border border-stone-300 focus:border-amber-600 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-colors';
  const labelCls = 'text-xs text-stone-500 block mb-1';
  const stepCls = 'text-sm font-serif font-semibold text-stone-900 flex items-center gap-2 mb-3';

  return (
    <section id="itinerary-builder" className="py-16 md:py-24 bg-[#f7f4ee] border-t border-stone-200 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Plan My Trip</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Craft Your Personalized Expedition
          </h2>
          <p className="text-stone-600 text-sm md:text-base mt-2 max-w-2xl font-light">
            Choose your destinations and the services you need, share your travel details, and our team will get back to you with a customised plan.
          </p>
        </div>

        {state === 'sent' ? (
          <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-10 text-center flex flex-col items-center gap-3">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
            <h3 className="text-xl font-serif font-bold text-stone-900">Thank you! Your trip request has been sent.</h3>
            <p className="text-sm text-stone-600">Our travel expert will contact you shortly with a personalised plan.</p>
            <button
              type="button"
              onClick={() => setState('idle')}
              className="mt-2 px-4 py-2 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer"
            >
              Plan another trip
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: destinations & services */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-6">
                <h3 className={stepCls}>1. Trip type</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(['Domestic', 'International'] as TripType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => switchTripType(t)}
                      className={`py-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        tripType === t
                          ? 'bg-amber-50 border-amber-500 text-amber-800'
                          : 'bg-[#fbf9f6] border-stone-300 text-stone-600 hover:border-amber-400'
                      }`}
                    >
                      {t === 'Domestic' ? <MapPin className="w-4 h-4" /> : <Plane className="w-4 h-4" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-6">
                <h3 className={stepCls}>
                  2. Select destinations{' '}
                  <span className="text-xs font-sans font-normal text-stone-500">({destinations.length} selected)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {options.map((d) => (
                    <Chip
                      key={d.name}
                      label={d.name}
                      image={d.image}
                      selected={destinations.includes(d.name)}
                      onToggle={() => toggle(destinations, setDestinations, d.name)}
                    />
                  ))}
                </div>
                {error && <p className="text-xs text-rose-400 mt-3">{error}</p>}
              </div>

              <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-6">
                <h3 className={stepCls}>3. Services required</h3>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_NAMES.map((s) => (
                    <Chip key={s} label={s} selected={services.includes(s)} onToggle={() => toggle(services, setServices, s)} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: travel & contact details */}
            <div className="lg:col-span-5 rounded-2xl bg-white border border-stone-200 shadow-sm p-6 space-y-4 lg:sticky lg:top-24">
              <h3 className={stepCls}>4. Your travel & contact details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Start date</label>
                  <input type="date" value={contact.startDate} onChange={update('startDate')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>No. of nights</label>
                  <input type="number" min={1} value={contact.nights} onChange={update('nights')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Adults</label>
                  <input type="number" min={1} value={contact.adults} onChange={update('adults')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Children</label>
                  <input type="number" min={0} value={contact.children} onChange={update('children')} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Full name *</label>
                <input required value={contact.name} onChange={update('name')} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Phone *</label>
                  <input
                    required
                    type="tel"
                    pattern="[0-9+\-\s]{7,}"
                    value={contact.phone}
                    onChange={update('phone')}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email (optional)</label>
                  <input type="email" value={contact.email} onChange={update('email')} className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>City / departing from</label>
                <input value={contact.city} onChange={update('city')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Special requirements</label>
                <textarea rows={3} value={contact.notes} onChange={update('notes')} className={`${inputCls} resize-none`} />
              </div>

              {state === 'error' && (
                <p className="text-xs text-rose-400">
                  Could not send your request. Please try again or email{' '}
                  <a href={`mailto:${ENQUIRY_EMAIL}`} className="underline">
                    {ENQUIRY_EMAIL}
                  </a>
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'sending'}
                className="w-full py-3 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 rounded-xl transition-all shadow-md shadow-amber-500/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                {state === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{state === 'sending' ? 'Sending…' : 'Send My Trip Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
