import { Button } from '~/components/ui/button';
import type { Route } from './+types/home';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Dashboard' }];
}

export default function Home() {
  return (
    <main className="p-4">
      <div className="flex justify-end">
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    </main>
  );
}
