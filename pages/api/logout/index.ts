import { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../lib/withSession';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.send({ ok: true });
}

export default withSessionRoute(handler);
