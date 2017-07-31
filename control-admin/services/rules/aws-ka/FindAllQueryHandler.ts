import { IRule, IRuleConfig, RuleStatus } from '../../../models/rule';
import { IQueryHandler } from '../../abstractions';
import utils from './utils';
import client from './client';

export class FindAllQueryHandler implements IQueryHandler<{}, IRule[]> {

    public async handle(msg: { id: string; }): Promise<IRule[]> {
        var hasMoreApps = true;
        var apps: IRule[] = [];

        while(hasMoreApps) {
            var data = await client.listApplications().promise();
            
            var appDescPromises = data.ApplicationSummaries
                .filter(x => x.ApplicationName.startsWith(utils.appsPrefix))
                .map(x => client.describeApplication({ ApplicationName: x.ApplicationName }).promise());
            
            var pageApps = (await Promise.all(appDescPromises))
                .map(x => x.ApplicationDetail)
                .map(x => utils.appToRule(x));

            apps.push.apply(apps, pageApps);

            hasMoreApps = data.HasMoreApplications;
        }
        return apps;
    }
}