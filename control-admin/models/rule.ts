export interface IRule {
    id: any,
    config: IRuleConfig,
    status: RuleStatus,
    metadata: any
}

export interface IRuleConfig {
    criterias: { [field: string]: string},
    requestsLimit: number,
    windowTimeSize: number,
    windowTimeUnit: TimeUnit
}

export const enum RuleStatus {
    DELETING="DELETING",
    STARTING="STARTING",
    STOPPING="STOPPING",
    READY="READY",
    RUNNING="RUNNING",
    UPDATING="UPDATING"
}

export enum TimeUnit {
    SECOND="SECOND",
    MINUTE="MINUTE",
    HOUR="HOUR"
}