'use strict';

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { App, InjectionKey } from 'vue';
import config from '@/config'


export const axiosKey: InjectionKey<AxiosInstance> = Symbol('axios');

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: config.apiUrl,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const _axios: AxiosInstance = axios.create(axiosRequestConfig);

_axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => config,
  (error: unknown): Promise<never> => Promise.reject(error)
);

_axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: unknown): Promise<never> => Promise.reject(error)
);

const AxiosPlugin = {
  install(app: App): void {
    // We prefer the Provide/Inject approach for better type safety and to avoid polluting the global namespace.
    // app.config.globalProperties.$axios = _axios;

    app.provide(axiosKey, _axios);
  }
};

export default AxiosPlugin;