import { Container, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import AddStudySpotOverlay from '../components/AddStudySpotOverlay';
import EditStudySpotOverlay from '../components/EditStudySpotOverlay';
import NavBar from '../components/NavBar';
import StudySpotActions from '../components/StudySpotActions';
import StudySpotTable from '../components/StudySpotTable';
import { USER_ROLE } from '../constants/users';
import useStudySpotsService from '../hooks/useStudySpotsService';
import { withSessionSsr } from '../lib/withSession';
import { StudySpotForm } from '../types/study-spots';
import { User } from '../types/user';

type Props = {
  user: User;
};

export default function StudySpots({ user }: Props): JSX.Element {
  const { getStudySpots } = useStudySpotsService();
  const [studySpots, setStudySpots] = useState<StudySpotForm[]>([]);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [studySpot, setStudySpot] = useState<StudySpotForm>();
  const [searchValue, setSearchValue] = useState('');

  const fetchStudySpots = async () => {
    const newStudySpots = await getStudySpots();
    setStudySpots(newStudySpots);
  };

  useEffect(() => {
    fetchStudySpots();
  }, []);

  const handleButtonClick = () => setIsAddDrawerOpen(true);

  const handleDrawerClose = (shouldRefresh: boolean) => {
    setIsAddDrawerOpen(false);
    setIsEditDrawerOpen(false);
    setStudySpot(undefined);
    shouldRefresh && fetchStudySpots();
  };

  const handleStudySpotClick = (studySpot: StudySpotForm) => {
    setStudySpot(studySpot);
    setIsEditDrawerOpen(true);
  };

  const filterStudySpots = () =>
    studySpots.filter(({ name }) =>
      name.toLowerCase().includes(searchValue.toLocaleLowerCase()),
    );

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <Stack height="100vh">
      <NavBar userRole={user.role} />
      <Container
        sx={{
          height: 'calc(100% - 57px)',
          display: 'flex',
          flexDirection: 'column',
          pb: 4,
        }}
      >
        <AddStudySpotOverlay
          isOpen={isAddDrawerOpen}
          onClose={handleDrawerClose}
        />
        <EditStudySpotOverlay
          studySpot={studySpot}
          isOpen={isEditDrawerOpen}
          onClose={handleDrawerClose}
        />

        <Stack direction="column" py={2}>
          <Typography variant="h4" fontWeight={300} pt={2}>
            Study Spots
          </Typography>
          <Divider />
        </Stack>

        <StudySpotActions
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onAddStudySpotClick={handleButtonClick}
          hideAddButton={user.role === USER_ROLE.MEMBER}
        />

        <StudySpotTable
          hideChevron={user.role === USER_ROLE.MEMBER}
          studySpots={filterStudySpots()}
          onStudySpotClick={handleStudySpotClick}
        />
      </Container>
    </Stack>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
  },
);
