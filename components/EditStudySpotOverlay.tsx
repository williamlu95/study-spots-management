import { Drawer, Typography, Button, Stack, IconButton } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import useStudySpotsService from '../hooks/useStudySpotsService';
import { StudySpotForm as StudySpotFormType } from '../types/study-spots';
import StudySpotForm from './StudySpotForm';
import ConfirmationPopup from './ConfirmationPopup';
import { useState } from 'react';

type Props = {
  studySpot?: StudySpotFormType;
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
};

export default function EditStudySpotOverlay({
  studySpot,
  isOpen,
  onClose,
}: Props) {
  const { updateStudySpot, deleteStudySpot } = useStudySpotsService();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isUnsavedConfirmOpen, setIsUnsavedConfirmOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const onSubmit = async (data: StudySpotFormType) => {
    if (!studySpot?._id) {
      return;
    }

    const isUpdated = await updateStudySpot(studySpot._id, data);

    if (isUpdated) {
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

  const handleDeleteConfirm = async (hasConfirmed: boolean) => {
    setIsDeleteConfirmOpen(false);

    if (!studySpot?._id || !hasConfirmed) {
      return;
    }

    const isDeleted = await deleteStudySpot(studySpot._id);

    if (isDeleted) {
      onClose(true);
    }
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
      open={studySpot && isOpen}
      onClose={handleDrawerClose}
      PaperProps={{ sx: { width: { xs: '100%', md: '50%' } } }}
    >
      <ConfirmationPopup
        isOpen={isDeleteConfirmOpen}
        title={`Delete ${studySpot?.name}?`}
        description="This will permanently remove this study spot from the mobile application as well."
        onConfirm={handleDeleteConfirm}
      />
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
          pb={2}
        >
          <Stack direction="row" alignItems="center">
            <Typography variant="h6">Edit Study Spot</Typography>
            <IconButton onClick={() => setIsDeleteConfirmOpen(true)}>
              <Delete />
            </IconButton>
          </Stack>

          <IconButton onClick={() => onClose(false)}>
            <Close />
          </IconButton>
        </Stack>

        <StudySpotForm
          studySpot={studySpot}
          onDirty={handleFormDirty}
          onSubmit={onSubmit}
        >
          <Button variant="contained" type="submit">
            Save
          </Button>
        </StudySpotForm>
      </Stack>
    </Drawer>
  );
}
