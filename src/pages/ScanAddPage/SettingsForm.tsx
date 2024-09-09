import React from 'react';
import { Form, Input, Button, Checkbox, Space, Dropdown, Menu, Typography } from 'antd';
import axios from 'axios';
const { Title, Text } = Typography;
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { BASE_URL, API_TOKEN } from '../../API/consts';
import { MinusCircleOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import DynamicFieldList from './DynamicFieldList';
import css from './index.module.scss';

const { Item: FormItem, List: FormList } = Form;

const SettingsForm = ({ settingsData, handleSettingsChange, scopeGroupMenu, templateMenu, removeTemplateItem, removeGroup, showStatus, editableFields, setEditableFields }) => {


    const [scanStatus, setScanStatus] = React.useState('');
    const [isRunning, setIsRunning] = React.useState(false);

    const handleToggleEdit = (key) => {
        setEditableFields(prev => {
            const newEditableFields = { ...prev };
            if (newEditableFields[key]) {
                newEditableFields[key] = false;
            } else {
                newEditableFields[key] = true;
            }
            return newEditableFields;
        });
    };

    const setLocalScanStatus = (res) => {
        if (typeof res.data.info === 'string') {
            setScanStatus(res.data.info);
            setIsRunning(false);
        } else {
            let statusString = '';
            if (res.data.info?.status) {
                statusString = statusString + `${res.data.info?.status}`;
                if (res.data.info?.status == "Running") {
                    setIsRunning(true);
                }
            }
            if (res.data.info?.status != "Finished") {
                if (res.data.info?.extendedStatistics?.percent) {
                    statusString = statusString + ` Процент выполнения: ${res.data.info?.extendedStatistics?.percent}%`;
                } else {
                    statusString = statusString + ` проводится OSINT`;
                }
            }
            setScanStatus(statusString);
        }
    }

    const getScanStatus = () => {
        if (settingsData.scan && showStatus) {
            axios.get(`${BASE_URL}/scan/status/${settingsData.scan}/`,  {
                headers: {
                    'Authorization': `Token ${API_TOKEN}`
                }
              })
              .then(res => setLocalScanStatus(res))
              .catch((error) => {
                  console.error('Ошибка:', error);
              });
        } 
    }

    const stopScan = (name) => {
        axios.get(`${BASE_URL}/scan/stop/${name}/`, {
            headers: {
                'Authorization': `Token ${API_TOKEN}`
            }
          })
          .catch((error) => {
              console.error('Ошибка:', error);
          });
    }

    React.useEffect(() => {
        getScanStatus();
    }, [settingsData])


    const startScan = (name) => {
        axios.post(`${BASE_URL}/scan/start/${name}/`, {}, {
              headers: {
                  'Authorization': `Token ${API_TOKEN}`,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
        }).then(() => getScanStatus()).catch(e => console.error('Ошибка запуска скана', e)) 
    };

    return (
        <Form layout="vertical">
            {showStatus && <div className={css.startButton}>
                <div><p>Запустить скан</p><Button size="medium" disabled={isRunning} icon={<PlayCircleOutlined />} rounded={true} onClick={(e) => {e.stopPropagation(); startScan(settingsData.scan)}}></Button></div>
                <div><p>Остановить скан</p><Button size="medium" disabled={!isRunning} icon={<PauseCircleOutlined />} rounded={true} onClick={(e) => {e.stopPropagation(); stopScan(settingsData.scan)}}></Button></div>
                </div>}
            {showStatus && <Title level={5}>Статус скана: {scanStatus || 'Не известен'}</Title>}
            <Title level={3}>Основные настройки</Title>
            <FormItem className={css.formItem} label="Scan Name">
                <Space>
                    <Input
                        value={settingsData.scan}
                        disabled={!editableFields.scan}
                        onChange={(e) => handleSettingsChange('settingsData', 'scan', e.target.value)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('scan')}
                    />
                </Space>
            </FormItem>

            <FormItem label="Scope Groups">
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
                        <div key={index}>
                            {group}
                            {index > 0 && (
                                <Button
                                    type="danger"
                                    size="small"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => removeGroup(index)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </FormItem>

            <Title level={5}>Nmap settings</Title>

            <FormItem className={css.formItem} label="Nmap Min Rate">
                <Space>
                    <Input
                        type="number"
                        value={settingsData.nmap_settings.min_rate}
                        disabled={!editableFields.nmap_min_rate}
                        onChange={(e) => handleSettingsChange('nmap_settings', 'min_rate', parseInt(e.target.value))}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('nmap_min_rate')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Version Intensity">
                <Space>
                    <Input
                        type="number"
                        value={settingsData.nmap_settings.version_intensity}
                        disabled={!editableFields.version_intensity}
                        onChange={(e) => handleSettingsChange('nmap_settings', 'version_intensity', parseInt(e.target.value))}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('version_intensity')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Ports">
                <Space>
                    <Input
                        type="text"
                        value={settingsData.nmap_settings.ports}
                        disabled={!editableFields.ports}
                        onChange={(e) => handleSettingsChange('nmap_settings', 'ports', e.target.value)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('ports')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Top Ports">
                <Space>
                    <Input
                        type="number"
                        value={settingsData.nmap_settings.top_ports}
                        disabled={!editableFields.top_ports}
                        onChange={(e) => handleSettingsChange('nmap_settings', 'top_ports', parseInt(e.target.value))}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('top_ports')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Exclude Ports">
                <Space>
                    <Input
                        value={settingsData.nmap_settings.exclude_ports}
                        disabled={!editableFields.exclude_ports}
                        onChange={(e) => handleSettingsChange('nmap_settings', 'exclude_ports', e.target.value)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('exclude_ports')}
                    />
                </Space>
            </FormItem>

            <Title level={5}>Nuclei settings</Title>

            <Title level={5}>Concurrency</Title>

            <FormItem className={css.formItem} label="Template Payload Concurrency">
                <Space>
                    <Input
                        type="number"
                        value={settingsData.nuclei_settings.concurrency.rate_limit_per_host}
                        disabled={!editableFields.template_payload_concurrency}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'concurrency', {
                            ...settingsData.nuclei_settings.concurrency,
                            rate_limit_per_host: parseInt(e.target.value)
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('template_payload_concurrency')}
                    />
                </Space>
            </FormItem>

            <Title level={5}>Interactsh options</Title>

            <FormItem className={css.formItem} label="Server URL">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.server_url}
                        value={settingsData.nuclei_settings.interactsh_options.server_url}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                            ...settingsData.nuclei_settings.interactsh_options,
                            server_url: e.target.value
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('server_url')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Auth">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.auth}
                        value={settingsData.nuclei_settings.interactsh_options.auth}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                            ...settingsData.nuclei_settings.interactsh_options,
                            auth: e.target.value
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('auth')}
                    />
                </Space>
            </FormItem>

            
            <FormItem className={css.formItem} label="Cache Size">
                <Space>
                    <Input
                        type="number"
                        disabled={!editableFields.cache_size}
                        value={settingsData.nuclei_settings.interactsh_options.cache_size}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                            ...settingsData.nuclei_settings.interactsh_options,
                            cache_size: parseInt(e.target.value)
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('cache_size')}
                    />
                </Space>
            </FormItem>

            <FormItem label="No Interactsh">
                <Checkbox
                    checked={settingsData.nuclei_settings.interactsh_options.no_interactsh}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                        ...settingsData.nuclei_settings.interactsh_options,
                        no_interactsh: e.target.checked
                    })}
                />
            </FormItem>

            <Title level={5}>Network config</Title>

            <FormItem label="Disable Max Host Err">
                <Checkbox
                    checked={settingsData.nuclei_settings.network_config.disable_max_host_err}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        disable_max_host_err: e.target.checked
                    })}
                />
            </FormItem>

            <FormItem className={css.formItem} label="Interface">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.interface}
                        value={settingsData.nuclei_settings.network_config.interface}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                            ...settingsData.nuclei_settings.network_config,
                            interface: e.target.value
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('interface')}
                    />
                </Space>
            </FormItem>

            <DynamicFieldList
                label="Internal Resolvers List"
                initialValues={settingsData.nuclei_settings.network_config.internal_resolvers_list}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'network_config', {
                    ...settingsData.nuclei_settings.network_config,
                    internal_resolvers_list: newValues
                })}}
                isDisabled={!editableFields.internal_resolvers_list}
                setIsDisabled={() => handleToggleEdit('internal_resolvers_list')}
            />

            <FormItem label="Leave Default Ports">
                <Checkbox
                    checked={settingsData.nuclei_settings.network_config.leave_default_ports}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        leave_default_ports: e.target.checked
                    })}
                />
            </FormItem>

            <FormItem className={css.formItem} label="Max Host Error">
                <Space>
                    <Input
                        type="number"
                        disabled={!editableFields.max_host_error}
                        value={settingsData.nuclei_settings.network_config.max_host_error}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                            ...settingsData.nuclei_settings.network_config,
                            max_host_error: parseInt(e.target.value)
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('max_host_error')}
                    />
                </Space>
            </FormItem>


            <FormItem className={css.formItem} label="Retries">
                <Space>
                    <Input
                        type="number"
                        disabled={!editableFields.retries}
                        value={settingsData.nuclei_settings.network_config.retries}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                            ...settingsData.nuclei_settings.network_config,
                            retries: parseInt(e.target.value)
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('retries')}
                    />
                </Space>
            </FormItem>


            <FormItem className={css.formItem} label="Source IP">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.source_ip}
                        value={settingsData.nuclei_settings.network_config.source_ip}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                            ...settingsData.nuclei_settings.network_config,
                            source_ip: e.target.value
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('source_ip')}
                    />
                </Space>
            </FormItem>


            <FormItem label="System Resolvers">
                <Checkbox
                    checked={settingsData.nuclei_settings.network_config.system_resolvers}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        system_resolvers: e.target.checked
                    })}
                />
            </FormItem>

            <FormItem className={css.formItem} label="Timeout">
                <Space>
                    <Input
                        type="number"
                        disabled={!editableFields.timeout}
                        value={settingsData.nuclei_settings.network_config.timeout}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                            ...settingsData.nuclei_settings.network_config,
                            timeout: parseInt(e.target.value) 
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('timeout')}
                    />
                </Space>
            </FormItem>

            <DynamicFieldList
                label="Track Error"
                initialValues={settingsData.nuclei_settings.network_config.track_error}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'network_config', {
                    ...settingsData.nuclei_settings.network_config,
                    track_error: newValues
                })}}
                isDisabled={!editableFields.track_error}
                setIsDisabled={() => handleToggleEdit('track_error')}
            />

            <Title level={5}>Template filters</Title>


            <FormItem className={css.formItem} label="Severity">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.severity}
                        value={settingsData.nuclei_settings.template_filters.severity}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'template_filters', {
                            ...settingsData.nuclei_settings.template_filters,
                            severity: e.target.value
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('severity')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Exclude severities">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.exclude_severities}
                        value={settingsData.nuclei_settings.template_filters.exclude_severities}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'template_filters', {
                            ...settingsData.nuclei_settings.template_filters,
                            exclude_severities: e.target.value
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('exclude_severities')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Protocol types">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.protocol_types}
                        value={settingsData.nuclei_settings.template_filters.protocol_types}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'template_filters', {
                            ...settingsData.nuclei_settings.template_filters,
                            protocol_types: e.target.value
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('protocol_types')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Exclude protocol types">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.exclude_protocol_types}
                        value={settingsData.nuclei_settings.template_filters.exclude_protocol_types}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'template_filters', {
                            ...settingsData.nuclei_settings.template_filters,
                            exclude_protocol_types: e.target.value
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('exclude_protocol_types')}
                    />
                </Space>
            </FormItem>

            <DynamicFieldList
                label="Authors"
                initialValues={settingsData.nuclei_settings.template_filters.authors}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'template_filters', {
                    ...settingsData.nuclei_settings.template_filters,
                    authors: newValues
                })}}
                isDisabled={!editableFields.authors}
                setIsDisabled={() => handleToggleEdit('authors')}
            />

            <DynamicFieldList
                label="Tags"
                initialValues={settingsData.nuclei_settings.template_filters.tags}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'template_filters', {
                    ...settingsData.nuclei_settings.template_filters,
                    tags: newValues
                })}}
                isDisabled={!editableFields.tags}
                setIsDisabled={() => handleToggleEdit('tags')}
            />

            <DynamicFieldList
                label="Exclude tags"
                initialValues={settingsData.nuclei_settings.template_filters.exclude_tags}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'template_filters', {
                    ...settingsData.nuclei_settings.template_filters,
                    exclude_tags: newValues
                })}}
                isDisabled={!editableFields.exclude_tags}
                setIsDisabled={() => handleToggleEdit('exclude_tags')}
            />

            <DynamicFieldList
                label="Include tags"
                initialValues={settingsData.nuclei_settings.template_filters.include_tags}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'template_filters', {
                    ...settingsData.nuclei_settings.template_filters,
                    include_tags: newValues
                })}}
                isDisabled={!editableFields.include_tags}
                setIsDisabled={() => handleToggleEdit('include_tags')}
            />

            <DynamicFieldList
                label="Ids"
                initialValues={settingsData.nuclei_settings.template_filters.ids}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'template_filters', {
                    ...settingsData.nuclei_settings.template_filters,
                    ids: newValues
                })}}
                isDisabled={!editableFields.ids}
                setIsDisabled={() => handleToggleEdit('ids')}
            />

            <DynamicFieldList
                label="Exclude ids"
                initialValues={settingsData.nuclei_settings.template_filters.exclude_ids}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'template_filters', {
                    ...settingsData.nuclei_settings.template_filters,
                    exclude_ids: newValues
                })}}
                isDisabled={!editableFields.exclude_ids}
                setIsDisabled={() => handleToggleEdit('exclude_ids')}
            />

            <DynamicFieldList
                label="Template condition"
                initialValues={settingsData.nuclei_settings.template_filters.template_condition}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'template_filters', {
                    ...settingsData.nuclei_settings.template_filters,
                    template_condition: newValues
                })}}
                isDisabled={!editableFields.template_condition}
                setIsDisabled={() => handleToggleEdit('template_condition')}
            />

            <Title level={5}>Template sources</Title>

            <FormItem label="Templates">
                <Dropdown overlay={templateMenu}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Выберите шаблон
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
                <div className={css.dropdownSelectedBlock}>
                    {settingsData.nuclei_settings.template_sources.templates.map((group, index) => (
                        <div key={index}>
                            {group}
                            {index >= 0 && (
                                <Button
                                    type="danger"
                                    size="small"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => removeTemplateItem(index)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </FormItem>

            <DynamicFieldList
                label="Templates"
                initialValues={settingsData.nuclei_settings.template_sources.templates}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'template_sources', {
                    ...settingsData.nuclei_settings.template_sources,
                    templates: newValues
                })}}
                isDisabled={!editableFields.templates}
                setIsDisabled={() => handleToggleEdit('templates')}
            />

            <DynamicFieldList
                label="Headers"
                initialValues={settingsData.nuclei_settings.headers}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'headers', newValues)}}
                isDisabled={!editableFields.headers}
                setIsDisabled={() => handleToggleEdit('headers')}
            />

            <FormItem label="Follow redirects">
                <Checkbox
                    checked={settingsData.nuclei_settings.follow_redirects}
                    onChange={(e) => handleSettingsChange('nuclei_settings','follow_redirects', e.target.checked)}
                />
            </FormItem>

            <FormItem label="Follow host redirects">
                <Checkbox
                    checked={settingsData.nuclei_settings.follow_host_redirects}
                    onChange={(e) => handleSettingsChange('nuclei_settings','follow_host_redirects', e.target.checked)}
                />
            </FormItem>

            <FormItem className={css.formItem} label="Max redirects">
                <Space>
                    <Input
                        type="number"
                        disabled={!editableFields.max_redirects}
                        value={settingsData.nuclei_settings.max_redirects}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'max_redirects', parseInt(e.target.value))}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('max_redirects')}
                    />
                </Space>
            </FormItem>

            <FormItem label="Disable redirects">
                <Checkbox
                    checked={settingsData.nuclei_settings.disable_redirects}
                    onChange={(e) => handleSettingsChange('nuclei_settings','disable_redirects', e.target.checked)}
                />
            </FormItem>

            <DynamicFieldList
                label="Internal resolvers list"
                initialValues={settingsData.nuclei_settings.internal_resolvers_list}
                onValuesChange={(newValues) => {handleSettingsChange('nuclei_settings', 'internal_resolvers_list', newValues)}}
                isDisabled={!editableFields.internal_resolvers_list2}
                setIsDisabled={() => handleToggleEdit('internal_resolvers_list2')}
            />

            <FormItem label="Force attempt http2">
                <Checkbox
                    checked={settingsData.nuclei_settings.force_attempt_http2}
                    onChange={(e) => handleSettingsChange('nuclei_settings','force_attempt_http2', e.target.checked)}
                />
            </FormItem>

            <FormItem className={css.formItem} label="Dialer timeout">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.dialer_timeout}
                        value={settingsData.nuclei_settings.dialer_timeout}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'dialer_timeout', e.target.value)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('dialer_timeout')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Dialer keep alive">
                <Space>
                    <Input
                        type="text"
                        disabled={!editableFields.dialer_keep_alive}
                        value={settingsData.nuclei_settings.dialer_keep_alive}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'dialer_keep_alive', e.target.value)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('dialer_keep_alive')}
                    />
                </Space>
            </FormItem>

        </Form>
    );
};

export default SettingsForm;
