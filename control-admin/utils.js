"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TODO
 *
 * @param {any} fn
 * @returns
 */
function handler(fn) {
    return (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    };
}
exports.default = {
    handler: handler
};
//# sourceMappingURL=utils.js.map