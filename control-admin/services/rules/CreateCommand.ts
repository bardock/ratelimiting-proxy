import { IRuleConfig } from '../../models/rule';

export class CreateCommand {

    private _configJson: string;
    private _id: string;

    constructor(private _config: IRuleConfig) {
        //TODO validate and normalize
        
        this._configJson = JSON.stringify(this._config);
        this._id = this.hashCode(this._configJson).toString();
    }

    get config() { return this._config }
    get configJson() { return this._configJson }
    get id() { return this._id }

    private hashCode(input: string) {
        var hash = 0;
        if (input.length == 0) return hash;
        for (var i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}