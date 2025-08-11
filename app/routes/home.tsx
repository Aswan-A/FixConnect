import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import type { Route } from './+types/home';
import { Link } from 'react-router';

type Issue = {
  _id: string;
  title: string;
  description: string;
  image?: string; // optional if not every issue has an image
};

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Dashboard' }];
}

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
  console.log("Fetching issues...");
  fetch('http://localhost:5000/api/issues')
    .then(res => {
      console.log("Response status:", res.status);
      return res.json();
    })
    .then((data: Issue[]) => {
      console.log("Fetched issues data:", data);
      setIssues(data);
    })
    .catch(err => console.error('Error fetching issues:', err));
}, []);

  useEffect(() => {
    console.log('📦 Current issues state:', issues);
  }, [issues]);

  return (
    <main className="p-4">
      <div className="flex justify-end mb-4">
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">All Issues</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {issues.map(issue => (
          <div
            key={issue._id}
            className="border rounded-lg shadow-md p-4 flex flex-col items-start"
          >
            {issue.image && (
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-lg font-semibold">{issue.title}</h2>
            <p className="text-gray-600 mb-3">{issue.description}</p>
            <Link to={`/issues/${issue._id}`}>
              <Button>View Details</Button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
