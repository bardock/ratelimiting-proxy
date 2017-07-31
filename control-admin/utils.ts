"use strict";

import express = require('express');

/**
 * Catch async errors and send to express middleware
 */
function decorate(fn: express.RequestHandler): express.RequestHandler {  
    return (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
}

export default {
    decorate: decorate
};