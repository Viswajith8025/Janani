import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ExperienceCard from '../components/ExperienceCard';
import { experiences } from '../data/experiences';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/AnimatedText';
import { useEffect, useState } from 'react';
import Magnetic from '../components/Magnetic';
import ExperienceModal from '../components/ExperienceModal';

const Experiences = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedExp, setSelectedExp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (exp) => {
    setSelectedExp(exp);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="experiences" className="section-luxury-sm md:section-luxury bg-earth-100 relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-20 md:h-40 bg-gradient-to-b from-earth-50 to-transparent" />

      {!isMobile && (
        <motion.div
          className="absolute top-40 right-0 w-[600px] h-[600px] bg-gold-100/30 rounded-full blur-[120px]"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />
      )}

      <div className="container-luxury relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 px-4">
          <FadeIn>
            <p className="text-label-gold mb-4 md:mb-6">
              Our Offerings
            </p>
          </FadeIn>

          <div className="overflow-hidden mb-4 md:mb-8">
            <motion.h2
              className="font-serif text-3xl sm:text-4xl md:text-6xl text-forest-900 leading-[1.1]"
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            >
              Discover Your Pathways
              <br className="hidden sm:block" />
              <span className="italic text-forest-600 font-light"> to Serenity</span>
            </motion.h2>
          </div>

          <FadeIn delay={0.4}>
            <div className="divider-gold my-6 md:my-8" />
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="text-forest-600/80 text-sm md:text-lg leading-relaxed px-2">
              From ancient healing arts to immersive nature experiences,
              each offering is designed to guide you toward holistic wellness
              and profound inner transformation.
            </p>
          </FadeIn>
        </div>

        {/* Experiences Grid - 2 columns on mobile, 4 on desktop */}
        <StaggerContainer
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
          staggerDelay={0.08}
          delay={0.3}
        >
          {experiences.map((experience, index) => (
            <StaggerItem key={experience.id}>
              <Magnetic strength={0.15}>
                <ExperienceCard 
                  experience={experience} 
                  index={index} 
                  onClick={() => handleOpenModal(experience)}
                />
              </Magnetic>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom CTA */}
        <FadeIn delay={0.6}>
          <div className="text-center mt-12 md:mt-20 pt-8 md:pt-12 border-t border-forest-200/50 px-4">
            <p className="text-forest-600/70 mb-4 md:mb-6 font-light text-sm md:text-base">
              Explore our complete range of wellness experiences
            </p>
            <Magnetic strength={0.3}>
              <motion.div
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center px-10 py-3 bg-forest-700/80 text-white text-sm tracking-wider rounded-full hover:bg-forest-800 transition-all duration-500"
                >
                  View Full Calendar
                </Link>
              </motion.div>
            </Magnetic>
          </div>
        </FadeIn>
      </div>

      <ExperienceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        experience={selectedExp} 
      />
    </section>
  );
};

export default Experiences;
