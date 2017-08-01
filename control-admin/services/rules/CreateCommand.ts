import { IRuleConfig, TimeUnit } from '../../models/rule';

export class CreateCommand {

    private _configJson: string;
    private _id: string;

    constructor(private _config: IRuleConfig) {
        if(!_config.criterias || !Object.keys(_config.criterias).length)
            throw new Error(`ArgumentException: _config.criterias must be an object. Value: ${JSON.stringify(_config.criterias)}`);

        for(const field of Object.keys(_config.criterias)) {
            if(!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(field))
                throw new Error(`ArgumentException: _config.criterias object must have fields with name that can be variable names. Value: ${JSON.stringify(field)}`);
            if(_config.criterias[field] != "*")
                throw new Error(`ArgumentException: _config.criterias object must have fields value equal to "*"`);
        }

        if(!Number.isInteger(_config.requestsLimit))
            throw new Error(`ArgumentException: _config.requestsLimit must be an integer. Value: ${JSON.stringify(_config.requestsLimit)}`);

        // TODO: check AWS constrains
        if(!Number.isInteger(_config.windowTimeSize))
            throw new Error(`ArgumentException: _config.windowTimeSize must be an integer. Value: ${JSON.stringify(_config.windowTimeSize)}`);

        if(!(_config.windowTimeUnit in TimeUnit))
            throw new Error(`ArgumentException: _config.windowTimeUnit must one of ${JSON.stringify(Object.keys(TimeUnit))}. Value: ${JSON.stringify(_config.windowTimeUnit)}`);

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