import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center px-4">
      <motion.div
        className="max-w-lg text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* 404 Number */}
        <motion.h1
          className="font-serif text-8xl md:text-9xl text-forest-200 leading-none mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
        >
          404
        </motion.h1>

        <h2 className="font-serif text-2xl md:text-3xl text-forest-900 mb-4">
          Lost in the <span className="italic text-forest-600 font-light">Wilderness</span>
        </h2>

        <p className="text-forest-600/70 text-sm md:text-base mb-8 leading-relaxed">
          The page you're looking for seems to have wandered off the trail.
          Let us guide you back to your wellness journey.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-forest-800 text-white text-sm font-medium tracking-wider rounded-full hover:bg-forest-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-8 py-3 border border-forest-300 text-forest-700 text-sm font-medium tracking-wider rounded-full hover:bg-forest-50 transition-colors"
          >
            Book a Retreat
          </Link>
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-3 text-forest-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-8 h-px bg-forest-200" />
          <span className="text-xs tracking-widest uppercase">Janani Lifestyle</span>
          <div className="w-8 h-px bg-forest-200" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
