import axiosInstance, { type CustomAxiosRequestConfig } from '../interceptor.ts';
import { CommonService } from './commonServices.ts';

export const AuthService = {
    Login: async (data: any):Promise<any> => {
       return axiosInstance.post('Users/login', 
            data,
           { isAuthorize: false } as CustomAxiosRequestConfig
        );
    },
    Resister: async (data: any): Promise<any> => {
        
        return axiosInstance.post('Users', data,
           { isAuthorize: false } as CustomAxiosRequestConfig
        ); 
    },
    RefreshToken: () => {
        return axiosInstance.post('Users/refresh',
            {
                refreshToken: CommonService.GetRefreshToken()
            });
    },
    Logout: () => {
        return axiosInstance.post('Users/logout',
            {
                refreshToken: CommonService.GetRefreshToken()
            });
    }
}