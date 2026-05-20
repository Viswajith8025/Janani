import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials as staticTestimonials } from '../data/testimonials';
import { FadeIn } from '../components/AnimatedText';
import { apiFetch } from '../config/api';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [testimonials, setTestimonials] = useState(staticTestimonials);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const fetchTestimonials = async () => {
      try {
        const res = await apiFetch('/testimonials');
        if (res.data && res.data.length > 0) {
          setTestimonials(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials, using fallback data', err);
      }
    };
    fetchTestimonials();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const paginate = useCallback((newDirection) => {
    if (testimonials.length === 0) return;
    setDirection(newDirection);
    setCurrent((prev) => {
      if (newDirection === 1) return (prev + 1) % testimonials.length;
      return (prev - 1 + testimonials.length) % testimonials.length;
    });
  }, [testimonials.length]);

  // Auto-advance
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => paginate(1), 6000);
    return () => clearInterval(interval);
  }, [paginate, testimonials.length]);

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 200 : -200,
      opacity: 0,
    }),
  };

  const testimonial = testimonials[current];

  if (!testimonial) return null;

  return (
    <section
      id="testimonials"
      className="section-luxury-sm md:section-luxury bg-earth-50 relative overflow-hidden"
    >
      {/* Background Decorations */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-20 left-10 w-[400px] h-[400px] bg-gold-100/40 rounded-full blur-[120px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-forest-100/40 rounded-full blur-[100px]"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="container-luxury relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
          <FadeIn>
            <p className="text-label-gold mb-4 md:mb-6">Guest Voices</p>
          </FadeIn>

          <div className="overflow-hidden mb-4 md:mb-8">
            <motion.h2
              className="font-serif text-3xl sm:text-4xl md:text-6xl text-forest-900 leading-[1.1]"
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            >
              Stories of
              <br className="hidden sm:block" />
              <span className="italic text-forest-600 font-light"> Transformation</span>
            </motion.h2>
          </div>

          <FadeIn delay={0.4}>
            <div className="divider-gold my-6 md:my-8" />
          </FadeIn>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto px-4">
          <FadeIn>
            <div className="relative bg-white p-8 sm:p-12 md:p-16 shadow-premium min-h-[320px] md:min-h-[360px]">
              {/* Decorative Quote */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8">
                <Quote className="w-8 h-8 md:w-12 md:h-12 text-gold-200" />
              </div>

              {/* Corner Lines */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4 w-6 md:w-8 h-px bg-gold-300" />
              <div className="absolute top-3 right-3 md:top-4 md:right-4 w-px h-6 md:h-8 bg-gold-300" />
              <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-6 md:w-8 h-px bg-gold-300" />
              <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 w-px h-6 md:h-8 bg-gold-300" />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className="text-center pt-8 md:pt-4"
                >
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-gold-400 text-gold-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-serif text-base sm:text-lg md:text-xl text-forest-800 leading-relaxed mb-8 max-w-2xl mx-auto italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                      <span className="font-serif text-forest-700 text-sm font-medium">
                        {testimonial.initials || testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-forest-800 text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-forest-500 text-xs">
                        {testimonial.location} · {testimonial.stay}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={() => paginate(-1)}
                    className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center
                             hover:bg-forest-50 transition-colors rounded-full"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5 text-forest-400" />
                  </button>
                  <button
                    onClick={() => paginate(1)}
                    className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center
                             hover:bg-forest-50 transition-colors rounded-full"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5 text-forest-400" />
                  </button>
                </>
              )}
            </div>
          </FadeIn>

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === current
                      ? 'w-8 bg-gold-500'
                      : 'w-1.5 bg-forest-200 hover:bg-forest-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
