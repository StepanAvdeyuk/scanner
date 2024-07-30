import axios from "axios";
import "./axios.defaults";

import { 
    Scan,
    Report,
    Inventory,
} from "./types";

export async function getAllScans(): Promise<Scan[]> {
    const response = await axios.get(`/scan/all`);

    if (response.status !== 200) {
        throw Error(response.data)
    }

    return response.data;
}

export async function getScanReport(reportName: string): Promise<Report[]> {
    const response = await axios.get(`/reports/${reportName}`);
    
    if (response.status !== 200) {
        throw Error(response.data)
    }

    return response.data;
}

export async function getReportInventory(reportId: number, filters?: Object): Promise<Inventory[]> {
    const response = await axios.post(`/reports/inventory/${reportId}/`, filters || {});
    
    if (response.status !== 200) {
        throw Error(response.data)
    }

    return response.data;
}

export async function getReportEvents(reportId: number, filters?: Object): Promise<any> {
    const response = await axios.post(`/reports/events/${reportId}/`, filters || {});
    
    if (response.status !== 200) {
        throw Error(response.data)
    }

    return response.data;   
}

export async function getReportSettings(reportId: number): Promise<any> {
    const response = await axios.get(`/reports/settings/${reportId}`);
    
    if (response.status !== 200) {
        throw Error(response.data)
    }

    return response.data;   
}