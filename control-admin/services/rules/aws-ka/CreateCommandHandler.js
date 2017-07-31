"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const client_1 = require("./client");
class CreateCommandHandler {
    handle(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const appName = utils_1.default.getAppName(msg.id);
            var appResponse = yield client_1.default.createApplication({
                ApplicationName: appName,
                ApplicationDescription: msg.configJson,
                ApplicationCode: this.generateCode(msg.config),
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
        });
    }
    generateCode(rule) {
        return "TO-DO";
        // "-- ** Aggregate (COUNT, AVG, etc.) + Sliding time window ** -- Performs function on the aggregate rows over a 10 second sliding window for a specified column. -- .----------. .----------. .----------. -- | SOURCE | | INSERT | | DESTIN. | -- Source-->| STREAM |-->| & SELECT |-->| STREAM |-->Destination -- | | | (PUMP) | | | -- '----------' '----------' '----------' -- STREAM (in-application): a continuously updated entity that you can SELECT from and INSERT into like a TABLE -- PUMP: an entity used to continuously 'SELECT ... FROM' a source STREAM, and INSERT SQL results into an output STREAM -- Create output stream, which can be used to send to a destination CREATE OR REPLACE STREAM "DESTINATION_SQL_STREAM" (ticker_symbol VARCHAR(4), ticker_symbol_count INTEGER); -- Create a pump which continuously selects from a source stream (SOURCE_SQL_STREAM_001) -- performs an aggregate count that is grouped by columns ticker over a 10-second sliding window CREATE OR REPLACE PUMP "STREAM_PUMP" AS INSERT INTO "DESTINATION_SQL_STREAM" -- COUNT|AVG|MAX|MIN|SUM|STDDEV_POP|STDDEV_SAMP|VAR_POP|VAR_SAMP) SELECT STREAM ticker_symbol, COUNT(*) OVER TEN_SECOND_SLIDING_WINDOW AS ticker_symbol_count FROM "SOURCE_SQL_STREAM_001" -- Results partitioned by ticker_symbol and a 10-second sliding time window WINDOW TEN_SECOND_SLIDING_WINDOW AS ( PARTITION BY ticker_symbol RANGE INTERVAL '10' SECOND PRECEDING); "
    }
}
exports.CreateCommandHandler = CreateCommandHandler;
//# sourceMappingURL=CreateCommandHandler.js.map