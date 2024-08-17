import React, { useState } from 'react';
import { Modal, Form, Input, Button, Space, List } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';

const ScopeGroupModal = ({ isOpen, onClose, onSave }) => {
    const [form] = Form.useForm();
    const [ips, setIps] = useState(['']); 
    const [domains, setDomains] = useState(['']);

    const addField = (type) => {
        if (type === 'ips') {
            setIps([...ips, '']);
        } else if (type === 'domains') {
            setDomains([...domains, '']);
        }
    };

    const removeField = (type, index) => {
        if (type === 'ips') {
            if (ips.length > 1) {
                setIps(ips.filter((_, i) => i !== index));
            } 
        } else if (type === 'domains') {
            if (domains.length > 1) {
                setDomains(domains.filter((_, i) => i !== index));
            }
        }
    };

    const handleSave = () => {
        form
            .validateFields()
            .then(values => {
                onSave({ ...values, ips, domains });
                form.resetFields();
                setIps(['']);
                setDomains(['']);
            })
            .catch(info => {
                console.log('Ошибка валидации:', info);
            });
    };

    return (
        <Modal
            visible={isOpen}
            title="Создать новую Scope группу"
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Отмена
                </Button>,
                <Button key="submit" type="primary" onClick={handleSave}>
                    Сохранить
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Название"
                    rules={[{ required: true, message: 'Введите название группы' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label="IP Адреса">
                    {ips.map((ip, index) => (
                        <Space key={index} style={{ display: 'flex', marginBottom: 8, alignItems: 'start' }} align="baseline">
                            <Form.Item
                                name={`ip-${index}`}
                                style={{ flex: 1, margin: 0 }}
                                rules={[
                                    { pattern: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, message: 'Введите корректный IP адрес' }
                                ]}
                            >
                                <Input placeholder="IP адрес" value={ip} onChange={(e) => {
                                    const newIps = [...ips];
                                    newIps[index] = e.target.value;
                                    setIps(newIps);
                                }} />
                            </Form.Item>
                            <Button
                                type="danger"
                                icon={<MinusOutlined />}
                                onClick={() => removeField('ips', index)}
                            />
                            {index === ips.length - 1 && <Button type="dashed" icon={<PlusOutlined />} onClick={() => addField('ips')} />}
                        </Space>
                    ))}
                </Form.Item>

                <Form.Item label="Домены">
                    {domains.map((domain, index) => (
                        <Space key={index} style={{ display: 'flex', marginBottom: 8, alignItems: 'start' }} align="baseline">
                            <Form.Item
                                name={`domain-${index}`}
                                style={{ flex: 1, margin: 0 }}
                            >
                                <Input placeholder="Домен" value={domain} onChange={(e) => {
                                    const newDomains = [...domains];
                                    newDomains[index] = e.target.value;
                                    setDomains(newDomains);
                                }} />
                            </Form.Item>
                            <Button
                                type="danger"
                                icon={<MinusOutlined />}
                                onClick={() => removeField('domains', index)}
                            />
                            {index === domains.length - 1 && <Button type="dashed" icon={<PlusOutlined />} onClick={() => addField('domains')} />}
                        </Space>
                    ))}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScopeGroupModal;