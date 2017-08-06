import { IKinesisAppConfig } from './IKinesisAppConfig';
import { CreateCommand } from '../CreateCommand';
import { IRule, IRuleConfig, RuleStatus } from '../../../models/rule';
import { ICommandHandler, IQueryHandler } from '../../abstractions';
import utils from './utils';
import client from './client';

export class CreateCommandHandler implements ICommandHandler<CreateCommand> {

    constructor(
        private _appConfig: IKinesisAppConfig) 
    { }

    public async handle(msg: CreateCommand): Promise<void> {
        const appName = utils.getAppName(msg.id);

        var appResponse = await client.createApplication({
            ApplicationName: appName,
            ApplicationDescription: msg.configJson,
            ApplicationCode: this.generateCode(msg),
            Inputs: this._appConfig.inputs,
            Outputs: this._appConfig.outputs,
            CloudWatchLoggingOptions: this._appConfig.cloudWatchLoggingOptions
        }).promise();
    }

    /**
     * Generates the SQL code for the Analytics app that aggregates requests 
     * based on rule criteria and filters and keeps overruns.
     * @param {CreateCommand} cmd object with rule values. It *MUST* be a validated CreateCommand, 
     * otherwise could have SQL injection
     * @returns {string} SQL code
     */
    private generateCode(cmd: CreateCommand): string {
        // TODO: support multiple criteria fields
        var criteria = Object.keys(cmd.config.criterias)[0];

        return `CREATE OR REPLACE STREAM "DESTINATION_SQL_STREAM" (
                    RULE_ID VARCHAR(50), 
                    CONTROL_FIELD VARCHAR(50), 
                    CONTROL_VALUE VARCHAR(200), 
                    REQUESTS_COUNT INTEGER,
                    EXPIRES_ON TIMESTAMP
                );
                CREATE OR REPLACE PUMP "STREAM_PUMP" AS INSERT INTO "DESTINATION_SQL_STREAM"
                SELECT * FROM (
                    SELECT STREAM
                        '${cmd.id}' as RULE_ID,
                        '${criteria}' as CONTROL_FIELD, 
                        "${criteria}" as CONTROL_VALUE, 
                        COUNT(*) OVER SLIDING_WINDOW AS REQUESTS_COUNT,
                        (MIN("receivedOn") OVER SLIDING_WINDOW) 
                            + INTERVAL '${cmd.config.windowTimeSize}' ${cmd.config.windowTimeUnit} 
                            AS EXPIRES_ON
                    FROM "SOURCE_SQL_STREAM_001"
                    -- Results partitioned by ticker_symbol and a 10-second sliding time window 
                    WINDOW SLIDING_WINDOW AS (
                    PARTITION BY "${criteria}"
                    RANGE INTERVAL '${cmd.config.windowTimeSize}' ${cmd.config.windowTimeUnit} PRECEDING)
                ) as x
                WHERE REQUESTS_COUNT > ${cmd.config.requestsLimit};`;
        // TODO: filter by criteria value
    }
}