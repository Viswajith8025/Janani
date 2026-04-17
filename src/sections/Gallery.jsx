import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { galleryImages } from '../data/testimonials';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedText';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedIndex]);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, goNext, goPrev, closeLightbox]);

  const selectedImage = selectedIndex !== null ? galleryImages[selectedIndex] : null;

  return (
    <section
      id="gallery"
      className="section-luxury-sm md:section-luxury bg-forest-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-luxury relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
          <FadeIn>
            <p className="text-label text-gold-400 mb-4 md:mb-6">Visual Journey</p>
          </FadeIn>

          <div className="overflow-hidden mb-4 md:mb-8">
            <motion.h2
              className="font-serif text-3xl sm:text-4xl md:text-6xl text-white leading-[1.1]"
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            >
              A Glimpse of
              <br className="hidden sm:block" />
              <span className="italic text-gold-300 font-light"> Paradise</span>
            </motion.h2>
          </div>

          <FadeIn delay={0.4}>
            <div className="w-16 h-px bg-gold-gradient mx-auto my-6 md:my-8" />
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="text-white/60 text-sm md:text-lg leading-relaxed">
              Explore the beauty of our sanctuary through moments captured
              across seasons and celebrations.
            </p>
          </FadeIn>
        </div>

        {/* Masonry Grid */}
        <StaggerContainer
          className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 auto-rows-[180px] md:auto-rows-[240px]"
          staggerDelay={0.08}
          delay={0.3}
        >
          {galleryImages.map((image, index) => (
            <StaggerItem
              key={image.id}
              className={isMobile ? '' : image.span}
            >
              <motion.div
                className="relative w-full h-full overflow-hidden cursor-pointer group"
                whileHover={!isMobile ? { scale: 1.02 } : {}}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/40 transition-all duration-500 flex items-center justify-center">
                  <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-12 h-12 border border-white/50 flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                </div>

                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-forest-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-xs md:text-sm font-light">{image.alt}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Enhanced Lightbox with Prev/Next */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-forest-950/95 backdrop-blur-lg flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              onClick={closeLightbox}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-wider z-10">
              {selectedIndex + 1} / {galleryImages.length}
            </div>

            {/* Previous Button */}
            <motion.button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </motion.button>

            {/* Next Button */}
            <motion.button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage.id}
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-[80vw] max-h-[80vh] object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Caption */}
            <motion.p
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {selectedImage.alt}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
