import { IKinesisAppConfig } from './services/rules/aws-ka/IKinesisAppConfig';

export default {
    port: process.env.PORT || 8081,
    proxyName: "test1", // this will be used to identify resources at the cloud provider
    aws: {
        region: 'us-east-1',
        kinesisAppConfig: <IKinesisAppConfig>{
            inputs: [{
                NamePrefix: "SOURCE_SQL_STREAM",
                KinesisStreamsInput: {
                    ResourceARN: "arn:aws:kinesis:us-east-1:715535454808:stream/ratelimiting-proxy-test-input",
                    RoleARN: "arn:aws:iam::715535454808:role/service-role/kinesis-analytics-test1-ratelimitingproxy-123-us-east-1"
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
                            Name: "receivedOn",
                            Mapping: "$.receivedOn",
                            SqlType: "TIMESTAMP"
                        },
                        {
                            Name: "ip",
                            Mapping: "$.ip",
                            SqlType: "VARCHAR(16)"
                        },
                        {
                            Name: "host",
                            Mapping: "$.host",
                            SqlType: "VARCHAR(100)"
                        },
                            {
                            Name: "path",
                            Mapping: "$.path",
                            SqlType: "VARCHAR(256)"
                        },
                        {
                            Name: "queryString",
                            Mapping: "$.queryString",
                            SqlType: "VARCHAR(256)"
                        },
                        {
                        Name: "userAgent",
                        Mapping: "$.userAgent",
                        SqlType: "VARCHAR(256)"
                        }
                    ]
                },
                InputParallelism: {
                    Count: 1
                }
            }],
            outputs: [{
                Name: "DESTINATION_SQL_STREAM",
                KinesisStreamsOutput: {
                    ResourceARN: "arn:aws:kinesis:us-east-1:715535454808:stream/ratelimiting-proxy-test-overruns",
                    RoleARN: "arn:aws:iam::715535454808:role/service-role/kinesis-analytics-test-ratelimitingproxy-ip_1000rps-us-east-1"
                },
                DestinationSchema: {
                    RecordFormatType: "JSON"
                }
            }],
            cloudWatchLoggingOptions: undefined
        }
    }
};