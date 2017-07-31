"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Catch async errors and send to express middleware
 */
function decorate(fn) {
    return (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    };
}
exports.default = {
    decorate: decorate
};
//# sourceMappingURL=utils.js.map