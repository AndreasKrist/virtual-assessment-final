import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) {
  // Define base classes
  const baseClasses = "relative overflow-hidden rounded-xl font-medium focus:outline-none transition-all";
  
  // Define color classes for our modern theme
  const variantClasses = {
    primary: `bg-blue-600 text-white ${disabled ? 'opacity-50' : 'hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30'}`,
    secondary: `bg-blue-100 text-blue-800 ${disabled ? 'opacity-50' : 'hover:bg-blue-200 shadow-lg shadow-blue-100/40'}`,
    outline: `border-2 border-blue-600 text-blue-600 bg-transparent ${disabled ? 'opacity-50' : 'hover:bg-blue-50'}`,
    danger: `bg-red-600 text-white ${disabled ? 'opacity-50' : 'hover:bg-red-700 shadow-lg shadow-red-500/20 hover:shadow-red-600/30'}`,
  };
  
  // Define size classes
  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3",
    large: "px-8 py-4 text-lg",
  };
  
  // Create final className string
  const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${disabled ? 'cursor-not-allowed' : ''}
    ${className}
  `;
  
  // Animation properties for interactive feedback
  const buttonAnimations = {
    whileHover: disabled ? {} : { scale: 1.03, y: -2 },
    whileTap: disabled ? {} : { scale: 0.97 },
    transition: { duration: 0.2 }
  };
  
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      data-variant={variant}
      {...buttonAnimations}
      {...props}
    >
      {children}
    </motion.button>
  );
}