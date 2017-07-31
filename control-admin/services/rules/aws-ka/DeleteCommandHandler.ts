import { IRule, IRuleConfig, RuleStatus } from '../../../models/rule';
import { ICommandHandler, IQueryHandler } from '../../abstractions';
import utils from './utils';
import client from './client';

export class DeleteCommandHandler implements ICommandHandler<{id: string}> {

    public async handle(msg: { id: string; }): Promise<void> {
        const appName = utils.getAppName(msg.id);
        const appDesc = await client.describeApplication({ ApplicationName: appName }).promise();

        const result = await client.deleteApplication({ 
            ApplicationName: appName,
            CreateTimestamp: appDesc.ApplicationDetail.CreateTimestamp
        }).promise();
    }
}