import { Button, Link, TextField, Typography } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useGatewayService from '../../hooks/useGatewayService';
import PasswordField from '../../components/PasswordField';
import EntryFormContainer from '../../components/EntryFormContainer';
import { withSessionSsr } from '../../lib/withSession';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type Login = z.input<typeof LoginSchema>;

export default function Login(): JSX.Element {
  const { authenticate } = useGatewayService();
  const { handleSubmit, control } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<Login> = (data) => authenticate(data);

  return (
    <EntryFormContainer onFormSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField {...field} autoComplete="email" label="Email" />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordField {...field} autoComplete="password" label="Password" />
        )}
      />

      <Button type="submit" variant="contained">
        Login
      </Button>

      <Typography variant="body2" textAlign="center">
        New to Study Spots? <Link href="/register">Create an account</Link>
      </Typography>
    </EntryFormContainer>
  );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  },
);
