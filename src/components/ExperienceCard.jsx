import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FadeIn } from './AnimatedText';

const ExperienceCard = ({ experience, index, onClick }) => {
  const Icon = experience.icon;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <FadeIn delay={index * 0.08} direction="up">
      <motion.div
        className="group relative bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-premium cursor-pointer transition-shadow duration-500"
        whileHover={!isMobile ? { y: -6 } : {}}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        onClick={onClick}
      >
        {/* Image Container - Rounded top */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
          {experience.image ? (
            <img
              src={experience.image}
              alt={experience.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : null}
          {/* Fallback gradient behind image */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-200 to-earth-200 flex items-center justify-center">
            <Icon className="w-10 h-10 text-forest-400/40" />
          </div>

          {/* Subtle gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
        </div>

        {/* Content - Below image */}
        <div className="p-4 md:p-5 text-center">
          <h3 className="font-serif text-base md:text-lg text-forest-800 mb-1 group-hover:text-forest-600 transition-colors">
            {experience.title}
          </h3>

          <p className="text-forest-500/70 text-xs md:text-sm leading-relaxed mb-3">
            {experience.description}
          </p>

          {/* CTA Button - Rounded pill */}
          <motion.button
            className="inline-flex items-center gap-1.5 px-5 py-1.5 bg-forest-700/80 text-white text-xs tracking-wider
                     rounded-full hover:bg-forest-800 transition-colors duration-300"
            whileTap={{ scale: 0.95 }}
          >
            {experience.cta || 'Discover'} <span className="text-[10px]">›</span>
          </motion.button>
        </div>
      </motion.div>
    </FadeIn>
  );
};

export default ExperienceCard;
