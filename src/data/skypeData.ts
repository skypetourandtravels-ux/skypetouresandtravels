export const ENQUIRY_EMAIL = 'shaji@skypetours.com';

export interface Destination {
  name: string;
  tagline: string;
  kind: 'Tour Package' | 'Destination' | 'International';
  image: string;
}

export const SERVICE_NAMES = [
  'Domestic & International Holiday Packages',
  'Domestic & International Hotel Booking',
  'Flight Ticket Booking',
  'Bus Ticket Booking',
  'Train Ticket Booking',
  'Airport & Local Transport Booking',
  'Passport Police Clearance Certificate',
  'Certificate Attestation',
  'Visa Services',
  'GCC Medical Appointment',
  'Visa Stamping',
  'Visiting Visa',
  'Immigration Clearance',
  'Courier Service',
  'International Money Transfer',
] as const;

export const DOMESTIC: Destination[] = [
  { name: 'Kerala', tagline: 'Backwaters, houseboats & hill stations', kind: 'Tour Package', image: '/images/destinations/kerala.jpg' },
  { name: 'Tamil Nadu', tagline: 'Temples, Ooty & Kodaikanal', kind: 'Tour Package', image: '/images/destinations/tamil-nadu.jpg' },
  { name: 'Karnataka', tagline: 'Mysore, Coorg & Hampi', kind: 'Tour Package', image: '/images/destinations/karnataka.jpg' },
  { name: 'Hyderabad', tagline: 'Charminar, Golconda & cuisine', kind: 'Tour Package', image: '/images/destinations/hyderabad.jpg' },
  { name: 'Goa', tagline: 'Beaches, forts & nightlife', kind: 'Tour Package', image: '/images/destinations/goa.jpg' },
  { name: 'Lakshadweep', tagline: 'Coral islands & lagoons', kind: 'Tour Package', image: '/images/destinations/lakshadweep.jpg' },
  { name: 'Amritsar', tagline: 'Golden Temple & Wagah Border', kind: 'Tour Package', image: '/images/destinations/amritsar.jpg' },
  { name: 'Ayodhya', tagline: 'Ram Janmabhoomi pilgrimage', kind: 'Tour Package', image: '/images/destinations/ayodhya.jpg' },
  { name: 'Himachal Pradesh', tagline: 'Shimla, Manali & Dharamshala', kind: 'Tour Package', image: '/images/destinations/himachal.jpg' },
  { name: 'Jammu & Kashmir', tagline: 'Srinagar, Gulmarg & Pahalgam', kind: 'Tour Package', image: '/images/destinations/jammu-kashmir.jpg' },
  { name: 'Uttarakhand', tagline: 'Rishikesh, Nainital & Char Dham', kind: 'Tour Package', image: '/images/destinations/uttarakhand.jpg' },
  { name: 'Rajasthan', tagline: 'Jaipur, Udaipur & Jaisalmer', kind: 'Tour Package', image: '/images/destinations/rajasthan.jpg' },
  { name: 'Madhya Pradesh', tagline: 'Khajuraho, Ujjain & Sanchi', kind: 'Tour Package', image: '/images/destinations/madhya-pradesh.jpg' },
  { name: 'Gujarat', tagline: 'Rann of Kutch, Gir & Somnath', kind: 'Destination', image: '/images/destinations/gujarat.jpg' },
  { name: 'Varanasi', tagline: 'Ganga aarti & ancient ghats', kind: 'Destination', image: '/images/destinations/varanasi.jpg' },
  { name: 'Leh & Ladakh', tagline: 'Pangong, Nubra & high passes', kind: 'Destination', image: '/images/destinations/leh-ladakh.jpg' },
  { name: 'Darjeeling', tagline: 'Tea gardens & toy train', kind: 'Destination', image: '/images/destinations/darjeeling.jpg' },
  { name: 'Gangtok', tagline: 'Tsomgo Lake & Nathula Pass', kind: 'Destination', image: '/images/destinations/gangtok.jpg' },
  { name: 'Assam', tagline: 'Kaziranga & Kamakhya Temple', kind: 'Destination', image: '/images/destinations/assam.jpg' },
  { name: 'Meghalaya', tagline: 'Shillong, Cherrapunji & living root bridges', kind: 'Destination', image: '/images/destinations/meghalaya.jpg' },
  { name: 'Arunachal Pradesh', tagline: 'Tawang & Ziro Valley', kind: 'Destination', image: '/images/destinations/arunachal-pradesh.jpg' },
  { name: 'Andaman', tagline: 'Havelock, Neil Island & Port Blair', kind: 'Destination', image: '/images/destinations/andaman.jpg' },
  { name: 'Jim Corbett', tagline: 'Tiger safaris & jungle lodges', kind: 'Destination', image: '/images/destinations/jim-corbett.jpg' },
  { name: 'Bandhavgarh', tagline: 'Tiger reserve safaris', kind: 'Destination', image: '/images/destinations/bandhavgarh.jpg' },
  { name: 'Pench', tagline: 'Jungle Book country wildlife', kind: 'Destination', image: '/images/destinations/pench.jpg' },
  { name: 'Puri', tagline: 'Jagannath Temple & Konark', kind: 'Destination', image: '/images/destinations/puri.jpg' },
  { name: 'Ajmer', tagline: 'Ajmer Sharif Dargah', kind: 'Destination', image: '/images/destinations/ajmer.jpg' },
  { name: 'Pushkar', tagline: 'Holy lake & camel fair', kind: 'Destination', image: '/images/destinations/pushkar.jpg' },
];

export const INTERNATIONAL: Destination[] = [
  { name: 'Malaysia', tagline: 'Kuala Lumpur, Genting & Langkawi', kind: 'International', image: '/images/destinations/malaysia.jpg' },
  { name: 'Singapore', tagline: 'Sentosa, Marina Bay & Universal Studios', kind: 'International', image: '/images/destinations/singapore.jpg' },
  { name: 'Dubai', tagline: 'Burj Khalifa, desert safari & Marina', kind: 'International', image: '/images/destinations/dubai.jpg' },
  { name: 'Thailand', tagline: 'Bangkok, Phuket & Krabi', kind: 'International', image: '/images/destinations/thailand.jpg' },
  { name: 'Vietnam', tagline: 'Hanoi, Ha Long Bay & Da Nang', kind: 'International', image: '/images/destinations/vietnam.jpg' },
  { name: 'Bali', tagline: 'Ubud, temples & beaches', kind: 'International', image: '/images/destinations/bali.jpg' },
  { name: 'China', tagline: 'Beijing, Shanghai & the Great Wall', kind: 'International', image: '/images/destinations/china.jpg' },
  { name: 'Europe', tagline: 'Paris, Switzerland, Italy & more', kind: 'International', image: '/images/destinations/europe.jpg' },
  { name: 'Nepal', tagline: 'Kathmandu, Pokhara & Himalayas', kind: 'International', image: '/images/destinations/nepal.jpg' },
  { name: 'Bhutan', tagline: 'Thimphu, Paro & Tiger’s Nest', kind: 'International', image: '/images/destinations/bhutan.jpg' },
  { name: 'Sri Lanka', tagline: 'Kandy, Sigiriya & Bentota', kind: 'International', image: '/images/destinations/sri-lanka.jpg' },
  { name: 'Azerbaijan', tagline: 'Baku, Gabala & Flame Towers', kind: 'International', image: '/images/destinations/azerbaijan.jpg' },
];

/** Emails an enquiry to ENQUIRY_EMAIL via FormSubmit (no backend required). Throws on failure. */
export async function sendEnquiry(subject: string, fields: Record<string, string>): Promise<void> {
  const res = await fetch(`https://formsubmit.co/ajax/${ENQUIRY_EMAIL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ _subject: subject, _template: 'table', _captcha: 'false', ...fields }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || String(data.success) === 'false') throw new Error(data.message || 'Send failed');
}
