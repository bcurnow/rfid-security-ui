import BaseModel from './BaseModel'

export interface ConfigSpec {
  key: string
  value: string
}

class Config extends BaseModel {
  static type: string = 'Config'
  static primaryKey: string = 'key'

  key: string
  value: string
  
  constructor({key, value}: ConfigSpec) {
    super()
    this.key = key
    this.value = value
  }

  isControllable(): boolean {
    return this.key !== 'ADMIN_API_KEY'
  }
}
 
export default Config
