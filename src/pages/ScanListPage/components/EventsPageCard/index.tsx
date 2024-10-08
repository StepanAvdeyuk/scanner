import { Button, Input, Select, Collapse, Table, Card, List, Typography, Dropdown, Menu } from 'antd';
import { FC, useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
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
const { Panel } = Collapse;

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
    const { Text } = Typography;
    const { reportId } = useParams();

    const [eventsData, setEventsData] = useState<EventsData | undefined>();
    const [detailedEvent, setDetailedEvent] = useState<Event | undefined>();

    const [activeId, setActiveId] = useState(null);

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

    const renderEventDetails: any = (details: any, level = 0) => {
        if (!details || (typeof details === 'object' && Object.keys(details).length === 0)) {
            return null;
        }
    
        return Object.entries(details).map(([key, value]) => {
            if (key === 'info') {
                return renderEventDetails(value, level);
            }
    
            if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                    return (
                        <List.Item key={key} style={{ paddingLeft: level * 20, paddingTop: 8, paddingBottom: 8 }}>
                            <Text strong>{key}:</Text> {value.join(', ')}
                        </List.Item>
                    );
                } else {
                    const nestedDetails = renderEventDetails(value, level + 1);
                    return nestedDetails ? (
                        <div key={key} style={{ marginBottom: 16, marginLeft: level * 20 }}>
                            <Text strong>{key}:</Text>
                            {nestedDetails}
                        </div>
                    ) : null;
                }
            } else {
                return (
                    <List.Item key={key} style={{ paddingLeft: level * 20, paddingTop: 8, paddingBottom: 8 }}>
                        <Text strong>{key}:</Text> {value !== null ? value?.toString() : 'null'}
                    </List.Item>
                );
            }
        });
    };
    

    const setDetailedEventById = (id: number) => {
        setActiveId(id);
        const event = eventsData?.events.find(event => event.id === id);
        setDetailedEvent(event);
    }

    const acceptRisk = async (id: number) => {
        try {
            const response = await axios.post(`${BASE_URL}/accepted_risk/`, {event_ids: [id]}, {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(() => alert('Риск принят'));
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

    const groupedEvents = eventsData?.events.reduce((acc, event) => {
        const eventName = event.info.name;
        if (!acc[eventName]) {
            acc[eventName] = [];
        }
        acc[eventName].push(event);
        return acc;
    }, {}); 

    const tableDataSource = groupedEvents && Object.keys(groupedEvents).map(name => {
        return {
            key: name,
            name: name,
            events: groupedEvents[name],
        };
    });
    
    const columns = [
        {
            title: 'Уязвимость',
            key: 'name',
            render: (_, record) => {
                const isExpandable = record.events.length > 1;
                const defaultActiveKey = isExpandable ? null : ['1']
                const activeStyle = (!isExpandable && (record.events[0].id == activeId)) ? {color: '#477ec2'} : {};
                return (
                    <Collapse
                        expandIconPosition="end"
                        bordered={false}
                        defaultActiveKey={defaultActiveKey} 
                        size='small'
                        collapsible={!isExpandable && 'icon'}
                    >
                        <Panel onClick={(e) => {e.stopPropagation(); if (!isExpandable) {setDetailedEventById(record.events[0].id)}}}
                            header={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={activeStyle}><span>{record.name}</span>
                                    <span>{isExpandable ? ` (Кол-во: ${record.events.length})` : ` (${record.events[0].info.severity})`}</span></div>
                                    {!isExpandable && (
                                        <Button
                                            danger
                                            size="small"
                                            shape="circle"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                acceptRiskClick(record.events[0].id);
                                            }}
                                        >
                                            ✓
                                        </Button>
                                    )}
                                </div>
                            }
                            key="1"
                            showArrow={isExpandable}
                        >
                            {isExpandable &&
                                record.events.map(event => {
                                    const spanStyle = (activeId === event.id) ? {color: '#477ec2'} : {};
                                    return (
                                        <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '24px', marginBottom: '8px' }}>
                                            <span style={spanStyle} onClick={() => setDetailedEventById(event.id)}>
                                                {`${event.info.name} ID:${event.id} Host: ${event.host} (${event.info.severity})`}
                                            </span>
                                            <Button
                                                danger
                                                size="small"
                                                shape="circle"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    acceptRiskClick(event.id);
                                                }}
                                            >
                                                ✓
                                            </Button>
                                        </div>
                                    )
                                })}
                        </Panel>
                    </Collapse>
                );
            },
        }
    ];


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
                                    rowKey="key"
                                    // onRow={(record) => {
                                    //     return {
                                    //         onClick: () => { setDetailedEventById(record.id) },
                                    //     };
                                    // }}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                            { detailedEvent &&
                                <Card
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Описание уязвимости</span>
                                        <Button
                                            type="text"
                                            icon={<CloseOutlined />}
                                            onClick={() => setDetailedEvent(undefined)}
                                            style={{ fontSize: '16px' }}
                                        />
                                    </div>
                                }
                                style={{ width: '50%' }}
                                >
                                    <List
                                        bordered
                                        dataSource={renderEventDetails(detailedEvent)}
                                        renderItem={item => item}
                                        style={{ padding: '0 16px' }}
                                    />
                                </Card>
                            }
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default EventsPageCard;
