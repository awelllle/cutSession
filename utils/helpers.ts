import { Model } from "mongoose";
import { Request } from "express";

import { Response } from "express";
type DynamicContent =
  | string
  | Record<string, unknown>
  | null
  | undefined
  | number;

const sendSuccessResponse = function (
  res: Response,
  content: DynamicContent,
  message: string,
  status?: number
) {
  const data = {
    success: true,
    message,
    data: content,
  };

  res.status(!status ? 200 : status).json(data);
};

const paginateData = async (Model: Model<any>, sortBy, sortOrder: string | number, req: Request, query?:Object, fields?: string ) => {
  const page = +req.query.offset || 1;
  const limit = +req.query.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  try {
    const data = await Model.find(query && query, fields && fields)
     // .sort({ [sortBy as string]: sortOrder })
      .skip(startIndex)
      .limit(limit);

    const count = await Model.countDocuments(query && query)
    const totalPages = Math.ceil(count / limit);

    const url = process.env.APP_URL

    const result = {
      ...(startIndex > 0 && { previous: `${url}/${page - 1}` }),
      ...(endIndex < count && { next: `${url}/${page + 1}`  }),
      // total: count,
      //currentPage: page,
      count: totalPages ? totalPages : 1,
      data: data,
    };

    return result;
  } catch (error) {
    console.log(error);
    throw error
  }


};

const sendErrorResponse = function (
  res: Response,
  content: DynamicContent,
  message: string | Error | undefined | null,
  status?: number
) {
  const data = {
    message: message,
    errors: content,
  };

  res.status(!status ? 400 : status).json(data);
};


const errorResponse = function (
  res: Response,
  errors: Array<string>,
  message: string | Error | undefined | null,
  status?: number
) {
  const data = {
    message: message,
    errors: errors,
  };

  res.status(!status ? 400 : status).json(data);
};

const trimCollection = (
  data: Record<string, unknown>
): Record<string, unknown> => {
  const newData = { ...data };

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

export interface ValidParamsResult {
  success: boolean;
  message: Array<string>;
}
export interface ValidParam {
  name: string;
  type: string;
}

const validParam = (
  obj: Record<string, unknown>,
  requiredParam: Array<ValidParam>
): ValidParamsResult => {
  const objKeys = Object.keys(obj);
  const notFound: Array<string> = [];
  let success = true;

  requiredParam.forEach((param) => {
    const idx = objKeys.findIndex((k) => {
      return k === param.name;
    });

    if (idx < 0) {
      notFound.push(`${param.name} is required`);
      success = false;
    } else if (
      param.type &&
      typeof obj[param.name] !== param.type &&
      param.type !== "array"
    ) {
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


export default {
  
  sendSuccessResponse,
  paginateData,
  sendErrorResponse,
  errorResponse,
  trimCollection,
  validParam,
};
