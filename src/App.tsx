/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  Hotel as HotelIcon, 
  Calendar, 
  MapPin, 
  Users, 
  ChevronRight, 
  Sparkles, 
  TrendingUp,
  ArrowRight,
  Clock,
  Compass,
  Heart,
  Palette,
  Camera,
  Utensils,
  Music,
  Waves
} from 'lucide-react';
import { cn } from './lib/utils';
import { UserPreferences, TripPlan, Flight, Hotel } from './types';
import { generateTripPlan } from './services/geminiService';

const INTERESTS = [
  { id: 'culture', label: 'Culture & History', icon: Palette },
  { id: 'nature', label: 'Nature & Parks', icon: Compass },
  { id: 'food', label: 'Gastronomy', icon: Utensils },
  { id: 'nightlife', label: 'Nightlife', icon: Music },
  { id: 'adventure', label: 'Adventure', icon: Waves },
  { id: 'luxury', label: 'Relaxation', icon: Heart },
  { id: 'photography', label: 'Photography', icon: Camera },
];

const BUDGET_OPTIONS = [
  { id: 'budget', label: 'Value', price: '$' },
  { id: 'moderate', label: 'Standard', price: '$$' },
  { id: 'luxury', label: 'Premium', price: '$$$' },
];

export default function App() {
  const [step, setStep] = useState<'landing' | 'prefs' | 'loading' | 'results'>('landing');
  const [prefs, setPrefs] = useState<UserPreferences>({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'moderate',
    travelers: 1,
    interests: [],
  });
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  const startPlanning = () => setStep('prefs');

  const handleSubmit = async () => {
    setStep('loading');
    try {
      const plan = await generateTripPlan(prefs);
      setTripPlan(plan);
      setStep('results');
    } catch (error) {
      console.error("Failed to generate trip plan:", error);
      setStep('prefs');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <LandingPage key="landing" onStart={startPlanning} />
        )}

        {step === 'prefs' && (
          <PreferencesForm 
            key="prefs" 
            prefs={prefs} 
            setPrefs={setPrefs} 
            onSubmit={handleSubmit} 
          />
        )}

        {step === 'loading' && (
          <LoadingState key="loading" destination={prefs.destination} />
        )}

        {step === 'results' && tripPlan && (
          <ResultsView 
            key="results" 
            plan={tripPlan} 
            onRestart={() => setStep('landing')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface LandingPageProps {
  onStart: () => void;
  key?: string;
}

function LandingPage(props: LandingPageProps) {
  const { onStart } = props;
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-40 brightness-50"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-on-a-trip-in-the-mountains-34533-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-white/60 mb-6 block font-medium">Elevate Your Journey</span>
          <h1 className="text-6xl md:text-8xl font-serif mb-8 leading-tight tracking-tight">
            Voyager <span className="italic">AI</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            The sophisticated travel curator that designs itineraries around your unique perspective. 
            Smart flights, tailored stays, and hidden gems.
          </p>
          
          <button 
            onClick={onStart}
            className="group relative px-10 py-5 bg-white text-black rounded-full text-sm font-semibold tracking-widest uppercase overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-3">
              Begin Planning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-12 bg-white/30" />
      </div>
    </motion.div>
  );
}

interface PreferencesFormProps {
  prefs: UserPreferences;
  setPrefs: React.Dispatch<React.SetStateAction<UserPreferences>>;
  onSubmit: () => void;
  key?: string;
}

function PreferencesForm(props: PreferencesFormProps) {
  const { prefs, setPrefs, onSubmit } = props;
  const toggleInterest = (id: string) => {
    setPrefs(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const isFormValid = prefs.destination && prefs.startDate && prefs.endDate && prefs.interests.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen pt-24 pb-12 px-6 max-w-3xl mx-auto"
    >
      <header className="mb-16">
        <h2 className="text-4xl font-serif mb-4 italic">Configure Your Story</h2>
        <p className="text-white/50 text-sm tracking-wide">TELL US WHERE YOU WANT TO GO AND WHAT MOVES YOU.</p>
      </header>

      <div className="space-y-12">
        <section className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input 
              type="text" 
              placeholder="e.g. Kyoto, Japan or Amalfi Coast"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-white/30 text-lg"
              value={prefs.destination}
              onChange={e => setPrefs({...prefs, destination: e.target.value})}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Date Range</label>
            <div className="flex gap-4">
              <input 
                type="date"
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-white/30"
                value={prefs.startDate}
                onChange={e => setPrefs({...prefs, startDate: e.target.value})}
              />
              <input 
                type="date"
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-white/30"
                value={prefs.endDate}
                onChange={e => setPrefs({...prefs, endDate: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Travelers</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input 
                type="number" 
                min="1" 
                max="10"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-white/30"
                value={prefs.travelers}
                onChange={e => setPrefs({...prefs, travelers: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Interests</label>
          <div className="flex flex-wrap gap-3">
            {INTERESTS.map(interest => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-full border text-xs tracking-wider transition-all",
                  prefs.interests.includes(interest.id) 
                    ? "bg-white text-black border-white" 
                    : "bg-transparent border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                )}
              >
                <interest.icon className="w-4 h-4" />
                {interest.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Budget Philosophy</label>
          <div className="grid grid-cols-3 gap-4">
            {BUDGET_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => setPrefs({...prefs, budget: option.id as any})}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all",
                  prefs.budget === option.id 
                    ? "bg-white text-black border-white" 
                    : "bg-transparent border-white/10 text-white/60 hover:border-white/20"
                )}
              >
                <span className="text-[10px] font-bold uppercase mb-1">{option.label}</span>
                <span className="text-xl font-serif italic">{option.price}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="pt-8 text-center">
          <button 
            disabled={!isFormValid}
            onClick={onSubmit}
            className={cn(
              "px-16 py-6 rounded-full text-sm font-bold uppercase tracking-[0.2em] transition-all",
              isFormValid 
                ? "bg-white text-black hover:scale-105 active:scale-95" 
                : "bg-white/10 text-white/20 cursor-not-allowed"
            )}
          >
            Generate My Plan
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface LoadingStateProps {
  destination: string;
  key?: string;
}

function LoadingState(props: LoadingStateProps) {
  const { destination } = props;
  const messages = [
    "Analyzing flight paths for the best efficiency...",
    "Curating hotel recommendations based on your style...",
    "Drafting your personalized itinerary...",
    "Connecting with local experts in " + destination + "...",
  ];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
        className="w-16 h-16 border-t border-white/50 border-r border-white/10 rounded-full mb-12"
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-white/60 font-serif italic text-lg text-center"
        >
          {messages[msgIdx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

interface ResultsViewProps {
  plan: TripPlan;
  onRestart: () => void;
  key?: string;
}

function ResultsView(props: ResultsViewProps) {
  const { plan, onRestart } = props;
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      <div className="relative h-[60vh] flex items-end">
        <img 
          src={plan.hotels[0]?.image || `https://picsum.photos/seed/${plan.destination}/1920/1080`} 
          alt={plan.destination}
          className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale-[0.2]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12">
          <button onClick={onRestart} className="text-white/40 hover:text-white flex items-center gap-2 mb-8 text-xs uppercase tracking-widest transition-colors">
            <Compass className="w-4 h-4" /> New Journey
          </button>
          <h1 className="text-6xl md:text-8xl font-serif mb-4 leading-tight italic">
            {plan.destination}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-light max-w-3xl leading-relaxed">
            {plan.summary}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-24">
        {/* Flights Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-serif italic">Efficient Transit</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plan.flights.map(flight => (
              <div key={flight.id} className={cn(
                "group relative p-8 rounded-3xl border transition-all hover:bg-white/5",
                flight.isSmartChoice ? "border-white/40 bg-white/[0.03]" : "border-white/10"
              )}>
                {flight.isSmartChoice && (
                  <div className="absolute -top-3 right-8 px-3 py-1 bg-white text-black text-[9px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3 h-3" /> Smart Choice
                  </div>
                )}
                <div className="flex justify-between items-start mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{flight.airline}</span>
                  <span className="text-2xl text-white font-light tracking-tighter">${flight.price}</span>
                </div>
                <div className="flex items-center justify-between mb-10">
                  <div className="text-center">
                    <span className="block text-2xl font-serif text-white mb-1 uppercase tracking-tighter">{flight.departure}</span>
                    <span className="text-[9px] text-white/30 uppercase font-black">Departure</span>
                  </div>
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <div className="w-full h-[1px] bg-white/10 relative">
                      <Plane className="w-3 h-3 text-white/30 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                    </div>
                    <span className="text-[9px] text-white/30 uppercase font-black mt-3">{flight.duration}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-serif text-white mb-1 uppercase tracking-tighter">{flight.arrival}</span>
                    <span className="text-[9px] text-white/30 uppercase font-black">Arrival</span>
                  </div>
                </div>
                <button className="w-full py-4 rounded-xl border border-white/10 text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-all">
                  Reserved Flight
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Hotels Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <HotelIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-serif italic">Curated Stays</h2>
            </div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Personalized for you</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {plan.hotels.map(hotel => (
              <div key={hotel.id} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-3xl mb-6 relative">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-[10px] font-bold text-white tracking-widest">{hotel.rating}/5</span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-xs italic text-white/90 leading-relaxed">
                      " {hotel.recommendationReason} "
                    </p>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-serif italic">{hotel.name}</h3>
                    <span className="text-lg font-light">${hotel.pricePerNight}<span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">/pn</span></span>
                  </div>
                  <p className="text-sm text-white/60 font-light mb-6 line-clamp-2 leading-relaxed">
                    {hotel.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {hotel.amenities.slice(0, 3).map(amenity => (
                      <span key={amenity} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest text-white/50">{amenity}</span>
                    ))}
                  </div>
                  <button className="w-full py-5 rounded-2xl bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] transform transition-transform active:scale-95">
                    Explore Experience
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="bg-white/5 p-12 rounded-[3rem] border border-white/10">
          <div className="flex items-center gap-4 mb-16">
            <div className="p-3 bg-white/10 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-serif italic">Your Narrative</h2>
          </div>
          
          <div className="space-y-16">
            {plan.itinerary.map((day, idx) => (
              <div key={day.day} className="flex flex-col md:flex-row gap-8 relative">
                {idx < plan.itinerary.length - 1 && (
                  <div className="hidden md:block absolute left-4 top-12 bottom-[-64px] w-[1px] bg-white/10" />
                )}
                <div className="md:w-32 flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block mb-2">Day</span>
                  <span className="text-5xl font-serif italic leading-none">{day.day < 10 ? `0${day.day}` : day.day}</span>
                </div>
                <div className="space-y-6 flex-1">
                  <h3 className="text-2xl font-medium tracking-tight border-b border-white/10 pb-4">{day.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {day.activities.map((activity, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                        <div className="mt-1 w-2 h-2 rounded-full border border-white/30 group-hover:bg-white transition-colors" />
                        <span className="text-sm text-white/70 font-light leading-relaxed">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center pt-12 border-t border-white/10">
          <h2 className="text-4xl font-serif italic mb-8">Ready for the horizon?</h2>
          <div className="flex justify-center gap-4">
            <button className="px-12 py-5 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              Book Full Package
            </button>
            <button className="px-12 py-5 bg-transparent border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:border-white transition-all">
              Save To Bucket List
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
