import { Close } from '@mui/icons-material';
import { Drawer, Typography, Button, Stack, IconButton } from '@mui/material';
import { useState } from 'react';
import useStudySpotsService from '../hooks/useStudySpotsService';
import { StudySpotForm as StudySpotFormType } from '../types/study-spots';
import ConfirmationPopup from './ConfirmationPopup';
import StudySpotForm from './StudySpotForm';

type Props = {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
};

export default function AddStudySpotOverlay({ isOpen, onClose }: Props) {
  const { createStudySpot } = useStudySpotsService();
  const [isUnsavedConfirmOpen, setIsUnsavedConfirmOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const onSubmit = async (data: StudySpotFormType) => {
    const isCreated = await createStudySpot(data);

    if (isCreated) {
      onClose(true);
    }
  };

  const handleDrawerClose = () => {
    if (!isFormDirty) {
      onClose(false);
      return;
    }

    setIsUnsavedConfirmOpen(true);
  };

  const handleFormDirty = (isDirty: boolean) => {
    setIsFormDirty(isDirty);
  };

  const handleUnsavedConfirm = (isConfirmed: boolean) => {
    setIsUnsavedConfirmOpen(false);

    if (!isConfirmed) {
      return;
    }

    onClose(false);
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleDrawerClose}
      PaperProps={{ sx: { width: { xs: '100%', md: '50%' } } }}
    >
      <ConfirmationPopup
        isOpen={isUnsavedConfirmOpen}
        title="You have unsaved changes."
        description="All unsaved changes will be lost."
        onConfirm={handleUnsavedConfirm}
      />
      <Stack p={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="h6" pb={2}>
            Add Study Spot
          </Typography>

          <IconButton onClick={() => onClose(false)}>
            <Close />
          </IconButton>
        </Stack>
        <StudySpotForm onSubmit={onSubmit} onDirty={handleFormDirty}>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </StudySpotForm>
      </Stack>
    </Drawer>
  );
}
