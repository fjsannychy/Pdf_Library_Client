import axiosInstance from '../interceptor.ts';
import type { CategoryModel } from '../Models/CategoryModel.ts';

export const CategoryService = {
    // Matches [HttpCategory("search")]
    GetList: async (data: any): Promise<any> => {
        return axiosInstance.post('Categories/search', data);
    },

    // Matches [HttpGet("{id}")]
    GetById: async (id: number): Promise<any> => {
        return axiosInstance.get(`Categories/${id}`);
    },

    // Matches [HttpCategory] (No extra word in the URL)
    Create: async (data: CategoryModel): Promise<any> => {
        return axiosInstance.post('Categories', data); 
    },

    // Matches [HttpPut("{id}")]
    Update: async (id: number, data: CategoryModel): Promise<any> => {
        return axiosInstance.put(`Categories/${id}`, data);
    },

    // Matches [HttpDelete("{id}")]
    Delete: async (id: number): Promise<any> => {
        return axiosInstance.delete(`Categories/${id}`);
    }
}