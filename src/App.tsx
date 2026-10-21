import { MotionConfig } from 'framer-motion';
import { DemoBanner } from './components/layout/DemoBanner';
import { FloatingActions } from './components/layout/FloatingActions';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { TopBar } from './components/layout/TopBar';
import { About } from './components/sections/About';
import { Blog } from './components/sections/Blog';
import { Contact } from './components/sections/Contact';
import { Departments } from './components/sections/Departments';
import { Doctors } from './components/sections/Doctors';
import { Features } from './components/sections/Features';
import { Hero } from './components/sections/Hero';
import { Insurance } from './components/sections/Insurance';
import { AppointmentProvider } from './context/AppointmentContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    // "Hareketi azalt" tercihi olan kullanıcılarda dönüşüm animasyonları otomatik kapatılır.
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <AppointmentProvider>
          <DemoBanner />
          <TopBar />
          <Navbar />
          <main>
            <Hero />
            <Features />
            <Departments />
            <Doctors />
            <About />
            <Insurance />
            <Blog />
            <Contact />
          </main>
          <Footer />
          <FloatingActions />
        </AppointmentProvider>
      </ToastProvider>
    </MotionConfig>
  );
}
