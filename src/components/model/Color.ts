import BaseModel from './BaseModel'

export interface ColorSpec {
  int: number
  hex: string
  html: string
} 

class Color extends BaseModel {
  static type: string = 'Color'
  // This was originally int but then there was an overridden diplayIdentifier that returned html, this may need to be changed back.
  static primaryKey: string = 'html'

  int: number
  hex: string
  html: string

  constructor({int, hex, html}: ColorSpec) {
    super()
    this.int = int
    this.hex = hex
    this.html = html
  }
}
 
export default Color