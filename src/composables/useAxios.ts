import { inject } from 'vue';
import { axiosKey } from '@/plugins/axios'; // Import the key from your plugin
import type { AxiosInstance } from 'axios';

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

export function useAxios(): AxiosInstance {
  // Inject the specific instance from the plugin
  const axiosInstance = inject(axiosKey);

  // Safety check (helpful for debugging if plugin isn't installed)
  if (!axiosInstance) {
    throw new Error('useAxios() must be used within a component tree where AxiosPlugin is installed.');
  }

  return axiosInstance
}