"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateCommandHandler_1 = require("./CreateCommandHandler");
const StopCommandHandler_1 = require("./StopCommandHandler");
const DeleteCommandHandler_1 = require("./DeleteCommandHandler");
const FindAllQueryHandler_1 = require("./FindAllQueryHandler");
const FindByIdQueryHandler_1 = require("./FindByIdQueryHandler");
const StartCommandHandler_1 = require("./StartCommandHandler");
function factory(config) {
    return {
        findByIdQueryHandler() {
            return new FindByIdQueryHandler_1.FindByIdQueryHandler();
        },
        findAllQueryHandler() {
            return new FindAllQueryHandler_1.FindAllQueryHandler();
        },
        createCommandHandler() {
            return new CreateCommandHandler_1.CreateCommandHandler(config.app);
        },
        deleteCommandHandler() {
            return new DeleteCommandHandler_1.DeleteCommandHandler();
        },
        startCommandHandler() {
            return new StartCommandHandler_1.StartCommandHandler();
        },
        stopCommandHandler() {
            return new StopCommandHandler_1.StopCommandHandler();
        },
    };
}
exports.default = factory;
//# sourceMappingURL=factory.js.map