import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navLinks } from '../data/experiences';
import Magnetic from './Magnetic';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleLogoClick = (e) => {
    // If it's a mobile device, we might want to handle it differently 
    // but the request just says "5 times a row"
    setLogoClickCount(prev => {
      const newCount = prev + 1;
      
      if (newCount === 5) {
        navigate('/admin');
        return 0;
      }
      
      // Reset timer on each click
      if (clickTimer) clearTimeout(clickTimer);
      
      const timer = setTimeout(() => {
        setLogoClickCount(0);
      }, 5000); // 5 seconds window to complete 5 clicks
      
      setClickTimer(timer);
      return newCount;
    });
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (!isHomePage) return;

      // Determine active section
      const sections = navLinks.map((link) => link.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href) => {
    setIsMobileMenuOpen(false);
    if (!isHomePage) {
      // Navigate to home page first, then scroll
      window.location.href = '/' + href;
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHomePage
            ? 'bg-earth-50/95 backdrop-blur-lg shadow-elegant py-2 md:py-3'
            : 'bg-transparent py-3 md:py-5'
        }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between">
            {/* Logo with Image */}
            <Magnetic strength={0.2}>
              <motion.div
                className="flex items-center"
                whileHover={{ scale: isMobile ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/"
                  className="flex items-center gap-2 md:gap-3 group"
                  onClick={handleLogoClick}
                >
                  <img
                    src="/assets/logo.png"
                    alt="Janani Logo"
                    className="w-10 h-10 md:w-12 md:h-12 object-contain"
                  />
                  <div className="flex flex-col leading-tight">
                    <span
                      className={`font-serif text-base md:text-lg tracking-wide transition-colors duration-500 ${
                        isScrolled || !isHomePage ? 'text-forest-900' : 'text-white'
                      }`}
                    >
                      Janani
                    </span>
                    <span
                      className={`text-[10px] md:text-xs tracking-wider uppercase transition-colors duration-500 ${
                        isScrolled || !isHomePage ? 'text-forest-600' : 'text-white/70'
                      }`}
                    >
                      Lifestyle
                    </span>
                  </div>
                </Link>
              </motion.div>
            </Magnetic>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 relative">
              {navLinks.map((link) => {
                const isActive = link.type === 'hash' 
                  ? activeSection === link.href.replace('#', '')
                  : location.pathname === link.href;
                
                if (link.type === 'route') {
                  return (
                    <motion.div key={link.name} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                      <Link
                        to={link.href}
                        className={`relative text-sm font-medium tracking-wider transition-colors duration-300 ${
                          isScrolled || !isHomePage
                            ? isActive ? 'text-forest-800' : 'text-forest-600 hover:text-forest-800'
                            : isActive ? 'text-white' : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {link.name}
                        {isActive && (
                          <motion.div
                            className={`absolute -bottom-1 left-0 right-0 h-px ${
                              isScrolled || !isHomePage ? 'bg-forest-800' : 'bg-white'
                            }`}
                            layoutId="activeNav"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                }

                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className={`relative text-sm font-medium tracking-wider transition-colors duration-300 ${
                      isScrolled || !isHomePage
                        ? isActive ? 'text-forest-800' : 'text-forest-600 hover:text-forest-800'
                        : isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        className={`absolute -bottom-1 left-0 right-0 h-px ${
                          isScrolled || !isHomePage ? 'bg-forest-800' : 'bg-white'
                        }`}
                        layoutId="activeNav"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Magnetic strength={0.3}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/book"
                    className={`inline-block px-6 md:px-8 py-2 md:py-2.5 text-xs md:text-sm font-medium tracking-wider uppercase
                               rounded-full transition-all duration-500 ${
                      isScrolled || !isHomePage
                        ? 'bg-forest-800 text-white hover:bg-forest-700'
                        : 'bg-white/10 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20'
                    }`}
                  >
                    Book Now
                  </Link>
                </motion.div>
              </Magnetic>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6 text-forest-800" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu
                      className={`w-5 h-5 md:w-6 md:h-6 ${
                        isScrolled || !isHomePage ? 'text-forest-800' : 'text-white'
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-forest-950/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 bg-earth-50 lg:hidden"
            >
              <div className="flex flex-col h-full pt-20 md:pt-24 px-6 md:px-8 pb-8">
                <nav className="flex-1">
                  <ul className="space-y-1">
                    {navLinks.map((link, index) => {
                      const isActive = link.type === 'hash' 
                        ? activeSection === link.href.replace('#', '')
                        : location.pathname === link.href;
                      
                      const content = (
                        <span className={`block py-3 md:py-4 font-serif text-2xl md:text-3xl transition-colors ${
                          isActive
                            ? 'text-forest-800'
                            : 'text-forest-600 hover:text-forest-800'
                        }`}>
                          {link.name}
                        </span>
                      );

                      return (
                        <motion.li
                          key={link.name}
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: [0.19, 1, 0.22, 1],
                          }}
                        >
                          {link.type === 'route' ? (
                            <Link to={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                              {content}
                            </Link>
                          ) : (
                            <a
                              href={link.href}
                              onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(link.href);
                              }}
                            >
                              {content}
                            </a>
                          )}
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                <motion.div
                  className="pt-6 md:pt-8 border-t border-forest-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Link
                    to="/book"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full btn-premium rounded-full text-center mb-6"
                  >
                    <span>Book Your Retreat</span>
                  </Link>

                  <div className="text-center">
                    <p className="text-forest-500 text-xs md:text-sm">
                      hello@jananilifestyle.com
                    </p>
                    <p className="text-forest-400 text-xs md:text-sm mt-1">
                      +91 96455 58593
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
