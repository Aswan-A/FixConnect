import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { PUBLIC_URL } from "config";

type Issue = {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  category?: string;
  createdAt: string;
  location: { type: "Point"; coordinates: [number, number] };
  reportedBy?: { name: string };
};

export default function IssueDetails() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();

  console.log("IssueDetails component mounted");
  console.log("useParams:", { issueId });
  
  const [issue, setIssue] = useState<Issue | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!issueId) return;

    const url = `${PUBLIC_URL}/api/issues/${issueId}`;
    console.log("Fetching issue from URL:", url);

    fetch(url)
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data: Issue) => {
        console.log("Data received:", data);
        setIssue(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to fetch issue details");
        setIsLoading(false);
      });
  }, [issueId]);



  const handleRequest = async () => {
    setIsRequesting(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(`${PUBLIC_URL}/api/issues/${issueId}/request`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to request issue");

      alert("Request submitted successfully!");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) return <p className="p-6">Loading issue details...</p>;
  if (!issue) return <p className="p-6">Issue not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold">{issue.title}</h1>
        <p className="text-slate-600">{issue.description}</p>
        {issue.category && (
          <p className="text-sm text-gray-500">Category: {issue.category}</p>
        )}
        {issue.reportedBy && (
          <p className="text-sm text-gray-500">Reported by: {issue.reportedBy.name}</p>
        )}
        <p className="text-sm text-gray-500">
          Created at: {new Date(issue.createdAt).toLocaleString()}
        </p>

        {/* Image Slider */}
        {issue.images && issue.images.length > 0 ? (
          <div className="relative w-full h-64 overflow-hidden rounded">
            <img
              src={issue.images[currentImageIndex]}
              alt={`Issue image ${currentImageIndex + 1}`}
              className="w-full h-64 object-cover transition-transform duration-500"
            />
            {issue.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (currentImageIndex - 1 + (issue.images?.length ?? 0)) % (issue.images?.length ?? 1)
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full"
                >
                  ◀
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((currentImageIndex + 1) % issue.images!.length)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full"
                >
                  ▶
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
            No Images
          </div>
        )}

        {/* Request Button */}
        <Button
          onClick={handleRequest}
          disabled={isRequesting}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          {isRequesting ? "Requesting..." : "Request to Solve"}
        </Button>

        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}
