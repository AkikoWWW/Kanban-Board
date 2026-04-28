import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon: Icon, 
  ...props 
}) => {
  const variants = {
    primary: 'btn-save',
    cancel: 'btn-cancel',
    icon: 'btn-icon',
    add: 'add-task-btn',
    delete: 'btn-delete',
    reset: 'reset-btn',
    theme: 'theme-toggle-btn'
  };

  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className="icon-svg" />}
      {children}
    </button>
  );
};