class BaseModel {
  static type = 'BaseModel'
  static primaryKey = 'id'

  isControllable() {
    return true
  }

  displayIdentifier() {
    return this[this.constructor.primaryKey]
  }

  toString() {
    return `${this.constructor.type} ${JSON.stringify(this)}`
  }
}

export default BaseModel
