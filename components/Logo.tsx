import { useMediaQuery } from '@mui/material';
import Image from 'next/legacy/image';
import LogoImage from '../public/logo.png';

export default function Logo(): JSX.Element {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const filter = prefersDarkMode ? 'invert(100%)' : '';

  return <Image src={LogoImage} alt="Study Spot Logo" style={{ filter }} />;
}
