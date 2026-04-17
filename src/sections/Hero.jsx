import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/AnimatedText';
import Magnetic from '../components/Magnetic';

const Hero = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '20%' : '50%']);
  const opacity = useTransform(scrollYProgress, [0, isMobile ? 0.3 : 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, isMobile ? 0.3 : 0.5], [1, 1.1]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-screen min-h-[700px] md:min-h-[900px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        {/* Hero Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/hero/hero.jpg')" }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

        {/* Warm golden tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-earth-950/30 via-transparent to-forest-950/40" />

        {/* Top atmospheric fade */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-earth-100/30 to-transparent" />

        {/* Bottom fade to site bg */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-earth-50/90 to-transparent" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 container-luxury text-center px-4 sm:px-6"
        style={{ opacity }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Janani Logo Image */}
          <motion.div
            className="mb-6 md:mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            <img
              src="/assets/logo.png"
              alt="Janani Lifestyle Logo"
              className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Main Title */}
          <div className="mb-3 md:mb-4 overflow-hidden">
            <motion.h1
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-[0.15em] uppercase leading-none drop-shadow-lg"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
              Janani Lifestyle
            </motion.h1>
          </div>

          {/* Tagline */}
          <FadeIn delay={1} direction="up">
            <p className="font-serif text-white/90 text-base sm:text-lg md:text-xl italic mb-2 leading-relaxed drop-shadow-md">
              A Sanctuary in the Womb of Mother Nature
            </p>
          </FadeIn>

          <FadeIn delay={1.2} direction="up">
            <p className="text-white/70 text-sm sm:text-base md:text-lg font-light mb-8 md:mb-10 tracking-[0.2em] uppercase drop-shadow-md">
              Escape. Heal. Reconnect.
            </p>
          </FadeIn>

          {/* CTA Button - Links to Book Now page */}
          <FadeIn delay={1.4} direction="up">
            <div className="flex items-center justify-center">
              <Magnetic strength={0.3}>
                <motion.div
                  whileHover={{ scale: isMobile ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/book"
                    className="inline-flex items-center justify-center px-10 py-3.5 md:px-12 md:py-4
                             font-medium text-sm tracking-wider uppercase
                             bg-white/10 text-white rounded-full
                             border border-white/30 backdrop-blur-md
                             hover:bg-white/20 hover:border-white/50 hover:shadow-premium
                             transition-all duration-500"
                  >
                    Begin Your Journey
                  </Link>
                </motion.div>
              </Magnetic>
            </div>
          </FadeIn>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-white/50 text-xs tracking-[0.3em] uppercase drop-shadow-md">Scroll</span>
        <motion.button
          onClick={scrollToAbout}
          className="text-white/50 hover:text-white transition-colors p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
      </motion.div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-40 bg-gradient-to-t from-earth-50 to-transparent z-10" />
    </section>
  );
};

export default Hero;
