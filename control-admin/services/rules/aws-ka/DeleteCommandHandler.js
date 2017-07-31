"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const client_1 = require("./client");
class DeleteCommandHandler {
    handle(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const appName = utils_1.default.getAppName(msg.id);
            const appDesc = yield client_1.default.describeApplication({ ApplicationName: appName }).promise();
            const result = yield client_1.default.deleteApplication({
                ApplicationName: appName,
                CreateTimestamp: appDesc.ApplicationDetail.CreateTimestamp
            }).promise();
        });
    }
}
exports.DeleteCommandHandler = DeleteCommandHandler;
//# sourceMappingURL=DeleteCommandHandler.js.map