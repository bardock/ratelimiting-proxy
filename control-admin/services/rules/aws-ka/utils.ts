import { IRule, IRuleConfig, RuleStatus } from '../../../models/rule';

const proxyName = "test1";
const appsPrefix = `${proxyName}-ratelimitingproxy-`;

export default {
    appsPrefix: appsPrefix,
    getAppName: (id) => {
        return `${appsPrefix}${id}`;
    },
    appToRule: (x: AWS.KinesisAnalytics.Types.ApplicationDetail): IRule => {
        return { 
            id: x.ApplicationName.replace(appsPrefix, ""),
            status: <RuleStatus>x.ApplicationStatus,
            config: <IRuleConfig>JSON.parse(x.ApplicationDescription),
            metadata: {awsKa: x}
        };
    }
};