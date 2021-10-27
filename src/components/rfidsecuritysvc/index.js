import configSvc from './Config'
import guestSvc from './Guests'
import errorToString from '@/components/Error.js'
import mediaSvc from './Media'
import mediaPermSvc from './MediaPerms'
import permissionSvc from './Permission'
import playerSvc from './Player'
import readerSvc from './Reader'
import soundSvc from './Sound'

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
