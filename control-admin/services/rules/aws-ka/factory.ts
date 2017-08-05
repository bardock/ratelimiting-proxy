import { IRuleServicesFactory } from '../../abstractions';
import { IKinesisAppConfig } from './IKinesisAppConfig';
import { CreateCommandHandler } from './CreateCommandHandler';
import { StopCommandHandler } from './StopCommandHandler';
import { DeleteCommandHandler } from './DeleteCommandHandler';
import { FindAllQueryHandler } from './FindAllQueryHandler';
import { FindByIdQueryHandler } from './FindByIdQueryHandler';
import { StartCommandHandler } from './StartCommandHandler';

function factory(config: { app: IKinesisAppConfig }): IRuleServicesFactory {
    return {
        findByIdQueryHandler() {
            return new FindByIdQueryHandler();
        },
        findAllQueryHandler() {
            return new FindAllQueryHandler();
        },
        createCommandHandler() {
            return new CreateCommandHandler(config.app);
        },
        deleteCommandHandler() {
            return new DeleteCommandHandler();
        },
        startCommandHandler() {
            return new StartCommandHandler();
        },
        stopCommandHandler() {
            return new StopCommandHandler();
        },
    };
}
export default factory;