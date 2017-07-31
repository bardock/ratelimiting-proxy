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
    constructor(_appConfig) {
        this._appConfig = _appConfig;
    }
    handle(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const appName = utils_1.default.getAppName(msg.id);
            var appResponse = yield client_1.default.createApplication({
                ApplicationName: appName,
                ApplicationDescription: msg.configJson,
                ApplicationCode: this.generateCode(msg),
                Inputs: this._appConfig.inputs,
                Outputs: this._appConfig.outputs,
                CloudWatchLoggingOptions: this._appConfig.cloudWatchLoggingOptions
            }).promise();
        });
    }
    generateCode(cmd) {
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
exports.CreateCommandHandler = CreateCommandHandler;
//# sourceMappingURL=CreateCommandHandler.js.map