import React, { useState } from 'react';
import { Modal, Card, List, Typography, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import { BASE_URL, API_TOKEN } from '../../API/consts';
const { Text } = Typography;

const EventModal = ({ isOpen, closeModal, scopes, openedScope }) => {
    const scopeData = scopes.find(scope => scope.id === openedScope);

    if (!scopeData) {
        return null; 
    }

    const getFieldValue = (field) => {
        if (!field || (Array.isArray(field) && field.length === 0)) {
            return 'Не указано';
        }
        if (Array.isArray(field)) {
            return field.map(item => {
                if (typeof item === 'object') {
                    return Object.entries(item)
                        .filter(([key]) => key !== 'id')
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                }
                return item;
            }).join(', ');
        }
        return field;
    };

    const handleDelete = () => {
        deleteScope();
    } 

    const deleteScope = async () => {
        try {
          const response = await axios.delete(`${BASE_URL}/scope/${scopeData.name}`, {
            headers: {
              'Authorization': `Token ${API_TOKEN}`
            }
          }).then(() => {
            closeModal();
          });
        } catch (error) {
          console.error('Ошибка при удалении:', error);
        }
      };

    return (
        <Modal
            visible={isOpen}
            onCancel={closeModal}
            footer={null}
            width={600} 
            closable={false}
        >
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span>Описание Scope</span>
                            <Button key="delete" size='small' style={{marginLeft: "10px"}} danger onClick={handleDelete}>
                                Удалить
                            </Button>
                        </div>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={closeModal}
                            style={{ fontSize: '16px' }}
                        />
                    </div>
                }
            >
                <List
                    bordered
                    dataSource={[
                        { key: 'Name', value: scopeData.name },
                        { key: 'IP Addresses', value: getFieldValue(scopeData.ips) },
                        { key: 'Domains', value: getFieldValue(scopeData.domains) },
                        { key: 'Display', value: scopeData.display ? 'Да' : 'Нет' }
                    ]}
                    renderItem={item => (
                        <List.Item style={{ paddingTop: 8, paddingBottom: 8 }}>
                            <Text strong>{item.key}:</Text> {item.value}
                        </List.Item>
                    )}
                    style={{ padding: '0 16px' }}
                />
            </Card>
        </Modal>
    );
};
export default EventModal;