import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Day,
  Hour,
  Hours,
  HoursModel,
  StudySpotForm,
  StudySpotModel,
} from '../types/study-spots';

const { NEXT_PUBLIC_API_URL } = process.env;

const formatHoursToModel = (hours: Hours): HoursModel => {
  const hourLists: HoursModel = {
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
  };

  hours.forEach(({ open, close, days }) => {
    Object.entries(days).forEach(([day, isOpen]) => {
      if (!isOpen) {
        return;
      }

      const dayHours = hourLists[day as Day] || [];
      dayHours.push({ open, close });
    });
  });

  return hourLists;
};

const formatHoursFromModel = (hours: HoursModel): Hours => {
  if (!hours) {
    return [];
  }

  const hoursMap: Record<string, Hour> = {};

  Object.entries(hours).forEach(([day, dayHours]) => {
    dayHours.forEach(({ open, close }) => {
      const hoursKey = `${open}${close}`;
      const hoursFromMap = hoursMap[hoursKey] || {
        open,
        close,
        days: {
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
        },
      };

      hoursFromMap.days[day as Day] = true;
      hoursMap[hoursKey] = hoursFromMap;
    });
  });

  return Object.values(hoursMap);
};

const formatStudySpotFromModel = (
  studySpot: StudySpotModel,
): StudySpotForm => ({
  ...studySpot,
  hours: formatHoursFromModel(studySpot.hours),
});

const formatStudySpotToModel = (studySpot: StudySpotForm): StudySpotModel => ({
  ...studySpot,
  hours: formatHoursToModel(studySpot.hours),
});

export default function useStudySpotsService() {
  const getStudySpots = async (): Promise<StudySpotForm | undefined> => {
    try {
      const response = await axios.get(`${NEXT_PUBLIC_API_URL}/study-spots`);
      return response.data.map((studySpot: StudySpotModel) =>
        formatStudySpotFromModel(studySpot),
      );
    } catch (err) {
      console.error('Fetching study spots failed: ', err);
      toast.error('Unable to retrieve study spots.');
    }
  };

  const createStudySpot = async (
    studySpot: StudySpotForm,
  ): Promise<boolean> => {
    try {
      await axios.post(
        `${NEXT_PUBLIC_API_URL}/study-spots`,
        formatStudySpotToModel(studySpot),
      );
      toast.success('Study spot successfully saved.');
      return true;
    } catch (err) {
      console.error('Saving study spots failed: ', err);
      toast.error('Unable to save study spot.');
      return false;
    }
  };

  const updateStudySpot = async (
    studySpotId: string,
    studySpot: StudySpotForm,
  ): Promise<boolean> => {
    try {
      await axios.put(
        `${NEXT_PUBLIC_API_URL}/study-spots/${studySpotId}`,
        formatStudySpotToModel(studySpot),
      );
      toast.success('Study spot successfully updated.');
      return true;
    } catch (err) {
      console.error('Updating study spots failed: ', err);
      toast.error('Unable to update study spot.');
      return false;
    }
  };

  const deleteStudySpot = async (studySpotId: string): Promise<boolean> => {
    try {
      await axios.delete(`${NEXT_PUBLIC_API_URL}/study-spots/${studySpotId}`);
      toast.success('Study spot successfully deleted.');
      return true;
    } catch (err) {
      console.error('Deleting study spots failed: ', err);
      toast.error('Unable to delete study spot.');
      return false;
    }
  };

  return {
    getStudySpots,
    createStudySpot,
    updateStudySpot,
    deleteStudySpot,
  };
}
