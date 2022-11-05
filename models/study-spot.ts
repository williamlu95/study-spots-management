import { Schema, model, models } from 'mongoose';

export const DEFAULT_RANGE = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

export const SEATING = Object.freeze({
  NONE: 'none',
  SOME: 'some',
  PLENTY: 'plenty',
});

const businessHoursSchema = [
  {
    open: String,
    close: String,
  },
];

const hoursSchema = {
  monday: businessHoursSchema,
  tuesday: businessHoursSchema,
  wednesday: businessHoursSchema,
  thursday: businessHoursSchema,
  friday: businessHoursSchema,
  saturday: businessHoursSchema,
  sunday: businessHoursSchema,
};

const addressSchema = {
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: { type: String, default: 'United States' },
};

const defaultRangeSchema = {
  type: String,
  enum: [...Object.values(DEFAULT_RANGE), ''],
  default: '',
};

const sustenanceSchema = {
  pricing: defaultRangeSchema,
  quality: defaultRangeSchema,
};

const studySpotSchema = new Schema(
  {
    name: { type: String, required: true },
    googlePlaceId: String,
    hours: hoursSchema,
    address: addressSchema,
    location: { latitude: Number, longitude: Number },
    food: sustenanceSchema,
    drinks: sustenanceSchema,
    seating: {
      type: String,
      enum: [...Object.values(SEATING), ''],
      default: '',
    },
    hasOutlets: { type: Boolean, default: null },
    hasBathroom: { type: Boolean, default: null },
    hasWifi: { type: Boolean, default: null },
  },
  {
    timestamps: true,
  },
);

const StudySpot = models.study_spot || model('study_spot', studySpotSchema);
export default StudySpot;
