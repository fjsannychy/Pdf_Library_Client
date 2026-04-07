export interface UserModel {
  id: number;
  username: string;
  fullname: string;
  role: string;
  status: number;
  password?: string;
}