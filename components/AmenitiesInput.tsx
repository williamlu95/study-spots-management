import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { StudySpotForm } from '../types/study-spots';
import FormSectionHeader from './FormSectionHeader';
import SustenanceInput from './SustenanceInput';

export default function AmenitiesInput({
  control,
}: {
  control: Control<StudySpotForm>;
}): JSX.Element {
  return (
    <>
      <FormSectionHeader label="Amenities" />
      <SustenanceInput type="food" control={control} />
      <SustenanceInput type="drinks" control={control} />

      <Controller
        name="seating"
        control={control}
        render={({ field }) => (
          <FormControl>
            <InputLabel id="seating-label">Seating</InputLabel>
            <Select labelId="seating-label" label="Seating" {...field}>
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="some">Some</MenuItem>
              <MenuItem value="plenty">Plenty</MenuItem>
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name="hasOutlets"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label="Outlets"
          />
        )}
      />
      <Controller
        name="hasBathroom"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label="Bathroom"
          />
        )}
      />
      <Controller
        name="hasWifi"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value} />}
            label="Wi-Fi"
          />
        )}
      />
    </>
  );
}
