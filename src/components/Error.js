function errorToString(error) {
  if (! error) {
    return ''
  }

  // check if this is an HTTP error
  if (error.response) {
    // convert based on status code
    switch (error.response.status) {
      case 400:
        // 400 = Bad Request
        return 'Invalid Request'
      case 401:
        // 401 = Unauthorized
        return 'Permissions issue: Unauthorized'
      case 403:
        // 403 = Forbidden
        return 'Permissions issue: Forbidden'
      case 404:
        // 404 = Not Found
        return 'Data not found'
      case 409:
        // 409 = Conflict
        return 'Duplicate record'
      default:
        // Not sure what this error is
        return `An unknown error occured: ${error}`
    }
  } else {
    return error.toString()
  }
}

export default errorToString
