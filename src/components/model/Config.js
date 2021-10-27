import BaseModel from "./BaseModel"

class Config extends BaseModel {
  static type = 'Config'
  static primaryKey = 'key'

  constructor(api) {
    super()
    this.key = api.key
    this.value = api.value
  }

  isControllable() {
    if (this.key === 'ADMIN_API_KEY') {
      return false
    }
    return true
  }
}

export default Config
