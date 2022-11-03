import { zodResolver } from '@hookform/resolvers/zod';
import { Add } from '@mui/icons-material';
import { TextField, Stack, Button } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { StudySpotForm as StudySpotFormType } from '../types/study-spots';
import { StudySpotFormSchema } from '../zod-schemas/StudySpots';
import AddressInput from './AddressInput';
import AmenitiesInput from './AmenitiesInput';
import FormSectionHeader from './FormSectionHeader';
import HoursInput from './HoursInput';

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

export default function StudySpotForm({
  studySpot,
  children,
  onDirty,
  onSubmit,
}: Props): JSX.Element {
  const {
    handleSubmit,
    control,
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
        zipCode: '',
        country: '',
      },
      drinks: {
        pricing: '',
        quality: '',
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

  useEffect(() => {
    onDirty(isDirty);
  }, [onDirty, isDirty]);

  const handleAddMoreHours = () => append(DEFAULT_HOURS);

  const handleRemoveClick = (index: number) => remove(index);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              error={!!errors?.name}
              helperText={errors?.name?.message}
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
