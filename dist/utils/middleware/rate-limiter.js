"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1000,
    max: 1,
    message: "You have exceeded the 3 requests in 1 second limit!",
    standardHeaders: true,
    legacyHeaders: false,
});
exports.rateLimiter = rateLimiter;
//# sourceMappingURL=rate-limiter.js.map