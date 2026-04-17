import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, ArrowUp, Send } from 'lucide-react';
import { FadeIn } from '../components/AnimatedText';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href) => {
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }
    const sectionId = href.replace('#', '');
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerLinks = {
    explore: [
      { name: 'Our Story', href: '#about' },
      { name: 'Experiences', href: '#experiences' },
      { name: 'Accommodations', href: '#retreat' },
      { name: 'Gallery', href: '#gallery' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Book Now', href: '/book' },
    ],
    wellness: [
      { name: 'Ayurveda', href: '#experiences' },
      { name: 'Yoga & Meditation', href: '#experiences' },
      { name: 'Kalarippayattu', href: '#experiences' },
      { name: 'Sound Healing', href: '#experiences' },
      { name: 'Nature Therapy', href: '#experiences' },
      { name: 'Detox Programs', href: '#experiences' },
    ],
  };

  return (
    <footer className="bg-forest-950 text-white relative overflow-hidden"
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

      <div className="container-luxury relative z-10"
      >
        {/* Main Footer Content */}
        <div className="py-12 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8"
        >
          {/* Brand Column - Full width on mobile */}
          <FadeIn className="col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6"
            >
              <img
                src="/assets/logo.png"
                alt="Janani Logo"
                className="w-12 h-12 md:w-14 md:h-14 object-contain"
              />
              <span className="font-serif text-xl md:text-2xl tracking-wide">Janani</span>
            </div>

            <p className="text-white/50 text-xs md:text-sm leading-relaxed mb-6 max-w-xs"
            >
              A luxury wellness retreat in Wayanad, offering transformative
              experiences rooted in Ayurveda, Yoga, and ancient Indian traditions.
            </p>

            {/* Social Links */}
            <div className="flex gap-2 md:gap-3"
            >
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Youtube, label: 'YouTube' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center
                           hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
                </motion.a>
              ))}
            </div>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn delay={0.1}>
            <h4 className="font-serif text-base md:text-lg mb-4 md:mb-6 text-gold-300">Explore</h4>
            <ul className="space-y-2 md:space-y-3"
            >
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-white/50 hover:text-white text-xs md:text-sm transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Wellness */}
          <FadeIn delay={0.2}>
            <h4 className="font-serif text-base md:text-lg mb-4 md:mb-6 text-gold-300">Wellness</h4>
            <ul className="space-y-2 md:space-y-3"
            >
              {footerLinks.wellness.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-white/50 hover:text-white text-xs md:text-sm transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Newsletter - Full width on mobile */}
          <FadeIn delay={0.3} className="col-span-2 md:col-span-1"
          >
            <h4 className="font-serif text-base md:text-lg mb-4 md:mb-6 text-gold-300">Stay Connected</h4>
            <p className="text-white/50 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed"
            >
              Subscribe for retreat updates, wellness tips, and exclusive offers.
            </p>

            <form className="space-y-2 md:space-y-3" onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 md:py-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30
                           focus:outline-none focus:border-gold-500/50 transition-colors text-sm pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gold-500/20 flex items-center justify-center
                           hover:bg-gold-500/30 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 md:w-4 md:h-4 text-gold-400" />
                </button>
              </div>
            </form>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10"
            >
              <p className="text-white/30 text-xs mb-1 md:mb-2">Contact</p>
              <p className="text-white/60 text-xs md:text-sm">livein@jananilifestyle.in</p>
              <p className="text-white/60 text-xs md:text-sm">+91 96455 58593</p>
            </div>
          </FadeIn>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="py-6 md:py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-white/30 text-xs md:text-sm text-center md:text-left"
          >
            © {currentYear} Janani Lifestyle. All rights reserved.
          </p>

          <div className="flex items-center gap-4 md:gap-8"
          >
            <a
              href="#"
              className="text-white/30 hover:text-white text-xs md:text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/30 hover:text-white text-xs md:text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>

          {/* Back to Top */}
          <motion.button
            onClick={scrollToTop}
            className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/10 flex items-center justify-center
                     hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            aria-label="Back to top"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-white/50 group-hover:text-white transition-colors" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
