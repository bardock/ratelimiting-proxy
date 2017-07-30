"use strict";

import express = require('express');

/**
 * TODO
 * 
 * @param {any} fn 
 * @returns 
 */
function handler(fn: express.RequestHandler): express.RequestHandler {  
    return (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
}

export default {
    handler: handler
};