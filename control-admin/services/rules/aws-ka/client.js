"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
exports.default = new AWS.KinesisAnalytics();
//# sourceMappingURL=client.js.map