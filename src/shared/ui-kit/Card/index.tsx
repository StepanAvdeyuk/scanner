import React, { ReactNode } from 'react';
import css from './index.module.scss';

interface CardProps {
  color: string;
  size: 'small' | 'medium' | 'large';
  rounded?: boolean;
  expanded?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ color, size, rounded, expanded, children, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`${css.cardContainer} ${css[size]} ${rounded ? css.rounded : ''} ${expanded ? css.expanded : ''}`} 
      style={{ backgroundColor: color }}>
      {children}
    </div>
  );
};

export default Card;
