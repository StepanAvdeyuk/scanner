import React from 'react';
import { CSSTransition } from 'react-transition-group';
import css from './index.module.scss';
import Button from '../Button';

interface ModalProps {
  isOpen: boolean;
  width?: number;
  height?: number;
  className?: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, width = 500, height, className, onClose, children }) => {

  return (
    <>
      <CSSTransition in={isOpen} timeout={300} classNames="modal" unmountOnExit>
        <div className={`${css.modal} ${className}`} style={{ width, height, zIndex: 1000 }}>
            <Button 
                className={css.closeButton}
                type="primary"
                icon
                rounded
                onClick={onClose}>
                    X
            </Button>
        {children}
        </div>
      </CSSTransition>
      {isOpen && <div className={css.backdrop} onClick={onClose} style={{ zIndex: 999 }}></div>}
    </>
  );
};

export default Modal;
