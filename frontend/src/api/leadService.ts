import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/leads";

export interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    lead_status_id: number;
    status: {
        id: number;
        name: string;
    };
    created_at?: string;
    updated_at?: string;
}

export const getLeads = async (
    search: string,
    page: number = 1,
    limit: number = 10
) => {
    return await axios.get(API_URL, {
        params: {
            search,
            page,
            limit,
        },
    });
};

export const getLead = (id: number) => {
    return axios.get(`${API_URL}/${id}`);
};

export const createLead = (
    leadData: Omit<Lead, "id" | "created_at" | "updated_at">
) => {
    return axios.post(API_URL, leadData);
};

export const updateLead = (id: number, leadData: Partial<Lead>) => {
    return axios.put(`${API_URL}/${id}`, leadData);
};

export const deleteLead = (id: number) => {
    return axios.delete(`${API_URL}/${id}`);
};
