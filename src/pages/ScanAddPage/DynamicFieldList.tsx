import React, { useState } from 'react';
import { Input, Button, Space, Form } from 'antd';
import { MinusOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';

const DynamicFieldList = ({ label, initialValues = [], onValuesChange, isDisabled, setIsDisabled }) => {

    const [fields, setFields] = useState(initialValues.map(value => ({ id: nanoid(), value })));

    const addField = () => {
        setFields([...fields, { id: nanoid(), value: '' }]);
    };

    const removeField = (id) => {
        const newFields = fields.filter(field => field.id !== id);
        setFields(newFields);
        onValuesChange(newFields.map(item => item.value));
    };

    const handleFieldChange = (id, value) => {
        const newFields = fields.map(field => 
            field.id === id ? { ...field, value } : field
        );
        setFields(newFields);
        onValuesChange(newFields.map(item => item.value));
    };

    return (
        <Form.Item label={label}>
            {fields.map(({id, value}, index) => {
                return (
                    <Space key={id} style={{ display: 'flex', marginBottom: 8, alignItems: 'start' }} align="baseline">
                        <Form.Item
                            name={id}
                            style={{ flex: 1, margin: 0 }}
                        >
                            <Input
                                placeholder="Введите значение"
                                value={value}
                                onChange={(e) => handleFieldChange(id, e.target.value)}
                                disabled={isDisabled}
                            />
                        </Form.Item>
                        {index !== 0 && <Button
                            type="danger"
                            icon={<MinusOutlined />}
                            onClick={() => removeField(id)}
                        />}
                        {index === fields.length - 1 && !isDisabled &&(
                            <Button
                                type="dashed"
                                icon={<PlusOutlined />}
                                onClick={addField}
                            />
                        )}
                        {index === 0 && <Button
                        icon={<EditOutlined />}
                        onClick={setIsDisabled}
                        />}
                    </Space>
                )
            })}
        </Form.Item>
    );
};

export default DynamicFieldList;
