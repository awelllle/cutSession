"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendSuccessResponse = function (res, content, message, status) {
    const data = {
        success: true,
        message,
        data: content,
    };
    res.status(!status ? 200 : status).json(data);
};
const sendErrorResponse = function (res, content, message, status) {
    const data = {
        success: false,
        message: message,
        data: content,
    };
    res.status(!status ? 400 : status).json(data);
};
const trimCollection = (data) => {
    const newData = Object.assign({}, data);
    Object.keys(data).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (typeof value === "string") {
                newData[key] = value.trim();
            }
        }
    });
    return newData;
};
const validParam = (obj, requiredParam) => {
    const objKeys = Object.keys(obj);
    const notFound = [];
    let success = true;
    requiredParam.forEach((param) => {
        const idx = objKeys.findIndex((k) => {
            return k === param.name;
        });
        if (idx < 0) {
            notFound.push(`${param.name} is required`);
            success = false;
        }
        else if (param.type &&
            typeof obj[param.name] !== param.type &&
            param.type !== "array") {
            notFound.push(`${param.name} should be ${param.type}`);
            success = false;
        }
        // array type validation
        else if (param.type === "array" && !Array.isArray(obj[param.name])) {
            notFound.push(`${param.name} should be ${param.type}`);
            success = false;
        }
    });
    return {
        success,
        message: notFound,
    };
};
exports.default = {
    sendSuccessResponse,
    sendErrorResponse,
    trimCollection,
    validParam,
};
//# sourceMappingURL=helpers.js.map