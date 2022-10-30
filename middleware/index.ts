import type { NextApiRequest, NextApiResponse } from 'next';
import { AnyZodObject } from 'zod';
import parseBody from './schema-validation';

type MiddlewareParams = {
  req: NextApiRequest;
  res: NextApiResponse;
  callback: (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
  schema?: AnyZodObject;
};

export default async function middleware({
  req,
  res,
  callback,
  schema,
}: MiddlewareParams) {
  try {
    await parseBody({ req, res, schema });
    return callback(req, res);
  } catch (err) {
    console.error(err);
  }
}
