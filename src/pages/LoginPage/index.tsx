import React, { FC } from 'react';
import css from './index.module.scss'
import Card from '../../shared/ui-kit/Card';
import Button from '../../shared/ui-kit/Button';
import { useNavigate } from 'react-router-dom';

const LoginPage: FC = () => {

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/`);
  };

  return (
    <div className={css.loginPageWrapper}>
        <div>
            <Card
                color="#ffffff" 
                size="large" 
                rounded={true}>
                <h1>Login</h1>
                <input type="text" placeholder="Username" className={css.loginPageWrapperInput}/>
                <input type="password" placeholder="Password" className={css.loginPageWrapperInput}/>
                <input type="password" placeholder="Token" className={css.loginPageWrapperInput}/>
                <Button
                    type="secondary" 
                    size="large" 
                    rounded={true}
                    onClick={handleButtonClick}>
                <span>Login</span>
                </Button>
                {/* если данные не заполнены нельзя заллогиниться */}
            </Card>
        </div>
    </div>
  );
}

export default LoginPage;
