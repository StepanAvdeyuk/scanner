import { Button, Input, Select } from "antd";
import { ChangeEvent, useRef } from "react";

import { InventoryFilters } from "../API/types";

import "./FilterForm.scss";

export interface FilterFormProps {
    onSubmitCallback?: (filters: InventoryFilters) => void,
}

function extractArrayFromMap(map: Map<string, string[]>, key: string) {
    const array = map.get(key);

    if (array?.length === 0) {
        return undefined;
    }

    return array;
}

export default function FilterForm( { onSubmitCallback }: FilterFormProps ) {
    const portsRef = useRef<number[]>();
    const stateRef = useRef<boolean>();
    const textFieldsRef = useRef(new Map<string, string[]>);

    const onCheckboxChange = (value: boolean | string) => {
        stateRef.current = typeof(value) === "string" ? undefined : value;
    }

    const onPortsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;

        const ports = text.split(',').map(portString => {
            const trimmedPortString = portString.trim();
            if (trimmedPortString) {
                return Number(trimmedPortString)
            }
            else {
                return undefined;
            }
        });

        portsRef.current = (ports.filter(port => port !== undefined));
        console.log(portsRef.current)
    }

    const onTextValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        const id = event.target.id;

        if (text.trim() === "") {
            textFieldsRef.current.set(id, []);
            return;
        } 

        const textArray = text.split(',').map(str => str.trim());

        textFieldsRef.current.set(id, textArray);
        console.log(textFieldsRef.current)
    }

    const submitForm = () => {
        const filters: InventoryFilters = {};
        const map = textFieldsRef.current;

        filters.ports     = portsRef.current?.length !== 0 ? portsRef.current : undefined;
        filters.state     = stateRef.current;
        filters.names     = extractArrayFromMap(map, "names");
        filters.products  = extractArrayFromMap(map, "products");
        filters.protocols = extractArrayFromMap(map, "protocols");

        onSubmitCallback?.(filters);
    }

    return (
        <form className="filter-form">
            <label>
                <span className="label-name">State:</span>
                <Select
                    className="button"
                    defaultValue='undefined'
                    onChange={onCheckboxChange}
                    style={{ width: 120 }}
                    options={[
                        { value: 'undefined', label: 'All' },
                        { value: true, label: 'True' },
                        { value: false, label: 'False' },
                    ]}
                />
            </label>
            <label>
                <span className="label-name">Порты:</span>
                {/* <input id="ports" type="text" onChange={onPortsChange}/> */}
                <Input className="input" id="ports" placeholder="22, 80, 4532" onChange={onPortsChange}/>
            </label>
            <label>
                <span className="label-name">Имена:</span>
                {/* <input id="names" type="text" onChange={onTextValueChange}/> */}
                <Input className="input" id="names" placeholder="ssh, ftp, nginx" onChange={onTextValueChange}/>
            </label>
            <label>
                <span className="label-name">Продукты:</span>
                {/* <input id="products" type="text" onChange={onTextValueChange}/> */}
                <Input className="input" id="products" placeholder="Apache HTTP Server" onChange={onTextValueChange}/>
            </label>
            <label>
                <span className="label-name">Протоколы:</span>
                {/* <input id="protocols" type="text" onChange={onTextValueChange}/> */}
                <Input className="input" id="protocols" placeholder="tcp, udp" onChange={onTextValueChange}/>
            </label>
            
            <div className="form-buttons">
                <Button className="button" type="primary" onClick={submitForm}>Применить</Button>
            </div>
        </form>
    );
}