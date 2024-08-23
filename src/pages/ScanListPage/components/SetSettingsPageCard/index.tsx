import React from 'react'
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import css from '../SettigsPageCard/index.module.scss';
import css2 from './index.module.scss';
import SettingsForm from '../../../ScanAddPage/SettingsForm';
import * as API from '../../../../API/api';
import { Menu, Button } from 'antd';
import { BASE_URL, API_TOKEN } from '../../../../API/consts';

const SettingsPageCard: FC = () => {
    const [scanSettings, setScanSettings] = useState();
    const {name} = useParams();


    const [scopeGroups, setScopeGroups] = useState<string[]>([]);
    const [editableFields, setEditableFields] = React.useState({});
    const [templates, setTemplates] = useState<string[]>([]);

    React.useEffect(() => {
        axios.get(`${BASE_URL}/templates/upload/`, {
            headers: {
                'Authorization': `Token ${API_TOKEN}`
            }
        })
        .then((res) => setTemplates(res.data.templates.filter(item => item.name).map(item => item.name)))
        .catch((e) => console.error('Ошибка получения шаблонов:', e));
    }, [])

    useEffect(() => {
        const fetchScanSettings = async () => {
            if (!name) {
                return;
            }
            axios.get(`${BASE_URL}/settings/${name}/`,  {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`
                }
              })
              .then(res => {
                setScanSettings(res.data);
                setBaseSettingsData(res.data)
              })
              .catch((error) => {
                  console.error('Ошибка при получении настроек скана:', error);
            });
        };
        fetchScanSettings();
    }, [name]);

    const setBaseSettingsData = (data) => {
        setSettingsData({
            scan: data.scan || '',
            scope_groups: data.scope_groups || [''],
            nmap_settings: {
                min_rate: data.nmap_settings.min_rate || null,
                version_intensity: data.nmap_settings.version_intensity || null,
                ports: data.nmap_settings.ports || '',
                top_ports: data.nmap_settings.top_ports || null,
                exclude_ports: data.nmap_settings.exclude_ports || ''
            },
            nuclei_settings: {
                concurrency: {
                    rate_limit_per_host: data.nuclei_settings.concurrency.rate_limit_per_host || null,
                },
                interactsh_options: {
                    server_url: data.nuclei_settings.interactsh_options.server_url || '',
                    auth: data.nuclei_settings.interactsh_options.auth || '',
                    cache_size: data.nuclei_settings.interactsh_options.cache_size || null,
                    no_interactsh: data.nuclei_settings.interactsh_options.no_interactsh || false
                },
                network_config: {
                    disable_max_host_err: data.nuclei_settings.network_config.disable_max_host_err || false,
                    interface: data.nuclei_settings.network_config.interface || '',
                    internal_resolvers_list: data.nuclei_settings.network_config.internal_resolvers_list || [''],
                    leave_default_ports: data.nuclei_settings.network_config.leave_default_ports || false,
                    max_host_error: data.nuclei_settings.network_config.max_host_error || null,
                    retries: data.nuclei_settings.network_config.retries || null,
                    source_ip: data.nuclei_settings.network_config.source_ip || '',
                    system_resolvers: data.nuclei_settings.network_config.system_resolvers || false,
                    timeout: data.nuclei_settings.network_config.timeout || null,
                    track_error: data.nuclei_settings.network_config.track_error || ['']
                },
                template_filters: {
                    severity: data.nuclei_settings.template_filters.severity || '',
                    exclude_severities: data.nuclei_settings.template_filters.exclude_severities || '',
                    protocol_types: data.nuclei_settings.template_filters.protocol_types || '',
                    exclude_protocol_types: data.nuclei_settings.template_filters.exclude_protocol_types || '',
                    authors: data.nuclei_settings.template_filters.authors || [''],
                    tags: data.nuclei_settings.template_filters.tags || [''],
                    exclude_tags: data.nuclei_settings.template_filters.exclude_tags || [''],
                    include_tags: data.nuclei_settings.template_filters.include_tags || [''],
                    ids: data.nuclei_settings.template_filters.ids || [''],
                    exclude_ids: data.nuclei_settings.template_filters.exclude_ids || [''],
                    template_condition: data.nuclei_settings.template_filters.template_condition || ['']
                },
                template_sources: {
                    templates: data.nuclei_settings.template_sources.template || ['']
                },
                headers: data.nuclei_settings.headers || [''],
                follow_redirects: data.nuclei_settings.follow_redirects || false,
                follow_host_redirects: data.nuclei_settings.follow_host_redirects || false,
                max_redirects: data.nuclei_settings.max_redirects || null,
                disable_redirects: data.nuclei_settings.disable_redirects || false,
                internal_resolvers_list: data.nuclei_settings.internal_resolvers_list || [''],
                force_attempt_http2: data.nuclei_settings.force_attempt_http2 || false,
                dialer_timeout: data.nuclei_settings.dialer_timeout || '',
                dialer_keep_alive: data.nuclei_settings.dialer_keep_alive || '',
            }
        });
    }

    const [settingsData, setSettingsData] = useState<any>({
        scan: '',
        scope_groups: [''],
        nmap_settings: {
            min_rate: null,
            version_intensity: null,
            ports: '',
            top_ports: null,
            exclude_ports: ''
        },
        nuclei_settings: {
            concurrency: {
                rate_limit_per_host: null,
            },
            interactsh_options: {
                server_url: '',
                auth: '',
                cache_size: null,
                no_interactsh: false
            },
            network_config: {
                disable_max_host_err: false,
                interface: '',
                internal_resolvers_list: [''],
                leave_default_ports: false,
                max_host_error: null,
                retries: null,
                source_ip: '',
                system_resolvers: false,
                timeout: null,
                track_error: ['']
            },
            template_filters: {
                severity: '',
                exclude_severities: '',
                protocol_types: '',
                exclude_protocol_types: '',
                authors: [''],
                tags: [''],
                exclude_tags: [''],
                include_tags: [''],
                ids: [''],
                exclude_ids: [''],
                template_condition: ['']
            },
            template_sources: {
                templates: ['']
            },
            headers: [''],
            follow_redirects: false,
            follow_host_redirects: false,
            max_redirects: null,
            disable_redirects: false,
            internal_resolvers_list: [''],
            force_attempt_http2: false,
            dialer_timeout: '',
            dialer_keep_alive: '',
        }
    });

    const handleSettingsChange = (section: string, key: string, value: any) => {
        if (section === 'settingsData') {
            setSettingsData(prevState => ({
                ...prevState,
                [key]: value
            }));
        } else {
            setSettingsData(prevState => ({
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [key]: value
                }
            }));
        }
    };

    const cleanSettingsData = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;
    
        if (Array.isArray(obj)) {
            const cleanedArray = obj
                .map(cleanSettingsData) 
                .filter(item => item !== null && item !== undefined && item !== '');
    
            return cleanedArray.length > 0 ? cleanedArray : undefined;
        }
    
        if (typeof obj === 'object' && obj !== null) {
            const cleanedObject = Object.keys(obj)
                .reduce((acc: any, key: string) => {
                    const value = cleanSettingsData(obj[key]);
                    if (value !== null && value !== undefined && value !== '') {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
    
            return Object.keys(cleanedObject).length > 0 ? cleanedObject : undefined;
        }
    
        return obj;
    };    

    const saveSettingsChanges = () => {
        axios.put(`${BASE_URL}/settings/`, cleanSettingsData(settingsData), {
            headers: {
                'Authorization': `Token ${API_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            console.log('Settings saved');
        })
        .catch(error => {
            console.error('Ошибка при сохранении настроек:', error);
            alert(`Ошибка при сохранении настроек: ${error.message}`)
        });
    };


    const handleSelectGroup = (group: string) => {
        setSettingsData(prevState => {
            const isGroupPresent = prevState.scope_groups.includes(group);
            if (isGroupPresent) {
                return prevState;
            }
            return {
                ...prevState,
                scope_groups: [...prevState.scope_groups, group]
            };
        });
    };

    const scopeGroupMenu = (
        <Menu>
            {scopeGroups && scopeGroups.map((group, index) => (
                <Menu.Item key={index} onClick={() => handleSelectGroup(group)}>{group}</Menu.Item>
            ))}
        </Menu>
    );

    const getScopeGroups = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/scope/`, {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`
                }
            }).then((res) => {
                setScopeGroups(res.data.filter(item => item.name).map(item => item.name));
            });
        } catch (error) {
            console.error('Ошибка получения Scope групп:', error);
        }
    }

    React.useEffect(() => {
        getScopeGroups();
    }, [])

    const removeGroup = (index) => {
        setSettingsData(prevState => ({
            ...prevState,
            scope_groups: prevState.scope_groups.filter((_, i) => i !== index)
        }));
    };

    const handleSelectTemplate = (template: string) => {
        setSettingsData(prevState => ({
            ...prevState,
            nuclei_settings: {
                ...prevState.nuclei_settings,
                template_sources: {
                    ...prevState.template_sources,
                    templates: [...prevState.nuclei_settings.template_sources.templates, template]
                }
            }
        }));
    };
  
    const templateMenu = (
        <Menu>
            {templates && templates.map((template, index) => (
                <Menu.Item key={index} onClick={() => handleSelectTemplate(template)}>{template}</Menu.Item>
            ))}
        </Menu>
    );
    
    const removeTemplateItem = (index) => {
        setSettingsData(prevState => ({
            ...prevState,
            nuclei_settings: {
                ...prevState.nuclei_settings,
                template_sources: {
                    ...prevState.template_sources,
                    templates: prevState.nuclei_settings.template_sources.templates.filter((_, i) => i !== index)
                }
            }
        }));
    };

    return (
        <div className={css.settingsPageWrapper} style={{"padding" : "20px"}}>
            <div className={css2.scanAddPageForm}>
            <SettingsForm 
                settingsData={settingsData} 
                handleSettingsChange={handleSettingsChange} 
                scopeGroupMenu={scopeGroupMenu} 
                templateMenu={templateMenu} 
                removeTemplateItem={removeTemplateItem}
                removeGroup={removeGroup}
                showStatus={true}
                editableFields={editableFields}
                setEditableFields={setEditableFields}
            />
            </div>
            <Button
                type="primary"
                className={css2.saveButton}
                onClick={saveSettingsChanges}>
                <div>Сохранить</div>
            </Button>
        </div>
    );
};

export default SettingsPageCard;
