import axiosInstance from '../interceptor.ts';
import type { UserModel } from '../Models/UserModel.ts';

export const UserService = {
  // Get all users
  GetAll: async (): Promise<UserModel[]> => {
    const resp = await axiosInstance.get('Users');
    return resp.data;
  },

  // Search users with pagination
  GetList: async (data: { search: string; pageNumber: number; pageSize: number }): Promise<{ users: UserModel[]; totalCount: number }> => {
    const resp = await axiosInstance.post('Users/search', data);
    return resp.data;
  },

  // Get a single user by ID
  GetById: async (id: number): Promise<UserModel> => {
    const resp = await axiosInstance.get(`Users/${id}`);
    return resp.data;
  },

  // Create new user
  Create: async (data: UserModel): Promise<UserModel> => {
    const resp = await axiosInstance.post('Users', data);
    return resp.data;
  },

  // Update user
  Update: async (id: number, data: UserModel): Promise<any> => {
    const resp = await axiosInstance.put(`Users/${id}`, data);
    return resp.data;
  },

  // Delete user
  Delete: async (id: number): Promise<any> => {
    const resp = await axiosInstance.delete(`Users/${id}`);
    return resp.data;
  }
};