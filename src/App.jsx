import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'
import PageLoader from './components/PageLoader'
import ScrollProgress from './components/ScrollProgress'
import FloatingContact from './components/FloatingContact'
import Hero from './sections/Hero'
import About from './sections/About'
import Experiences from './sections/Experiences'
import RetreatFeatures from './sections/RetreatFeatures'
import Gallery from './sections/Gallery'
import Testimonials from './sections/Testimonials'
import CTA from './sections/CTA'
import Footer from './sections/Footer'
import BookNow from './pages/BookNow'
import Team from './pages/Team'
import Blog from './pages/Blog'
import NotFound from './pages/NotFound'

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Smooth scroll polyfill for Safari
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <PageLoader onComplete={() => setIsLoaded(true)} />

      {isLoaded && <ScrollProgress />}

      <div className={`min-h-screen bg-earth-50 overflow-x-hidden transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <About />
              <Experiences />
              <RetreatFeatures />
              <Gallery />
              <Testimonials />
              <CTA />
            </main>
          } />
          <Route path="/book" element={<BookNow />} />
          <Route path="/team" element={<Team />} />
          <Route path="/stories" element={<Blog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <FloatingContact />
      </div>
    </>
  )
}

export default App
