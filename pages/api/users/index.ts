import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_ROLE } from '../../../constants/users';
import { withSessionRoute } from '../../../lib/withSession';
import middleware from '../../../middleware';
import User from '../../../models/user';

const getUsers = async (_req: NextApiRequest, res: NextApiResponse) => {
  const users = await User.find({}).select('-password');
  res.status(200).send(users);
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return middleware({
        req,
        res,
        callback: getUsers,
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);
