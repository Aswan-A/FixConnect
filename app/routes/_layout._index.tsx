import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { PUBLIC_URL } from "config";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

type Issue = {
  currentImageIndex: number;
  _id: string;
  title: string;
  description: string;
  images?: string[];
  createdAt: string;
  category?: string;
  location: { type: "Point"; coordinates: [number, number] };
};

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  if (!navigator.geolocation) {
    console.error("Geolocation not supported");
    setIsLoading(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const radius = 10;

      console.log("Location:", latitude, longitude);

      fetch(`${PUBLIC_URL}/api/issues?latitude=${latitude}&longitude=${longitude}&radius=${radius}`)
        .then((res) => res.json())
        .then((data: Issue[]) => {
          setIssues(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching issues:", err);
          setIsLoading(false);
        });
    },
    (error) => {
      console.error("Geolocation error:", error);
      setIsLoading(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}, []);


  return (
  <div>
    {isLoading && <p>Loading issues...</p>}

    {!isLoading && issues.length > 0 && (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

        {issues.map((issue) => (
          <Card
  key={issue._id}
  className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[var(--border)]/50 hover:border-[var(--border)]/80 hover:scale-[1.02] bg-[var(--card)]/70 backdrop-blur-sm"
>
  <CardHeader className="p-0">
    {issue.images && issue.images.length > 0 ? (
      <AspectRatio ratio={16 / 9}>
        <img
          src={issue.images[issue.currentImageIndex ?? 0]}
          alt={issue.title}
          className="w-full h-full object-cover rounded-t-2xl transition-transform duration-700 group-hover:scale-105"
        />
      </AspectRatio>
    ) : (
      <div className="w-full h-48 bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)]">
        No Image
      </div>
    )}
  </CardHeader>

  <CardContent className="p-6 space-y-3">
    <CardTitle className="text-xl text-[var(--card-foreground)]">{issue.title}</CardTitle>
    <CardDescription className="text-[var(--foreground)] line-clamp-3">
      {issue.description}
    </CardDescription>
  </CardContent>

  <CardFooter className="p-6 pt-0 flex justify-center">
    <Button
      onClick={() => navigate(`/issues/${issue._id}`)}
      className="text-[var(--primary-foreground)] border border-[var(--primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
    >
      View Details
    </Button>
  </CardFooter>
</Card>

        ))}
      </div>
    )}

    {!isLoading && issues.length === 0 && (
      <div className="text-center py-16">
  <h3 className="text-2xl font-bold text-[var(--card-foreground)] mb-2">No Issues Found</h3>
  <p className="text-[var(--foreground)]">Check back later for new community issues.</p>
</div>

    )}
  </div>
)
}
