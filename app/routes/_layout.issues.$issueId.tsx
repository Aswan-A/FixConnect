import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, MapPin, Calendar, User, Tag, Loader2 } from 'lucide-react';

import { PUBLIC_URL } from 'config.js';

type Issue = {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  category?: string;
  createdAt: string;
  status?: string;
  reportedBy?: { name: string };
  address?: string;
};

export default function IssueDetails() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState('');
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (!issueId) return;

    const url = `${PUBLIC_URL}/api/issues/${issueId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data: Issue) => {
        setIssue(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to fetch issue details');
        setIsLoading(false);
      });
  }, [issueId]);

  const handleRequest = async () => {
    setIsRequesting(true);
    setError('');
    try {
      const token = sessionStorage.getItem('accessToken') || '';
      if (!token) throw new Error('User not authenticated');

      const res = await fetch(`${PUBLIC_URL}/api/issues/${issueId}/request`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to request issue');

      alert('Request submitted successfully!');
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsRequesting(false);
    }
  };

  const nextImage = () => {
    if (issue?.images && issue.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % issue.images!.length);
    }
  };

  const prevImage = () => {
    if (issue?.images && issue.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + issue.images!.length) % issue.images!.length);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'open':
        return 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20';
      case 'in progress':
        return 'bg-[var(--secondary)]/10 text-[var(--secondary)] border-[var(--secondary)]/20';
      case 'resolved':
        return 'bg-[var(--accent)]/10 text-[var(--accent-foreground)] border-[var(--accent)]/20';
      default:
        return 'bg-[var(--muted)]/10 text-[var(--muted-foreground)] border-[var(--muted)]/20';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Electronics':
        return 'bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/25';
      case 'Electrical':
        return 'bg-[var(--secondary)]/15 text-[var(--secondary)] border-[var(--secondary)]/25';
      case 'Plumbing':
        return 'bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/25';
      default:
        return 'bg-[var(--muted)]/15 text-[var(--muted-foreground)] border-[var(--muted)]/25';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-6">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Issue Not Found</h2>
          <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] md:min-h-screen">
      <div className="mx-auto max-w-5xl p-3 pb-3 md:p-6 md:pb-6">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]/40 bg-[var(--card)] shadow-xl">
          {/* Title Section */}
          <div className="border-b border-[var(--border)] p-4 md:p-8">
            <h1 className="mb-3 text-2xl font-bold text-[var(--foreground)] md:text-3xl">
              {issue.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {issue.status && (
                <Badge variant="outline" className={getStatusColor(issue.status)}>
                  {issue.status}
                </Badge>
              )}
              {issue.category && (
                <Badge variant="outline" className={getCategoryColor(issue.category)}>
                  <Tag className="mr-1 h-3 w-3" />
                  {issue.category}
                </Badge>
              )}
            </div>
          </div>

          {/* Image Carousel */}
          {issue.images && issue.images.length > 0 ? (
            <div className="relative bg-[var(--muted)]">
              <div
                className="relative aspect-video w-full overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={issue.images[currentImageIndex]}
                  alt={`Issue image ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />

                {/* Image Counter */}
                {issue.images.length > 1 && (
                  <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    {currentImageIndex + 1} / {issue.images.length}
                  </div>
                )}

                {/* Navigation Buttons */}
                {issue.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--card)]/90 text-[var(--foreground)] shadow-lg transition-all hover:bg-[var(--card)]"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--card)]/90 text-[var(--foreground)] shadow-lg transition-all hover:bg-[var(--card)]"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {issue.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto bg-[var(--muted)]/50 p-3">
                  {issue.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        idx === currentImageIndex
                          ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/50'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-[var(--muted)] text-[var(--muted-foreground)]">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--muted)]/50">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm">No images available</p>
              </div>
            </div>
          )}

          {/* Details Section */}
          <div className="space-y-4 p-4 md:space-y-6 md:p-8">
            {/* Description */}
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
                Description
              </h3>
              <p className="leading-relaxed text-[var(--foreground)]">{issue.description}</p>
            </div>

            {/* Other Details */}
            <div className="grid grid-cols-1 gap-3 border-t border-[var(--border)] pt-3 md:grid-cols-2 md:gap-4 md:pt-4">
              {issue.reportedBy && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                    <User className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--muted-foreground)]">
                      Reported By
                    </p>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {issue.reportedBy.name}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <Calendar className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)]">Created At</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {new Date(issue.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {new Date(issue.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {issue.address && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                    <MapPin className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--muted-foreground)]">
                      Location Address
                    </p>
                    <p className="text-sm font-medium text-[var(--foreground)]">{issue.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Request Button */}
            <div className="pt-3 md:pt-4">
              <Button
                onClick={handleRequest}
                disabled={isRequesting}
                className="w-full rounded-lg bg-[var(--primary)] px-8 py-2.5 font-medium text-[var(--primary-foreground)] shadow-sm transition-all hover:bg-[var(--primary)]/90 md:w-auto"
              >
                {isRequesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  'Request to Solve'
                )}
              </Button>

              {error && (
                <p className="mt-2 rounded-lg border border-[var(--destructive)]/20 bg-[var(--destructive)]/10 px-4 py-2 text-sm text-[var(--destructive)]">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
