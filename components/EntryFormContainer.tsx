import { Container, Stack } from '@mui/material';
import Logo from './Logo';

type Props = {
  children: JSX.Element | JSX.Element[];
  onFormSubmit: () => void;
};

export default function EntryFormContainer({
  children,
  onFormSubmit,
}: Props): JSX.Element {
  return (
    <Container sx={{ height: '100vh' }}>
      <Stack alignItems="center" justifyContent="center" height="100%">
        <form onSubmit={onFormSubmit}>
          <Stack
            justifyContent="center"
            spacing={4}
            height={700}
            width={500}
            border={1}
            borderRadius={2}
            p={6}
          >
            <Stack alignItems="center">
              <Logo height={100} width={288} />
            </Stack>

            {children}
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
