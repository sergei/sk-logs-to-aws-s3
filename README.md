# Push SignalK server logs to AWS S3

This plugin can be used by the developers to upload server multiplexed logs to AWS S3 bucket.

This plugin requires following four manadatory configuration items:

- AWS S3 bucket name
- AWS Region
- AWS Access Key ID
- AWS Secret Access Key

It's a good idea to create AWS IAM user with very limited permissions: e.g. that should be enough
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "SignalKS3Put",
            "Effect": "Allow",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```
To download logs it's nice to have some other policy that can be granted to other users 
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "SignalKLogsDownload",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR_BUCKET_NAME",
                "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            ]
        }
    ]
}
```

To download logs from S3 to your local machine you can use 
```
aws s3 sync s3://YOUR_BUCKET_NAME . --profile signalk-down
```

The  *signalk-down* is the name of the profile specified in  ~/.aws/config for the user that has the above 
SignalKLogsDownload policy attached   
