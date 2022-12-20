"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const app_1 = require("./app");
class Routes {
    constructor() {
        this.appRoutes = new app_1.AppRoutes();
    }
    routes(app) {
        app.route("/").get((req, res) => {
            res.status(200).send({
                message: "APIs are up and running!",
            });
        });
        this.appRoutes.routes(app);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=index.js.map