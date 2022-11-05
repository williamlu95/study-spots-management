import axios, { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../../../lib/withSession';
import middleware from '../../../../../middleware';
import { Address } from '../../../../../types/study-spots';

const ADDRESS_MAP = {
  STREET_NUMBER: 'street_number',
  STREET_NAME: 'route',
  CITY: 'locality',
  STATE: 'administrative_area_level_1',
  ZIP_CODE: 'postal_code',
};

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type PlaceAddress = {
  results: {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: {
      location: { lat: number; lng: number };
      location_type: string;
      viewport: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
      };
      place_id: string;
      plus_code: {
        compound_code: string;
        global_code: string;
      };
      types: string[];
    };
  }[];
};

const formatAddress = (addressComponents: AddressComponent[]): Address => {
  const streetNumber =
    addressComponents.find((addressComponents) =>
      addressComponents.types.includes(ADDRESS_MAP.STREET_NUMBER),
    )?.long_name || '';

  const streetName =
    addressComponents.find((addressComponents) =>
      addressComponents.types.includes(ADDRESS_MAP.STREET_NAME),
    )?.long_name || '';

  const state =
    addressComponents.find((addressComponents) =>
      addressComponents.types.includes(ADDRESS_MAP.STATE),
    )?.short_name || '';

  const city =
    addressComponents.find((addressComponents) =>
      addressComponents.types.includes(ADDRESS_MAP.CITY),
    )?.long_name || '';

  const zipCode =
    addressComponents.find((addressComponents) =>
      addressComponents.types.includes(ADDRESS_MAP.ZIP_CODE),
    )?.long_name || '';

  return {
    street: `${streetNumber}${streetName ? ' ' + streetName : streetName}`,
    city,
    state,
    zipCode,
  };
};

const getPlaceAddress = async (req: NextApiRequest, res: NextApiResponse) => {
  const { placeId } = req.query;

  try {
    const response: AxiosResponse<PlaceAddress> = await axios.get(
      `${process.env.GOOGLE_MAPS_URL}/geocode/json`,
      {
        params: {
          place_id: placeId,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    );

    const addressComponents = response.data.results.length
      ? response.data.results[0].address_components
      : [];

    const address = formatAddress(addressComponents);
    res.status(200).send(address);
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
        callback: getPlaceAddress,
      });
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(handler);
