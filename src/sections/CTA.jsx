import { motion } from 'framer-motion';
import { FadeIn, ScaleIn } from '../components/AnimatedText';
import { Check, ArrowRight, Send, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiFetch } from '../config/api';
import Magnetic from '../components/Magnetic';

const CTA = () => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dates: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendError('');

    try {
      await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name:           formData.name,
          email:          formData.email,
          phone:          formData.phone || undefined,
          preferredDates: formData.dates  || undefined,
          message:        formData.message,
          subject:        'general',
          source:         'website',
        }),
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', dates: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch (err) {
      setSendError(
        err.message || 'Something went wrong. Please try again or contact us via WhatsApp.'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="section-luxury-sm md:section-luxury bg-earth-100 relative overflow-hidden px-4"
    >
      {/* Background Decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] opacity-50 md:opacity-100"
      >
        <div className="absolute inset-0 bg-gradient-radial from-gold-200/40 via-gold-100/20 to-transparent blur-3xl" />
      </div>

      {!isMobile && (
        <>
          <motion.div
            className="absolute top-20 left-20 w-2 h-2 bg-gold-400 rounded-full"
            animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-40 right-32 w-1.5 h-1.5 bg-forest-400 rounded-full"
            animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}

      <div className="container-luxury relative z-10">
        <div className="max-w-5xl mx-auto">
          <ScaleIn>
            <div className="relative bg-white p-6 sm:p-10 md:p-16 shadow-premium"
            >
              {/* Decorative Corner Lines */}
              <div className="absolute top-3 left-3 md:top-4 md:left-4 w-6 md:w-8 h-px bg-gold-300" />
              <div className="absolute top-3 left-3 md:top-4 md:left-4 w-px h-6 md:h-8 bg-gold-300" />
              <div className="absolute top-3 right-3 md:top-4 md:right-4 w-6 md:w-8 h-px bg-gold-300" />
              <div className="absolute top-3 right-3 md:top-4 md:right-4 w-px h-6 md:h-8 bg-gold-300" />
              <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-6 md:w-8 h-px bg-gold-300" />
              <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-px h-6 md:h-8 bg-gold-300" />
              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-6 md:w-8 h-px bg-gold-300" />
              <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-px h-6 md:h-8 bg-gold-300" />

              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Left Side: Text */}
                <div className="text-center lg:text-left">
                  <FadeIn delay={0.2}>
                    <p className="text-label-gold mb-4 md:mb-6">
                      Begin Your Journey
                    </p>
                  </FadeIn>

                  <div className="overflow-hidden mb-4 md:mb-8">
                    <motion.h2
                      className="font-serif text-3xl sm:text-4xl md:text-5xl text-forest-900 leading-[1.1]"
                      initial={{ y: '100%' }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
                    >
                      Ready to
                      <br className="hidden sm:block" />
                      <span className="italic text-forest-600 font-light"> Transform</span>?
                    </motion.h2>
                  </div>

                  <FadeIn delay={0.5}>
                    <div className="divider-gold lg:mx-0 my-6 md:my-8" />
                  </FadeIn>

                  <FadeIn delay={0.6}>
                    <p className="text-forest-600/80 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                      Step away from the noise of everyday life and reconnect with
                      your true essence. Your journey to wellness begins with a single
                      step into nature&#39;s embrace.
                    </p>
                  </FadeIn>

                  {/* Trust Indicators */}
                  <FadeIn delay={0.8}>
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-forest-600/70 text-xs md:text-sm">
                      {[
                        'No booking fees',
                        'Free cancellation',
                        'Personalized attention',
                      ].map((text, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gold-200 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-gold-700" />
                          </div>
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </FadeIn>
                </div>

                {/* Right Side: Booking Form */}
                <FadeIn delay={0.4} direction="right">
                  <div className="relative">
                    {isSubmitted ? (
                      <motion.div
                        className="flex flex-col items-center justify-center py-16 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mb-6">
                          <Check className="w-8 h-8 text-forest-600" />
                        </div>
                        <h3 className="font-serif text-2xl text-forest-800 mb-2">Thank You!</h3>
                        <p className="text-forest-600/70 text-sm">
                          We&#39;ll get back to you within 24 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-premium text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-premium text-sm"
                          />
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-premium text-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="dates"
                            placeholder="Preferred Dates (e.g., Dec 15-22)"
                            value={formData.dates}
                            onChange={handleChange}
                            className="input-premium text-sm"
                          />
                        </div>
                        <div>
                          <textarea
                            name="message"
                            placeholder="Tell us about your wellness goals..."
                            value={formData.message}
                            onChange={handleChange}
                            rows={3}
                            className="input-premium text-sm resize-none"
                          />
                        </div>
                        <Magnetic strength={0.2}>
                          <motion.button
                            type="submit"
                            disabled={isSending}
                            className={`btn-premium group w-full text-sm md:text-base ${isSending ? 'opacity-70 cursor-not-allowed' : ''}`}
                            whileHover={{ scale: isMobile || isSending ? 1 : 1.02 }}
                            whileTap={{ scale: isSending ? 1 : 0.98 }}
                          >
                            <span className="flex items-center justify-center gap-2">
                              {isSending ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  Book Your Retreat
                                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                              )}
                            </span>
                          </motion.button>
                        </Magnetic>
                        {sendError && (
                          <p className="text-red-500 text-xs text-center mt-3">{sendError}</p>
                        )}
                      </form>
                    )}
                  </div>
                </FadeIn>
              </div>
            </div>
          </ScaleIn>
        </div>
      </div>
    </section>
  );
};

export default CTA;
