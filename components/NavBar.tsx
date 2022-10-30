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
      borderBottom={1}
      alignItems="flex-end"
      my={1}
      px={1}
      justifyContent="space-between"
    >
      <Link href="/">
        <Box sx={{ width: '100px', cursor: 'pointer' }}>
          <Logo />
        </Box>
      </Link>

      <IconButton onClick={logout}>
        <Logout titleAccess="Logout" />
      </IconButton>
    </Stack>
  );
}
