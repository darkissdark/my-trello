import axios from 'axios';
import { api } from '../common/constants';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

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
    Authorization: 'Bearer 123',
  },
});

instance.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    NProgress.done();
    return res;
  },
  (error) => {
    NProgress.done();
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: error?.message || 'An unexpected error occurred',
    });
    return Promise.reject(error);
  }
);

export default instance;
