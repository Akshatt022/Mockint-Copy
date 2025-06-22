import React, { useState,useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Animated Button with Ripple Effect
export const AnimatedButton = ({ children, onClick, className, ...props }) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = {
      id: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    
    setRipples(prev => [...prev, ripple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
    
    onClick?.(event);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden ${className}`}
      onClick={createRipple}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 20, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

// Floating Action Button with Tooltip
export const FloatingButton = ({  tooltip, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        onClick={onClick}
        className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
      >
        <Icon size={20} />
      </motion.button>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap"
          >
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Animated Counter
export const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = 0;
    const endValue = value;

    const updateValue = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const current = startValue + (endValue - startValue) * easeOutQuart(progress);
      setDisplayValue(Math.floor(current));
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }, [value, duration]);

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="tabular-nums"
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
};