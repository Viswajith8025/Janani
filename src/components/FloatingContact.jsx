import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          {/* Expanded Options */}
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.a
                  href="https://wa.me/919645558593?text=Hello!%20I'm%20interested%20in%20booking%20a%20retreat%20at%20Janani%20Lifestyle."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white px-5 py-3 shadow-premium hover:shadow-elevated transition-shadow group"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="w-10 h-10 bg-green-500 flex items-center justify-center rounded-full">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-forest-800 text-sm font-medium">WhatsApp</p>
                    <p className="text-forest-500 text-xs">Chat with us</p>
                  </div>
                </motion.a>

                <motion.a
                  href="tel:+919645558593"
                  className="flex items-center gap-3 bg-white px-5 py-3 shadow-premium hover:shadow-elevated transition-shadow group"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-10 h-10 bg-forest-600 flex items-center justify-center rounded-full">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-forest-800 text-sm font-medium">Call Us</p>
                    <p className="text-forest-500 text-xs">+91 96455 58593</p>
                  </div>
                </motion.a>
              </>
            )}
          </AnimatePresence>

          {/* Main FAB */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-14 h-14 flex items-center justify-center rounded-full shadow-premium transition-all duration-500 ${isOpen
              ? 'bg-forest-800 rotate-0'
              : 'bg-gradient-to-br from-green-500 to-green-600'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Contact us"
          >
            {/* Pulse Ring */}
            {!isOpen && (
              <motion.div
                className="absolute inset-0 rounded-full bg-green-500/40"
                animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingContact;
