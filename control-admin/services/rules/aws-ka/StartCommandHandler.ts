import { IRule, IRuleConfig, RuleStatus } from '../../../models/rule';
import { ICommandHandler, IQueryHandler } from '../../abstractions';
import utils from './utils';
import client from './client';

export class StartCommandHandler implements ICommandHandler<{id: string}> {

    public async handle(msg: { id: string; }): Promise<void> {
        const appName = utils.getAppName(msg.id);
        
        await client.startApplication({
            ApplicationName: appName,
            InputConfigurations: [{
                Id: "1.1",
                InputStartingPositionConfiguration: {
                    InputStartingPosition: "NOW"
                }
            }]
        }).promise();
    }
}