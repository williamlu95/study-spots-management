import type { NextApiRequest, NextApiResponse } from 'next';
import { AnyZodObject } from 'zod';
import dbConnect from '../lib/mongoose';
import validateRoles from './role-validation';
import parseBody from './schema-validation';

type MiddlewareParams = {
  req: NextApiRequest;
  res: NextApiResponse;
  callback: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  schema?: AnyZodObject;
  roles?: string[];
};

export default async function middleware({
  req,
  res,
  callback,
  schema,
  roles = [],
}: MiddlewareParams) {
  try {
    await dbConnect();
    await parseBody({ req, res, schema });
    validateRoles({ req, res, roles });
    return callback(req, res);
  } catch (err) {
    console.error(err);
  }
}
