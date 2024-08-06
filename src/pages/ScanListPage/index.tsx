import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import css from './index.module.scss';
import Card from '../../shared/ui-kit/Card';
import SharedButton from '../../shared/ui-kit/Button';
import * as API from '../../API/api'; 
import * as API_TYPES from '../../API/types';
import { BASE_URL, API_TOKEN } from '../../API/consts';

const ScanListPage: FC = () => {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState<API_TYPES.Scan[]>([]);

  useEffect(() => {
    API.getAllScans().then(data => {
      setCardData(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  useEffect(() => {
      try {
          axios.get(`${BASE_URL}/scan/status/miit_scan/`,  {
            headers: {
                'Authorization': `Token ${API_TOKEN}`
            }
          }).then(res => console.log(res));
      } catch (error) {
          console.error('Ошибка:', error);
      }
  }, [])

  const handleCardClick = (name: string) => {
    navigate(`/details/${name}/`);
  };

  const handleAddScanClick = () => {
    navigate(`/scan-add`);
  };

  const handleScopeGropesClick = () => {
    navigate('/scope-groups');
  };

  const startScan = async (name) => {
    const start_datetime = new Date().toISOString();;
    try {
        const response = await axios.post(`${BASE_URL}/scan/start/${name}/`, {start_datetime}, {
          headers: {
              'Authorization': `Token ${API_TOKEN}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
      });
    } catch (error) {
        console.error('Ошибка запуска скана:', error);
    }
};

  const handleStartClick = (name) => {
    startScan(name);
  }

  return (
    <div className={css.scanListPageWrapper}>
      <div>
        <span className={css.scanListTitle}>Список сканов</span>
        <div className={css.prevScanBlock}>
          {cardData.map((card) => (
            <Card
              key={card.id}
              expanded
              color="#ffffff"
              size="small"
              rounded={true}
              onClick={() => handleCardClick(card.name)}
            >
              <span>{card.name}</span>
              <Button size="medium" icon={<PlayCircleOutlined />} rounded={true} className={css.startButton} onClick={(e) => {e.stopPropagation();handleStartClick(card.name)}}></Button>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <SharedButton size="medium" rounded={true} type="secondary" style={{"marginBottom": "10px"}} onClick={handleAddScanClick}>
          Создать скан
        </SharedButton>
        <SharedButton size="medium" rounded={true} type="secondary" onClick={handleScopeGropesClick}>
          Скоп группы
        </SharedButton>
      </div>
    </div>
  );
};

export default ScanListPage;