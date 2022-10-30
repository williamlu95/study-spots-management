import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../lib/withSession';
import middleware from '../../../middleware';
import StudySpot from '../../../models/study-spot';
import { StudySpotSchema } from '../../../zod-schemas/StudySpots';

const updateStudySpot = async (req: NextApiRequest, res: NextApiResponse) => {
  const { studySpotId } = req.query;
  const {
    name,
    food,
    drinks,
    hasBathroom,
    hasOutlets,
    hasWifi,
    address,
    hours,
    seating,
  } = req.body;
  const studySpot = await StudySpot.findById(studySpotId);

  if (!studySpot) {
    return res.status(400).send('Request is not valid');
  }

  if (name) studySpot.name = name;
  if (seating) studySpot.seating = seating;
  if (address) studySpot.address = address;
  if (food) studySpot.food = food;
  if (drinks) studySpot.drinks = drinks;
  if (hours) studySpot.hours = hours;
  if (hasOutlets !== undefined) studySpot.hasOutlets = hasOutlets;
  if (hasBathroom !== undefined) studySpot.hasBathroom = hasBathroom;
  if (hasWifi !== undefined) studySpot.hasWifi = hasWifi;

  await studySpot.save();
  res.status(200).send(studySpot);
};

const deleteStudySpot = async (req: NextApiRequest, res: NextApiResponse) => {
  const { studySpotId } = req.query;
  await StudySpot.findByIdAndDelete(studySpotId);
  res.send({ ok: true });
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return middleware({
        req,
        res,
        callback: updateStudySpot,
        schema: StudySpotSchema,
      });
    case 'DELETE':
      return middleware({
        req,
        res,
        callback: deleteStudySpot,
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);