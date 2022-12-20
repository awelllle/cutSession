"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const date_fns_1 = require("date-fns");
const utils_1 = require("../utils");
class AppController {
    howOld(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dob = req.query.dob;
            if (!dob) {
                return utils_1.default.helpers.sendErrorResponse(res, {}, "dob param is required");
            }
            try {
                const valid = (new Date(dob)).getTime() > 0;
                if (!valid) {
                    return utils_1.default.helpers.sendErrorResponse(res, {}, "Invalid date of birth param");
                }
                const age = (0, date_fns_1.differenceInYears)(new Date(), new Date(`${dob}`));
                return res.status(200).json({ age: age });
            }
            catch (e) {
                const error = e;
                console.log(error);
                return res.status(400).json(error);
            }
        });
    }
}
exports.AppController = AppController;
//# sourceMappingURL=app.js.map