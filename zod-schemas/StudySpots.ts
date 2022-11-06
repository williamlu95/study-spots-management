import { format } from 'date-fns';
import { z } from 'zod';

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string().length(2).optional(),
  zipCode: z.string(),
});
const HourSchema = z
  .string()
  .or(z.date())
  .transform((date) => {
    if (typeof date === 'string') {
      return date;
    }

    return format(date, 'K:mm aaa');
  });

export const DayHoursSchema = z.array(
  z.object({
    open: HourSchema,
    close: HourSchema,
  }),
);

export const WeeklyHoursSchema = z.optional(
  z.object({
    monday: DayHoursSchema,
    tuesday: DayHoursSchema,
    wednesday: DayHoursSchema,
    thursday: DayHoursSchema,
    friday: DayHoursSchema,
    saturday: DayHoursSchema,
    sunday: DayHoursSchema,
  }),
);

const SustenanceSchema = z.optional(
  z.object({
    pricing: z.enum(['low', 'medium', 'high', '']),
    quality: z.enum(['low', 'medium', 'high', '']),
  }),
);

export const HourFormSchema = z.object({
  open: HourSchema,
  close: HourSchema,
  days: z.object({
    sunday: z.boolean(),
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
  }),
});

export const HoursSchema = z.array(HourFormSchema);

export const LocationSchema = z.object({
  latitude: z.number().nullable().default(null),
  longitude: z.number().nullable().default(null),
});

export const StudySpotSchema = z.object({
  googlePlaceId: z.optional(z.string().nullable()),
  name: z.string().min(1, 'Please enter a name for the study spot.'),
  seating: z.enum(['none', 'some', 'plenty', '']),
  address: z.optional(AddressSchema),
  location: LocationSchema,
  hours: WeeklyHoursSchema,
  food: SustenanceSchema,
  drinks: SustenanceSchema,
  hasOutlets: z.boolean(),
  hasBathroom: z.boolean(),
  hasWifi: z.boolean(),
  images: z.array(
    z.object({ fileName: z.string(), caption: z.optional(z.string()) }),
  ),
});

export const StudySpotFormSchema = StudySpotSchema.extend({
  hours: HoursSchema,
});
