import { Table } from "antd";
import { Port } from "../../../../../../API/types";

export type PortTableProps = {
    ports: Port[]
}

export default function PortTable({ ports }: PortTableProps) {
    const columns = [
        {
            title: 'Порт',
            key: 'port',
            dataIndex: 'port',
            sorter: (a: Port, b: Port) => a.port - b.port,
        },
        {
            title: 'Имя',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: 'Продукт',
            key: 'product',
            dataIndex: 'product',
        },
        {
            title: 'Версия',
            key: 'version',
            dataIndex: 'version',
        },
        {
            title: 'Протокол',
            key: 'protocol',
            dataIndex: 'protocol',
            filters: [
                {
                    text: "TCP",
                    value: "tcp"
                },
                {
                    text: "UDP",
                    value: "udp"
                },
            ],
            onFilter: (value: string, record: Port) => record.protocol === value,
            filterSearch: true
        },
    ];


    return (
        //@ts-ignore
        <Table dataSource={ports} columns={columns}/>
    );
}