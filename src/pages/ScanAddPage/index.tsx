
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space, Button } from 'antd';
import axios from 'axios';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_TOKEN, BASE_URL } from '../../API/consts';
import { MinusCircleOutlined } from '@ant-design/icons';
import SharedButton from '../../shared/ui-kit/Button';
import SettingsForm from './SettingsForm';
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
    
    const [editableFields, setEditableFields] = React.useState({});

    const navigate = useNavigate()

    React.useEffect(() => {
        try {
            const response = axios.get(`${BASE_URL}/templates/upload/`, {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`
                }
            }).then((res) => console.log(res));
        } catch (error) {
            console.error('Ошибка получения Scope групп:', error);
        }
    }, [])

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

    const createScan = async (name: string) => {
        try {
            const response = await axios.post('http://109.172.115.106:8000/api/v1/scan/create/', {name}, {
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
        // await createScan();
        // await fetchSettingsData();
        setIsMainBlockVisible(true);
    };

    const getScopeGroups = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/scope/`, {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`
                }
            }).then((res) => setScopeGroups(res.data.filter(item => item.name).map(item => item.name)));
        } catch (error) {
            console.error('Ошибка получения Scope групп:', error);
        }
    }

    React.useEffect(() => {
        getScopeGroups();
    }, [])

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

            // const newTemplate = response.data.name;
            // setTemplates([...templates, newTemplate]);
            // setSettingsData(prevState => ({
            //     ...prevState,
            //     template_sources: {
            //         ...prevState.template_sources,
            //         templates: [...prevState.template_sources.templates, newTemplate]
            //     }
            // }));
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
        axios.post('http://109.172.115.106:8000/api/v1/settings/', cleanSettingsData(setDisabledSettingsData(settingsData)), {
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
            console.dir(error);
            console.error('Ошибка при сохранении настроек:', error);
            alert(`Ошибка при сохранении настроек: ${JSON.stringify(error?.response?.data)}`)
        });
    };

    const handleSaveAllButton = () =>{
        createScan(settingsData.scan);
        handleSaveAll()
    }

    const scopeGroupMenu = (
        <Menu>
            {scopeGroups && scopeGroups.map((group, index) => (
                <Menu.Item key={index} onClick={() => handleSelectGroup(group)}>{group}</Menu.Item>
            ))}
            {/* <Menu.Item key="create" onClick={() => toggleModal('group', true)}>
                Создать
            </Menu.Item> */}
        </Menu>
    );

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

    const removeGroup = (index) => {
        setSettingsData(prevState => ({
            ...prevState,
            scope_groups: prevState.scope_groups.filter((_, i) => i !== index)
        }));
    };


    const setDisabledSettingsData = (data) => {
        return {
            scan: editableFields.scan ? data.scan : null,
            scope_groups: data.scope_groups,
            nmap_settings: {
                min_rate: editableFields.nmap_min_rate ?  data.nmap_settings.min_rate : null,
                version_intensity: editableFields.version_intensity ? data.nmap_settings.version_intensity : null,
                ports: editableFields.ports ? data.nmap_settings.ports : null,
                top_ports: editableFields.top_ports ? data.nmap_settings.top_ports : null,
                exclude_ports: editableFields.exclude_ports ? data.nmap_settings.exclude_ports : null
            },
            nuclei_settings: {
                concurrency: {
                    rate_limit_per_host: editableFields.template_payload_concurrency ? data.nuclei_settings.concurrency.rate_limit_per_host : null,
                },
                interactsh_options: {
                    server_url: editableFields.server_url ? data.nuclei_settings.interactsh_options.server_url : null,
                    auth: editableFields.auth ? data.nuclei_settings.interactsh_options.auth : null,
                    cache_size: editableFields.cache_size ? data.nuclei_settings.interactsh_options.cache_size : null,
                    no_interactsh: data.nuclei_settings.interactsh_options.no_interactsh
                },
                network_config: {
                    disable_max_host_err: data.nuclei_settings.network_config.disable_max_host_err,
                    interface: editableFields.interface ? data.nuclei_settings.network_config.interface : null,
                    internal_resolvers_list: editableFields.internal_resolvers_list ? data.nuclei_settings.network_config.internal_resolvers_list : null,
                    leave_default_ports: data.nuclei_settings.network_config.leave_default_ports,
                    max_host_error: editableFields.max_host_error ? data.nuclei_settings.network_config.max_host_error : null,
                    retries: editableFields.retries ? data.nuclei_settings.network_config.retries : null,
                    source_ip: editableFields.source_ip ? data.nuclei_settings.network_config.source_ip : null,
                    system_resolvers: data.nuclei_settings.network_config.system_resolvers,
                    timeout: editableFields.timeout ? data.nuclei_settings.network_config.timeout : null,
                    track_error: editableFields.track_error ? data.nuclei_settings.network_config.track_error : null
                },
                template_filters: {
                    severity: editableFields.severity ? data.nuclei_settings.template_filters.severity : null,
                    exclude_severities: editableFields.exclude_severities ? data.nuclei_settings.template_filters.exclude_severities : null,
                    protocol_types: editableFields.protocol_types ? data.nuclei_settings.template_filters.protocol_types : null,
                    exclude_protocol_types: editableFields.exclude_protocol_types ? data.nuclei_settings.template_filters.exclude_protocol_types : null,
                    authors: editableFields.authors ? data.nuclei_settings.template_filters.authors : null,
                    tags: editableFields.tags ? data.nuclei_settings.template_filters.tags : null,
                    exclude_tags: editableFields.exclude_tags ? data.nuclei_settings.template_filters.exclude_tags : null,
                    include_tags: editableFields.include_tags ? data.nuclei_settings.template_filters.include_tags : null,
                    ids: editableFields.ids ? data.nuclei_settings.template_filters.ids : null,
                    exclude_ids: editableFields.exclude_ids ? data.nuclei_settings.template_filters.exclude_ids : null,
                    template_condition: editableFields.template_condition ? data.nuclei_settings.template_filters.template_condition : null
                },
                template_sources: {
                    templates: editableFields.templates ? data.nuclei_settings.template_sources.template : null
                },
                headers: editableFields.headers ? data.nuclei_settings.headers : null,
                follow_redirects: data.nuclei_settings.follow_redirects,
                follow_host_redirects: data.nuclei_settings.follow_host_redirects,
                max_redirects: editableFields.max_redirects ? data.nuclei_settings.max_redirects : null,
                disable_redirects: data.nuclei_settings.disable_redirects,
                internal_resolvers_list: editableFields.internal_resolvers_list2 ? data.nuclei_settings.internal_resolvers_list : null,
                force_attempt_http2: data.nuclei_settings.force_attempt_http2,
                dialer_timeout: editableFields.dialer_timeout ? data.nuclei_settings.dialer_timeout : null,
                dialer_keep_alive: editableFields.dialer_keep_alive ? data.nuclei_settings.dialer_keep_alive : null,
            }
    }}


    return (
        <div className={css.scanAddPageWrapper}>
            {isMainBlockVisible ? (
                <div className={css.scanAddPageForm}>
                    <SettingsForm 
                        settingsData={settingsData} 
                        handleSettingsChange={handleSettingsChange} 
                        scopeGroupMenu={scopeGroupMenu} 
                        removeGroup={removeGroup}
                        showStatus={false}
                        editableFields={editableFields}
                        setEditableFields={setEditableFields}
                    />
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
                                    <SharedButton
                                        type="primary"
                                        icon
                                        rounded
                                        onClick={addIpField}>
                                        <div>+</div>
                                    </SharedButton>
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
                                    <SharedButton
                                        type="primary"
                                        icon
                                        rounded
                                        onClick={addDomainField}>
                                        <div>+</div>
                                    </SharedButton>
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
                            <SharedButton
                                size="small"
                                type="secondary"
                                onClick={handleSaveGroup}
                                rounded>
                                {saveStatus}
                            </SharedButton>
                        </div>
                    </Modal>
                    <Button
                        className={css.saveButton}
                        type="primary"
                        onClick={handleSaveAllButton}
                        rounded>
                        <div>Сохранить</div>
                    </Button>
                </div>
            ) : null}
            <Modal isOpen={isOpenTemplate} onClose={() => setIsOpenTemplate(false)}>
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
                            <SharedButton
                                size="small"
                                type="secondary"
                                onClick={handleSaveTemplate}
                                rounded>
                                {templateSaveStatus}
                            </SharedButton>
                        </div>
            </Modal>
            <div className={css.inputWrapper}>
                <span>Создать скан</span>
                <SharedButton
                    type="secondary"
                    icon
                    rounded
                    onClick={handleAddScanClick}>
                    <div>+</div>
                </SharedButton>
            </div>
            <div className={css.inputWrapper}>
                <span>Загрузить template</span>
                <SharedButton
                    type="secondary"
                    icon
                    rounded
                    onClick={() => setIsOpenTemplate(true)}>
                    <div>+</div>
                </SharedButton>
            </div>

        </div>
    );
}

export default ScanAddPage;
