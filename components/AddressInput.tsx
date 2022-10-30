import { Grid, TextField } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
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

      <Controller
        name="address.country"
        control={control}
        render={({ field }) => <TextField {...field} label="Country" />}
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
              <TextField fullWidth {...field} label="State" />
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
