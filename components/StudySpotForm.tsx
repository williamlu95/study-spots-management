import { zodResolver } from '@hookform/resolvers/zod';
import { Add } from '@mui/icons-material';
import { Stack, Button, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import usePlaceService from '../hooks/usePlaceService';
import { Place } from '../types/places';
import {
  Address,
  StudySpotForm as StudySpotFormType,
} from '../types/study-spots';
import { StudySpotFormSchema } from '../zod-schemas/StudySpots';
import AddressInput from './AddressInput';
import AmenitiesInput from './AmenitiesInput';
import FormSectionHeader from './FormSectionHeader';
import HoursInput from './HoursInput';
import StudySpotAutoComplete from './StudySpotAutocomplete';

type Props = {
  studySpot?: StudySpotFormType;
  children: JSX.Element;
  onDirty: (isDirty: boolean) => void;
  onSubmit: (data: StudySpotFormType) => Promise<void>;
};

const DEFAULT_HOURS = {
  open: '08:00 am',
  close: '05:00 pm',
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

const formatAddress = (address?: Address) => {
  if (!address) {
    return '';
  }

  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
};

const buildPlace = (studySpot?: StudySpotFormType): Place | undefined => {
  if (!studySpot?.name) {
    return;
  }

  return {
    name: studySpot.name,
    place_id: studySpot.googlePlaceId || null,
    formatted_address: formatAddress(studySpot.address),
    geometry: {
      location: {
        lat: studySpot.location.latitude,
        lng: studySpot.location.longitude,
      },
    },
  };
};

export default function StudySpotForm({
  studySpot,
  children,
  onDirty,
  onSubmit,
}: Props): JSX.Element {
  const { getPlaceAddress } = usePlaceService();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isDirty, errors },
  } = useForm<StudySpotFormType>({
    resolver: zodResolver(StudySpotFormSchema),
    defaultValues: {
      name: '',
      food: {
        pricing: '',
        quality: '',
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      drinks: {
        pricing: '',
        quality: '',
      },
      location: {
        latitude: null,
        longitude: null,
      },
      seating: '',
      hasOutlets: false,
      hasBathroom: false,
      hasWifi: false,
      ...studySpot,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hours',
  });

  watch('googlePlaceId');

  useEffect(() => {
    onDirty(isDirty);
  }, [onDirty, isDirty]);

  const handleAddMoreHours = () => append(DEFAULT_HOURS);

  const handleRemoveClick = (index: number) => remove(index);

  const handleAutocompleteChange = async (place: Place) => {
    if (place.place_id) {
      const address = await getPlaceAddress(place.place_id);
      setValue('address', address);
    } else {
      setValue('address', { street: '', city: '', zipCode: '', state: '' });
    }

    setValue('googlePlaceId', place.place_id);
    setValue('name', place.name);
    setValue('location.latitude', place.geometry.location.lat);
    setValue('location.longitude', place.geometry.location.lng);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Stack spacing={2}>
        <StudySpotAutoComplete
          initialPlace={buildPlace(studySpot)}
          onChange={handleAutocompleteChange}
        />

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              error={!!errors?.name}
              helperText={errors?.name?.message}
              label="Name"
            />
          )}
        />

        <AddressInput control={control} />

        <FormSectionHeader label="Hours of Operation" />

        {fields.map((field, index) => (
          <HoursInput
            key={field.id}
            control={control}
            index={index}
            onRemoveClick={handleRemoveClick}
          />
        ))}

        <Button onClick={handleAddMoreHours}>
          <Add />
          Add More Hours
        </Button>

        <AmenitiesInput control={control} />
        {children}
      </Stack>
    </form>
  );
}
