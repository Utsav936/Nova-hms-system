import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useInView, useTransform } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MagneticButton from '../components/common/MagneticButton';
import { Shield, Zap, Heart, Activity, Search, Users } from 'lucide-react';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

export default function Landing() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Mouse tracking for parallax mesh background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 25;
    const moveY = (clientY - window.innerHeight / 2) / 25;
    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  // Parallax transforms (Top level hooks)
  const x2 = useTransform(smoothMouseX, (v) => v * -1.2);
  const y2 = useTransform(smoothMouseY, (v) => v * -1.2);
  const x3 = useTransform(smoothMouseX, (v) => v * 0.8);
  const y3 = useTransform(smoothMouseY, (v) => v * -0.5);
  
  // Determine if auth should be open based on route
  const [isAuthOpen, setIsAuthOpen] = useState(
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/forgot-password'
  );
  
  // Track which auth view to show internally, derived from URL
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (location.pathname === '/register') setAuthView('register');
    else if (location.pathname === '/forgot-password') setAuthView('forgot');
    else setAuthView('login');

    if (['/login', '/register', '/forgot-password'].includes(location.pathname)) {
      setIsAuthOpen(true);
    }
  }, [location.pathname]);

  const handleGetStarted = () => {
    setIsAuthOpen(true);
    navigate('/login');
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
    navigate('/');
  };

  return (
    <div className="landing-container" onMouseMove={handleMouseMove}>
      {/* Dynamic Mesh Gradient Background with Parallax */}
      <div className="mesh-bg">
        <motion.div 
          className="mesh-blob blob-1" 
          style={{ x: smoothMouseX, y: smoothMouseY }}
        ></motion.div>
        <motion.div 
          className="mesh-blob blob-2"
          style={{ x: x2, y: y2 }}
        ></motion.div>
        <motion.div 
          className="mesh-blob blob-3"
          style={{ x: x3, y: y3 }}
        ></motion.div>
        <div className="mesh-noise"></div>
      </div>

      {/* Main Layout Area */}
      <main className="landing-content">
        
        {/* Navigation / Header */}
        <header className="landing-header">
          <motion.div 
            className="brand"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Nova<span className="text-accent">HMS</span>
          </motion.div>
          {!isAuthOpen && (
            <motion.button 
              className="btn-ghost"
              onClick={handleGetStarted}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Sign In
            </motion.button>
          )}
        </header>

        {/* AnimatePresence handles the hero exit and auth enter */}
        <div className="center-wrapper">
          <AnimatePresence mode="wait">
            {!isAuthOpen ? (
              <motion.div 
                key="hero"
                className="hero-section"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.4 } }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="hero-badge">Next Generation Healthcare</div>
                <h1 className="hero-title">
                  Immersive Management.<br/>
                  <span className="text-gradient">Fluid Experiences.</span>
                </h1>
                <p className="hero-subtitle">
                  Nova HMS brings your hospital data to life through secure, responsive, and incredibly fast workflows.
                </p>
                <MagneticButton onClick={handleGetStarted}>
                  Get Started Now
                </MagneticButton>
              </motion.div>
            ) : (
              <motion.div 
                key="auth"
                className="auth-portal glassmorphism"
                layoutId="auth-container"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <button className="auth-close" onClick={handleCloseAuth} aria-label="Close">
                  &times;
                </button>
                <div className="auth-inner-content">
                  {authView === 'login' && <Login />}
                  {authView === 'register' && <Register />}
                  {authView === 'forgot' && <ForgotPassword />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll-Reveal Features Section */}
        {!isAuthOpen && <FeaturesSection />}
      </main>

      <style>{`
        .landing-container {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          overflow-x: hidden;
          overflow-y: auto;
          background-color: #030014;
          color: white;
          font-family: var(--font-sans);
        }
        
        .landing-container::-webkit-scrollbar {
          width: 8px;
        }
        .landing-container::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        .landing-container::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .landing-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }

        /* Ambient Mesh Background */
        .mesh-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .mesh-blob {
          position: absolute;
          filter: blur(80px);
          border-radius: 50%;
          opacity: 0.6;
          animation: float 20s infinite ease-in-out alternate;
        }

        .blob-1 {
          top: -10%; left: -10%;
          width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%);
          animation-delay: 0s;
        }

        .blob-2 {
          bottom: -20%; right: -10%;
          width: 60vw; height: 60vw;
          background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%);
          animation-delay: -5s;
        }

        .blob-3 {
          top: 30%; left: 40%;
          width: 40vw; height: 40vw;
          background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
          animation-delay: -10s;
        }

        .mesh-noise {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 10%) scale(1.1); }
          66% { transform: translate(-5%, -5%) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .landing-content {
          position: relative;
          z-index: 10;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 4rem;
        }

        .brand {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .btn-ghost {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1.5rem;
          border-radius: 999px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.2s;
        }
        .btn-ghost:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .center-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .hero-section {
          text-align: center;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: #818cf8;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 2rem;
          letter-spacing: 0.5px;
        }

        .hero-title {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 1.5rem;
        }

        .text-gradient {
          background: linear-gradient(to right, #818cf8, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #9ca3af;
          max-width: 600px;
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .cta-button {
          position: relative;
          background: white;
          color: #030014;
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 999px;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s;
        }

        .glow-effect {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          transform: translateX(-100%);
          animation: shimmer 2.5s infinite;
        }

        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        /* Glassmorphism Auth Portal */
        .glassmorphism {
          background: rgba(20, 20, 35, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        .auth-portal {
          position: relative;
          width: 100%;
          max-width: 480px;
          padding: 3rem;
          overflow: hidden;
        }

        /* Shimmer border glow */
        .auth-portal::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .auth-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 20;
        }
        .auth-close:hover {
          background: rgba(255,255,255,0.15);
        }

        .auth-inner-content {
          position: relative;
          z-index: 10;
          color: white;
        }

        /* Visibility Fixes for Auth Components in Glass Mode */
        .auth-inner-content .login-page,
        .auth-inner-content .register-page,
        .auth-inner-content .forgot-password-page {
          background: transparent !important;
          min-height: auto !important;
          padding: 0 !important;
        }

        .auth-inner-content h2, 
        .auth-inner-content h1,
        .auth-inner-content .auth-header h2 {
          color: white !important;
        }

        .auth-inner-content p,
        .auth-inner-content .auth-header p,
        .auth-inner-content .input-label {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .auth-inner-content .input-field {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }

        .auth-inner-content .input-field:focus {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2) !important;
        }

        .auth-inner-content .input-field::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .auth-inner-content .input-icon {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        .auth-inner-content .btn-primary {
          background: #10b981 !important;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4) !important;
        }

        .auth-inner-content .forgot-password a,
        .auth-inner-content .auth-footer a {
          color: #34d399 !important; /* Brighter Emerald for visibility */
          font-weight: 600;
        }

        .auth-inner-content .forgot-password a:hover,
        .auth-inner-content .auth-footer a:hover {
          text-decoration: underline;
          filter: brightness(1.2);
        }

        /* Features Styling */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 2.5rem;
          perspective: 1000px;
          transition: border-color 0.3s;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #818cf8;
          margin-bottom: 1.5rem;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #9ca3af;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    { title: 'Secure Infrastructure', desc: 'Enterprise-grade encryption for all medical records and patient data.', icon: <Shield size={24} /> },
    { title: 'Instant Analytics', desc: 'Real-time performance metrics and hospital capacity tracking.', icon: <Zap size={24} /> },
    { title: 'Patient Centric', desc: 'Designed to prioritize patient experience and accessibility.', icon: <Heart size={24} /> },
    { title: 'Advanced Monitoring', desc: 'Continuous health monitoring and early warning systems.', icon: <Activity size={24} /> },
    { title: 'Smart Search', desc: 'Quickly locate patient records and histories with AI-powered search.', icon: <Search size={24} /> },
    { title: 'Staff Management', desc: 'Seamlessly coordinate between doctors, nurses, and admin staff.', icon: <Users size={24} /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      className="features-grid"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {features.map((feature, idx) => (
        <motion.div 
          key={idx} 
          className="feature-card glassmorphism"
          variants={itemVariants}
          whileHover={{ 
            rotateX: idx % 2 === 0 ? 5 : -5,
            rotateY: idx % 3 === 0 ? 5 : -5,
            borderColor: "rgba(255, 255, 255, 0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.05)"
          }}
        >
          <div className="feature-icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.desc}</p>
        </motion.div>
      ))}
    </motion.section>
  );
}


