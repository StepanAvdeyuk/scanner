import React, { FC } from 'react';
import { CSSTransition } from 'react-transition-group';
import css from './index.module.scss';

interface ProgressBarProps {
  active: boolean;
  percentage: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ active, percentage }) => {
  return (
    <CSSTransition
      in={active}
      timeout={300}
      classNames={{
        enter: css.enter,
        enterActive: css.enterActive,
        exit: css.exit,
        exitActive: css.exitActive,
      }}
      unmountOnExit
    >
      <div className={css.progressBarContainer}>
        <div className={css.progressBar} style={{ width: `${percentage}%` }} />
      </div>
    </CSSTransition>
  );
};

export default ProgressBar;
