import type { NextApiRequest, NextApiResponse } from 'next';
import { USER_ROLE } from '../../../constants/users';
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
    images,
    location,
    googlePlaceId,
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
  if (images) studySpot.images = images;
  if (location) studySpot.location = location;
  if (googlePlaceId) studySpot.googlePlaceId = googlePlaceId;
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
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    case 'DELETE':
      return middleware({
        req,
        res,
        callback: deleteStudySpot,
        roles: [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN],
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);
