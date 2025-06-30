export interface IUser {
  id: number;
  email: string;
  username: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: IUser | null;
}
