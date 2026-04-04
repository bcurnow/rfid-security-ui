import BaseModel from './BaseModel'

export interface SoundSpec {
  id: number
  name: string
  lastUpdateTimestamp: number
  content: string
}

class Sound extends BaseModel {
  static type: string = 'Sound'
  static primaryKey: string = 'id'

  id : number
  name: string
  lastUpdateTimestamp: number
  content: string
  
  constructor({id, name, lastUpdateTimestamp, content}: SoundSpec) {
    super()
    this.id = id
    this.name = name
    this.lastUpdateTimestamp = lastUpdateTimestamp
    this.content = content
  }
}

export default Sound
