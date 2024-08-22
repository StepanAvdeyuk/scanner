import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const ScopeGroupModalList = ({ isOpen, onClose, onSave }) => {
    const [form] = Form.useForm();
    const [ips, setIps] = useState(''); 
    const [domains, setDomains] = useState('');

    const handleSave = () => {
        form
            .validateFields()
            .then(values => {
                const ipsArray = ips.split('\n').filter(ip => ip.trim() !== '');
                const domainsArray = domains.split('\n').filter(domain => domain.trim() !== '');
                onSave({ ...values, ips: ipsArray, domains: domainsArray });
                form.resetFields();
                onClose();
                setIps('');
                setDomains('');
            })
            .catch(info => {
                console.log('Ошибка валидации:', info);
            });
    };

    return (
        <Modal
            visible={isOpen}
            title="Создать новую Scope группу (списком)"
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

                <Form.Item
                    label="IP Адреса"
                    name="ips"
                >
                    <Input.TextArea
                        placeholder="Введите IP адреса, каждый с новой строки"
                        value={ips}
                        onChange={(e) => setIps(e.target.value)}
                        rows={5}
                    />
                </Form.Item>

                <Form.Item
                    label="Домены"
                    name="domains"
                >
                    <Input.TextArea
                        placeholder="Введите домены, каждый с новой строки"
                        value={domains}
                        onChange={(e) => setDomains(e.target.value)}
                        rows={5}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ScopeGroupModalList;
