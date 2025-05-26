import axios from 'axios';
import { api } from '../common/constants';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123',
  },
});

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: error?.message || 'An unexpected error occurred',
    });
    return Promise.reject(error);
  }
);

export default instance;
