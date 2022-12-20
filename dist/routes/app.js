"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const app_1 = require("../controllers/app");
const rate_limiter_1 = require("../utils/middleware/rate-limiter");
class AppRoutes {
    constructor() {
        this.appController = new app_1.AppController();
    }
    routes(app) {
        app.route('/howold').get([rate_limiter_1.rateLimiter], this.appController.howOld);
    }
}
exports.AppRoutes = AppRoutes;
//# sourceMappingURL=app.js.map