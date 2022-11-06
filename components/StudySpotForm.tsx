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
import ImagesInput from './ImagesInput';
import StudySpotAutoComplete from './StudySpotAutocomplete';

type ImageType = {
  id?: string;
  fileName: string;
  caption?: string;
};

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
        lat: studySpot?.location?.latitude,
        lng: studySpot?.location?.longitude,
      },
    },
  };
};

const SET_VALUE_OPTIONS = {
  shouldDirty: true,
  shouldValidate: true,
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
      images: [],
      ...studySpot,
    },
  });

  const hours = useFieldArray({
    control,
    name: 'hours',
  });

  const images = useFieldArray({
    control,
    name: 'images',
  });

  watch('googlePlaceId');
  watch('images');

  useEffect(() => {
    onDirty(isDirty);
  }, [onDirty, isDirty]);

  const handleAddMoreHours = () => hours.append(DEFAULT_HOURS);

  const handleRemoveClick = (index: number) => hours.remove(index);

  const handleAutocompleteChange = async (place: Place) => {
    if (place.place_id) {
      const address = await getPlaceAddress(place.place_id);
      setValue('address', address, SET_VALUE_OPTIONS);
    } else {
      setValue(
        'address',
        { street: '', city: '', zipCode: '', state: '' },
        SET_VALUE_OPTIONS,
      );
    }

    setValue('googlePlaceId', place.place_id, SET_VALUE_OPTIONS);
    setValue('name', place.name, SET_VALUE_OPTIONS);

    setValue(
      'location.latitude',
      place.geometry.location.lat,
      SET_VALUE_OPTIONS,
    );

    setValue(
      'location.longitude',
      place.geometry.location.lng,
      SET_VALUE_OPTIONS,
    );
  };

  const handleImagesChange = (newImages: ImageType[]) => {
    const newImagesWithoutIds = newImages.map(({ fileName, caption }) => ({
      fileName,
      caption,
    }));

    setValue('images', newImagesWithoutIds, SET_VALUE_OPTIONS);
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

        {hours.fields.map((field, index) => (
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

        <ImagesInput
          images={images.fields}
          onImagesChange={handleImagesChange}
        />
        {children}
      </Stack>
    </form>
  );
}
