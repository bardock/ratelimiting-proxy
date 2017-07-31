"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CreateCommand {
    constructor(_config) {
        //TODO validate and normalize
        this._config = _config;
        this._configJson = JSON.stringify(this._config);
        this._id = this.hashCode(this._configJson).toString();
    }
    get config() { return this._config; }
    get configJson() { return this._configJson; }
    get id() { return this._id; }
    hashCode(input) {
        var hash = 0;
        if (input.length == 0)
            return hash;
        for (var i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}
exports.CreateCommand = CreateCommand;
//# sourceMappingURL=CreateCommand.js.map