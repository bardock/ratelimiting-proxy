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
const CreateCommand_1 = require("../services/rules/CreateCommand");
const config_1 = require("../config");
const utils_1 = require("../utils");
const express = require("express");
const router = express.Router();
const handlers = config_1.default.rules.handlers;
router.get('/', utils_1.default.decorate((req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield handlers
        .findAllQueryHandler()
        .handle({});
    res.json(data);
})));
router.post('/', utils_1.default.decorate((req, res) => __awaiter(this, void 0, void 0, function* () {
    const cmd = new CreateCommand_1.CreateCommand(req.body);
    yield handlers
        .createCommandHandler()
        .handle(cmd);
    yield handlers
        .startCommandHandler()
        .handle({ id: cmd.id });
    const data = yield handlers
        .findByIdQueryHandler()
        .handle({ id: cmd.id });
    res.json(data);
})));
router.get('/:id', utils_1.default.decorate((req, res) => __awaiter(this, void 0, void 0, function* () {
    const data = yield handlers
        .findByIdQueryHandler()
        .handle({ id: req.params.id });
    res.json(data);
})));
router.delete('/:id', utils_1.default.decorate((req, res) => __awaiter(this, void 0, void 0, function* () {
    yield handlers
        .deleteCommandHandler()
        .handle({ id: req.params.id });
    res.json("OK");
})));
router.put('/:id/start', utils_1.default.decorate((req, res) => __awaiter(this, void 0, void 0, function* () {
    yield handlers
        .startCommandHandler()
        .handle({ id: req.params.id });
    const data = yield handlers
        .findByIdQueryHandler()
        .handle({ id: req.params.id });
    res.json(data);
})));
router.put('/:id/stop', utils_1.default.decorate((req, res) => __awaiter(this, void 0, void 0, function* () {
    yield handlers
        .stopCommandHandler()
        .handle({ id: req.params.id });
    const data = yield handlers
        .findByIdQueryHandler()
        .handle({ id: req.params.id });
    res.json(data);
})));
module.exports = router;
//# sourceMappingURL=rules.js.map