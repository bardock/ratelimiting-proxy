import { IRule, IRuleConfig, RuleStatus } from '../../../models/rule';
import { ICommandHandler, IQueryHandler } from '../../abstractions';
import utils from './utils';
import client from './client';

export class StopCommandHandler implements ICommandHandler<{id: string}> {

    public async handle(msg: { id: string; }): Promise<void> {
        const appName = utils.getAppName(msg.id);

        await client.stopApplication({ ApplicationName: appName }).promise();
    }
}