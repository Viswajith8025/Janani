import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const PageLoader = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            onComplete?.();
          }, 600);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-forest-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Background ambient glow */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-forest-800/40 blur-[60px] md:blur-[100px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-gold-600/20 blur-[50px] md:blur-[80px]"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Mark */}
            <motion.div
              className="relative mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="absolute -inset-2 bg-gold-500/10 rounded-full blur-xl" />
              <img
                src="/assets/logo.png"
                alt="Janani Lifestyle"
                className="relative w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-lg"
              />
            </motion.div>

            {/* Brand Name */}
            <motion.div
              className="overflow-hidden mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.h1
                className="font-serif text-3xl md:text-4xl text-white tracking-wider"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
              >
                Janani
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-gold-400/80 text-xs tracking-[0.4em] uppercase mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              Lifestyle
            </motion.p>

            {/* Progress Bar */}
            <div className="w-48 h-px bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold-500 to-gold-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <motion.p
              className="text-white/30 text-[10px] tracking-[0.3em] uppercase mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Loading experience
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
