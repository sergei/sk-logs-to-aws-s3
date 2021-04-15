const s3Uploader = require('../s3_uploader')

// Copy file secret-pattern.js to secret.js and put your secret information here 
const options = require('./secret')

console.log(options)

logDir = '/Users/sergei/debuglog/signalk/server'

s3Uploader(options, logDir, console.log, console.log)

