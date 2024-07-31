import { Button, Input, Select, Table } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import css from './index.module.scss';
import { getReportEvents } from '../../../../API/api';
import { API_TOKEN, BASE_URL } from '../../../../API/consts';

import "./components/EventChart";
import "./Styles.scss";
import EventChart from './components/EventChart';
import img from '../../../../shared/icons/arrow_down/down-arrow.svg';

const { Option } = Select;

interface EventInfo {
    name: string;
    tags: string[];
    description: string;
    severity: string;
    reference: string[];
    classification: {
        "cwe-id"?: string[];
        "cvss-metrics"?: string;
    };
}

export interface Event {
    id: number;
    template: string;
    template_id: string;
    template_path: string;
    info: EventInfo;
    type: string;
    host: string;
    matched_at: string;
    extracted_results: string[];
    request: string;
    timestamp: number;
    matcher_status: boolean;
    report_id: number;
    matcher_name?: string;
    curl_command?: string;
    ip?: string;
    url?: string;
}

interface EventsData {
    start: string;
    end: string;
    events: Event[];
}

const EventsPageCard: FC = () => {
    const { reportId } = useParams();

    const [eventsData, setEventsData] = useState<EventsData | undefined>();
    const [detailedEvent, setDetailedEvent] = useState<Event | undefined>();

    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        severity: [],
        tags: [],
        template_ids: [],
        types: [],
        matcher_names: []
    });

    const handleFilterChange = (key: string, value: any) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value
        }));
    };

    const filterEmptyFields = (filters: any) => {
        const filtered: any = {};
        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key].length > 0) {
                //@ts-ignore
                filtered[key] = filters[key].filter(str => str !== '').map(str => str.trim());
                if (filtered[key]?.length === 0) {
                    filtered[key] = undefined;
                }
            }
        });
        return filtered;
    };

    const fetchEvents = async (filtersToApply = {}) => {
        //@ts-ignore
        if (reportId === 'undefined') {
            setEventsData(undefined);
            return;
        }

        try {
            const data = await getReportEvents(Number(reportId), filterEmptyFields(filters))

            if (data) {
                setEventsData(data);
                setError(null);
            } else {
                setEventsData(undefined);
                setError('Events not found');
            }
        } catch (error) {
            setEventsData(undefined);
            setError('Ошибка при получении данных событий');
            console.error('Ошибка при получении данных событий:', error);
        }
    };

    useEffect(() => {
        fetchEvents({});
    }, [reportId]);

    const renderEventDetails = (details: any) => {
        if (details === undefined) return;
        
        return Object.entries(details).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={key}>
                        <strong>{key}:</strong>
                        <div className={css.settingsNested}>
                            {renderEventDetails(value)}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={key} className={css.setting}>
                        <strong>{key}:</strong> {value !== null ? value?.toString() : 'null'}
                    </div>
                );
            }
        });
    };

    const setDetailedEventById = (id: number) => {
        const event = eventsData?.events.find(event => event.id === id);
        setDetailedEvent(event);
    }

    const acceptRisk = async (id: number) => {
        try {
            const response = await axios.post(`${BASE_URL}/accepted_risk`, [id], {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Ошибка принятия риска:', error);
        }
    };

    const acceptRiskClick = (id: number) => {
        const event = eventsData?.events.find(event => event.id === id);
        const userConfirmed = confirm(`Принять риск для ${event?.info.name}?`);
        if (userConfirmed) {
            acceptRisk(id);
        } else {
        }
    }

    const columns = [
        {
            title: 'Уязвимость',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Критичность',
            dataIndex: 'severity',
            key: 'severity',
        },
        {
            title: 'Принять риск',
            dataIndex: 'accept_risk',
            key: 'accept_risk',
            render: (_: any, record: any) => (
                <Button danger size='small' shape="circle" onClick={(e) => {e.stopPropagation();acceptRiskClick(record.id)}}>✓</Button>
            ),
        }
    ];

    const tableDataSource = eventsData?.events.map(event => {
        return {
            key: event.id,
            id: event.id,
            name: event.info.name,
            severity: event.info.severity,
        };
    });

    return (
        <div>
            {error ? (
                <div>{error}</div>
            ) : (
                <>
                    <div className={css.filtersWrapper}>
                        <div className={css.filterItem}>
                            <strong>Severity:</strong>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select severity"
                                onChange={(value) => handleFilterChange('severity', [value])}
                            >
                                <Option value="info">Info</Option>
                                <Option value="low">Low</Option>
                                <Option value="medium">Medium</Option>
                                <Option value="high">High</Option>
                            </Select>
                        </div>
                        <div className={css.filterItem}>
                            <strong>Template IDs:</strong>
                            <Input
                                placeholder="Enter template IDs"
                                onChange={(e) => handleFilterChange('template_ids', e.target.value.split(','))}
                            />
                        </div>
                        <div className={css.filterItem}>
                            <strong>Types:</strong>
                            <Input
                                placeholder="Enter types"
                                onChange={(e) => handleFilterChange('types', e.target.value.split(','))}
                            />
                        </div>
                        <div className={css.filterItem}>
                            <strong>Hosts:</strong>
                            <Input
                                placeholder="Enter hosts"
                                onChange={(e) => handleFilterChange('hosts', e.target.value.split(','))}
                            />
                        </div>
                        <Button type="primary" onClick={() => fetchEvents(filters)}>
                            Apply Filters
                        </Button>
                    </div>

                    <div className={css.eventsPageWrapper}>
                        <div>
                            <strong className={css.title}>Scan: { `${reportId}` }</strong>
                        </div>
                        <div>
                            <strong className={css.title}>Start:</strong>
                            <div className={css.title}>{eventsData?.start}</div>
                        </div>
                        <div>
                            <strong className={css.title}>End:</strong>
                            <div className={css.title}>{eventsData?.end}</div>
                        </div>


                        <div className='event-charts'>
                            <EventChart events={eventsData?.events!!} />
                        </div>
                        <div className='events-container'>
                            <div className='events-table'>
                                <Table
                                    dataSource={tableDataSource}
                                    columns={columns}
                                    pagination={false}
                                    onRow={(record) => {
                                        return {
                                            onClick: () => { setDetailedEventById(record.id) },
                                        };
                                    }}
                                    // TODOD pass this style to rows only
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            { detailedEvent &&
                                <div className='event-details'>
                                    <div className={css.eventsList}>
                                        { renderEventDetails(detailedEvent) }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EventsPageCard;
