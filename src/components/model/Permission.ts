import { BaseModel } from './BaseModel'

/**
 * A union type which allows the Permission to also have a disabled property which is used in when inside a select list
 */
export type SelectablePermission = Permission & { disabled?: boolean }

export class Permission extends BaseModel<Permission> {

  id: number = undefined as any
  name: string = undefined as any
  desc: string = undefined as any
  
  constructor(data: Partial<Permission>) {
    super(data)
    Object.assign(this, data)
 }

  override displayIdentifier(): string {
    return this.name
  }
}