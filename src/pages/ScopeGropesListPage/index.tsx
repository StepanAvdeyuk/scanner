import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { Modal, Card, List, Typography, Button } from 'antd';
import SharedCard from '../../shared/ui-kit/Card';
import css from './index.module.scss';
import { BASE_URL, API_TOKEN } from '../../API/consts';
import EventModal from './EventModal';
import ScopeGroupModal from './ScopeGroupModal';

const ScopeGropesListPage: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [scopes, setScopes] = useState([]);
  const [openedScope, setOpenedScope] = useState<number|null>(null);

  const openScopeModal = () => setIsScopeOpen(true);
  const closeScopeModal = () => setIsScopeOpen(false);

  const handleSave = (data) => {
    const sendData = {
      name: data.name,
      ips: data.ips.map(ip => ({ ip, domains: [] })),
      domains: data.domains.map(domain => ({ domain, ips: [] })),
      display: true
    }
    addScopeGroup(sendData);
    closeScopeModal();
    fetchScopes();
  };


  const fetchScopes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/scope/`, {
        headers: {
          'Authorization': `Token ${API_TOKEN}`
        }
      });
      setScopes(response.data);
    } catch (error) {
      console.error('Error fetching scopes:', error);
    }
  };

  useEffect(() => {
    fetchScopes();
  }, []);

  const addScopeGroup = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/scope/`, data, {
              headers: {
                'Authorization': `Token ${API_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Ошибка добавления scope group:', error);
    }
};

  const openModal = (id: number) => {
    setIsOpen(true);
    setOpenedScope(id);
  };
  const closeModal = () => {
    setIsOpen(false)
    setOpenedScope(null);
  };

  return (
    <div className={css.scopeGropesListPageWrapper}>
        <div>
        <span className={css.scopeGropesListTitle}>Список скоп групп</span>
          <div className={css.prevScopeBlock}>
            <EventModal 
              isOpen={isOpen} 
              closeModal={closeModal}
              scopes={scopes}
              openedScope={openedScope}
              >
            </EventModal>
            {scopes && scopes.map((scope: any, index) => {
              if (scope.name) {
                return <SharedCard
                key={index}
                expanded
                color="#ffffff"
                size="small"
                rounded={true}
                onClick={() => openModal(scope.id)}>
                <span>{scope.name}</span>
              </SharedCard>
              }
            })}
          </div>
        </div>
        <div>
          <Button 
            size="medium" 
            rounded={true}
            onClick={openScopeModal}>
            Создать Scope группу
          </Button>
          <ScopeGroupModal isOpen={isScopeOpen} onClose={closeScopeModal} onSave={handleSave} />
          {/* <Button 
            size="medium" 
            rounded={true}
            type="primary">
            Скоп группы
          </Button> */}
        </div>
    </div>
  );
};

export default ScopeGropesListPage;
