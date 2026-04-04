import BaseModel from './BaseModel'

export interface PermissionSpec {
  id: string
  name: string
  desc: string
}

class Permission extends BaseModel {
  static type: string = 'Permission'
  static primaryKey: string = 'id'

  id: string
  name: string
  desc: string
  
  constructor({id, name, desc}: PermissionSpec) {
    super()
    this.id = id
    this.name = name
    this.desc = desc
  }

  displayIdentifier(): string {
    return this.name
  }
}

export default Permission
