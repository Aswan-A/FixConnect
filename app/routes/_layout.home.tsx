import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import Layout from "./_layout";
import { PUBLIC_URL } from "config";

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
      console.error("❌ Geolocation not supported");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const radius = 10;

      fetch(`${PUBLIC_URL}/api/issues?latitude=${latitude}&longitude=${longitude}&radius=${radius}`)
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

  return (<div>
      {isLoading && <p>Loading issues...</p>}

      {!isLoading && issues.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="group bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/50 hover:border-white/80 transform hover:scale-[1.02] transition-all duration-500"
            >
              {issue.images && issue.images.length > 0 ? (
                <div className="relative w-full h-48 overflow-hidden rounded">
                  <img
                    src={issue.images[issue.currentImageIndex ?? 0]}
                    alt={issue.title}
                    className="w-full h-48 object-cover transition-transform duration-700"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                  No Image
                </div>
              )}

              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-slate-800">{issue.title}</h2>
                <p className="text-slate-600 line-clamp-3">{issue.description}</p>
              </div>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                onClick={() => navigate(`/issues/${issue._id}`)}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}

      {!isLoading && issues.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">No Issues Found</h3>
          <p className="text-slate-600">Check back later for new community issues.</p>
        </div>
      )}
  </div>
  );
}
