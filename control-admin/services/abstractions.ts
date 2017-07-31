import { IRule, IRuleConfig } from '../models/rule';
import { CreateCommand } from './rules/CreateCommand';

export interface ICommandHandler<TCommand> {
    handle(msg: TCommand): Promise<void>;
}

export interface IQueryHandler<TQuery, TResult> {
    handle(msg: TQuery): Promise<TResult>;
}

export interface IRuleServicesFactory {
    findByIdQueryHandler(): IQueryHandler<{id: string}, IRule>;
    findAllQueryHandler(): IQueryHandler<{}, IRule[]>;
    createCommandHandler(): ICommandHandler<CreateCommand>;
    deleteCommandHandler(): ICommandHandler<{id: string}>;
    startCommandHandler(): ICommandHandler<{id: string}>;
    stopCommandHandler(): ICommandHandler<{id: string}>;
}