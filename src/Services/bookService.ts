import axiosInstance from '../interceptor.ts';
import type { BookModel } from '../Models/BookModel.ts';
import { CommonService } from './commonServices.ts';

export const BookService = {
  GetList: async (data: any): Promise<any> => {
    return axiosInstance.post('Books/search', data);
  },

  GetById: async (id: number): Promise<any> => {
    return axiosInstance.get(`Books/${id}`);
  },

  Create: async (data: BookModel): Promise<any> => {
    const formData = CommonService.buildFormData(data);
    return axiosInstance.post('Books', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  Update: async (id: number, data: BookModel): Promise<any> => {
    const formData = CommonService.buildFormData(data);
    return axiosInstance.put(`Books/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  Delete: async (id: number): Promise<any> => {
    return axiosInstance.delete(`Books/${id}`);
  }
};