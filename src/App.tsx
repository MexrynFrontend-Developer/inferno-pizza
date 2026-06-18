import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Flame, Star, MapPin, Phone, Mail, Facebook, Twitter,
  Clock, Users, Calendar, User, MessageSquare, ChevronDown, X, Menu
} from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '7511442695';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  display_order: number;
}

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
}

const FALLBACK_MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Margherita Classica', description: 'San Marzano tomatoes, buffalo mozzarella, fresh basil, extra virgin olive oil', price: 1800, display_order: 1 },
  { id: '2', name: 'Truffle Bianca', description: 'White cream base, black truffle shavings, taleggio, crispy pancetta, arugula', price: 2800, display_order: 2 },
  { id: '3', name: 'Diavola Inferno', description: 'Spicy Calabrian nduja, San Marzano tomatoes, fior di latte, hot honey drizzle', price: 2200, display_order: 3 },
  { id: '4', name: 'Vesuvio Prosciutto', description: 'Prosciutto di Parma, burrata, cherry tomatoes, pesto, aged balsamic', price: 2600, display_order: 4 },
  { id: '5', name: 'Funghi Selvatici', description: 'Wild mushroom medley, fontina, roasted garlic cream, thyme, truffle oil', price: 2400, display_order: 5 },
  { id: '6', name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, parmigiano reggiano, pecorino, honey walnut', price: 2000, display_order: 6 },
  { id: '7', name: 'Salmone Affumicato', description: 'Smoked Norwegian salmon, crème fraîche, capers, red onion, dill', price: 2900, display_order: 7 },
  { id: '8', name: 'Capricciosa Royale', description: 'Artichokes, olives, capers, prosciutto, mushrooms, San Marzano base', price: 2300, display_order: 8 },
  { id: '9', name: 'Bresaola e Rucola', description: 'Aged beef bresaola, wild arugula, shaved parmigiano, lemon zest, EVOO', price: 2500, display_order: 9 },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Alessandro M.', content: 'The Truffle Bianca is unlike anything I have tasted outside of Naples. The leopard char on the crust, the fragrance of the truffle — Inferno is the real thing.', rating: 5 },
  { id: '2', name: 'Sophia K.', content: 'We celebrated our anniversary here and the private dining experience was absolutely flawless. The sommelier pairings were inspired. A truly special evening.', rating: 5 },
  { id: '3', name: 'James R.', content: 'I have eaten at Michelin-starred pizzerias across Italy. Inferno stands with the best of them. The Diavola Inferno has just the right heat — bold but not reckless.', rating: 5 },
];

async function sendTelegramNotification(formData: {
  name: string;
  date: string;
  time: string;
  guests: string;
  requests: string;
}) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('[Telegram] VITE_TELEGRAM_BOT_TOKEN is not set — skipping notification.');
    return;
  }

  const message =
    `🍕 New Reservation — Inferno Pizza\n` +
    `👤 Name: ${formData.name}\n` +
    `📅 Date: ${formData.date}\n` +
    `🕐 Time: ${formData.time}\n` +
    `👥 Guests: ${formData.guests}\n` +
    `📝 Requests: ${formData.requests || 'None'}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = { chat_id: TELEGRAM_CHAT_ID, text: message };

  console.log('[Telegram] Sending to:', url.replace(TELEGRAM_BOT_TOKEN, '***'));
  console.log('[Telegram] Payload:', JSON.stringify(payload));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log('[Telegram] Response status:', res.status);
    console.log('[Telegram] Response body:', JSON.stringify(data));

    if (!data.ok) {
      console.error('[Telegram] API error:', data.description);
    } else {
      console.log('[Telegram] Message sent successfully ✅');
    }
  } catch (err) {
    console.error('[Telegram] Fetch failed:', err);
  }
}

function App() {
  const [formData, setFormData] = useState({ name: '', date: '', time: '', guests: '', requests: '' });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [menuItems, testimonials]);

  useEffect(() => {
    const createParticles = () => {
      if (!particlesRef.current) return;
      particlesRef.current.innerHTML = '';
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = `${Math.random() * 20}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${6 + Math.random() * 4}s`;
        particlesRef.current.appendChild(particle);
      }
    };
    createParticles();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!supabase) throw new Error('Supabase not configured');

        const [menuRes, testimonialsRes] = await Promise.all([
          supabase.from('menu_items').select('*').order('display_order'),
          supabase.from('testimonials').select('*').order('display_order'),
        ]);

        const fetchedMenu = menuRes.data && menuRes.data.length > 0 ? menuRes.data : FALLBACK_MENU_ITEMS;
        const fetchedTestimonials = testimonialsRes.data && testimonialsRes.data.length > 0 ? testimonialsRes.data : FALLBACK_TESTIMONIALS;

        setMenuItems(fetchedMenu);
        setTestimonials(fetchedTestimonials);
      } catch {
        setMenuItems(FALLBACK_MENU_ITEMS);
        setTestimonials(FALLBACK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (menuModalOpen || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuModalOpen, mobileMenuOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      let savedToDb = false;

      if (supabase) {
        const { error } = await supabase.from('reservations').insert({
          name: formData.name,
          date: formData.date,
          time: formData.time,
          guests: parseInt(formData.guests),
          special_requests: formData.requests || null,
        });
        if (!error) savedToDb = true;
      }

      await sendTelegramNotification(formData);

      if (savedToDb || TELEGRAM_BOT_TOKEN) {
        setSubmitMessage({ type: 'success', text: 'Thank you for your reservation request! We will contact you shortly to confirm.' });
        setFormData({ name: '', date: '', time: '', guests: '', requests: '' });
      } else {
        throw new Error('Could not submit');
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'Something went wrong. Please try again or call us directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (cents: number) => `€${(cents / 100).toFixed(0)}`;

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Menu', href: '#menu' },
    { label: 'Experience', href: '#experience' },
    { label: 'Reservations', href: '#reserve' },
  ];

  return (
    <div className="min-h-screen bg-dark text-white">

      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-dark/90 backdrop-blur-sm border-b border-dark-300">
        <a href="#" className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-gold" />
          <span className="font-serif text-xl font-bold">Inferno Pizza</span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="text-gray-300 hover:text-gold transition-colors duration-300 text-sm tracking-wide">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#reserve" className="hidden md:inline-block button-gold text-sm py-2 px-6">
          Reserve
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-300 hover:text-gold transition-colors p-1"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative ml-auto w-72 bg-dark-100 h-full flex flex-col p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-gold" />
                <span className="font-serif text-lg font-bold">Inferno Pizza</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-400 hover:text-gold transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-200 hover:text-gold transition-colors duration-300 text-lg font-medium border-b border-dark-300 pb-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto">
              <a
                href="#reserve"
                className="button-gold w-full text-center block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reserve a Table
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/11467204/pexels-photo-11467204.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Pizza background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/50 to-transparent" />
        </div>

        <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flame className="w-8 h-8 text-gold" />
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">Est. 2026</span>
            <Flame className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Where Every Slice<br />
            <span className="text-gradient">is an Experience</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light tracking-wide">
            Premium ingredients. Artisan craftsmanship. Unforgettable taste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#reserve" className="button-gold text-lg text-center">Reserve a Table</a>
            <a href="#menu" className="button-outline text-lg text-center">View Menu</a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-gold" />
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" style={{ '--tw-via-color': '#D4AF37' } as React.CSSProperties} />

      {/* About Section */}
      <section id="about" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative animate-on-scroll">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Chef preparing pizza"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 border border-gold/30 m-4" style={{ borderColor: 'rgba(212,175,55,0.3)' }} />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-dark-100 border border-gold p-6" style={{ borderColor: '#D4AF37' }}>
                <p className="font-serif text-4xl text-gold">Est.</p>
                <p className="font-serif text-5xl font-bold">2026</p>
              </div>
            </div>

            <div className="lg:pl-8 animate-on-scroll">
              <div style={{ width: '4rem', height: '2px', backgroundColor: '#D4AF37', marginBottom: '2rem' }} />
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Our <span className="text-gold">Story</span>
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  Born from a passion for authentic Italian craftsmanship and a vision to elevate pizza to an art form,
                  Inferno Pizza opened its doors in 2026 with a singular mission: to create an experience unlike any other.
                </p>
                <p>
                  Our master pizzaiolos use only the finest imported ingredients — San Marzano tomatoes from the volcanic
                  soils of Vesuvius, buffalo mozzarella from Campania, and truffles sourced directly from Italian forests.
                </p>
                <p>
                  Each pizza is handcrafted in our wood-fired oven, reaching temperatures of 900 degrees, creating the
                  perfect leopard-spotted char and that unmistakable flavor that defines true Neapolitan excellence.
                </p>
              </div>
              <button className="button-outline mt-10">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      {/* Menu Section */}
      <section id="menu" className="section-padding bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="gold-divider mb-8" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Signature <span className="text-gold">Creations</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Each pizza is a masterpiece, crafted with passion and the finest ingredients from Italy's most renowned regions.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuItems.slice(0, 6).map((pizza) => (
                <div key={pizza.id} className="menu-card animate-on-scroll">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif text-2xl font-semibold">{pizza.name}</h3>
                    <span className="text-gold text-2xl font-serif">{formatPrice(pizza.price)}</span>
                  </div>
                  <p className="text-gray-400">{pizza.description}</p>
                  <div className="mt-6 w-12 h-0.5" style={{ backgroundColor: 'rgba(212,175,55,0.5)' }} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <button className="button-outline" onClick={() => setMenuModalOpen(true)}>
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* Full Menu Modal */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMenuModalOpen(false)} />
          <div className="relative bg-dark-100 border border-dark-300 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-dark-100 border-b border-dark-300 px-8 py-6 flex items-center justify-between">
              <div>
                <div style={{ width: '3rem', height: '2px', backgroundColor: '#D4AF37', marginBottom: '0.75rem' }} />
                <h2 className="font-serif text-3xl font-bold">
                  Full <span className="text-gold">Menu</span>
                </h2>
              </div>
              <button
                onClick={() => setMenuModalOpen(false)}
                className="text-gray-400 hover:text-gold transition-colors p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {menuItems.map((pizza) => (
                  <div key={pizza.id} className="menu-card">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-serif text-xl font-semibold pr-4">{pizza.name}</h3>
                      <span className="text-gold text-xl font-serif flex-shrink-0">{formatPrice(pizza.price)}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{pizza.description}</p>
                    <div className="mt-4 w-8 h-0.5" style={{ backgroundColor: 'rgba(212,175,55,0.5)' }} />
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 border border-gold/20 text-center" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
                <p className="text-gray-400 text-sm">
                  All pizzas are made with 72-hour fermented dough, baked in our 900°F wood-fired oven.<br />
                  Gluten-free bases available on request. Please inform us of any allergies.
                </p>
              </div>

              <div className="text-center mt-8">
                <a href="#reserve" className="button-gold inline-block" onClick={() => setMenuModalOpen(false)}>
                  Reserve a Table
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      {/* Special Experience Section */}
      <section id="experience" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1414234/pexels-photo-1414234.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Private dining"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0a0a0a, rgba(10,10,10,0.9), rgba(10,10,10,0.7))' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 animate-on-scroll">
          <div className="max-w-2xl">
            <div className="gold-divider mb-8" style={{ marginLeft: 0 }} />
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Private Dining<br />& <span className="text-gold">Events</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Elevate your special occasions with an exclusive dining experience in our private chamber.
              Accommodating up to 16 guests, our VIP suite features a dedicated chef, bespoke menu curation,
              and sommelier-selected wine pairings.
            </p>
            <p className="text-gray-400 mb-10">
              Corporate events | Anniversary celebrations | Private gatherings | Wine dinners
            </p>
            <button className="button-gold">Book Private Experience</button>
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="gold-divider mb-8" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Guest <span className="text-gold">Experiences</span>
            </h2>
            <p className="text-gray-400 text-lg">What our distinguished guests have to say</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-dark-100 border border-dark-300 p-8 transition-all duration-500 animate-on-scroll"
                  style={{ borderColor: '#222222' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#222222')}
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold fill-gold" style={{ color: '#D4AF37', fill: '#D4AF37' }} />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="w-12 h-0.5 mb-4" style={{ backgroundColor: 'rgba(212,175,55,0.5)' }} />
                  <p className="font-serif text-lg">{testimonial.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      {/* Reservation Section */}
      <section id="reserve" className="section-padding bg-dark">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll">
            <div className="gold-divider mb-8" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Reserve Your <span className="text-gold">Table</span>
            </h2>
            <p className="text-gray-400 text-lg">Secure your spot for an unforgettable dining experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-on-scroll">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text" name="name" placeholder="Full Name"
                  value={formData.name} onChange={handleInputChange}
                  className="input-dark pl-12" required
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="date" name="date" value={formData.date}
                  onChange={handleInputChange} className="input-dark pl-12" required
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select
                  name="time" value={formData.time}
                  onChange={handleInputChange} className="input-dark pl-12 appearance-none" required
                >
                  <option value="">Select Time</option>
                  {['17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'].map((t) => {
                    const [h, m] = t.split(':');
                    const hour = parseInt(h);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const display = `${hour > 12 ? hour - 12 : hour}:${m} ${ampm}`;
                    return <option key={t} value={t}>{display}</option>;
                  })}
                </select>
              </div>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <select
                  name="guests" value={formData.guests}
                  onChange={handleInputChange} className="input-dark pl-12 appearance-none" required
                >
                  <option value="">Number of Guests</option>
                  {[1,2,3,4,5,6,7,8].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
              <textarea
                name="requests"
                placeholder="Special Requests (dietary requirements, celebrations, seating preferences)"
                value={formData.requests} onChange={handleInputChange}
                rows={4} className="input-dark pl-12 resize-none"
              />
            </div>

            {submitMessage && (
              <div className={`p-4 border ${submitMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                style={{ borderColor: submitMessage.type === 'success' ? '#22c55e' : '#ef4444', backgroundColor: submitMessage.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                {submitMessage.text}
              </div>
            )}

            <button
              type="submit" disabled={submitting}
              className="button-gold w-full py-5 text-lg"
              style={{ opacity: submitting ? 0.5 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'Submitting...' : 'Request Reservation'}
            </button>
          </form>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 lg:px-24 bg-dark border-t border-dark-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Flame className="w-8 h-8 text-gold" />
                <span className="font-serif text-2xl font-bold">Inferno Pizza</span>
              </div>
              <p className="text-gray-400 mb-6">
                Where every slice is an experience. Premium artisan pizza crafted with passion.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 border border-dark-400 flex items-center justify-center transition-all duration-300"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#D4AF37'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}>
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 border border-dark-400 flex items-center justify-center transition-all duration-300"
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#D4AF37'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}>
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-serif text-xl mb-6">Navigation</h4>
              <ul className="space-y-4">
                {['Home', 'About', 'Menu', 'Private Dining', 'Reservations'].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 transition-colors duration-300"
                      onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                      onMouseLeave={e => (e.currentTarget.style.color = '')}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-xl mb-6">Hours</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex justify-between"><span>Mon - Thu</span><span>5PM - 10PM</span></li>
                <li className="flex justify-between"><span>Fri - Sat</span><span>5PM - 11PM</span></li>
                <li className="flex justify-between"><span>Sunday</span><span>4PM - 9PM</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-xl mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                  <span>123 Artisan Avenue<br />Culinary District, NY 10001</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  <a href="tel:+12125551234" className="transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                    onMouseLeave={e => (e.currentTarget.style.color = '')}>
                    +1 (212) 555-1234
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5" style={{ color: '#D4AF37' }} />
                  <a href="mailto:hello@infernopizza.com" className="transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.color = '#D4AF37')}
                    onMouseLeave={e => (e.currentTarget.style.color = '')}>
                    hello@infernopizza.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full h-px mb-8" style={{ background: 'linear-gradient(to right, transparent, #D4AF37, transparent)' }} />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">&copy; 2026 Inferno Pizza. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="transition-colors hover:text-gold">Privacy Policy</a>
              <a href="#" className="transition-colors hover:text-gold">Terms of Service</a>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-dark-400">
            <p className="text-[12px] tracking-[2px] uppercase text-gray-600">
              Designed & Developed by{' '}
              <a
                href="https://github.com/MexrynFrontend-Developer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover-glow transition-all duration-300"
              >
                Mexryn
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
