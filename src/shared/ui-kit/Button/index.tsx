import css from './index.module.scss'
import React, { ReactNode } from 'react';

interface ButtonProps {
    size?: 'small' | 'medium' | 'large' ;
    type: 'primary' | 'secondary' | 'default' ; 
    rounded?: boolean
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
    icon?: boolean;
    style?: any;
  }

  const Button: React.FC<ButtonProps> = ({ size, rounded, children, type, onClick, className, icon, style }) => {
    return (
      <div onClick={onClick} style={style} className={`${css.button} ${css[size]} ${className} ${css[type]} ${icon ? css.icon: ''} ${rounded ? css.rounded : ''}`}>
      {children}
    </div>
    );
  };
  
  export default Button;