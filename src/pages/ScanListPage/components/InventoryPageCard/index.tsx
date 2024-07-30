import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Styles.scss';

import * as API from '../../../../API/api'; 
import { Inventory, InventoryFilters } from '../../../../API/types';
import Domain from './components/Domain';
import FilterForm from '../../../FilterForm';
import InventoryChart from './components/InventoryChart';

const InventoryPageCard: FC = () => {
    const { reportId } = useParams();
    
    const [inventory, setInventory] = useState<Inventory[]>();
    const [inventoryFilters, setInventoryFilters] = useState<InventoryFilters>({});

    const firstInventory = inventory?.[0];

    useEffect(() => {
        if (reportId !== 'undefined') {
            API.getReportInventory(Number(reportId), inventoryFilters)
            .then(data => {
                setInventory(data);
            })
            .catch(error => {
                console.error(error);
            });    
        } 
    }, [inventoryFilters, reportId]);

    return (
        <div className='page-card-container'>
            <div className='filter-container'>
                <FilterForm onSubmitCallback={setInventoryFilters}/>
            </div>
            <div className='inventory-chart-container'>
                <InventoryChart inventory={inventory?.[0]} />
            </div>
            <div className='inventory-container'>
                <h1>Домены</h1>
                { firstInventory?.domains.map(domain => <Domain key={domain.domain} domain={domain} />) }
            </div>
        </div>
    );
};

export default InventoryPageCard;
