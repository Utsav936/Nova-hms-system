import { motion } from 'framer-motion';

export default function Skeleton({ width = '100%', height = '1rem', borderRadius = 'var(--radius-md)', className = '' }) {
  return (
    <div 
      className={`skeleton-base ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    >
      <div className="skeleton-shimmer" />
      
      <style>{`
        .skeleton-base {
          position: relative;
          background-color: var(--color-bg-input);
          overflow: hidden;
        }

        .skeleton-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          transform: translateX(-100%);
          animation: skeleton-sweep 1.5s infinite;
        }

        @keyframes skeleton-sweep {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export function SkeletonCircle({ size = '3rem', className = '' }) {
  return <Skeleton width={size} height={size} borderRadius="50%" className={className} />;
}

export function SkeletonCard({ rows = 3, className = '' }) {
  return (
    <div className={`skeleton-card glassmorphism p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <SkeletonCircle size="3rem" />
        <div className="flex-1">
          <Skeleton width="60%" height="1.2rem" className="mb-2" />
          <Skeleton width="40%" height="0.8rem" />
        </div>
      </div>
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} width={i === rows - 1 ? '70%' : '100%'} height="0.8rem" className="mb-2" />
      ))}
      
      <style>{`
        .skeleton-card {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          background: rgba(255, 255, 255, 0.02);
        }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .gap-4 { gap: 1rem; }
        .flex-1 { flex: 1; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .p-6 { padding: 1.5rem; }
      `}</style>
    </div>
  );
}
