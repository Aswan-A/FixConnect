import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";
import { Link, useNavigate } from "react-router";
import { PUBLIC_URL } from "config";

type Issue = {
  currentImageIndex: number;
  _id: string;
  title: string;
  description: string;
  images?: string[];  // <-- multiple images
  createdAt: string;
  category?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
};

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

export default function Home() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("❌ Geolocation not supported");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const radius = 10;

      fetch(
        `${PUBLIC_URL}/api/issues?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
      )
        .then((res) => res.json())
        .then((data: Issue[]) => {
          setIssues(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("❌ Error fetching issues:", err);
          setIsLoading(false);
        });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <main className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="space-y-2">
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
              Issues Dashboard
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Discover and explore community issues near you
            </p>
          </div>

          <div className="flex gap-4">
            {/* Navigate to Create Issue Screen */}
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-lg"
              onClick={() => navigate("/create-issue")}
            >
              Create Issue
            </Button>
<Button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-lg"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && <p>Loading issues...</p>}

        {/* Issues grid */}
        {!isLoading && issues.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/50 hover:border-white/80 transform hover:scale-[1.02] transition-all duration-500"
              >
                {issue.images && issue.images.length > 0 ? (
  <div className="relative w-full h-48 overflow-hidden rounded">
    {/* Current image */}
    <img
      src={issue.images[issue.currentImageIndex ?? 0]}
      alt={issue.title}
      className="w-full h-48 object-cover transition-transform duration-700"
    />

    {/* Navigation arrows */}
    {issue.images.length > 1 && (
      <>
        <button
          onClick={() =>
            setIssues((prev) =>
              prev.map((i) =>
                i._id === issue._id
                  ? {
                      ...i,
                      currentImageIndex:
                        ((i.currentImageIndex ?? 0) - 1 + i.images!.length) %
                        i.images!.length,
                    }
                  : i
              )
            )
          }
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full"
        >
          ◀
        </button>
        <button
          onClick={() =>
            setIssues((prev) =>
              prev.map((i) =>
                i._id === issue._id
                  ? {
                      ...i,
                      currentImageIndex:
                        ((i.currentImageIndex ?? 0) + 1) % i.images!.length,
                    }
                  : i
              )
            )
          }
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full"
        >
          ▶
        </button>
      </>
    )}
  </div>
) : (
  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
    No Image
  </div>
)

}


                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    {issue.title}
                  </h2>
                  <p className="text-slate-600 line-clamp-3">{issue.description}</p>
                </div>
<Button
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
  onClick={() => navigate(`/issues/${issue._id}`)}
>
  View Details
</Button>

              </div>
            ))
            }
          </div>
        )}

        {/* Empty state */}
        {!isLoading && issues.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No Issues Found
            </h3>
            <p className="text-slate-600">Check back later for new community issues.</p>
          </div>
        )}
      </main>
    </div>
  );
}
