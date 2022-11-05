import {
  Autocomplete,
  AutocompleteRenderInputParams,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  AutocompleteChangeReason,
  Chip,
} from '@mui/material';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Place } from '../types/places';
import usePlaceService from '../hooks/usePlaceService';

const EMPTY_VALUE = {
  place_id: null,
  name: '',
  formatted_address: '',
  geometry: {
    location: {
      lat: null,
      lng: null,
    },
  },
};

export default function StudySpotAutoComplete({
  initialPlace,
  onChange,
}: {
  initialPlace?: Place;
  onChange: (place: Place) => void;
}): JSX.Element {
  const { findPlaces } = usePlaceService();
  const [place, setPlace] = useState<Place | undefined>(initialPlace);
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Place[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlaces = async (input: string) => {
    if (!input) {
      setLoading(false);
      return;
    }

    const places = await findPlaces(input);
    setOptions(places);
    setLoading(false);
  };

  const debouncedFetchPlaces = useCallback(debounce(fetchPlaces, 300), []);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleMenuOpen = () => {
    setOpen(true);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  const handleInputChange = (
    _e: SyntheticEvent,
    value: string,
    reason: 'input' | 'reset' | 'clear',
  ) => {
    if (reason !== 'input') {
      return;
    }

    setInputValue(value);

    if (value) {
      setLoading(true);
      debouncedFetchPlaces(value);
      return;
    }

    setOptions([]);
    return;
  };

  const handleAutocompleteChange = async (
    _e: SyntheticEvent,
    value: Place | null,
    reason: AutocompleteChangeReason,
  ) => {
    if (reason === 'selectOption' && value) {
      onChange(value);
      setPlace(value);
      setInputValue('');
      return;
    }
  };

  const handleClearValue = () => {
    onChange(EMPTY_VALUE);
    setPlace(undefined);
  };

  const renderEndAdornment = () =>
    loading ? <CircularProgress color="inherit" size={20} /> : null;

  const renderLabel = (placeLabel: Place) => (
    <Stack direction="row" spacing={1} alignItems="baseline">
      <Typography>{placeLabel.name}</Typography>
      <Typography variant="caption">{placeLabel.formatted_address}</Typography>
    </Stack>
  );

  const renderTextField = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      placeholder={!place ? 'Search by name and/or address' : ''}
      fullWidth
      InputProps={{
        ...params.InputProps,
        endAdornment: renderEndAdornment(),
        startAdornment: place ? (
          <Chip
            label={renderLabel(place)}
            onDelete={handleClearValue}
            sx={{ maxWidth: '90%' }}
          />
        ) : (
          <></>
        ),
      }}
    />
  );

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    placeOption: Place,
  ) => {
    return <li {...props}>{renderLabel(placeOption)}</li>;
  };

  return (
    <Autocomplete
      noOptionsText="No results found"
      disableClearable={true}
      open={open && !!inputValue}
      disabled={!!place}
      onChange={handleAutocompleteChange}
      onOpen={handleMenuOpen}
      onClose={handleMenuClose}
      isOptionEqualToValue={(option) => option.place_id === place?.place_id}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      value={place}
      inputValue={inputValue}
      renderInput={renderTextField}
      renderOption={renderOption}
      onInputChange={handleInputChange}
    />
  );
}
