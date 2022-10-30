import { Search, Clear, Add } from '@mui/icons-material';
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { ChangeEvent } from 'react';

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddStudySpotClick: () => void;
};

export default function StudySpotActions({
  searchValue,
  onSearchChange,
  onAddStudySpotClick,
}: Props): JSX.Element {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearClick = () => onSearchChange('');

  return (
    <Stack
      direction="row"
      my={2}
      justifyContent="space-between"
      alignItems="flex-end"
    >
      <TextField
        label="Search by name"
        variant="standard"
        onChange={handleSearchChange}
        value={searchValue}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchValue ? (
                <IconButton onClick={handleClearClick}>
                  <Clear />
                </IconButton>
              ) : (
                <Search />
              )}
            </InputAdornment>
          ),
        }}
      />

      <Button onClick={onAddStudySpotClick}>
        <Add />
        Add Study Spot
      </Button>
    </Stack>
  );
}
