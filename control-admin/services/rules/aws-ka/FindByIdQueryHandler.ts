import { IRule, IRuleConfig, RuleStatus } from '../../../models/rule';
import { IQueryHandler } from '../../abstractions';
import utils from './utils';
import client from './client';

export class FindByIdQueryHandler implements IQueryHandler<{id: string}, IRule> {

    public async handle(msg: { id: string; }): Promise<IRule> {
        const appName = utils.getAppName(msg.id);
        const appDesc = await client.describeApplication({ ApplicationName: appName }).promise();

        return utils.appToRule(appDesc.ApplicationDetail);
    }
}