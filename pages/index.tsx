import { Container, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AddStudySpotOverlay from '../components/AddStudySpotOverlay';
import EditStudySpotOverlay from '../components/EditStudySpotOverlay';
import NavBar from '../components/NavBar';
import StudySpotActions from '../components/StudySpotActions';
import StudySpotTable from '../components/StudySpotTable';
import useStudySpotsService from '../hooks/useStudySpotsService';
import { withSessionSsr } from '../lib/withSession';
import { StudySpotForm } from '../types/study-spots';
import { User } from '../types/user';

type Props = {
  user: User;
  studySpots: StudySpotForm[];
};

export default function StudySpots({ studySpots }: Props): JSX.Element {
  const router = useRouter();
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [studySpot, setStudySpot] = useState<StudySpotForm>();
  const [searchValue, setSearchValue] = useState('');

  const handleButtonClick = () => setIsAddDrawerOpen(true);

  const handleDrawerClose = (shouldRefresh: boolean) => {
    setIsAddDrawerOpen(false);
    setIsEditDrawerOpen(false);
    setStudySpot(undefined);
    shouldRefresh && router.replace(router.asPath);
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
      <NavBar />
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

        <StudySpotActions
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onAddStudySpotClick={handleButtonClick}
        />

        <StudySpotTable
          onStudySpotClick={handleStudySpotClick}
          studySpots={filterStudySpots()}
        />
      </Container>
    </Stack>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    const { getStudySpots } = useStudySpotsService(req.headers.host);

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const studySpots = await getStudySpots();

    return {
      props: {
        user: req.session.user,
        studySpots,
      },
    };
  },
);
