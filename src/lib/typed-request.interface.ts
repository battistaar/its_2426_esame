import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export interface TypedRequest<B = any, Q = ParsedQs, P = ParamsDictionary>
        extends Request<P, any, B, Q> {};

export { ParamsDictionary, ParsedQs };