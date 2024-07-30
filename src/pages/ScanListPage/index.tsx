import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './index.module.scss';
import Card from '../../shared/ui-kit/Card';
import Button from '../../shared/ui-kit/Button';
import * as API from '../../API/api'; 
import * as API_TYPES from '../../API/types';

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

  const handleCardClick = (name: string) => {
    navigate(`/details/${name}/`);
  };

  const handleAddScanClick = () => {
    navigate(`/scan-add`);
  };

  const handleScopeGropesClick = () => {
    navigate('/scope-groups');
  };

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
            </Card>
          ))}
        </div>
      </div>
      <div>
        <Button size="medium" rounded={true} type="secondary" style={{"marginBottom": "10px"}} onClick={handleAddScanClick}>
          Создать скан
        </Button>
        <Button size="medium" rounded={true} type="secondary" onClick={handleScopeGropesClick}>
          Скоп группы
        </Button>
      </div>
    </div>
  );
};

export default ScanListPage;