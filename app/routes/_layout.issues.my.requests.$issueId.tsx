import { useEffect, useState } from "react";
import { useParams } from 'react-router';
import { Button } from "~/components/ui/button";
import { PUBLIC_URL } from "config";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

type ProUser = {
  _id: string;
  name: string;
  profilePic?: string;
  occupation?: string;
  degree?: string;
  skill?: string[];
  certifications?: string[];
  description?: string;
};

export default function IssueRequests() {
  const { issueId } = useParams<{ issueId: string }>();
  const [proUsers, setProUsers] = useState<ProUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!issueId) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    fetch(`${PUBLIC_URL}/api/issues/my/requests/${issueId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProUsers(data);
        else setError("Unexpected response from server");
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load pro users");
        setIsLoading(false);
      });
  }, [issueId]);

  if (isLoading) return <p className="text-center py-8">Loading pro users...</p>;

  if (error)
    return (
      <div className="text-center py-16 text-red-500 font-semibold">
        {error}
      </div>
    );

  if (proUsers.length === 0)
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold text-[var(--card-foreground)] mb-2">
          No Requests Yet
        </h3>
        <p className="text-[var(--foreground)]">
          No professional users have applied for this issue yet.
        </p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {proUsers.map((user) => (
        <Card
          key={user._id}
          className="rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-[var(--card)] border border-[var(--border)]/50"
        >
          <CardHeader className="p-0">
            <AspectRatio ratio={1}>
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="object-cover w-full h-full rounded-t-2xl"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                  No Image
                </div>
              )}
            </AspectRatio>
          </CardHeader>

          <CardContent className="p-6 space-y-3">
            <CardTitle className="text-lg font-semibold text-[var(--card-foreground)]">
              {user.name}
            </CardTitle>

            {user.occupation && (
              <p className="text-[var(--foreground)] font-medium">
                {user.occupation}
              </p>
            )}

            {user.degree && (
              <p className="text-sm text-[var(--muted-foreground)]">
                🎓 {user.degree}
              </p>
            )}

            {user.skill && user.skill.length > 0 && (
              <p className="text-sm text-[var(--foreground)]">
                <strong>Skills:</strong> {user.skill.join(", ")}
              </p>
            )}

            {user.certifications && user.certifications.length > 0 && (
              <p className="text-sm text-[var(--foreground)]">
                <strong>Certifications:</strong> {user.certifications.join(", ")}
              </p>
            )}

            {user.description && (
              <CardDescription className="text-[var(--foreground)] line-clamp-3">
                {user.description}
              </CardDescription>
            )}

            <div className="pt-3">
              <Button
                className="w-full border border-[var(--primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
