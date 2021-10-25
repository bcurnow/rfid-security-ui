import configSvc from './svc/Config.js'
import guestSvc from './svc/Guests.js'
import errorToString from '@/components/Error.js'
import mediaSvc from './svc/Media.js'
import mediaPermSvc from './svc/MediaPerms.js'
import permissionSvc from './svc/Permission.js'
import playerSvc from './svc/Player.js'
import readerSvc from './svc/Reader.js'
import soundSvc from './svc/Sound.js'

const RFIDSecuritySvc = {
  config: configSvc,
  errorToString: errorToString,
  guests: guestSvc,
  media: mediaSvc,
  mediaPerms: mediaPermSvc,
  permission: permissionSvc,
  player: playerSvc,
  reader: readerSvc,
  sound: soundSvc,
}

export default RFIDSecuritySvc
