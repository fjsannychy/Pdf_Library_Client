import axiosInstance from '../interceptor.ts';
import type { AuthorModel } from '../Models/AuthorModel.ts';

export const AuthorService = {
    // Matches [HttpAuthor("search")]
    GetList: async (data: any): Promise<any> => {
        return await axiosInstance.post('Authors/search', data);
    },

    // Matches [HttpGet("{id}")]
    GetById: async (id: number): Promise<any> => {
        return await axiosInstance.get(`Authors/${id}`);
    },

    // Matches [HttpAuthor] (No extra word in the URL)
    Create: async (data: AuthorModel): Promise<any> => {
        return await axiosInstance.post('Authors', data); 
    },

    // Matches [HttpPut("{id}")]
    Update: async (id: number, data: AuthorModel): Promise<any> => {
        return await axiosInstance.put(`Authors/${id}`, data);
    },

    // Matches [HttpDelete("{id}")]
    Delete: async (id: number): Promise<any> => {
        return await axiosInstance.delete(`Authors/${id}`);
    }
}