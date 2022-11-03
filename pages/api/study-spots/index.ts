import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_ROLE } from '../../../constants/users';
import { withSessionRoute } from '../../../lib/withSession';
import middleware from '../../../middleware';
import StudySpot from '../../../models/study-spot';
import { StudySpotSchema } from '../../../zod-schemas/StudySpots';

const createStudySpot = async (req: NextApiRequest, res: NextApiResponse) => {
  const studySpot = await StudySpot.create(req.body);
  res.status(201).send(studySpot);
};

const getStudySpots = async (_req: NextApiRequest, res: NextApiResponse) => {
  const studySpot = await StudySpot.find({});
  res.status(201).send(studySpot);
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return middleware({
        req,
        res,
        callback: createStudySpot,
        schema: StudySpotSchema,
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    case 'GET':
      return middleware({
        req,
        res,
        callback: getStudySpots,
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);
