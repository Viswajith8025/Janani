import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  CreditCard,
  Check,
  ChevronDown,
  ArrowLeft,
  Leaf,
  Heart,
  Sun,
  Star,
  Shield,
  Clock,
  Eye,
  X,
  Loader2,
  MessageCircle,
  UploadCloud,
  FileText,
  Trash2,
} from 'lucide-react';
import { FadeIn, ScaleIn } from '../components/AnimatedText';
import Magnetic from '../components/Magnetic';

import { experiences } from '../data/experiences';
import { apiFetch } from '../config/api';

const packages = [
  {
    id: 'serenity',
    name: 'Serenity Escape',
    duration: '3 Nights / 4 Days',
    price: 899,
    perNight: 300,
    description: 'A tranquil introduction to holistic wellness in the heart of nature.',
    features: [
      'Luxury mud house accommodation',
      'Daily yoga & meditation sessions',
      'Ayurvedic wellness consultation',
      'Farm-to-table organic meals',
      'Nature trail guided walk',
      'Airport transfers included',
    ],
    icon: Leaf,
    popular: false,
    color: 'forest',
  },
  {
    id: 'harmony',
    name: 'Harmony Retreat',
    duration: '5 Nights / 6 Days',
    price: 1399,
    perNight: 280,
    description: 'Our signature retreat combining ancient healing traditions with modern luxury.',
    features: [
      'Premium mud house suite',
      'Daily yoga, meditation & Kalarippayattu',
      'Full Ayurvedic treatment package',
      'Sound healing & music therapy',
      'Organic meals + juice detox',
      'Mud bath & detox session',
      'Cultural excursion',
      'Airport transfers included',
    ],
    icon: Heart,
    popular: true,
    color: 'gold',
  },
  {
    id: 'transformation',
    name: 'Total Transformation',
    duration: '7 Nights / 8 Days',
    price: 1899,
    perNight: 271,
    description: 'The ultimate immersive journey to reconnect, heal, and transform.',
    features: [
      'Deluxe mud house suite with private garden',
      'Personalized yoga & wellness program',
      'Complete Ayurvedic treatment series',
      'Daily Kalarippayattu training',
      'Sound healing & music therapy sessions',
      'Mud bath, detox & nature therapy',
      'Private meditation sessions',
      'Cultural immersion experiences',
      'Complimentary spa treatments',
      'Airport transfers + local excursions',
    ],
    icon: Sun,
    popular: false,
    color: 'forest',
  },
];

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
];

const ID_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'driving', label: 'Driving Licence' },
  { value: 'voter', label: "Voter's ID" },
  { value: 'passport', label: 'Passport' },
  { value: 'pan', label: 'PAN Card' },
];

const BookNow = () => {
  const [selectedPackage, setSelectedPackage] = useState('harmony');
  const [guests, setGuests] = useState(1);
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState('+1');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showExperiences, setShowExperiences] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [sendError, setSendError] = useState('');
  // ID proof state
  const [idType, setIdType] = useState('aadhaar');
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    specialRequests: '',
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const selectedPkg = packages.find((p) => p.id === selectedPackage);
  const totalPrice = selectedPkg ? selectedPkg.price * guests : 0;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── ID File handlers ──────────────────────────────────────────────────────
  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setSendError('Invalid file type. Use JPG, PNG, WebP, or PDF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSendError('File is too large. Maximum size is 5 MB.');
      return;
    }
    setSendError('');
    setIdFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setIdPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setIdPreview('pdf');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const removeFile = () => {
    setIdFile(null);
    setIdPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendError('');

    try {
      // 1. Create Booking
      const bookingRes = await apiFetch('/booking', {
        method: 'POST',
        body: JSON.stringify({
          firstName:       formData.firstName,
          lastName:        formData.lastName,
          email:           formData.email,
          countryCode,
          phone:           formData.phone,
          checkIn:         formData.checkIn  || undefined,
          checkOut:        formData.checkOut || undefined,
          packageId:       selectedPackage,
          packageName:     selectedPkg?.name,
          totalGuests:     { adults: guests },
          specialRequests: formData.specialRequests || '',
          source:          'website',
        }),
      });

      const ref = bookingRes.data?.bookingRef;
      setBookingRef(ref);

      // 2. Create Razorpay Order
      setIsPaying(true);
      const orderRes = await apiFetch('/payment/order', {
        method: 'POST',
        body: JSON.stringify({
          bookingRef: ref,
          email:      formData.email,
        }),
      });

      const options = {
        key:         orderRes.data.keyId,
        amount:      orderRes.data.amount,
        currency:    orderRes.data.currency,
        name:        'Janani Lifestyle',
        description: orderRes.data.description,
        order_id:    orderRes.data.orderId,
        prefill:     orderRes.data.prefill,
        theme: {
          color: '#1f321e', // Janani forest green
        },
        handler: async (response) => {
          try {
            setIsPaying(true);
            await apiFetch('/payment/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpayOrderId:   response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentId:         orderRes.data.paymentId,
              }),
            });
            setIsSubmitted(true);
          } catch (err) {
            setSendError('Payment verification failed. Please contact us with your reference.');
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            setSendError('Payment was cancelled. You can retry from your email link later.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setSendError(
        err.message || 'Something went wrong. Please try again or contact us via WhatsApp.'
      );
    } finally {
      setIsSending(false);
      setIsPaying(false);
    }
  };

  const SuccessModal = () => (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-earth-50 flex items-center">
      <div className="container-luxury">
        <motion.div
          className="max-w-4xl mx-auto bg-white shadow-premium overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="grid md:grid-cols-5">
            <div className="md:col-span-2 bg-forest-900 p-8 md:p-12 text-white flex flex-col justify-between">
              <div>
                <motion.div
                  className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-8"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5, type: 'spring' }}
                >
                  <Check className="w-8 h-8 text-gold-500" />
                </motion.div>
                <h2 className="font-serif text-3xl mb-4">Retreat Confirmed</h2>
                {bookingRef && (
                  <div className="mb-4 px-4 py-3 bg-white/10 rounded">
                    <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Your Booking Reference</p>
                    <p className="font-mono text-gold-400 text-lg font-bold tracking-widest">{bookingRef}</p>
                    <p className="text-white/40 text-[10px] mt-1">Save this — you can use it to look up or cancel your booking.</p>
                  </div>
                )}
                <p className="text-white/70 text-sm leading-relaxed mb-8">
                  Your wellness journey with Janani has officially begun. Your payment was successful
                  and your reservation is now confirmed. We can't wait to welcome you.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-white/50 tracking-widest uppercase">
                  <Shield className="w-4 h-4" />
                  <span>Secure Confirmation</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 p-8 md:p-12">
              <h3 className="font-serif text-2xl text-forest-900 mb-8">Reservation Summary</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-start pb-6 border-b border-earth-100">
                  <div>
                    <p className="text-forest-400 text-[10px] uppercase tracking-widest mb-1">Package</p>
                    <p className="text-forest-900 font-medium">{selectedPkg?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-forest-400 text-[10px] uppercase tracking-widest mb-1">Guests</p>
                    <p className="text-forest-900 font-medium">{guests}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pb-6 border-b border-earth-100">
                  <div>
                    <p className="text-forest-400 text-[10px] uppercase tracking-widest mb-1">Check-in</p>
                    <p className="text-forest-900 font-medium">{formData.checkIn || 'To be confirmed'}</p>
                  </div>
                  <div>
                    <p className="text-forest-400 text-[10px] uppercase tracking-widest mb-1">Check-out</p>
                    <p className="text-forest-900 font-medium">{formData.checkOut || 'To be confirmed'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 bg-earth-50 px-6">
                  <span className="text-forest-700 font-medium">Estimated Total</span>
                  <span className="text-forest-900 font-serif text-3xl">${totalPrice.toLocaleString('en-US')} <span className="text-xs font-sans text-forest-500 uppercase">USD</span></span>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                   <Magnetic strength={0.2}>
                      <a
                        href={`https://wa.me/919645558593?text=Hi!%20I%20just%20submitted%20a%20booking%20request%20for%20the%20${encodeURIComponent(selectedPkg?.name || '')}%20package.%20My%20reference%20is%20${encodeURIComponent(bookingRef)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-4 bg-forest-800 text-white text-sm font-medium tracking-widest uppercase hover:bg-forest-900 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chat on WhatsApp
                      </a>
                   </Magnetic>
                   <Link to="/" className="text-center text-forest-400 text-xs hover:text-forest-600 transition-colors">
                      Return to Home
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  if (isSubmitted) {
    return <SuccessModal />;
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-earth-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-radial from-gold-200/20 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gradient-radial from-forest-200/15 to-transparent blur-3xl pointer-events-none" />

      <div className="container-luxury relative z-10">
        {/* Back to Home + Explore Experiences */}
        <FadeIn>
          <div className="flex items-center gap-6 mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-800 transition-colors text-sm group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <button
              onClick={() => setShowExperiences(true)}
              className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-800 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              Explore Experiences
            </button>
          </div>
        </FadeIn>

        {/* Experiences Popup */}
        <AnimatePresence>
          {showExperiences && (
            <>
              <motion.div
                className="fixed inset-0 bg-forest-950/50 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowExperiences(false)}
              />
              <motion.div
                className="fixed inset-4 md:inset-8 lg:inset-16 bg-white z-50 overflow-y-auto shadow-premium"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-earth-200 px-6 md:px-8 py-4 flex items-center justify-between z-10">
                  <h2 className="font-serif text-xl md:text-2xl text-forest-900">Our Experiences</h2>
                  <button
                    onClick={() => setShowExperiences(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-earth-100 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-forest-600" />
                  </button>
                </div>
                <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      className="group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="aspect-[4/3] overflow-hidden mb-3 bg-earth-100">
                        <img
                          src={exp.image}
                          alt={exp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="font-serif text-sm md:text-base text-forest-800 mb-0.5">{exp.title}</h3>
                      <p className="text-forest-500 text-xs leading-relaxed">{exp.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <FadeIn>
            <p className="text-label-gold mb-4">Reserve Your Experience</p>
          </FadeIn>
          <div className="overflow-hidden mb-4">
            <motion.h1
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-forest-900 leading-tight"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            >
              Book Your <span className="italic text-forest-600 font-light">Retreat</span>
            </motion.h1>
          </div>
          <FadeIn delay={0.4}>
            <p className="text-forest-600/70 text-sm md:text-base max-w-xl mx-auto">
              All prices are in United States Dollars (USD). Choose your ideal wellness package
              and begin your transformative journey.
            </p>
          </FadeIn>
        </div>

        {/* Step Indicator */}
        <FadeIn delay={0.3}>
          <div className="flex flex-col items-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              {[
                { num: 1, label: 'Choose Package' },
                { num: 2, label: 'Guest Details' },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center gap-4">
                  <button
                    onClick={() => s.num < step + 1 && setStep(s.num)}
                    className={`flex items-center gap-2.5 transition-all duration-300 ${
                      step >= s.num ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-500 ${
                        step > s.num
                          ? 'bg-forest-700 text-white'
                          : step === s.num
                          ? 'bg-forest-700 text-white ring-4 ring-forest-200'
                          : 'bg-earth-200 text-forest-600'
                      }`}
                    >
                      {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span className="hidden sm:inline text-sm text-forest-700 font-medium">
                      {s.label}
                    </span>
                  </button>
                  {i === 0 && (
                    <div className={`w-12 sm:w-20 h-px transition-all duration-500 ${
                      step > 1 ? 'bg-forest-700' : 'bg-earth-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-gold-50 border border-gold-200 rounded-full animate-pulse">
              <Clock className="w-3 h-3 text-gold-600" />
              <span className="text-[10px] text-gold-700 font-medium uppercase tracking-widest">Popular retreat dates are filling fast</span>
            </div>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Package Selection */}
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
                {packages.map((pkg, index) => {
                  const isSelected = selectedPackage === pkg.id;
                  const IconComponent = pkg.icon;
                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                    >
                      <button
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`relative w-full text-left p-6 md:p-8 transition-all duration-500 group ${
                          isSelected
                            ? 'bg-white shadow-premium ring-2 ring-forest-700 -translate-y-1'
                            : 'bg-white shadow-elegant hover:shadow-premium hover:-translate-y-1'
                        }`}
                      >
                        {/* Popular Badge */}
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1 px-4 py-1 bg-gold-500 text-white text-xs font-medium tracking-wider uppercase rounded-full">
                              <Star className="w-3 h-3" /> Most Popular
                            </span>
                          </div>
                        )}

                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            isSelected ? 'bg-forest-100' : 'bg-earth-100 group-hover:bg-forest-50'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              isSelected ? 'text-forest-700' : 'text-forest-500'
                            }`} />
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? 'border-forest-700 bg-forest-700'
                              : 'border-earth-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>

                        <h3 className="font-serif text-xl md:text-2xl text-forest-900 mb-1">
                          {pkg.name}
                        </h3>
                        <p className="text-forest-500 text-xs mb-4">{pkg.duration}</p>
                        <p className="text-forest-600/70 text-sm mb-6 leading-relaxed">
                          {pkg.description}
                        </p>

                        {/* Price */}
                        <div className="mb-6 pb-6 border-b border-earth-200">
                          <div className="flex items-baseline gap-1">
                            <span className="text-forest-400 text-sm">$</span>
                            <span className="font-serif text-3xl md:text-4xl text-forest-900">
                              {pkg.price.toLocaleString('en-US')}
                            </span>
                            <span className="text-forest-400 text-sm ml-1">USD</span>
                          </div>
                          <p className="text-forest-400 text-xs mt-1">
                            ${pkg.perNight}/night per person
                          </p>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2.5">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                isSelected ? 'bg-forest-100' : 'bg-earth-100'
                              }`}>
                                <Check className={`w-2.5 h-2.5 ${
                                  isSelected ? 'text-forest-700' : 'text-forest-400'
                                }`} />
                              </div>
                              <span className="text-forest-600 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Guest Count & Continue */}
              <div className="max-w-xl mx-auto">
                <div className="bg-white p-6 md:p-8 shadow-elegant mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-forest-600" />
                      <span className="text-forest-800 font-medium">Number of Guests</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-8 h-8 rounded-full border border-forest-300 flex items-center justify-center text-forest-600 hover:bg-forest-50 transition-colors"
                      >
                        −
                      </button>
                      <span className="text-forest-900 font-serif text-xl w-6 text-center">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(10, guests + 1))}
                        className="w-8 h-8 rounded-full border border-forest-300 flex items-center justify-center text-forest-600 hover:bg-forest-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="border-t border-earth-200 pt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-forest-600">{selectedPkg?.name} × {guests} {guests === 1 ? 'guest' : 'guests'}</span>
                      <span className="text-forest-800">${totalPrice.toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-forest-600">Taxes & fees</span>
                      <span className="text-forest-500 italic">Calculated at confirmation</span>
                    </div>
                    <div className="border-t border-earth-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-forest-800 font-medium">Estimated Total</span>
                        <span className="font-serif text-2xl text-forest-900">${totalPrice.toLocaleString('en-US')} <span className="text-sm text-forest-500 font-sans">USD</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => setStep(2)}
                  className="btn-premium w-full group text-base"
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue to Details
                    <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white p-6 md:p-10 shadow-elegant">
                    <h2 className="font-serif text-2xl text-forest-900 mb-2">Guest Information</h2>
                    <p className="text-forest-500 text-sm mb-8">
                      Fill in your details below. All fields marked with * are required.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-forest-700 text-xs font-medium tracking-wider uppercase mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="input-premium text-sm"
                            placeholder="Your first name"
                          />
                        </div>
                        <div>
                          <label className="block text-forest-700 text-xs font-medium tracking-wider uppercase mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="input-premium text-sm"
                            placeholder="Your last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-forest-700 text-xs font-medium tracking-wider uppercase mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="input-premium text-sm"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      {/* Phone with Country Code */}
                      <div>
                        <label className="block text-forest-700 text-xs font-medium tracking-wider uppercase mb-2">
                          Phone Number *
                        </label>
                        <div className="flex gap-3">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                              className="flex items-center gap-1.5 px-3 py-4 bg-transparent border-0 border-b border-forest-300 text-forest-800 text-sm hover:border-forest-600 transition-colors min-w-[100px]"
                            >
                              <span>{countryCodes.find(c => c.code === countryCode)?.flag}</span>
                              <span>{countryCode}</span>
                              <ChevronDown className="w-3 h-3 text-forest-400 ml-auto" />
                            </button>
                            <AnimatePresence>
                              {showCountryDropdown && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="absolute top-full left-0 mt-1 w-48 bg-white shadow-premium border border-earth-200 z-20 max-h-60 overflow-y-auto"
                                >
                                  {countryCodes.map((c) => (
                                    <button
                                      key={c.code}
                                      type="button"
                                      onClick={() => {
                                        setCountryCode(c.code);
                                        setShowCountryDropdown(false);
                                      }}
                                      className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left hover:bg-earth-50 transition-colors ${
                                        countryCode === c.code ? 'bg-forest-50 text-forest-800' : 'text-forest-600'
                                      }`}
                                    >
                                      <span>{c.flag}</span>
                                      <span className="font-medium">{c.code}</span>
                                      <span className="text-forest-400 text-xs">{c.country}</span>
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-premium text-sm flex-1"
                            placeholder="Phone number"
                          />
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-forest-700 text-xs font-medium tracking-wider uppercase mb-2">
                            <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                            Preferred Check-in
                          </label>
                          <input
                            type="date"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleChange}
                            className="input-premium text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-forest-700 text-xs font-medium tracking-wider uppercase mb-2">
                            <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                            Preferred Check-out
                          </label>
                          <input
                            type="date"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleChange}
                            className="input-premium text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-forest-700 text-xs font-medium tracking-wider uppercase mb-2">
                          Special Requests or Dietary Requirements
                        </label>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleChange}
                          rows={3}
                          className="input-premium text-sm resize-none"
                          placeholder="Any allergies, dietary preferences, mobility needs, or special occasions..."
                        />
                      </div>

                      {/* ── ID Proof Upload ──────────────────────────────── */}
                      <div>
                        <label className="block text-forest-700 text-xs font-medium tracking-wider uppercase mb-2">
                          <Shield className="w-3.5 h-3.5 inline mr-1.5" />
                          Government ID Proof *
                        </label>

                        {/* ID Type Selector */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {ID_TYPES.map((t) => (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() => setIdType(t.value)}
                              className={`px-3 py-1.5 text-xs font-medium border transition-all duration-300 ${
                                idType === t.value
                                  ? 'bg-forest-700 text-white border-forest-700'
                                  : 'bg-transparent text-forest-600 border-forest-300 hover:border-forest-500'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>

                        {/* Drop Zone / Preview */}
                        <AnimatePresence mode="wait">
                          {!idFile ? (
                            <motion.div
                              key="dropzone"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                              className={`relative flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed
                                cursor-pointer transition-all duration-300 group
                                ${
                                  isDragging
                                    ? 'border-forest-500 bg-forest-50'
                                    : 'border-earth-300 hover:border-forest-400 hover:bg-earth-50'
                                }`}
                            >
                              <UploadCloud className={`w-7 h-7 transition-colors duration-300 ${
                                isDragging ? 'text-forest-600' : 'text-forest-400 group-hover:text-forest-600'
                              }`} />
                              <p className="text-forest-600 text-sm font-medium">
                                {isDragging ? 'Drop your file here' : 'Drag & drop or click to upload'}
                              </p>
                              <p className="text-forest-400 text-xs">
                                JPG, PNG, WebP, PDF · Max 5 MB
                              </p>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                className="hidden"
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="preview"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="flex items-center gap-4 p-4 bg-forest-50 border border-forest-200"
                            >
                              {/* Thumbnail or PDF icon */}
                              <div className="w-14 h-14 shrink-0 overflow-hidden bg-earth-100 flex items-center justify-center">
                                {idPreview === 'pdf' ? (
                                  <FileText className="w-7 h-7 text-forest-500" />
                                ) : (
                                  <img src={idPreview} alt="ID preview" className="w-full h-full object-cover" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-forest-800 text-sm font-medium truncate">{idFile.name}</p>
                                <p className="text-forest-500 text-xs mt-0.5">
                                  {ID_TYPES.find(t => t.value === idType)?.label} · {(idFile.size / 1024).toFixed(0)} KB
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="w-2 h-2 rounded-full bg-green-500" />
                                  <span className="text-green-700 text-xs">Ready to upload</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={removeFile}
                                className="shrink-0 w-8 h-8 flex items-center justify-center text-forest-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                aria-label="Remove file"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <p className="text-forest-400 text-xs mt-2 leading-relaxed">
                          Your ID is encrypted and stored securely. It is only used for identity verification purposes.
                        </p>
                      </div>

                      {/* Trust Signals */}
                      <div className="flex flex-wrap gap-4 text-xs text-forest-500 pt-2">
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Secure booking</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Free cancellation up to 48h</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Secure Payment</span>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          disabled={isSending}
                          className="btn-outline-premium flex-shrink-0"
                        >
                          <span>Back</span>
                        </button>
                        <motion.button
                          type="submit"
                          disabled={isSending}
                          className={`btn-premium flex-1 group ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                          whileHover={{ scale: isMobile || isSending ? 1 : 1.02 }}
                          whileTap={{ scale: isSending ? 1 : 0.98 }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {isSending || isPaying ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isPaying ? 'Processing Payment...' : 'Creating Booking...'}
                              </>
                            ) : (
                              'Confirm & Pay'
                            )}
                          </span>
                        </motion.button>
                      </div>
                      {sendError && (
                        <p className="text-red-500 text-xs text-center mt-3">{sendError}</p>
                      )}
                    </form>
                  </div>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white p-6 md:p-8 shadow-elegant sticky top-28">
                    <h3 className="font-serif text-xl text-forest-800 mb-6">Your Selection</h3>

                    <div className="space-y-4 mb-6 pb-6 border-b border-earth-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center">
                          {selectedPkg && <selectedPkg.icon className="w-5 h-5 text-forest-700" />}
                        </div>
                        <div>
                          <p className="text-forest-800 font-medium text-sm">{selectedPkg?.name}</p>
                          <p className="text-forest-500 text-xs">{selectedPkg?.duration}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm mb-6 pb-6 border-b border-earth-200">
                      <div className="flex justify-between">
                        <span className="text-forest-600">Price per person</span>
                        <span className="text-forest-800">${selectedPkg?.price.toLocaleString('en-US')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Guests</span>
                        <span className="text-forest-800">{guests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Taxes & fees</span>
                        <span className="text-forest-500 italic text-xs">At confirmation</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline mb-6">
                      <span className="text-forest-700 font-medium">Est. Total</span>
                      <div className="text-right">
                        <span className="font-serif text-2xl text-forest-900">
                          ${totalPrice.toLocaleString('en-US')}
                        </span>
                        <span className="text-forest-500 text-xs ml-1">USD</span>
                      </div>
                    </div>

                    <div className="bg-gold-50 p-4 text-xs text-forest-600 leading-relaxed">
                      <p className="font-medium text-forest-700 mb-1">💡 How it works</p>
                      <p>
                        This is a booking request — no payment is required now. Our team will
                        confirm availability and send you a secure payment link within 24 hours.
                      </p>
                    </div>

                    <div className="mt-4 bg-earth-100 p-4 text-xs text-forest-500 leading-relaxed">
                      <p className="font-medium text-forest-600 mb-1">🌍 International Guests</p>
                      <p>
                        All prices are in USD. We accept payments from all countries.
                        Visa assistance available upon request.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BookNow;
