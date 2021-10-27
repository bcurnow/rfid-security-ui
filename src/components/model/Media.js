import BaseModel from "./BaseModel"

class Media extends BaseModel {
  static type = 'Media'
  static primaryKey = 'name'

  constructor(api) {
    super()
    this.id = api.id
    this.name = api.name
    this.desc = api.desc
  }

  displayIdentifier() {
    return `${this.name}  (${this.id})`
  }
}

export default Media
