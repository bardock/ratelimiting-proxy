"use strict";
import { CreateCommand } from '../services/rules/CreateCommand';

import config from '../config';
import utils from '../utils';
import { IRuleConfig } from '../models/rule';
import express = require('express');

const router = express.Router();
const handlers = config.rules.handlers;

router.get('/', utils.decorate(async (req, res) => {
    const data = await handlers
        .findAllQueryHandler()
        .handle({});

    res.json(data);
}));

router.post('/', utils.decorate(async (req, res) => {
    const cmd = new CreateCommand(req.body);

    await handlers
        .createCommandHandler()
        .handle(cmd);

    await handlers
        .startCommandHandler()
        .handle({ id: cmd.id });

    const data = await handlers
        .findByIdQueryHandler()
        .handle({ id: cmd.id });

    res.json(data);
}));

router.get('/:id', utils.decorate(async (req, res) => {
    const data = await handlers
        .findByIdQueryHandler()
        .handle({ id: req.params.id });

    res.json(data);
}));

router.delete('/:id', utils.decorate(async (req, res) => {
    await handlers
        .deleteCommandHandler()
        .handle({ id: req.params.id });

    res.json("OK");
}));

router.put('/:id/start', utils.decorate(async (req, res) => {
    await handlers
        .startCommandHandler()
        .handle({ id: req.params.id });

    const data = await handlers
        .findByIdQueryHandler()
        .handle({ id: req.params.id });

    res.json(data);
}));

router.put('/:id/stop', utils.decorate(async (req, res) => {
    await handlers
        .stopCommandHandler()
        .handle({ id: req.params.id });

    const data = await handlers
        .findByIdQueryHandler()
        .handle({ id: req.params.id });

    res.json(data);
}));

module.exports = router;