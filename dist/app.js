"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const index_1 = require("./routes/index");
class App {
    constructor() {
        this.route = new index_1.Routes();
        this.app = express();
        this.config();
        this.route.routes(this.app);
        this.app.set('trust proxy', 1);
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
        this.app.use(cors());
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map