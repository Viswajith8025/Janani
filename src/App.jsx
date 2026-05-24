import { useEffect, useState, useCallback } from 'react';
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
import Shop from './pages/Shop'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => { document.documentElement.style.scrollBehavior = 'auto'; };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Admin pages — skip page loader, navbar, footer
  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    );
  }

  return (
    <>
      <PageLoader onComplete={handleLoadComplete} />
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
          <Route path="/shop" element={<Shop />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <FloatingContact />
      </div>
    </>
  )
}

export default App
