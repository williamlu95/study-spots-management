import axios, { AxiosResponse } from 'axios';
import { Place } from '../types/places';
import { Address } from '../types/study-spots';

export default function usePlaceService() {
  const findPlaces = async (input: string): Promise<Place[]> => {
    try {
      const response = await axios.get('/api/places', {
        params: {
          input,
        },
      });
      return response.data || [];
    } catch (err) {
      console.error('Fetching places failed: ', err);
      return [];
    }
  };

  const getPlaceAddress = async (placeId: string): Promise<Address> => {
    try {
      const response: AxiosResponse<Address> = await axios.get(
        `/api/places/${placeId}/address`,
      );
      return response.data;
    } catch (err) {
      console.error('Fetching place address failed: ', err);
      return {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      };
    }
  };

  return {
    getPlaceAddress,
    findPlaces,
  };
}
