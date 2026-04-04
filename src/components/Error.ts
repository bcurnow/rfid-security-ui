import axios, { type AxiosError } from 'axios'

function errorToString(error: AxiosError | Error | null): string {
  if (!error) {
    return ''
  }

  if (axios.isAxiosError(error)) {
    switch (error.response?.status) {
      case 400: return 'Invalid Request'
      case 401: return 'Permissions issue: Unauthorized'
      case 403: return 'Permissions issue: Forbidden'
      case 404: return 'Data not found'
      case 409: return 'Duplicate record'
      default:  return `An unknown error occurred: ${error.message}`
    }
  }

  return error.message
}

export default errorToString