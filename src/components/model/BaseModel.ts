class BaseModel {
  [key: string]: unknown


  static type: string = 'BaseModel'
  static primaryKey: string = 'id'

  isControllable(): boolean {
    return true
  }

  displayIdentifier(): string {
    const ctor = this.constructor as typeof BaseModel
    const value = this[ctor.primaryKey]
    return value !== undefined ? String(value) : ''
  }

  toString(): string {
    const ctor = this.constructor as typeof BaseModel
    return `${ctor.type} ${JSON.stringify(this)}`
  }
}

export type { BaseModel }
export default BaseModel
