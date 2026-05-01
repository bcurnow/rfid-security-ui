import { BaseModel } from './BaseModel'

export class Color extends BaseModel<Color> {
  static override primaryKey(): string {
    return 'int'
  }

  // Need to override this entire method because the value is not an object, it's just the int property
  override toApiInput(): Record<string, any> | number | string {
    return this.int
  }

  static fromNumber(int: number): Color {
    return new Color({
      int: int,
      hex: int.toString(16).toUpperCase().padStart(6, '0'),
      html: `#${int.toString(16).padStart(6, '0')}`
    })
  }

  int: number = undefined as any
  hex: string = undefined as any
  html: string = undefined as any

  
  constructor(data: Partial<Color>) {
    super(data)
    Object.assign(this, data)
  }
}