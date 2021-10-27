import BaseModel from "./BaseModel"

class Permission extends BaseModel {
  static type = 'Permission'
  static primaryKey = 'id'

  constructor(api) {
    super()
    this.id = api.id
    this.name = api.name
    this.desc = api.desc
  }
}

export default Permission
