import { CreateCommand } from '../CreateCommand';
import { IRule, IRuleConfig, RuleStatus } from '../../../models/rule';
import { ICommandHandler, IQueryHandler } from '../../abstractions';
import utils from './utils';
import client from './client';

export class CreateCommandHandler implements ICommandHandler<CreateCommand> {

    public async handle(msg: CreateCommand): Promise<void> {
        const appName = utils.getAppName(msg.id);

        var appResponse = await client.createApplication({
            ApplicationName: appName,
            ApplicationDescription: msg.configJson,
            ApplicationCode: this.generateCode(msg),
            Inputs: [{
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
    }

    private generateCode(cmd: CreateCommand): string {
        // TODO: support multiple criteria fields
        var criteria = Object.keys(cmd.config.criterias)[0];

        return `CREATE OR REPLACE STREAM "DESTINATION_SQL_STREAM" (
                    RULE_ID VARCHAR(50), 
                    CONTROL_FIELD VARCHAR(50), 
                    CONTROL_VALUE VARCHAR(200), 
                    REQUESTS_COUNT INTEGER,
                    FIRST_REQUEST_RECEIVED_ON TIMESTAMP
                );
                CREATE OR REPLACE PUMP "STREAM_PUMP" AS INSERT INTO "DESTINATION_SQL_STREAM"
                SELECT * FROM (
                    SELECT STREAM
                        '${cmd.id}' as RULE_ID,
                        '${criteria}' as CONTROL_FIELD, 
                        "${criteria}" as CONTROL_VALUE, 
                        COUNT(*) OVER SLIDING_WINDOW AS REQUESTS_COUNT,
                        MIN("receivedOn") OVER SLIDING_WINDOW AS FIRST_REQUEST_RECEIVED_ON
                    FROM "SOURCE_SQL_STREAM_001"
                    -- Results partitioned by ticker_symbol and a 10-second sliding time window 
                    WINDOW SLIDING_WINDOW AS (
                    PARTITION BY "${criteria}"
                    RANGE INTERVAL '${cmd.config.windowTimeSize}' ${cmd.config.windowTimeUnit} PRECEDING)
                ) as x
                WHERE REQUESTS_COUNT > ${cmd.config.requestsLimit};`;
    }
}