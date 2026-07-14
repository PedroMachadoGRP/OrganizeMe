export type TaskStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

export interface Task {
  id: string;
  title: string;
  description: string;
  expiresAt: string; // ISO 8601
  status: TaskStatus;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  // JWT vem em cookie HttpOnly — não no body
}

export interface ApiError {
  status: number;
  message: string;
}