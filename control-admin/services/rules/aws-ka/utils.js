"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxyName = "test1";
const appsPrefix = `${proxyName}-ratelimitingproxy-`;
exports.default = {
    appsPrefix: appsPrefix,
    getAppName: (id) => {
        return `${appsPrefix}${id}`;
    },
    appToRule: (x) => {
        return {
            id: x.ApplicationName.replace(appsPrefix, ""),
            status: x.ApplicationStatus,
            config: JSON.parse(x.ApplicationDescription),
            metadata: { awsKa: x }
        };
    }
};
//# sourceMappingURL=utils.js.map