import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import config from '@/config'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Combines two URL path segments into a single properly-formed path.
 * Ensures exactly one '/' at the join point regardless of trailing/leading slashes.
 *
 * @param base - The base URL path (e.g. '/api/v1.0')
 * @param relative - The relative path to append (e.g. 'configs/my-key')
 * @returns The combined path (e.g. '/api/v1.0/configs/my-key')
 *
 * @example
 * combineURLs('/api/v1/', '/users')   // → '/api/v1/users'
 * combineURLs('/api/v1', 'users')     // → '/api/v1/users'
 * combineURLs('/api/v1/', '/users/')  // → '/api/v1/users/'
 */
export const combineURLs = (base: string, relative: string): string =>
  `${base.replace(/\/$/, '')}/${relative.replace(/^\//, '')}`

const api = {
  delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.delete<T>(url, config)
  },

  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.get<T>(url, config)
  },

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.post<T>(url, data, config)
  },

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return axiosInstance.put<T>(url, data, config)
  },
}

export default api

