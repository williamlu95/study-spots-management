import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../lib/withSession';
import middleware from '../../../middleware';

const OUTPUT_FIELDS = ['place_id', 'formatted_address', 'geometry', 'name'];

const searchPlaces = async (req: NextApiRequest, res: NextApiResponse) => {
  const { input } = req.query;

  try {
    const response = await axios.get(
      `${process.env.GOOGLE_MAPS_URL}/place/findplacefromtext/json`,
      {
        params: {
          input,
          inputtype: 'textquery',
          fields: OUTPUT_FIELDS.join(','),
          locationbias: 'point:36.114647,-115.172813',
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    );
    res.status(200).send(response.data.candidates);
    return;
  } catch (err) {
    console.error(`API call to google failed: ${err}`);
    res.status(500).send('Internal Server Error');
    return;
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return middleware({
        req,
        res,
        callback: searchPlaces,
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);
