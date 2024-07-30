import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import Button from '../../shared/ui-kit/Button';
import Card from '../../shared/ui-kit/Card';
import Modal from '../../shared/ui-kit/Modal';
import css from './index.module.scss';

const ScopeGropesListPage: FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [scopes, setScopes] = useState([]);

  useEffect(() => {
    const fetchScopes = async () => {
      try {
        const response = await axios.get('http://109.172.115.106:8000/api/v1/scope/', {
          headers: {
            'Authorization': `Token ${process.env.REACT_APP_API_TOKEN}`
          }
        });
        setScopes(response.data);
      } catch (error) {
        console.error('Error fetching scopes:', error);
      }
    };

    fetchScopes();
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className={css.scopeGropesListPageWrapper}>
        <div>
        <span className={css.scopeGropesListTitle}>Список скоп групп</span>
          <div className={css.prevScopeBlock}>
            <Modal isOpen={isOpen} onClose={closeModal}>
            </Modal>
            {scopes.map((scope, index) => (
              <Card
                key={index}
                expanded
                color="#ffffff"
                size="small"
                rounded={true}
                onClick={openModal}>
                <span>{scope}</span>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <Button 
            size="medium" 
            rounded={true}
            type="primary">
            Создать скан
          </Button>
          <Button 
            size="medium" 
            rounded={true}
            type="primary">
            Скоп группы
          </Button>
        </div>
    </div>
  );
};

export default ScopeGropesListPage;
