"use strict";

import AWS = require('aws-sdk');
import express = require('express');
import utils from '../utils';
import * as Model from '../models/rule';

AWS.config.update({region: 'us-east-1'});
const ka = new AWS.KinesisAnalytics();

const router = express.Router();

const proxyName = "test1";
const appsPrefix = `${proxyName}-ratelimitingproxy-`;

router.get('/', utils.handler(async (req, res) => {

    var hasMoreApps = true;
    var apps = [];

    while(hasMoreApps) {
        var data = await ka.listApplications().promise();
        
        var appDescPromises = data.ApplicationSummaries
            .filter(x => x.ApplicationName.startsWith(appsPrefix))
            .map(x => ka.describeApplication({ ApplicationName: x.ApplicationName }).promise());
        
        var pageApps = (await Promise.all(appDescPromises))
            .map(x => x.ApplicationDetail)
            .map(x => <Model.IRule>{ 
                id: x.ApplicationName.replace(appsPrefix, ""),
                status: x.ApplicationStatus,
                config: <Model.IRuleConfig>JSON.parse(x.ApplicationDescription),
                metadata: {awsKa: x}
            });

        apps.push.apply(apps, pageApps);

        hasMoreApps = data.HasMoreApplications;
    }

    res.json(apps);
}));

router.post('/', utils.handler(async (req, res) => {

    const ruleConfig: Model.IRuleConfig = req.body;
    //TODO validate and normalize

    const ruleJson = JSON.stringify(ruleConfig);
    const id = hashCode(ruleJson);

    var appResponse = await ka.createApplication({
        ApplicationName: `${appsPrefix}${id}`,
        ApplicationDescription: ruleJson,
        ApplicationCode: generateCode(ruleConfig),
        Inputs: [{
            NamePrefix: "SOURCE_SQL_STREAM",
            KinesisStreamsInput: {
                ResourceARN: "arn:aws:kinesis:us-east-1:715535454808:stream/kinesis-analytics-demo-stream",
                RoleARN: "arn:aws:iam::715535454808:role/service-role/kinesis-analytics-test-ratelimitingproxy-ip_1000rps-us-east-1"
            },
            InputSchema: {
                RecordFormat: {
                    RecordFormatType: "JSON",
                    MappingParameters: {
                        JSONMappingParameters: {
                            RecordRowPath: "$"
                        }
                    }
                },
                RecordEncoding: "UTF-8",
                RecordColumns: [
                    {
                        Name: "TICKER_SYMBOL",
                        Mapping: "$.TICKER_SYMBOL",
                        SqlType: "VARCHAR(4)"
                    },
                    {
                        Name: "SECTOR",
                        Mapping: "$.SECTOR",
                        SqlType: "VARCHAR(16)"
                    },
                    {
                        Name: "CHANGE",
                        Mapping: "$.CHANGE",
                        SqlType: "REAL"
                    },
                    {
                        Name: "PRICE",
                        Mapping: "$.PRICE",
                        SqlType: "REAL"
                    }
                ]
            },
            InputParallelism: {
                Count: 1
            }
        }],
        Outputs: [{
            Name: "DESTINATION_SQL_STREAM",
            KinesisStreamsOutput: {
                ResourceARN: "arn:aws:kinesis:us-east-1:715535454808:stream/ratelimiting-proxy-test-overruns",
                RoleARN: "arn:aws:iam::715535454808:role/service-role/kinesis-analytics-test-ratelimitingproxy-ip_1000rps-us-east-1"
            },
            DestinationSchema: {
                RecordFormatType: "JSON"
            }
        }],
        CloudWatchLoggingOptions: undefined
    }).promise();

    var startResponse = await ka.startApplication({
        ApplicationName: appResponse.ApplicationSummary.ApplicationName,
        InputConfigurations: [{
            Id: "1.1",
            InputStartingPositionConfiguration: {
                InputStartingPosition: "NOW"
            }
        }]
    }).promise();

    const rule: Model.IRule = {
        id: id,
        config: ruleConfig,
        status: Model.RuleStatus.STARTING,
        metadata: { 
            awsKa: {
                createAppResponse: appResponse,
                startAppResponse: startResponse,
            }
        }
    };

    res.json(rule);
}));

function generateCode(rule: Model.IRuleConfig): string {
    return "TO-DO";
    // "-- ** Aggregate (COUNT, AVG, etc.) + Sliding time window ** -- Performs function on the aggregate rows over a 10 second sliding window for a specified column. -- .----------. .----------. .----------. -- | SOURCE | | INSERT | | DESTIN. | -- Source-->| STREAM |-->| & SELECT |-->| STREAM |-->Destination -- | | | (PUMP) | | | -- '----------' '----------' '----------' -- STREAM (in-application): a continuously updated entity that you can SELECT from and INSERT into like a TABLE -- PUMP: an entity used to continuously 'SELECT ... FROM' a source STREAM, and INSERT SQL results into an output STREAM -- Create output stream, which can be used to send to a destination CREATE OR REPLACE STREAM "DESTINATION_SQL_STREAM" (ticker_symbol VARCHAR(4), ticker_symbol_count INTEGER); -- Create a pump which continuously selects from a source stream (SOURCE_SQL_STREAM_001) -- performs an aggregate count that is grouped by columns ticker over a 10-second sliding window CREATE OR REPLACE PUMP "STREAM_PUMP" AS INSERT INTO "DESTINATION_SQL_STREAM" -- COUNT|AVG|MAX|MIN|SUM|STDDEV_POP|STDDEV_SAMP|VAR_POP|VAR_SAMP) SELECT STREAM ticker_symbol, COUNT(*) OVER TEN_SECOND_SLIDING_WINDOW AS ticker_symbol_count FROM "SOURCE_SQL_STREAM_001" -- Results partitioned by ticker_symbol and a 10-second sliding time window WINDOW TEN_SECOND_SLIDING_WINDOW AS ( PARTITION BY ticker_symbol RANGE INTERVAL '10' SECOND PRECEDING); "
}

function hashCode(input: string) {
	var hash = 0;
	if (input.length == 0) return hash;
	for (var i = 0; i < input.length; i++) {
		const char = input.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

module.exports = router;
// export default router;