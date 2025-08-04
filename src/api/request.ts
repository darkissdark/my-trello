import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { api } from '../common/constants';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import store from '../store';
import { login, logout } from '../store/slices/authSlice';

NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  speed: 500,
  easing: 'ease',
});

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

instance.interceptors.request.use(handleRequest, handleRequestError);
instance.interceptors.response.use(handleResponse, handleResponseError);

function handleRequest(config: InternalAxiosRequestConfig) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  NProgress.start();
  return config;
}

function handleRequestError(error: AxiosError) {
  NProgress.done();
  return Promise.reject(error);
}

function handleResponse(response: AxiosResponse) {
  NProgress.done();
  return response;
}

let isRefreshing = false;
type QueuePromise = {
  resolve: (value?: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
};

let failedQueue: QueuePromise[] = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });

  failedQueue = [];
};

async function handleResponseError(error: AxiosError) {
  NProgress.done();

  const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (token && originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
        }
        return instance(originalRequest);
      });
    }

    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${api.baseURL}/refresh`, { refreshToken });

      const currentUser = store.getState().auth.user;

      if (currentUser) {
        store.dispatch(
          login({
            token: data.token,
            refreshToken: data.refreshToken,
            user: currentUser,
          })
        );
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);

      processQueue(null, data.token);

      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
      }

      return instance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, undefined);
      store.dispatch(logout());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  if (error.response?.status !== 401) {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message:
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
        error.message ||
        'Unexpected error occurred',
    });
  }

  return Promise.reject(error);
}

export default instance;
