# control api

This web api allows you to manage rules for rate limiting.
An implementation for AWS Kinesis is included.

## Setup

### Build

The only requirement of this application is the Node Package Manager. All other dependencies can be installed with:

    npm install

### Kinesis Stream

You need to create one stream for input and another for output.
Then configure them in `config.ts` file.

### AWS credentials

You need to set up your AWS security credentials before the app is able
to connect to AWS. You can do this by creating a file named "credentials" at ~/.aws/ 
(C:\Users\USER_NAME\.aws\ for Windows users) and saving the following lines in the file:

    [default]
    aws_access_key_id = <your access key id>
    aws_secret_access_key = <your secret key>

See the [Security Credentials](http://aws.amazon.com/security-credentials) page and the AWS SDK for Node.js [Developer Guide](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html)
for more information.

## Generate input data for Kinesis

You can generate sample input data using this [tool](https://github.com/awslabs/amazon-kinesis-data-generator) and the following template:

	{
		"receivedOn": "{{date.utc}}",
		"ip": "{{internet.ip}}",
		"host": "{{internet.domainName}}",
		"path": "{{random.arrayElement([
			"users/1/",
			"sellers/asd",
			"products/qwe"
		])}}",
		"queryString": "TO-DO",
		"userAgent": "{{internet.userAgent}}"
	}