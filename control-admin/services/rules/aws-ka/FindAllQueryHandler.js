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
class FindAllQueryHandler {
    handle(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            var hasMoreApps = true;
            var apps = [];
            while (hasMoreApps) {
                var data = yield client_1.default.listApplications().promise();
                var appDescPromises = data.ApplicationSummaries
                    .filter(x => x.ApplicationName.startsWith(utils_1.default.appsPrefix))
                    .map(x => client_1.default.describeApplication({ ApplicationName: x.ApplicationName }).promise());
                var pageApps = (yield Promise.all(appDescPromises))
                    .map(x => x.ApplicationDetail)
                    .map(x => utils_1.default.appToRule(x));
                apps.push.apply(apps, pageApps);
                hasMoreApps = data.HasMoreApplications;
            }
            return apps;
        });
    }
}
exports.FindAllQueryHandler = FindAllQueryHandler;
//# sourceMappingURL=FindAllQueryHandler.js.map