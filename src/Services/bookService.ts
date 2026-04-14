import axiosInstance from '../interceptor.ts';
import type { BookModel } from '../Models/BookModel.ts';
import type { UserActionModel } from '../Models/UserActionModel.ts';
import { CommonService } from './commonServices.ts';

export const BookService = {
  GetList: async (data: any): Promise<any> => {
    return axiosInstance.post('Books/search', data);
  },

  GetById: async (id: number, readMode: boolean): Promise<any> => {
    return axiosInstance.get(`Books/${id}?readMode=${readMode}`);
  },

  // --- ADD THIS METHOD ---
  ToggleFavourite: async (bookId: number): Promise<any> => {
    return axiosInstance.post('UserFavourite/toggle', { bookId });
  },
  // -----------------------

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
  },

  AddUserAction: async (data: UserActionModel): Promise<any> => {
    return axiosInstance.post('Books/user-action', data);
  },
  ProcessPayment: async (bookId: number): Promise<any> => {
    // Note: The backend expects [FromBody] int bookId
    return axiosInstance.post('Books/process-payment', bookId);
  },


};