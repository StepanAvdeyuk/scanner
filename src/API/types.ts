export interface Scan {
    id: number,
    name: string
}

export interface Report {
    id: number,
    start_datetime: Date,
    done_datetime: Date,
    scan: number,
}

export interface InventoryFilters {
    state?: boolean,
    ports?: number[],
    names?: string[],
    products?: string[],
    protocols?: string[],
}

export interface Inventory {
    domains: Domain[]
}

export interface Domain {
    domain: string,
    state: boolean,
    ips: IP[],
    screenshot?: string
}

export interface IP {
    ip: string,
    state: string,
    ports: Port[],
}

export interface Port {
    id: number,
    report_id: number,
    ip_id: number,
    port: number,
    name: string,
    product: string,
    version: string,
    protocol: string,
}