import api from '../request';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface UserResponse {
  id: number;
  email: string;
  username: string;
}

class AuthService {
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const { data } = await api.post('/login', loginData);
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const { data } = await api.post('/user', registerData);
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse[]> {
    const { data } = await api.get(`/user?emailOrUsername=${encodeURIComponent(email)}`);
    return data;
  }

  async getUserByEmailWithToken(email: string, token: string): Promise<UserResponse[]> {
    try {
      const { data } = await api.get(`/user?emailOrUsername=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      console.error('Get user failed:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data } = await api.post('/refresh', { refreshToken });
    return data;
  }
}

export const authService = new AuthService();
