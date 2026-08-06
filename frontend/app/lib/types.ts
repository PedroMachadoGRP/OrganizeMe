export type TaskStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';

export interface Task {
  id: string;
  title: string;
  description: string;
  expiresAt: string; 
  status: TaskStatus;
  createdAt: string;
}

export interface User {
  id: string;
  name?:string;
  email: string;
}

export interface UserRegister{
  name:string;
  email:string;
  password:string
}

export interface AuthResponse {
  user: User;

}

export interface ApiError {
  status: number;
  message: string;
}