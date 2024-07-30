import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LeftSideMenu from '../LeftSideMenu';
import css from './index.module.scss';

export interface Tab {
  id: string;
  label: string;
  url: string;
  onSelectCallback?: () => void;
}

export interface TopTabsMenuProps {
  tabs: Tab[];
  activeTabId: string;
  reportId?: number;
  setReportIdCallback: (id: number) => void;
}

function TopTabsMenu({ tabs, activeTabId, reportId, setReportIdCallback }: TopTabsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSetTab = (tabId: string) => {
    const tab = tabs.find(tab => tab.id === tabId);
    tab?.onSelectCallback?.();
    navigate(`${tab?.url}/${reportId}`);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleItemClick = (reportId: string) => {
    navigate(`${reportId}`);
    setReportIdCallback(Number(reportId));
    setMenuOpen(false);
  };

  return (
    <div>
      <div className={css.topTabsMenu}>
        <div className={css.tabHeaders}>
          <button
            className={`${css.tabButton} ${menuOpen ? css.active : ''}`}
            onClick={handleMenuToggle}
          >
            Меню
          </button>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${css.tabButton} ${tab.id === activeTabId ? css.active : ''}`}
              onClick={() => handleSetTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {menuOpen && (
        <div>
          <LeftSideMenu 
            isOpen={menuOpen} 
            onClose={() => setMenuOpen(false)} 
            onItemClick={handleItemClick} 
          />
        </div>
      )}
    </div>
  );
};

export default TopTabsMenu;
