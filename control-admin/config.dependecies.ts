import config from './config'
import rulesAwsHandlersFactory from './services/rules/aws-ka/factory'

export default {
    rules: {
        handlers: rulesAwsHandlersFactory({
            app: config.aws.kinesisAppConfig
        })
    }
};