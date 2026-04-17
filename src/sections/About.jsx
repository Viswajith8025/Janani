import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { FadeIn, ScaleIn } from '../components/AnimatedText';

const About = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const decorativeY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      ref={containerRef}
      id="about"
      className="section-luxury-sm md:section-luxury bg-earth-50 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold-100/50 blur-3xl"
            style={{ y: decorativeY }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-forest-100/50 blur-3xl"
            style={{ y: useTransform(scrollYProgress, [0, 1], ['20%', '-20%']) }}
          />
        </>
      )}

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <ScaleIn delay={0.2}>
              <div className="relative">
                {/* Frame - Hidden on mobile */}
                {!isMobile && (
                  <>
                    <div className="absolute -inset-4 border border-forest-800/10" />
                    <div className="absolute -inset-8 border border-forest-800/5" />
                  </>
                )}

                {/* Main Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-forest-100"
                >
                  {!isMobile ? (
                    <motion.div
                      className="absolute inset-0"
                      style={{ y: imageY }}
                    >
                      <img
                        src="/assets/about/about.jpg"
                        alt="Aerial view of Janani Lifestyle retreat in Wayanad"
                        className="w-full h-[110%] object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  ) : (
                    <img
                      src="/assets/about/retreat.png"
                      alt="Aerial view of Janani Lifestyle retreat in Wayanad"
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/20 to-transparent" />
                </div>

                {/* Floating Card */}
                <motion.div
                  className="absolute -bottom-4 -right-2 md:-bottom-8 md:-right-8 bg-white p-4 md:p-6 shadow-premium"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
                >
                  <div className="flex items-center gap-3 md:gap-4"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-forest-100 flex items-center justify-center"
                    >
                      <span className="text-xl md:text-2xl">⛰️</span>
                    </div>
                    <div>
                      <p className="font-serif text-forest-800 text-base md:text-lg">Wayanad</p>
                      <p className="text-forest-500 text-xs md:text-sm">Kerala, India</p>
                    </div>
                  </div>
                  <div className="hidden md:block mt-4 pt-4 border-t border-forest-100"
                  >
                    <p className="text-forest-600/70 text-xs leading-relaxed"
                    >
                      Nestled in the Western Ghats, a UNESCO World Heritage Site
                    </p>
                  </div>
                </motion.div>

                {/* Year Badge */}
                <motion.div
                  className="absolute top-4 -left-2 md:top-8 md:-left-8 bg-forest-800 text-white px-4 py-3 md:px-6 md:py-4"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                >
                  <p className="font-serif text-2xl md:text-3xl">15+</p>
                  <p className="text-white/70 text-[10px] md:text-xs tracking-wider uppercase">Years</p>
                </motion.div>
              </div>
            </ScaleIn>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 px-1">
            <FadeIn delay={0.2} direction="right">
              <p className="text-label-gold mb-4 md:mb-6">Our Story</p>
            </FadeIn>

            <div className="overflow-hidden mb-4 md:mb-6">
              <motion.h2
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-forest-900 leading-[1.1]"
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              >
                Born From The
                <br className="hidden sm:block" />
                <span className="italic text-forest-600 font-light"> Spirit of Earth</span>
              </motion.h2>
            </div>

            <FadeIn delay={0.5} direction="up">
              <div className="divider-gold my-6 md:my-8" />
            </FadeIn>

            <FadeIn delay={0.6} direction="up">
              <div className="space-y-4 md:space-y-6 text-forest-700/80 text-sm md:text-base leading-relaxed"
              >
                <p>
                  In the serene hills of Wayanad, <span className="font-serif text-forest-900 text-base md:text-lg">Janani</span>—meaning
                  &ldquo;Mother&rdquo; in Sanskrit—was born from the spirit of
                  Earth herself. Here, in the warm embrace of nature,
                  find peace, healing, and a refuge for the soul
                  seeking to reconnect with its natural essence.
                </p>

                <p>
                  Our traditional mud houses, built using ancestral techniques passed
                  down through generations, offer an authentic connection to the earth
                  while providing the comfort of modern amenities.
                </p>

                <p className="hidden md:block">
                  Drawing from the timeless traditions of{' '}
                  <span className="text-forest-900 font-medium">Ayurveda</span>,{' '}
                  <span className="text-forest-900 font-medium">Yoga</span>, and{' '}
                  <span className="text-forest-900 font-medium">Kalarippayattu</span>,
                  we offer transformative experiences that nurture body, mind, and
                  spirit in perfect harmony.
                </p>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.8} direction="up">
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-forest-200"
              >
                <div className="grid grid-cols-3 gap-4 md:gap-8"
                >
                  {[
                    { number: '15+', label: 'Years', sublabel: 'Experience' },
                    { number: '50+', label: 'Retreats', sublabel: 'Hosted' },
                    { number: '2k+', label: 'Guests', sublabel: 'Transformed' },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: 0.9 + index * 0.1,
                        ease: [0.19, 1, 0.22, 1],
                      }}
                    >
                      <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-forest-800"
                      >
                        {stat.number}
                      </p>
                      <p className="text-forest-600 text-xs md:text-sm font-medium"
                      >{stat.label}</p>
                      <p className="text-forest-400 text-[10px] md:text-xs mt-0.5">{stat.sublabel}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
