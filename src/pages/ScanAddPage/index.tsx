
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd';
import axios from 'axios';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_TOKEN } from '../../API/consts';
import Button from '../../shared/ui-kit/Button';
import Modal from '../../shared/ui-kit/Modal';
import css from './index.module.scss';

const ScanAddPage: FC = () => {

    const [isOpenGroup, setIsOpenGroup] = useState(false);
    const [isOpenTemplate, setIsOpenTemplate] = useState(false);
    const [isMainBlockVisible, setIsMainBlockVisible] = useState(false);

    const [name, setName] = useState('');
    const [ips, setIps] = useState<string[]>([]);
    const [domains, setDomains] = useState<string[]>([]);
    const [nameError, setNameError] = useState('');
    const [ipError, setIpError] = useState('');
    const [saveStatus, setSaveStatus] = useState('Сохранить');

    const [file, setFile] = useState<File | null>(null);
    const [templateError, setTemplateError] = useState('');
    const [templateSaveStatus, setTemplateSaveStatus] = useState('Сохранить');

    const [scopeGroups, setScopeGroups] = useState<string[]>([]);
    const [templates, setTemplates] = useState<string[]>([]);

    const navigate = useNavigate()

    const [settingsData, setSettingsData] = useState<any>({
        scan: '',
        scope_groups: [''],
        nmap_settings: {
            min_rate: 0,
            version_intensity: 0,
            ports: '',
            top_ports: 0,
            exclude_ports: ''
        },
        nuclei_settings: {
            concurrency: {
                template_concurrency: 0,
                host_concurrency: 0,
                headless_host_concurrency: 0,
                headless_template_concurrency: 0,
                javascript_template_concurrency: 0,
                template_payload_concurrency: 0
            },
            interactsh_options: {
                server_url: '',
                auth: '',
                cache_size: 0,
                no_interactsh: false
            },
            network_config: {
                disable_max_host_err: false,
                interface: '',
                internal_resolvers_list: [''],
                leave_default_ports: false,
                max_host_error: 0,
                retries: 0,
                source_ip: '',
                system_resolvers: false,
                timeout: 0,
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
            max_redirects: 0,
            disable_redirects: false,
            internal_resolvers_list: [''],
            force_attempt_http2: false,
            dialer_timeout: '',
            dialer_keep_alive: '',
            global_rate_limit_max_tokens: 0,
            global_rate_limit_duration: ''
        }
    });

    const addIpField = () => setIps([...ips, '']);
    const addDomainField = () => setDomains([...domains, '']);
    
    const handleIpChange = (index: number, value: string) => {
        const newIps = [...ips];
        newIps[index] = value;
        setIps(newIps);
    };
    
    const handleDomainChange = (index: number, value: string) => {
        const newDomains = [...domains];
        newDomains[index] = value;
        setDomains(newDomains);
    };
    
    const toggleModal = (type: 'group' | 'template', isOpen: boolean) => {
        if (type === 'group') {
            setIsOpenGroup(isOpen);
            setSaveStatus('Сохранить');
        } else if (type === 'template') {
            setIsOpenTemplate(isOpen);
            setTemplateSaveStatus('Сохранить');
        }
    };

    const fetchSettingsData = async () => {
        try {
            const response = await axios.get('http://109.172.115.106:8000/api/v1/settings/', {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`
                }
            });
            setSettingsData(response.data);
        } catch (error) {
            console.error('Ошибка при получении настроек:', error);
        }
    };

    const createScan = async () => {
        try {
            const response = await axios.post('http://109.172.115.106:8000/api/v1/scan/create/', {}, {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            setSettingsData(prevState => ({
                ...prevState,
                scan: response.data.scan_name
            }));
        } catch (error) {
            console.error('Ошибка при создании скана:', error);
        }
    };

    const handleAddScanClick = async () => {
        await createScan();
        await fetchSettingsData();
        setIsMainBlockVisible(true);
    };

    const handleSaveGroup = async () => {
        setNameError('');
        setIpError('');
        setSaveStatus('Сохранить');

        try {
            const response = await axios.post('http://109.172.115.106:8000/api/v1/scope/', {
                name: name,
                ips: ips.map(ip => ({ ip, domains: [] })),
                domains: domains.map(domain => ({ domain, ips: [] })),
                display: true
            }, {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const newGroup = response.data.name;
            setScopeGroups([...scopeGroups, newGroup]);
            setSettingsData(prevState => ({
                ...prevState,
                scope_groups: [...prevState.scope_groups, newGroup]
            }));
            setSaveStatus('Сохранено');
            toggleModal('group', false);
        } catch (error) {
            console.error('Ошибка:', error);
            if (error.response && error.response.data && error.response.data.name) {
                setNameError('Группа с таким именем уже существует.');
            }
            if (error.response && error.response.data && error.response.data.ips) {
                setIpError('Введите корректный IPv4 адрес.');
            }
            setSaveStatus('Сохранить');
        }
    };

    const handleSaveTemplate = async () => {
        if (!file) {
            setTemplateError('Пожалуйста, выберите файл.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://109.172.115.106:8000/api/v1/templates/upload/', formData, {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`,
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            });

            const newTemplate = response.data.name;
            setTemplates([...templates, newTemplate]);
            setSettingsData(prevState => ({
                ...prevState,
                template_sources: {
                    ...prevState.template_sources,
                    templates: [...prevState.template_sources.templates, newTemplate]
                }
            }));
            setTemplateSaveStatus('Сохранено');
            toggleModal('template', false);
        } catch (error) {
            console.error('Ошибка:', error);
            if (error.response && error.response.data && error.response.data.error) {
                if (error.response.data.error === "yaml: invalid leading UTF-8 octet") {
                    setTemplateError('Неверный тип файла. Загрузите корректный YAML файл.');
                } else {
                    setTemplateError('Не удалось загрузить файл. Проверьте файл.');
                }
            } else {
                setTemplateError('Произошла неизвестная ошибка.');
            }
            setTemplateSaveStatus('Сохранить');
        }
    };

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

    const handleSaveAll = () => {
        axios.post('http://109.172.115.106:8000/api/v1/settings/', settingsData, {
            headers: {
                'Authorization': `Token ${API_TOKEN}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            console.log('Settings saved');
            return handleSaveGroup();
        })
        .then(() => {
            console.log('Group saved');
            return handleSaveTemplate();
        })
        .then(() => {
            console.log('Template saved');
            const scanName = settingsData.scan;
            navigate(`/details/${scanName}`);
            console.log('Navigating to details page');
        })
        .catch(error => {
            console.error('Ошибка при сохранении настроек:', error);
        });
    };

    const handleSaveAllButton = () =>{
        handleSaveAll()
        createScan()
    }

    const scopeGroupMenu = (
        <Menu>
            {scopeGroups.map((group, index) => (
                <Menu.Item key={index} onClick={() => handleSelectGroup(group)}>{group}</Menu.Item>
            ))}
            <Menu.Item key="create" onClick={() => toggleModal('group', true)}>
                Создать
            </Menu.Item>
        </Menu>
    );

    const handleSelectGroup = (group: string) => {
        setSettingsData(prevState => ({
            ...prevState,
            scope_groups: [...prevState.scope_groups, group]
        }));
    };

    const templateMenu = (
        <Menu>
            {templates.map((template, index) => (
                <Menu.Item key={index} onClick={() => handleSelectTemplate(template)}>{template}</Menu.Item>
            ))}
            <Menu.Item key="create" onClick={() => toggleModal('template', true)}>
                Создать
            </Menu.Item>
        </Menu>
    );

    const handleSelectTemplate = (template: string) => {
        setSettingsData(prevState => ({
            ...prevState,
            template_sources: {
                ...prevState.template_sources,
                templates: [...prevState.template_sources.templates, template]
            }
        }));
    };

return (
        <div className={css.scanAddPageWrapper}>
            {isMainBlockVisible ? (
                <div className={css.scanAddPageForm}>
                    <div>
                        <h2>Основные настройки</h2>
                        <div className={css.inputWrapper}>
                            <label>Scan:</label>
                            <input
                                type="text"
                                value={settingsData.scan}
                                onChange={(e) => handleSettingsChange('settingsData', 'scan', e.target.value)}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Scope Groups:</label>
                            <Dropdown overlay={scopeGroupMenu}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        Выберите группу
                                        <DownOutlined />
                                    </Space>
                                </a>
                            </Dropdown>
                            <div className={css.dropdownSelectedBlock}>
                                {settingsData.scope_groups.map((group, index) => (
                                    <div key={index}>{group}</div>
                                ))}
                            </div>
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Nmap Min Rate:</label>
                            <input
                                type="number"
                                value={settingsData.nmap_settings.min_rate}
                                onChange={(e) => handleSettingsChange('nmap_settings', 'min_rate', parseInt(e.target.value))}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Version Intensity:</label>
                            <input
                                type="number"
                                value={settingsData.nmap_settings.version_intensity}
                                onChange={(e) => handleSettingsChange('nmap_settings', 'version_intensity', parseInt(e.target.value))}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Ports:</label>
                            <input
                                type="text"
                                value={settingsData.nmap_settings.ports}
                                onChange={(e) => handleSettingsChange('nmap_settings', 'ports', e.target.value)}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Top Ports:</label>
                            <input
                                type="

number"
                                value={settingsData.nmap_settings.top_ports}
                                onChange={(e) => handleSettingsChange('nmap_settings', 'top_ports', parseInt(e.target.value))}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Exclude Ports:</label>
                            <input
                                type="text"
                                value={settingsData.nmap_settings.exclude_ports}
                                onChange={(e) => handleSettingsChange('nmap_settings', 'exclude_ports', e.target.value)}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Template Concurrency:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.concurrency.template_concurrency}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'concurrency', {
                                    ...settingsData.nuclei_settings.concurrency,
                                    template_concurrency: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Host Concurrency:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.concurrency.host_concurrency}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'concurrency', {
                                    ...settingsData.nuclei_settings.concurrency,
                                    host_concurrency: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Headless Host Concurrency:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.concurrency.headless_host_concurrency}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'concurrency', {
                                    ...settingsData.nuclei_settings.concurrency,
                                    headless_host_concurrency: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Headless Template Concurrency:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.concurrency.headless_template_concurrency}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'concurrency', {
                                    ...settingsData.nuclei_settings.concurrency,
                                    headless_template_concurrency: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>JavaScript Template Concurrency:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.concurrency.javascript_template_concurrency}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'concurrency', {
                                    ...settingsData.nuclei_settings.concurrency,
                                    javascript_template_concurrency: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Template Payload Concurrency:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.concurrency.template_payload_concurrency}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'concurrency', {
                                    ...settingsData.nuclei_settings.concurrency,
                                    template_payload_concurrency: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Server URL:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.interactsh_options.server_url}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                                    ...settingsData.nuclei_settings.interactsh_options,
                                    server_url: e.target.value
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Auth:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.interactsh_options.auth}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                                    ...settingsData.nuclei_settings.interactsh_options,
                                    auth: e.target.value
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Cache Size:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.interactsh_options.cache_size}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                                    ...settingsData.nuclei_settings.interactsh_options,
                                    cache_size: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>No Interactsh:</label>
                            <input
                                type="checkbox"
                                checked={settingsData.nuclei_settings.interactsh_options.no_interactsh}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                                    ...settingsData.nuclei_settings.interactsh_options,
                                    no_interactsh: e.target.checked
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Disable Max Host Err:</label>
                            <input
                                type="checkbox"
                                checked={settingsData.nuclei_settings.network_config.disable_max_host_err}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                                    ...settingsData.nuclei_settings.network_config,
                                    disable_max_host_err: e.target.checked
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Interface:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.network_config.interface}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                                    ...settingsData.nuclei_settings.network_config,
                                    interface: e.target.value
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Internal Resolvers List:</label>
                            {settingsData.nuclei_settings.network_config.internal_resolvers_list.map((resolver: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={resolver}
                                    onChange={(e) => {
                                        const newResolversList = [...settingsData.nuclei_settings.network_config.internal_resolvers_list];
                                        newResolversList[index] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'network_config', {
                                            ...settingsData.nuclei_settings.network_config,
                                            internal_resolvers_list: newResolversList
                                        });
                                    }}
                                />
                            ))}
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Leave Default Ports:</label>
                            <input
                                type="checkbox"
                                checked={settingsData.nuclei_settings.network_config.leave_default_ports}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                                    ...settingsData.nuclei_settings.network_config,
                                    leave_default_ports: e.target.checked
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Max Host Error:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.network_config.max_host_error}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                                    ...settingsData.nuclei_settings.network_config,
                                    max_host_error: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Retries:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.network_config.retries}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                                    ...settingsData.nuclei_settings.network_config,
                                    retries: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Source IP:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.network_config.source_ip}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                                    ...settingsData.nuclei_settings.network_config,
                                    source_ip: e.target.value
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>System Resolvers:</label>
                            <input
                                type="checkbox"
                                checked={settingsData.nuclei_settings.network_config.system_resolvers}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                                    ...settingsData.nuclei_settings.network_config,
                                    system_resolvers: e.target.checked
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Timeout:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.network_config.timeout}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                                    ...settingsData.nuclei_settings.network_config,
                                    timeout: parseInt(e.target.value)
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Track Error:</label>
                            {settingsData.nuclei_settings.network_config.track_error.map((error: string, index: number) => (
                            <input
                                key={index}
                                type="text"
                                value={error}
                                onChange={(e) => {
                                    const newTrackError = [...settingsData.nuclei_settings.network_config.track_error];
                                    newTrackError[index] = e.target.value;
                                    handleSettingsChange('nuclei_settings', 'network_config', {
                                        ...settingsData.nuclei_settings.network_config,
                                        track_error: newTrackError
                                    });
                                }}
                            />
                        ))}

                        </div>
                        <div className={css.inputWrapper}>
                            <label>Severity:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.template_filters.severity}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'template_filters', {
                                    ...settingsData.nuclei_settings.template_filters,
                                    severity: e.target.value
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Exclude Severities:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.template_filters.exclude_severities}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'template_filters', {
                                    ...settingsData.nuclei_settings.template_filters,
                                    exclude_severities: e.target.value
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Protocol Types:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.template_filters.protocol_types}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'template_filters', {
                                    ...settingsData.nuclei_settings.template_filters,
                                    protocol_types: e.target.value
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Exclude Protocol Types:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.template_filters.exclude_protocol_types}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'template_filters', {
                                    ...settingsData.nuclei_settings.template_filters,
                                    exclude_protocol_types: e.target.value
                                })}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Authors:</label>
                            {settingsData.nuclei_settings.template_filters.authors.map((author: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={author}
                                    onChange={(e) => {
                                        const newAuthors = [...settingsData.nuclei_settings.template_filters.authors];
                                        newAuthors[index] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'template_filters', {
                                            ...settingsData.nuclei_settings.template_filters,
                                            authors: newAuthors
                                        });
                                    }}
                                />
                            ))}
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Tags:</label>
                            {settingsData.nuclei_settings.template_filters.tags.map((tag: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={tag}
                                    onChange={(e) => {
                                        const newTags = [...settingsData.nuclei_settings.template_filters.tags];
                                        newTags[index] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'template_filters', {
                                            ...settingsData.nuclei_settings.template_filters,
                                            tags: newTags
                                        });
                                    }}
                                />
                            ))}
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Exclude Tags:</label>
                            {settingsData.nuclei_settings.template_filters.exclude_tags.map((tag: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={tag}
                                    onChange={(e) => {
                                        const newExcludeTags = [...settingsData.nuclei_settings.template_filters.exclude_tags];
                                        newExcludeTags[index] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'template_filters', {
                                            ...settingsData.nuclei_settings.template_filters,
                                            exclude_tags: newExcludeTags
                                        });
                                    }}
                                />
                            ))}
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Include Tags:</label>
                            {settingsData.nuclei_settings.template_filters.include_tags.map((tag: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={tag}
                                    onChange={(e) => {
                                        const newIncludeTags = [...settingsData.nuclei_settings.template_filters.include_tags];
                                        newIncludeTags[index] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'template_filters', {
                                            ...settingsData.nuclei_settings.template_filters,
                                            include_tags: newIncludeTags
                                        });
                                    }}
                                />
                            ))}
                        </div>
                        <div className={css.inputWrapper}>
                            <label>IDs:</label>
                            {settingsData.nuclei_settings.template_filters.ids.map((id: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={id}
                                    onChange={(e) => {
                                        const newIds = [...settingsData.nuclei_settings.template_filters.ids];
                                        newIds[index] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'template_filters', {
                                            ...settingsData.nuclei_settings.template_filters,
                                            ids: newIds
                                        });
                                    }}
                                />
                            ))}
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Exclude IDs:</label>
                            {settingsData.nuclei_settings.template_filters.exclude_ids.map((id: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={id}
                                    onChange={(e) => {
                                        const newExcludeIds = [...settingsData.nuclei_settings.template_filters.exclude_ids];
                                        newExcludeIds[index] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'template_filters', {
                                            ...settingsData.nuclei_settings.template_filters,
                                            exclude_ids: newExcludeIds
                                        });
                                    }}
                                />
                            ))}
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Template Condition:</label>
                            {settingsData.nuclei_settings.template_filters.template_condition.map((condition: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={condition}
                                    onChange={(e) => {
                                        const newTemplateCondition = [...settingsData.nuclei_settings.template_filters.template_condition];
                                        newTemplateCondition[index] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'template_filters', {
                                            ...settingsData.nuclei_settings.template_filters,
                                            template_condition: newTemplateCondition
                                        });
                                    }}
                                />
                            ))}
                        </div>
                        <div className={css.inputWrapper}>
                        {/* <label>Template sources:</label>
                        <Dropdown overlay={templateMenu}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    Выберите шаблон
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown> */}
                        {/* <div>
                            {settingsData.template_sources.templates.map((template, index) => (
                                <div key={index}>{template}</div>
                            ))}
                        </div> */}
                    </div>
                        <div className={css.inputWrapper}>
                            <label>Headers:</label>
                            {settingsData.nuclei_settings.headers.map((header: string, index: number) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={header}
                                    onChange={(e) => {
                                        const newHeaders = [...settingsData.nuclei_settings.headers];
                                        newHeaders[index] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'headers', newHeaders);
                                    }}
                                />
                            ))}
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Follow Redirects:</label>
                            <input
                                type="checkbox"
                                checked={settingsData.nuclei_settings.follow_redirects}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'follow_redirects', e.target.checked)}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Follow Host Redirects:</label>
                            <input
                                type="checkbox"
                                checked={settingsData.nuclei_settings.follow_host_redirects}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'follow_host_redirects', e.target.checked)}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Max Redirects:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.max_redirects}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'max_redirects', parseInt(e.target.value))}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Disable Redirects:</label>
                            <input
                                type="checkbox"
                                checked={settingsData.nuclei_settings.disable_redirects}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'disable_redirects', e.target.checked)}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Force Attempt HTTP2:</label>
                            <input
                                type="checkbox"
                                checked={settingsData.nuclei_settings.force_attempt_http2}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'force_attempt_http2', e.target.checked)}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Dialer Timeout:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.dialer_timeout}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'dialer_timeout', e.target.value)}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Dialer Keep Alive:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.dialer_keep_alive}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'dialer_keep_alive', e.target.value)}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Global Rate Limit Max Tokens:</label>
                            <input
                                type="number"
                                value={settingsData.nuclei_settings.global_rate_limit_max_tokens}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'global_rate_limit_max_tokens', parseInt(e.target.value))}
                            />
                        </div>
                        <div className={css.inputWrapper}>
                            <label>Global Rate Limit Duration:</label>
                            <input
                                type="text"
                                value={settingsData.nuclei_settings.global_rate_limit_duration}
                                onChange={(e) => handleSettingsChange('nuclei_settings', 'global_rate_limit_duration', e.target.value)}
                            />
                        </div>
                    </div>
                    <Modal isOpen={isOpenGroup} onClose={() => toggleModal('group', false)}>
                        <div className={css.modalContent}>
                            <h2>Создать скоп группу</h2>
                            <form>
                                <div>
                                    <label>
                                        Название:
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        {nameError && <div className={css.modalError}>{nameError}</div>}
                                    </label>
                                </div>
                                <div className={css.inputWrapper}>
                                    <div>IP:</div>
                                    <Button
                                        type="primary"
                                        icon
                                        rounded
                                        onClick={addIpField}>
                                        <div>+</div>
                                    </Button>
                                    {ips.map((ip, index) => (
                                        <div key={index}>
                                            <label>
                                                <input
                                                    type="text"
                                                    value={ip}
                                                    onChange={(e) => handleIpChange(index, e.target.value)}
                                                />
                                                {ipError && <div className={css.modalError}>{ipError}</div>}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className={css.inputWrapper}>
                                    <div>Домен:</div>
                                    <Button
                                        type="primary"
                                        icon
                                        rounded
                                        onClick={addDomainField}>
                                        <div>+</div>
                                    </Button>
                                    {domains.map((domain, index) => (
                                        <div key={index}>
                                            <label>
                                                <input
                                                    type="text"
                                                    value={domain}
                                                    onChange={(e) => handleDomainChange(index, e.target.value)}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </form>
                            <Button
                                size="small"
                                type="secondary"
                                onClick={handleSaveGroup}
                                rounded>
                                {saveStatus}
                            </Button>
                        </div>
                    </Modal>
                    <Modal isOpen={isOpenTemplate} onClose={() => toggleModal}>
                        <div className={css.modalContent}>
                            <h2>Создать template</h2>
                            <form>
                                <div>
                                    <label>
                                        Загрузить файл:
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const files = e.target.files;
                                                if (files && files[0]) {
                                                    setFile(files[0]);
                                                }
                                            }}
                                        />
                                        {templateError && <div className={css.modalError}>{templateError}</div>}
                                    </label>
                                </div>
                            </form>
                            <Button
                                size="small"
                                type="secondary"
                                onClick={handleSaveTemplate}
                                rounded>
                                {templateSaveStatus}
                            </Button>
                        </div>
                    </Modal>
                    <Button
                        className={css.saveButton}
                        size="small"
                        type="primary"
                        onClick={handleSaveAllButton}
                        rounded>
                        <div>Сохранить</div>
                    </Button>
                </div>
            ) : null}
            <div className={css.inputWrapper}>
                <span>Создать скан</span>
                <Button
                    type="secondary"
                    icon
                    rounded
                    onClick={handleAddScanClick}>
                    <div>+</div>
                </Button>
            </div>

        </div>
    );
}

export default ScanAddPage;
