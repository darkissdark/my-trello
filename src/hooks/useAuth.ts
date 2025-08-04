import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService, LoginData, RegisterData } from '../api/services';
import { login } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (loginData: LoginData) => {
      try {
        const authResponse = await authService.login(loginData);
        const userResponse = await authService.getUserByEmailWithToken(loginData.email, authResponse.token);
        const user = userResponse[0];

        dispatch(
          login({
            token: authResponse.token,
            refreshToken: authResponse.refreshToken,
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
            },
          })
        );

        navigate('/');
        return { success: true };
      } catch (error: any) {
        const message = error.response?.data?.message || 'User with this email or password not found';
        return { success: false, error: message };
      }
    },
    [dispatch, navigate]
  );

  const handleRegister = useCallback(
    async (registerData: RegisterData) => {
      try {
        const authResponse = await authService.register(registerData);
        const userResponse = await authService.getUserByEmailWithToken(registerData.email, authResponse.token);
        const user = userResponse[0];

        dispatch(
          login({
            token: authResponse.token,
            refreshToken: authResponse.refreshToken,
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
            },
          })
        );

        navigate('/');
        return { success: true };
      } catch (error: any) {
        const message = error.response?.data?.message || 'Registration error';
        return { success: false, error: message };
      }
    },
    [dispatch, navigate]
  );

  return {
    handleLogin,
    handleRegister,
  };
}; 