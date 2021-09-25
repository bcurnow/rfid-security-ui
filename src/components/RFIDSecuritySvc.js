import configSvc from './svc/Config.js'
import mediaSvc from './svc/Media.js'
import permissionSvc from './svc/Permission.js'
import readerSvc from './svc/Reader.js'
import associationSvc from './svc/Association.js'
import soundSvc from './svc/Sound.js'
import playerSvc from './svc/Player.js'
import errorToString from '@/components/Error.js'

const RFIDSecuritySvc = {
  association: associationSvc,
  config: configSvc,
  errorToString: errorToString,
  media: mediaSvc,
  permission: permissionSvc,
  player: playerSvc,
  reader: readerSvc,
  sound: soundSvc,
}

export default RFIDSecuritySvc
