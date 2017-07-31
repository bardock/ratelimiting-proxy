import { IRuleServicesFactory } from '../../abstractions';
import { CreateCommandHandler } from './CreateCommandHandler';
import { StopCommandHandler } from './StopCommandHandler';
import { DeleteCommandHandler } from './DeleteCommandHandler';
import { FindAllQueryHandler } from './FindAllQueryHandler';
import { FindByIdQueryHandler } from './FindByIdQueryHandler';
import { StartCommandHandler } from './StartCommandHandler';

const factory: IRuleServicesFactory = {
    findByIdQueryHandler() {
        return new FindByIdQueryHandler();
    },
    findAllQueryHandler() {
        return new FindAllQueryHandler();
    },
    createCommandHandler() {
        return new CreateCommandHandler();
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

export default factory;