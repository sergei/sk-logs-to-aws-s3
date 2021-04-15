const fs = require('fs');
const {gzip} = require('zlib');
const path = require('path')
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const UPLOAD_BATCH_SIZE = 5;
const TIME_BETWEEN_BATCHES  = 5 * 1000
const TIME_BETWEEN_ATTEMPTS = 15 * 60 * 1000

module.exports = function (options, logDir, debug, error) {

    // This function gZIPs and uploads file to the S3 bucket
    const uploadSigleFile = (file, cb) => {
        fs.readFile(file, (err, data) => {
            if (err) { 
                error(err)
                numToUpload --
                cb(numToUpload)
            }else{
                gzip(data, (err, buffer) => {
                    if (err) {
                        error('ZIP error:', err);
                    }else{
                        const uploadParams = { 
                            Bucket: options.aws_s3_bucket_name, 
                            ContentType: 'application/gzip',
                            Key: path.basename(file) + '.gz'
                        };
                        debug('Uploading ', uploadParams.Key,' compresed size', buffer.length, ' bytes')
                        uploadParams.Body = buffer;
                        s3.send(new PutObjectCommand(uploadParams))
                            .then((data) => {
                                debug('Uploaded', uploadParams.Key, ' deleting ...')
                                fs.unlink(file, (err) => { if(err) error('Failed to delete ', file, err)});
                            })
                            .catch((err) => {
                                error('Error uploading ',uploadParams.Key, err)
                            })
                            .finally(() => {
                                numToUpload --
                                cb(numToUpload)
                            });
                    }
                });
            }
        });        
    };

    // This function uploads files from the provided list
    const uploadMultipleFiles = (files, cb) => {
        numToUpload = files.length
        cb(numToUpload)
        files.map( file => {
            uploadSigleFile(file, cb)
        })
    };

    // This function looks for the serve logs in the log folder and uploads N of them to the S3 bucket
    const uploadSomeLogs = () => {
        fs.readdir(logDir, (err, files) => {
            const serverLogs = files.filter(name=>name.endsWith('.log'))
                                    .filter(name=>name.startsWith('skserver-raw_'))
                                    .sort()

            const numFilesToUpload = Math.min(UPLOAD_BATCH_SIZE, serverLogs.length)
            const filesToUpload = serverLogs.slice(0, numFilesToUpload).map(x => path.join(logDir,x))
            debug(filesToUpload)

            if ( filesToUpload.length > 0 ) {
                uploadMultipleFiles(filesToUpload, uploadStatus)
            }else{  // Nothing to uplaod, come back later
                debug('Nothing to upload sleep for ', TIME_BETWEEN_ATTEMPTS/1000, ' sec')
                setTimeout(uploadSomeLogs, TIME_BETWEEN_ATTEMPTS)
            }
        });        
    }

    // The callback is called each time the upload is completed either successfuly or not
    const uploadStatus = (numToUpload) => {
        debug('Remaining files to upload:', numToUpload)            
        if ( numToUpload == 0 ){
            debug('schedule next batch upload')
            setTimeout(uploadSomeLogs, TIME_BETWEEN_BATCHES)
        }
    }

    debug('log will be read from ', logDir);
    debug('Logs will be uploaded to ', options.aws_s3_bucket_name);

    // Create an Amazon S3 service client object.
    const s3 = new S3Client({ 
        region: options.aws_region,
        credentials: {
            accessKeyId: options.aws_access_key_id,
            secretAccessKey: options.aws_secret_access_key,
        }
        });

    // Start first batch upload
    let numToUpload =  0;
    uploadSomeLogs();
    // f = path.join(logDir, 'skserver-raw_2021-04-09T18.log')
    // uploadSigleFile(f, x => {})

    
}
