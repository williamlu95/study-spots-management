import { z } from 'zod';
import {
  AddressSchema,
  DayHoursSchema,
  HourFormSchema,
  StudySpotFormSchema,
  StudySpotSchema,
  WeeklyHoursSchema,
} from '../zod-schemas/StudySpots';

export type StudySpotModel = { _id?: string } & z.input<typeof StudySpotSchema>;
export type DayHours = z.input<typeof DayHoursSchema>;
export type Hour = z.input<typeof HourFormSchema>;
export type Hours = Hour[];

export type StudySpotForm = { _id?: string; updatedAt: string } & z.input<
  typeof StudySpotFormSchema
>;

export type Address = z.input<typeof AddressSchema>;

export type Day =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type HoursModel = z.input<typeof WeeklyHoursSchema>;
