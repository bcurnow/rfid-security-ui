import axios from 'axios';
import config from '@/config'

const axiosInstance = axios.create({
      baseURL: config.apiUrl,
      timeout: 10 * 1000,
      headers: {
        'X-RFIDSECURITYSVC-API-KEY': config.apiKey,
      }
  })

// Always post using JSON
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'

const api = {
  axios: axiosInstance,
  delete: function(url, config) {
    return this.axios.delete(url, config)
  },
  get: function(url, config) {
    return this.axios.get(url, config)
  },
  post: function(url, config) {
    return this.axios.post(url, config)
  },
  put: function(url, config) {
    return this.axios.put(url, config)
  },
}

export default api
