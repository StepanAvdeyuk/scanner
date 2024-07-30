import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../Button';

import * as API from '../../../API/api'; 
import * as API_TYPES from '../../../API/types';

import css from './index.module.scss';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (name: string) => void;
}

export interface ReportItem {
  id: string;
  name: string;
  status?: 'Active' | 'Completed' | 'Inactive';
  percentage?: string;
}

const LeftSideMenu: FC<MenuProps> = ({ isOpen, onClose, onItemClick }) => {
  const { name: scanName } = useParams<{ name: string }>();
  const [items, setItems] = useState<API_TYPES.Report[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && scanName) {
      setLoading(true);
      
      API.getScanReport(scanName)
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
    }
  }, [isOpen, scanName]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom) {
      // Assuming API already returns all the necessary items, no additional load logic here
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && !document.getElementById('menuContainer')?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div id="menuContainer" className={css.menu} onScroll={handleScroll}>
      <div className={css.headerMenuWrapper}>
        <div>Предыдущие сканирования: {scanName}</div>
        <Button type="default" size="small" rounded onClick={onClose}>
          X
        </Button>
      </div>
      {items.map((item) => (
        <div key={item.id} className={css.menuItem} onClick={() => onItemClick(`${item.id}`)}>
          { formatDateTime(item.start_datetime.toString()) }
        </div>
      ))}
      {loading && <div className={css.loading}>Loading...</div>}
    </div>
  );
};

export default LeftSideMenu;

function formatDateTime(dateInput: string) {
  const date = new Date(Date.parse(dateInput));

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes} ${day}.${month}.${year}`;
}