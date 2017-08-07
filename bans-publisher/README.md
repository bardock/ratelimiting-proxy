# bans publisher

This is a Lambda function that reveices Kinesis events and publishes them to Redis (Pub/Sub)

## Setup

IMPORTANT: Your Lambda and your Redis must use the same VPC, Subnet and Security Group.

1. Setup Redis
	* Use a Redis Clustes using Elasticache ([doc](http://docs.aws.amazon.com/AmazonElastiCache/latest/UserGuide/GettingStarted.CreateCluster.html))
	* Or, setup a Redis instance in EC2 (recommended for dev). Follow this [instructions](http://docs.aws.amazon.com/AmazonElastiCache/latest/UserGuide/GettingStarted.CreateCluster.html)
		* You can use the last stable release (tested with v.4.0.1)
		* In `6379.conf` file, put `bind <private_ip>` instead of `bind 127.0.0.1`. `<private_ip>` is the EC2 instance's private IP.
1. Create Lambda function ([doc](http://docs.aws.amazon.com/lambda/latest/dg/with-kinesis-example.html))
1. Upload code
	* You can run `npm install`, zip this folder content and upload it to aws
1. Configure redis host (Elasticache DNS or EC2 private DNS) and port
1. You can test de Lambda function using the "Kinesis" sample event template