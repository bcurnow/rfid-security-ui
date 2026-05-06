import { describe, it, expect } from 'vitest'
import { AxiosError } from 'axios'
import { errorToString } from '../Error'

function axiosError(status: number, message = 'request failed'): AxiosError {
  const err = new AxiosError(message)
  err.response = { status, data: {}, headers: {}, config: {} as any, statusText: '' }
  return err
}

describe('errorToString', () => {
  it('returns empty string for null', () => {
    expect(errorToString(null)).toBe('')
  })

  it('handles 400', () => {
    expect(errorToString(axiosError(400))).toBe('Invalid Request')
  })

  it('handles 401', () => {
    expect(errorToString(axiosError(401))).toBe('Permissions issue: Unauthorized')
  })

  it('handles 403', () => {
    expect(errorToString(axiosError(403))).toBe('Permissions issue: Forbidden')
  })

  it('handles 404', () => {
    expect(errorToString(axiosError(404))).toBe('Data not found')
  })

  it('handles 409', () => {
    expect(errorToString(axiosError(409))).toBe('Duplicate record')
  })

  it('returns generic message for unknown status', () => {
    expect(errorToString(axiosError(500, 'boom'))).toBe('An unknown error occurred: boom')
  })

  it('returns generic message when response is missing', () => {
    const err = new AxiosError('network error')
    expect(errorToString(err)).toBe('An unknown error occurred: network error')
  })

  it('returns error.message for non-axios errors', () => {
    expect(errorToString(new Error('plain error'))).toBe('plain error')
  })
})
