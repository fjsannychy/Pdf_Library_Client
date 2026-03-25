import axiosInstance from '../interceptor.ts';
import type { PublisherModel } from '../Models/PublisherModel.ts';

export const PublisherService = {
    // Matches [HttpPublisher("search")]
    GetList: async (data: any): Promise<any> => {
        return axiosInstance.post('Publishers/search', data);
    },

    // Matches [HttpGet("{id}")]
    GetById: async (id: number): Promise<any> => {
        return axiosInstance.get(`Publishers/${id}`);
    },

    // Matches [HttpPublisher] (No extra word in the URL)
    Create: async (data: PublisherModel): Promise<any> => {
        return axiosInstance.post('Publishers', data); 
    },

    // Matches [HttpPut("{id}")]
    Update: async (id: number, data: PublisherModel): Promise<any> => {
        return axiosInstance.put(`Publishers/${id}`, data);
    },

    // Matches [HttpDelete("{id}")]
    Delete: async (id: number): Promise<any> => {
        return axiosInstance.delete(`Publishers/${id}`);
    }
}