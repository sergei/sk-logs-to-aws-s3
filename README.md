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
