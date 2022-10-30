import { Delete } from '@mui/icons-material';
import {
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { parse } from 'date-fns';
import { Control, Controller } from 'react-hook-form';
import { Day, StudySpotForm } from '../types/study-spots';

export default function HoursInput({
  index,
  control,
  onRemoveClick,
}: {
  index: number;
  control: Control<StudySpotForm>;
  onRemoveClick: (index: number) => void;
}): JSX.Element {
  const handleRemoveClick = () => onRemoveClick(index);

  const getValue = (value: string | Date) => {
    if (typeof value !== 'string') {
      return value;
    }

    return parse(value, 'K:mm aaa', new Date());
  };

  const renderCheckbox = (day: Day) => (
    <Controller
      key={`hours-${index}-${day}`}
      name={`hours.${index}.days.${day}`}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={<Checkbox {...field} checked={field.value} />}
          label={day[0].toUpperCase() + day.slice(1, 3)}
        />
      )}
    />
  );

  return (
    <>
      <Stack>
        <Stack direction="row" spacing={2}>
          <Controller
            name={`hours.${index}.open`}
            control={control}
            render={({ field }) => {
              return (
                <TimePicker
                  label="Open"
                  onChange={field.onChange}
                  value={getValue(field.value)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              );
            }}
          />

          <Controller
            name={`hours.${index}.close`}
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Closed"
                onChange={field.onChange}
                value={getValue(field.value)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            )}
          />

          <IconButton onClick={handleRemoveClick}>
            <Delete />
          </IconButton>
        </Stack>

        <Stack direction="row" justifyContent="space-evenly" pt={1}>
          {renderCheckbox('sunday')}
          {renderCheckbox('monday')}
          {renderCheckbox('tuesday')}
          {renderCheckbox('wednesday')}
          {renderCheckbox('thursday')}
          {renderCheckbox('friday')}
          {renderCheckbox('saturday')}
        </Stack>
      </Stack>
    </>
  );
}
