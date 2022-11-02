import { Box, IconButton, Stack } from '@mui/material';
import { Logout } from '@mui/icons-material';
import Link from 'next/link';
import useGatewayService from '../hooks/useGatewayService';
import Logo from './Logo';

export default function NavBar(): JSX.Element {
  const { logout } = useGatewayService();

  return (
    <Stack
      direction="row"
      height="50px"
      borderBottom={1}
      px={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Link href="/">
        <Box sx={{ pt: 2 }}>
          <Logo height={37.5} width={108} />
        </Box>
      </Link>

      <IconButton onClick={logout}>
        <Logout titleAccess="Logout" />
      </IconButton>
    </Stack>
  );
}
