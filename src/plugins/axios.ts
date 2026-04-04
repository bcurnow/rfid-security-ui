'use strict';

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { App, InjectionKey } from 'vue';

const config: AxiosRequestConfig = {
  // baseURL: import.meta.env.VITE_API_URL || '',
  // timeout: 60 * 1000,
  // withCredentials: true,
};

const _axios: AxiosInstance = axios.create(config);

_axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => config,
  (error: unknown): Promise<never> => Promise.reject(error)
);

_axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: unknown): Promise<never> => Promise.reject(error)
);

// Typed injection key for Composition API
export const axiosKey: InjectionKey<AxiosInstance> = Symbol('axios');

// Augment Vue's globalProperties for Options API ($axios)
declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const AxiosPlugin = {
  install(app: App): void {
    // Options API — this.$axios
    app.config.globalProperties.$axios = _axios;

    // Composition API — const axios = inject(axiosKey)
    app.provide(axiosKey, _axios);
  }
};

export { _axios as axios };
export default AxiosPlugin;