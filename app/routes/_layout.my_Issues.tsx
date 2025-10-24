import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { PUBLIC_URL } from "config";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type Issue = {
  currentImageIndex: number;
  _id: string;
  title: string;
  description: string;
  images?: string[];
  createdAt: string;
  category?: string;
  status?: string;
  location: { type: "Point"; coordinates: [number, number] };
};

export default function MyIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    fetch(`${PUBLIC_URL}/api/issues/my/issues`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Issue[]) => {
        setIssues(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching issues:", err);
        setError("Failed to load issues");
        setIsLoading(false);
      });
  }, []);

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    setUpdatingStatus(issueId);
    try {
      const res = await fetch(`${PUBLIC_URL}/api/issues/${issueId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err: any) {
      console.error("Error updating status:", err);
      setError(err.message || "Failed to update status");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      {isLoading && <p>Loading issues...</p>}

      {!isLoading && error && (
        <div className="text-center py-4 text-red-500 font-semibold bg-red-50 rounded-lg mb-4">
          {error}
        </div>
      )}

      {!isLoading && !error && issues.length > 0 && (
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
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl text-[var(--card-foreground)]">
                    {issue.title}
                  </CardTitle>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status || "open"}
                  </span>
                </div>

                <CardDescription className="text-[var(--foreground)] line-clamp-3">
                  {issue.description}
                </CardDescription>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Update Status
                  </label>
                  {issue.status !== "resolved" && (
                    <Button
                      onClick={() =>
                        handleStatusChange(
                          issue._id,
                          issue.status === "open" ? "in progress" : "resolved"
                        )
                      }
                      disabled={updatingStatus === issue._id}
                      className="w-full"
                      variant="outline"
                    >
                      {updatingStatus === issue._id ? (
                        "Updating..."
                      ) : issue.status === "open" ? (
                        "Mark In Progress"
                      ) : (
                        "Mark Resolved"
                      )}
                    </Button>
                  )}
                  {issue.status === "resolved" && (
                    <div className="text-center py-2 text-sm text-green-600 font-medium">
                      ✓ Issue Resolved
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex justify-center">
                <Button
                  onClick={() => navigate(`/issues/my/requests/${issue._id}`)}
                  className="text-[var(--primary-foreground)] border border-[var(--primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                  disabled={updatingStatus === issue._id}
                >
                  {updatingStatus === issue._id ? "Updating..." : "View Requests"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && issues.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-[var(--card-foreground)] mb-2">
            No Issues Found
          </h3>
          <p className="text-[var(--foreground)]">
            You haven't created any issues yet.
          </p>
        </div>
      )}
    </div>
  );
}