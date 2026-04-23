import { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export default function MagneticButton({ children, onClick, className = "", variant = "primary" }) {
  const ref = useRef(null);
  
  // Motion values for the button position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for magnetic effect
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Shimmer position
  const [shimmerPos, setShimmerPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Magnetic pull calculation
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    // Limits the pull to a small range (magnetic strength)
    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);

    // Shimmer position within button
    setShimmerPos({
      x: clientX - left,
      y: clientY - top
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      className={`mag-btn ${variant} ${className}`}
      style={{
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      <span className="btn-content relative z-10">{children}</span>
      
      {/* Liquid Shimmer / Glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="shimmer-effect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              left: shimmerPos.x,
              top: shimmerPos.y,
            }}
          />
        )}
      </AnimatePresence>

      <style>{`
        .mag-btn {
          position: relative;
          padding: 1rem 2.5rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 1.125rem;
          overflow: hidden;
          transition: background 0.3s, color 0.3s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .mag-btn.primary {
          background: white;
          color: #030014;
        }

        .mag-btn.outline {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .shimmer-effect {
          position: absolute;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          z-index: 1;
        }

        .mag-btn.outline .shimmer-effect {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
        }

        .btn-content {
          pointer-events: none;
        }
      `}</style>
    </motion.button>
  );
}
