import BaseModel from './BaseModel'

export interface MediaSpec {
  id: string
  name: string
  desc: string
} 

class Media extends BaseModel {
  static type: string = 'Media'
  static primaryKey: string = 'name'

  id: string
  name: string
  desc: string
  
  constructor({id, name, desc}: MediaSpec) {
    super()
    this.id = id
    this.name = name
    this.desc = desc
  }
}

export default Media
