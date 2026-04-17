import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import FeatureCard from '../components/FeatureCard';
import { features } from '../data/experiences';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedText';

const RetreatFeatures = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', isMobile ? '10%' : '20%']);

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
      id="retreat"
      className="section-luxury-sm md:section-luxury bg-forest-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Animated Gradient Orbs - Only on desktop */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-forest-700/20 rounded-full blur-[120px]"
            style={{ y }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold-600/10 rounded-full blur-[100px]"
            style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-30%']) }}
          />
        </>
      )}

      <div className="container-luxury relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 px-4">
          <FadeIn>
            <p className="text-label text-gold-400 mb-4 md:mb-6">
              Our Sanctuary
            </p>
          </FadeIn>

          <div className="overflow-hidden mb-4 md:mb-8">
            <motion.h2
              className="font-serif text-3xl sm:text-4xl md:text-6xl text-white leading-[1.1]"
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            >
              Retreat
              <br className="hidden sm:block" />
              <span className="italic text-gold-300 font-light"> Features</span>
            </motion.h2>
          </div>

          <FadeIn delay={0.4}>
            <div className="w-16 h-px bg-gold-gradient mx-auto my-6 md:my-8" />
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="text-white/60 text-sm md:text-lg leading-relaxed">
              Every aspect of Janani is thoughtfully designed to support
              your journey of renewal, from traditional architecture to
              organic cuisine.
            </p>
          </FadeIn>
        </div>

        {/* Features Grid - 2 columns on mobile */}
        <StaggerContainer
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-16 md:mb-24"
          staggerDelay={0.1}
          delay={0.3}
        >
          {features.map((feature, index) => (
            <StaggerItem key={feature.id}>
              <FeatureCard feature={feature} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Featured Image Section */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center px-4 md:px-0">
          <FadeIn direction="left">
            <div className="relative">
              {/* Frame */}
              <div className="absolute -inset-2 md:-inset-4 border border-white/10" />

              <div className="relative aspect-video overflow-hidden bg-forest-800"
              >
                <img
                  src="/assets/hero/hero.jpg"
                  alt="Yoga Shala at Janani Lifestyle"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
              </div>

              {/* Floating Stats Card */}
              <motion.div
                className="absolute -bottom-3 -right-2 md:-bottom-6 md:-right-6 lg:right-8 bg-white p-3 md:p-6 shadow-premium"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                <div className="flex items-center gap-3 md:gap-6"
                >
                  {[
                    { number: '25', label: 'Acres' },
                    { number: '12', label: 'Mud Houses' },
                    { number: '∞', label: 'Nature' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center"
                    >
                      <p className="font-serif text-lg md:text-2xl text-forest-800"
                      >{stat.number}</p>
                      <p className="text-forest-500 text-[10px] md:text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <div className="space-y-4 md:space-y-6">
              <p className="text-label text-gold-400">The Experience</p>

              <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white leading-tight">
                Where Ancient Wisdom
                <br className="hidden sm:block" />
                <span className="italic text-gold-300 font-light">Meets Modern Comfort</span>
              </h3>

              <div className="space-y-3 md:space-y-4 pt-2 md:pt-4"
              >
                {[
                  {
                    title: 'Traditional Architecture',
                    description:
                      'Our mud houses are built using ancient techniques, naturally cool in summer and warm in winter.',
                  },
                  {
                    title: 'Organic Gardens',
                    description:
                      'Farm-to-table dining with ingredients harvested daily from our permaculture gardens.',
                  },
                  {
                    title: 'Sacred Spaces',
                    description:
                      'Dedicated areas for meditation, yoga, and spiritual practice, designed in harmony with nature.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-4 md:p-6 border border-white/10 hover:border-gold-500/30 hover:bg-white/5 transition-all duration-500 group"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + index * 0.1,
                      ease: [0.19, 1, 0.22, 1],
                    }}
                  >
                    <div className="flex items-start gap-3 md:gap-4"
                    >
                      <span className="text-gold-500 text-xs md:text-sm font-medium shrink-0"
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4 className="font-serif text-base md:text-lg text-gold-200 mb-1 md:mb-2 group-hover:text-gold-300 transition-colors"
                        >
                          {item.title}
                        </h4>
                        <p className="text-white/50 text-xs md:text-sm leading-relaxed"
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default RetreatFeatures;
