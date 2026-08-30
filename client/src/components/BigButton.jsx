import React from 'react';

/**
 * BigButton — The primary large-touch-target button for elderly users.
 * Always at least 56px tall, large text, high contrast, press feedback.
 */
export default function BigButton({
  onClick,
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'warn'
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = true,
  ...rest
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    warn: 'btn-warn',
  }[variant] || 'btn-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
