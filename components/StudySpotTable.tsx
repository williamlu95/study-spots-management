import {
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Typography,
  Stack,
  TableSortLabel,
} from '@mui/material';
import { Address, StudySpotForm } from '../types/study-spots';
import { ChevronRight } from '@mui/icons-material';
import { format } from 'date-fns';
import { useState } from 'react';

type Props = {
  studySpots: StudySpotForm[];
  onStudySpotClick: (studySpot: StudySpotForm) => void;
};

export default function StudySpotTable({
  studySpots,
  onStudySpotClick,
}: Props) {
  const [isAscendingName, setIsAscendingName] = useState(true);

  const handleStudySpotClick = (studySpot: StudySpotForm) => () => {
    onStudySpotClick(studySpot);
  };

  const renderAddress = (address: Address) =>
    address?.street ? (
      `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
    ) : (
      <></>
    );

  const renderEmptyMessage = () =>
    !studySpots.length ? (
      <Stack height={100} alignItems="center" justifyContent="center">
        <Typography>
          You have no study spots. Add some to see it in this list!
        </Typography>
      </Stack>
    ) : (
      <></>
    );

  const getSortedStudySpots = () =>
    [...studySpots].sort((a, b) =>
      isAscendingName
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    );

  return (
    <>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="Table of study spots">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={true}
                  direction={isAscendingName ? 'asc' : 'desc'}
                  onClick={() =>
                    setIsAscendingName((isAscendingName) => !isAscendingName)
                  }
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedStudySpots().map((studySpot) => (
              <TableRow
                key={studySpot._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {studySpot.name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {renderAddress(studySpot.address)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {format(new Date(studySpot.updatedAt), 'P')}
                </TableCell>
                <TableCell component="th" scope="row">
                  <IconButton onClick={handleStudySpotClick(studySpot)}>
                    <ChevronRight />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {renderEmptyMessage()}
    </>
  );
}
