import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useEffect } from 'react';
import Magnetic from './Magnetic';

const iconMap = {
  Leaf: Icons.Leaf,
  Heart: Icons.Heart,
  Sun: Icons.Sun,
  Mountain: Icons.Mountain,
  Flame: Icons.Flame,
  Droplets: Icons.Droplets,
  Wind: Icons.Wind,
  Moon: Icons.Moon,
  Sparkles: Icons.Sparkles
};

const ExperienceModal = ({ isOpen, onClose, experience }) => {
  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!experience) return null;

  // Resolve icon component
  const getIcon = () => {
    if (typeof experience.icon === 'function') return experience.icon;
    return iconMap[experience.icon] || Icons.Sparkles;
  };
  const Icon = getIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-forest-950/40 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden rounded-[2rem] flex flex-col md:flex-row h-auto max-h-[90vh]"
          >
            {/* Close Button */}
            <div className="absolute top-6 right-6 z-10">
              <Magnetic strength={0.3}>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </Magnetic>
            </div>

            {/* Left: Image (Full height on desktop) */}
            <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                src={experience.image}
                alt={experience.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:hidden" />
            </div>

            {/* Right: Content */}
            <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gold-600" />
                  </div>
                  <span className="text-gold-600 font-medium tracking-[0.2em] uppercase text-[10px] md:text-xs">
                    Experiences
                  </span>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-900 mb-6 leading-tight">
                  {experience.title}
                </h2>

                <div className="divider-gold mb-8 lg:mb-10 w-1/4" />

                <p className="text-forest-700/80 text-sm md:text-base lg:text-lg leading-relaxed mb-8 font-light italic">
                  {experience.longDescription}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Magnetic strength={0.2}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3.5 bg-forest-800 text-white text-xs tracking-widest uppercase rounded-full hover:bg-forest-900 transition-shadow hover:shadow-lg flex items-center gap-2 group"
                    >
                      {experience.cta || 'Book This Experience'}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Magnetic>
                  
                  <button 
                    onClick={onClose}
                    className="text-forest-400 text-xs tracking-widest uppercase hover:text-forest-600 transition-colors"
                  >
                    Return to gallery
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExperienceModal;

