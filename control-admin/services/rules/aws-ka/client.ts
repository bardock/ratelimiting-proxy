import * as AWS from 'aws-sdk';
import config from '../../../config';

AWS.config.update({region: config.aws.region});

export default new AWS.KinesisAnalytics();