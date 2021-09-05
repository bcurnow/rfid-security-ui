import mediaSvc from './svc/Media.js'
import configSvc from './svc/Config.js'

export class ApiError extends Error {
  constructor(error) {
    super(error.message)
    this.name = this.constructor.name
    // capturing the stack trace keeps the reference to your error class
    Error.captureStackTrace(this, this.constructor);
    this.wrappedError = error
  }
}

export class NotFoundError extends ApiError {}
export class DuplicateError extends ApiError {}
export class InvalidRequestError extends ApiError {}
export class AuthNError extends ApiError {}
export class AuthZError extends ApiError {}

export function resolveError(error) {
  let resolvedError
  if (error.response) {
    switch (error.response.status) {
      case 400:
        // 400 = Bad Request
        resolvedError =  new InvalidRequestError(error)
        break;
      case 401:
        // 401 = Unauthorized
        resolvedError =  new AuthNError(error)
        break;
      case 403:
        // 403 = Forbidden
        resolvedError =  new AuthZError(error)
        break;
      case 404:
        // 404 = Not Found
        resolvedError =  new NotFoundError(error)
        break;
      case 409:
        // 409 = Conflict
        resolvedError =  new DuplicateError(error)
        break;
      default:
        // Not sure what this error is
        resolvedError =  new ApiError(error)
    }
  } else if (error.request) {
    // Made the request but got no response
    resolvedError = new ApiError(error)
  } else {
    // There was an error setting up the request
    resolvedError = new ApiError(error)
  }
  return resolvedError
}

const RFIDSecuritySvc = {
  media: mediaSvc,
  config: configSvc,
}

export default RFIDSecuritySvc
