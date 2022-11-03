import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { STATES } from '../constants/address';
import { StudySpotForm } from '../types/study-spots';
import FormSectionHeader from './FormSectionHeader';

export default function AddressInput({
  control,
}: {
  control: Control<StudySpotForm>;
}): JSX.Element {
  return (
    <>
      <FormSectionHeader label="Address" />

      <Controller
        name="address.street"
        control={control}
        render={({ field }) => <TextField {...field} label="Street Name" />}
      />

      <Grid container>
        <Grid item xs={6} pr={2}>
          <Controller
            name="address.city"
            control={control}
            render={({ field }) => (
              <TextField fullWidth {...field} label="City" />
            )}
          />
        </Grid>

        <Grid item xs={2} pr={2}>
          <Controller
            name="address.state"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select label="State" {...field}>
                  {STATES.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <Controller
            name="address.zipCode"
            control={control}
            render={({ field }) => (
              <TextField fullWidth {...field} label="Zip Code" />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
}
