# control api

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