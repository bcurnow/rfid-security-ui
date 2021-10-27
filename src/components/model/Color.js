import BaseModel from './BaseModel'

class Color extends BaseModel {
  static type = 'Color'
  static primaryKey = 'int'

  constructor(api) {
    super()
    this.int = api.int
    this.hex = api.hex
    this.html = api.html
  }

  displayIdentifier() {
    return this.html
  }
}

export default Color
