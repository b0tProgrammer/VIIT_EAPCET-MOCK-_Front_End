import { useMemo } from 'react';

const AnimatedBackground = () => {
  const bubbles = useMemo(() => [
    { top: 'top-[5%]', left: 'left-[10%]', size: 'w-4 h-4', color: 'bg-blue-200', delay: '0s', opacity: 0.6 },
    { top: 'top-[15%]', right: 'right-[15%]', size: 'w-6 h-6', color: 'bg-purple-200', delay: '1s', opacity: 0.5 },
    { top: 'top-[25%]', left: 'left-[25%]', size: 'w-3 h-3', color: 'bg-green-200', delay: '2s', opacity: 0.7 },
    { top: 'top-[35%]', right: 'right-[30%]', size: 'w-5 h-5', color: 'bg-pink-200', delay: '0.5s', opacity: 0.4 },
    { top: 'top-[45%]', left: 'left-[50%]', size: 'w-4 h-4', color: 'bg-cyan-200', delay: '1.5s', opacity: 0.5 },
    { top: 'top-[55%]', right: 'right-[25%]', size: 'w-3 h-3', color: 'bg-orange-200', delay: '2.5s', opacity: 0.6 },
    { top: 'top-[65%]', left: 'left-[30%]', size: 'w-5 h-5', color: 'bg-teal-200', delay: '0.8s', opacity: 0.45 },
    { top: 'top-[75%]', right: 'right-[50%]', size: 'w-4 h-4', color: 'bg-lime-200', delay: '1.2s', opacity: 0.55 },
    { bottom: 'bottom-[10%]', left: 'left-[10%]', size: 'w-6 h-6', color: 'bg-indigo-200', delay: '0.3s', opacity: 0.5 },
    { bottom: 'bottom-[20%]', right: 'right-[5%]', size: 'w-3 h-3', color: 'bg-rose-200', delay: '1.8s', opacity: 0.65 },
    { bottom: 'bottom-[30%]', left: 'left-[25%]', size: 'w-4 h-4', color: 'bg-violet-200', delay: '2.2s', opacity: 0.5 },
    { bottom: 'bottom-[40%]', right: 'right-[30%]', size: 'w-5 h-5', color: 'bg-emerald-200', delay: '0.7s', opacity: 0.4 },
    { bottom: 'bottom-[50%]', left: 'left-[50%]', size: 'w-3 h-3', color: 'bg-amber-200', delay: '1.4s', opacity: 0.6 },
    { bottom: 'bottom-[60%]', right: 'right-[25%]', size: 'w-4 h-4', color: 'bg-sky-200', delay: '2.1s', opacity: 0.55 },
    { bottom: 'bottom-[70%]', left: 'left-[30%]', size: 'w-5 h-5', color: 'bg-fuchsia-200', delay: '0.9s', opacity: 0.45 },
    { bottom: 'bottom-[80%]', right: 'right-[50%]', size: 'w-3 h-3', color: 'bg-slate-200', delay: '1.6s', opacity: 0.5 },
  ], []);

  const stars = useMemo(() => [
    { top: 'top-[5%]', left: 'left-[20%]', size: 'w-2 h-2', delay: '0.5s', opacity: 0.8 },
    { top: 'top-[15%]', right: 'right-[20%]', size: 'w-3 h-3', delay: '1.2s', opacity: 0.6 },
    { top: 'top-[25%]', left: 'left-[40%]', size: 'w-2 h-2', delay: '0.8s', opacity: 0.7 },
    { top: 'top-[35%]', right: 'right-[40%]', size: 'w-3 h-3', delay: '1.8s', opacity: 0.5 },
    { top: 'top-[45%]', left: 'left-[60%]', size: 'w-2 h-2', delay: '0.3s', opacity: 0.75 },
    { top: 'top-[55%]', right: 'right-[60%]', size: 'w-3 h-3', delay: '1.5s', opacity: 0.55 },
    { top: 'top-[65%]', left: 'left-[80%]', size: 'w-2 h-2', delay: '0.6s', opacity: 0.65 },
    { top: 'top-[75%]', right: 'right-[80%]', size: 'w-3 h-3', delay: '1.9s', opacity: 0.45 },
    { bottom: 'bottom-[5%]', left: 'left-[20%]', size: 'w-2 h-2', delay: '0.4s', opacity: 0.7 },
    { bottom: 'bottom-[15%]', right: 'right-[20%]', size: 'w-3 h-3', delay: '1.1s', opacity: 0.6 },
    { bottom: 'bottom-[25%]', left: 'left-[40%]', size: 'w-2 h-2', delay: '0.7s', opacity: 0.75 },
    { bottom: 'bottom-[35%]', right: 'right-[40%]', size: 'w-3 h-3', delay: '1.7s', opacity: 0.5 },
    { bottom: 'bottom-[45%]', left: 'left-[60%]', size: 'w-2 h-2', delay: '0.2s', opacity: 0.65 },
    { bottom: 'bottom-[55%]', right: 'right-[60%]', size: 'w-3 h-3', delay: '1.4s', opacity: 0.55 },
    { bottom: 'bottom-[65%]', left: 'left-[80%]', size: 'w-2 h-2', delay: '0.9s', opacity: 0.7 },
    { bottom: 'bottom-[75%]', right: 'right-[80%]', size: 'w-3 h-3', delay: '1.6s', opacity: 0.45 },
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Floating Bubbles */}
      {bubbles.map((bubble, index) => (
        <div
          key={`bubble-${index}`}
          className={`absolute ${bubble.top || ''} ${bubble.left || ''} ${bubble.right || ''} ${bubble.bottom || ''} ${bubble.size} ${bubble.color} rounded-full animate-bounce`}
          style={{ animationDelay: bubble.delay, opacity: bubble.opacity || 0.5 }}
        />
      ))}

      {/* Floating Stars */}
      {stars.map((star, index) => (
        <div
          key={`star-${index}`}
          className={`absolute ${star.top || ''} ${star.left || ''} ${star.right || ''} ${star.bottom || ''} ${star.size} bg-yellow-400 rounded-full animate-pulse`}
          style={{ animationDelay: star.delay, opacity: star.opacity || 0.5 }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
