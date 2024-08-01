import React from 'react';
import { Form, Input, Button, Checkbox, Space, Dropdown, Menu } from 'antd';
import { MinusCircleOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import css from './index.module.scss';

const { Item: FormItem, List: FormList } = Form;

const SettingsForm = ({ settingsData, handleSettingsChange, scopeGroupMenu, removeGroup }) => {


    const [editableFields, setEditableFields] = React.useState({});

    // Toggle input availability and reset values
    const handleToggleEdit = (key, fieldType) => {
        setEditableFields(prev => {
            const newEditableFields = { ...prev };
            if (newEditableFields[key]) {
                newEditableFields[key] = false;
                if (fieldType === 'number') {
                    handleSettingsChange('settingsData', key, '');
                } else {
                    handleSettingsChange('settingsData', key, '');
                }
            } else {
                newEditableFields[key] = true;
            }
            return newEditableFields;
        });
    };

    return (
        <Form layout="vertical">
            <h2>Основные настройки</h2>

            <FormItem className={css.formItem} label="Scan">
                <Space>
                    <Input
                        value={settingsData.scan}
                        disabled={!editableFields.scan}
                        onChange={(e) => handleSettingsChange('settingsData', 'scan', e.target.value)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('scan', 'text')}
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
                        onClick={() => handleToggleEdit('nmap_min_rate', 'number')}
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
                        onClick={() => handleToggleEdit('version_intensity', 'number')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Ports">
                <Space>
                    <Input
                        value={settingsData.nmap_settings.ports}
                        disabled={!editableFields.ports}
                        onChange={(e) => handleSettingsChange('nmap_settings', 'ports', e.target.value)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('ports', 'text')}
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
                        onClick={() => handleToggleEdit('top_ports', 'number')}
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
                        onClick={() => handleToggleEdit('exclude_ports', 'text')}
                    />
                </Space>
            </FormItem>

            <FormItem className={css.formItem} label="Template Payload Concurrency">
                <Space>
                    <Input
                        type="number"
                        value={settingsData.nuclei_settings.concurrency.rate_limit_per_host}
                        disabled={!editableFields.template_payload_concurrency}
                        onChange={(e) => handleSettingsChange('nuclei_settings', 'concurrency', {
                            ...settingsData.nuclei_settings.concurrency,
                            rate_limit_per_host: parseInt(e.target.value, 10)
                        })}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleToggleEdit('template_payload_concurrency')}
                    />
                </Space>
            </FormItem>

            <FormItem label="Server URL">
                <Input
                    value={settingsData.nuclei_settings.interactsh_options.server_url}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                        ...settingsData.nuclei_settings.interactsh_options,
                        server_url: e.target.value
                    })}
                />
            </FormItem>

            <FormItem label="Auth">
                <Input
                    value={settingsData.nuclei_settings.interactsh_options.auth}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                        ...settingsData.nuclei_settings.interactsh_options,
                        auth: e.target.value
                    })}
                />
            </FormItem>

            <FormItem label="Cache Size">
                <Input
                    type="number"
                    value={settingsData.nuclei_settings.interactsh_options.cache_size}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'interactsh_options', {
                        ...settingsData.nuclei_settings.interactsh_options,
                        cache_size: parseInt(e.target.value)
                    })}
                />
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

            <FormItem label="Disable Max Host Err">
                <Checkbox
                    checked={settingsData.nuclei_settings.network_config.disable_max_host_err}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        disable_max_host_err: e.target.checked
                    })}
                />
            </FormItem>

            <FormItem label="Interface">
                <Input
                    value={settingsData.nuclei_settings.network_config.interface}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        interface: e.target.value
                    })}
                />
            </FormItem>

            <FormList name="internal_resolvers_list" initialValue={settingsData.nuclei_settings.network_config.internal_resolvers_list}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey }) => (
                            <FormItem
                                key={key}
                                name={[name]}
                                fieldKey={[fieldKey]}
                                label="Internal Resolvers List"
                            >
                                <Input
                                    onChange={(e) => {
                                        const newResolversList = [...settingsData.nuclei_settings.network_config.internal_resolvers_list];
                                        newResolversList[fieldKey] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'network_config', {
                                            ...settingsData.nuclei_settings.network_config,
                                            internal_resolvers_list: newResolversList
                                        });
                                    }}
                                />
                            </FormItem>
                        ))}
                    </>
                )}
            </FormList>

            <FormItem label="Leave Default Ports">
                <Checkbox
                    checked={settingsData.nuclei_settings.network_config.leave_default_ports}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        leave_default_ports: e.target.checked
                    })}
                />
            </FormItem>

            <FormItem label="Max Host Error">
                <Input
                    type="number"
                    value={settingsData.nuclei_settings.network_config.max_host_error}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        max_host_error: parseInt(e.target.value)
                    })}
                />
            </FormItem>

            <FormItem label="Retries">
                <Input
                    type="number"
                    value={settingsData.nuclei_settings.network_config.retries}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        retries: parseInt(e.target.value)
                    })}
                />
            </FormItem>

            <FormItem label="Source IP">
                <Input
                    value={settingsData.nuclei_settings.network_config.source_ip}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        source_ip: e.target.value
                    })}
                />
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

            <FormItem label="Timeout">
                <Input
                    type="number"
                    value={settingsData.nuclei_settings.network_config.timeout}
                    onChange={(e) => handleSettingsChange('nuclei_settings', 'network_config', {
                        ...settingsData.nuclei_settings.network_config,
                        timeout: parseInt(e.target.value)
                    })}
                />
            </FormItem>

            <FormList name="track_error" initialValue={settingsData.nuclei_settings.network_config.track_error}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey }) => (
                            <FormItem
                                key={key}
                                name={[name]}
                                fieldKey={[fieldKey]}
                                label="Track Error"
                            >
                                <Input
                                    onChange={(e) => {
                                        const newTrackError = [...settingsData.nuclei_settings.network_config.track_error];
                                        newTrackError[fieldKey] = e.target.value;
                                        handleSettingsChange('nuclei_settings', 'network_config', {
                                            ...settingsData.nuclei_settings.network_config,
                                            track_error: newTrackError
                                        });
                                    }}
                                />
                            </FormItem>
                        ))}
                    </>
                )}
            </FormList>
        </Form>
    );
};

export default SettingsForm;
