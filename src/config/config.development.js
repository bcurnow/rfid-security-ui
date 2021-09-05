const config = {
  apiKey: process.env.VUE_APP_RFID_API_KEY || 'Wu0sWRGCLF1NClIsYZVCdc-MV8b696oivfFF1oQqCGnK0vEaUZyb80El0ln6eCWKO9qrNlNTmvOfb7q0-GtnTw',
  production: false,
  apiUrl: process.env.VUE_APP_RFID_API_URL || 'http://rfidsecuritysvc:5000/api/v1.0/'
}

export default config
