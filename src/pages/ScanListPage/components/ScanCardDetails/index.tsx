import { FC, useEffect, useState } from 'react';
import React from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import TopTabsMenu, { Tab } from '../../../../shared/ui-kit/HeaderMenu';
import EventsPageCard from '../EventsPageCard';
import InventoryPageCard from '../InventoryPageCard';
import SettigsPageCard from '../SettigsPageCard';
import SetSettigsPageCard  from '../SetSettingsPageCard';

import * as API from '../../../../API/api'; 
import * as API_TYPES from '../../../../API/types';

import { BASE_URL, API_TOKEN } from '../../../../API/consts';

import css from './index.module.scss';

const ScanCardDetails: FC = () => {
  const { name } = useParams();
  const [zeroReports, setZeroRepots] = React.useState(false);

  const settingsTab: Tab = {
    id: 'settings',
    label: 'Настройки',
    url: `/details/${name}/settings`,
    onSelectCallback: () => setActiveTab('settings')
  };

  const inventoryTab: Tab = {
    id: 'inventory',
    label: 'Инвентаризация',
    url: `/details/${name}/inventory`,
    onSelectCallback: () => setActiveTab('inventory')
  };

  const eventTab: Tab = {
    id: 'events',
    label: 'Ивенты',
    url: `/details/${name}/events`,
    onSelectCallback: () => setActiveTab('events')
  };

  const changeSettings: Tab = {
    id: 'changeSettings',
    label: 'Редактировать',
    url: `/details/${name}/change-settings`,
    onSelectCallback: () => setActiveTab('changeSettings')
  };

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(settingsTab.id); 
  const [reports, setReports] = useState<API_TYPES.Report[]>();
  const [reportId, setReportId] = useState<number | undefined>(undefined); 

  const lastReportId = reports?.sort((report1, report2) => report2.id - report1.id)?.[0]?.id;
  
  if (reportId === undefined && lastReportId !== undefined) {
    setReportId(lastReportId);
  }

  useEffect(() => {
    API.getScanReport(name!!).then(data => {
      setReports(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  useEffect(() => {
    if (reportId)
      navigate(`settings/${reportId}`);
  }, [reportId]);


  React.useEffect(() => {
    axios.get(`${BASE_URL}/reports/${name}/`,  {
        headers: {
            'Authorization': `Token ${API_TOKEN}`
        }
      })
      .then(res => {
        if (res.data.length > 0) {
          setZeroRepots(false);
        } else {
          setZeroRepots(true);
          navigate(`change-settings/${reportId}`);
        }
      })
      .catch((error) => {
          console.error('Ошибка при получении настроек скана:', error);
    });
  }, [])

  return (
    <div className={css.scanCardWrapper}>
      <TopTabsMenu 
        tabs={zeroReports ? [changeSettings] : [settingsTab, inventoryTab, eventTab, changeSettings]} 
        activeTabId={activeTab} 
        reportId={reportId}
        setReportIdCallback={setReportId}
      />
      {/* { reportId ? undefined : ('Загрузка...') } */}
      <Routes>
        <Route path='settings/:reportId' element={<SettigsPageCard />} />
        <Route path='inventory/:reportId' element={<InventoryPageCard />} />
        <Route path='events/:reportId' element={<EventsPageCard />} />
        <Route path='change-settings/:reportId' element={<SetSettigsPageCard />} />
      </Routes>
    </div>
  );
};

export default ScanCardDetails;

        {/* 1) скан активен - плашка прогрузки

        2) скан не запущен - скан не запущен (создан, но не запущем) - кнопка запустить скан 
        3) скан завершен - все данные 
            вехрнее меню с отдельными страницами
            1. Настройки - тупо много полей
            2. Инвентаризация - тупо много данных
            3. Ивенты -  */}