import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { StudySpotForm } from '../types/study-spots';

export default function SustenanceInput({
  type,
  control,
}: {
  type: 'food' | 'drinks';
  control: Control<StudySpotForm>;
}): JSX.Element {
  const label = type[0].toUpperCase() + type.slice(1);

  return (
    <Stack direction="row" spacing={2}>
      <Controller
        name={`${type}.pricing`}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id={`${type}-pricing-label`}>
              {label} Pricing
            </InputLabel>
            <Select
              labelId={`${type}-pricing-label`}
              label={`${label} Pricing`}
              {...field}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name={`${type}.quality`}
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id={`${type}-quality-label`}>
              {label} Quality
            </InputLabel>
            <Select
              labelId={`${type}-quality-label`}
              label={`${label} Quality`}
              {...field}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        )}
      />
    </Stack>
  );
}
