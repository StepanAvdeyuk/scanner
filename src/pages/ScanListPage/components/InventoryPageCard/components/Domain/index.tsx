import { Collapse, Divider } from "antd";

import { Domain as DomainType} from "../../../../../../API/types"
import { HOST } from "../../../../../../API/consts"
import PortTable from "../PortTable";

export type DomainProps = {
    domain: DomainType;
}

export default function Domain({ domain }: DomainProps) {
    return (
        <div>
            <Divider orientation="left">Домен: { domain.domain }</Divider>
            <Collapse
                size="large"
                items={[{
                    label: `Состояние: ${ domain.state ? "true" : "false" }`,
                    children: [
                        domain.ips.map(ip => (
                            <div key={ip.ip} className="domain-ip-container">
                                <h3>IP: { ip.ip }</h3>
                                <h3>Состояние: { ip.state }</h3>
            
                                <PortTable ports={ip.ports} key={ip.ip} />
                            </div>
                        )),
                        domain.screenshot ? 
                            <div className="screenshot-container">
                                <img src={`${HOST}${domain.screenshot}`} />
                            </div> : undefined
                    ] 
                }]}
            />
{/*             
            { domain.ips.map(ip => (
                <div key={ip.ip} className="domain-ip-container">
                    <h3>IP: { ip.ip }</h3>
                    <h3>Состояние: { ip.state }</h3>

                    <PortTable ports={ip.ports} />
                </div>
            ))} */}
        </div>
    );
}