import axiosInstance from '../interceptor.ts';
import type { UserMarkModel } from '../Models/UserMarkModel.ts';

export const UserMarkService = {
    // Matches [HttpUserMark("search")]
    GetList: async (bookId: number): Promise<any> => {
        return axiosInstance.get(`UserMarks/get-all/${bookId}`);
    },

    // Matches [HttpUserMark] (No extra word in the URL)
    Create: async (data: UserMarkModel): Promise<any> => {
        return axiosInstance.post('UserMarks', data); 
    },

    // Matches [HttpDelete("{id}")]
    Delete: async (id: number): Promise<any> => {
        return axiosInstance.delete(`UserMarks/${id}`);
    }
}