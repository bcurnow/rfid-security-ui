import { describe, it, expect } from 'vitest'
import { BaseModel } from '@/components/model/BaseModel'

class Simple extends BaseModel<Simple> {
  id: number = undefined as any
  firstName: string = undefined as any
  lastName: string = undefined as any

  constructor(data: Partial<Simple>) {
    super(data)
    Object.assign(this, data)
  }
}

class WithNested extends BaseModel<WithNested> {
  id: number = undefined as any
  child: Simple = undefined as any
  tags: string[] = []
  children: Simple[] = []

  constructor(data: Partial<WithNested>) {
    super(data)
    Object.assign(this, data)
    if (data.child) this.child = new Simple(data.child as Partial<Simple>)
    if (data.children) this.children = (data.children as any[]).map(c => new Simple(c))
  }
}

describe('BaseModel', () => {
  describe('static displayName', () => {
    it('returns the class name', () => {
      expect(Simple.displayName()).toBe('Simple')
    })
  })

  describe('static primaryKey', () => {
    it('defaults to "id"', () => {
      expect(Simple.primaryKey()).toBe('id')
    })
  })

  describe('static fromApi', () => {
    it('converts snake_case keys to camelCase', () => {
      const instance = Simple.fromApi({ id: 1, first_name: 'Jane', last_name: 'Doe' })
      expect(instance.id).toBe(1)
      expect(instance.firstName).toBe('Jane')
      expect(instance.lastName).toBe('Doe')
    })

    it('returns an instance of the subclass', () => {
      const instance = Simple.fromApi({ id: 1, first_name: 'Jane', last_name: 'Doe' })
      expect(instance).toBeInstanceOf(Simple)
    })

    it('leaves already-camelCase keys unchanged', () => {
      const instance = Simple.fromApi({ id: 5, first_name: 'A', last_name: 'B' })
      expect(instance.id).toBe(5)
    })
  })

  describe('inputExcludedProperties', () => {
    it('excludes "id" by default', () => {
      const instance = new Simple({ id: 1, firstName: 'X', lastName: 'Y' })
      expect(instance.inputExcludedProperties()).toEqual(new Set(['id']))
    })
  })

  describe('toApiInput', () => {
    it('converts camelCase keys to snake_case', () => {
      const instance = new Simple({ id: 1, firstName: 'Alice', lastName: 'Smith' })
      expect(instance.toApiInput()).toEqual({ first_name: 'Alice', last_name: 'Smith' })
    })

    it('excludes id', () => {
      const instance = new Simple({ id: 99, firstName: 'Alice', lastName: 'Smith' })
      const result = instance.toApiInput() as Record<string, any>
      expect(result).not.toHaveProperty('id')
    })

    it('recursively calls toApiInput on nested BaseModel', () => {
      const instance = new WithNested({
        id: 1,
        child: new Simple({ id: 2, firstName: 'Bob', lastName: 'Jones' }),
      })
      const result = instance.toApiInput() as Record<string, any>
      expect(result.child).toEqual({ first_name: 'Bob', last_name: 'Jones' })
    })

    it('maps array of BaseModel instances via toApiInput', () => {
      const instance = new WithNested({
        id: 1,
        children: [
          new Simple({ id: 2, firstName: 'C1', lastName: 'L1' }),
          new Simple({ id: 3, firstName: 'C2', lastName: 'L2' }),
        ],
      })
      const result = instance.toApiInput() as Record<string, any>
      expect(result.children).toEqual([
        { first_name: 'C1', last_name: 'L1' },
        { first_name: 'C2', last_name: 'L2' },
      ])
    })

    it('keeps primitive array items as-is', () => {
      const instance = new WithNested({ id: 1, tags: ['a', 'b', 'c'] })
      const result = instance.toApiInput() as Record<string, any>
      expect(result.tags).toEqual(['a', 'b', 'c'])
    })
  })

  describe('displayIdentifier', () => {
    it('returns the primary key value as a string', () => {
      const instance = new Simple({ id: 42 })
      expect(instance.displayIdentifier()).toBe('42')
    })
  })

  describe('toString', () => {
    it('returns a JSON representation', () => {
      const instance = new Simple({ id: 1, firstName: 'A', lastName: 'B' })
      expect(JSON.parse(instance.toString())).toEqual({ id: 1, firstName: 'A', lastName: 'B' })
    })
  })

  describe('toJSON', () => {
    it('returns a plain object with all own properties', () => {
      const instance = new Simple({ id: 1, firstName: 'A', lastName: 'B' })
      expect(instance.toJSON()).toEqual({ id: 1, firstName: 'A', lastName: 'B' })
    })
  })
})
