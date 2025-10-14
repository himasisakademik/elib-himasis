import Login from '@/components/Login';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getRedirectPath } from '@/lib/auth-actions';

const SignInPage = async () => {
  const session = await auth();

  if (session?.user?.email) {
    const path = await getRedirectPath(session.user.email);
    redirect(path);
  }

  return <Login />;
};

export default SignInPage;
