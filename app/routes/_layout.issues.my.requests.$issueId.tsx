import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { PUBLIC_URL } from "config";
import { Button } from "~/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  profilePic?: string;
  isPro?: boolean;
};

type ProUser = {
  _id: string; // user _id
  name: string;
  email?: string;
  phoneNumber?: string;
  profilePic?: string;
  isPro?: boolean;
  occupation?: string;
  skill?: string[];
  degree?: string;
  certifications?: string[];
  description?: string;
  // optional: an array of certificate URLs (image or pdf)
  certificates?: string[];
};

export default function IssueRequests() {
  const { issueId } = useParams<{ issueId: string }>();
  const [proUsers, setProUsers] = useState<ProUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState<ProUser | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [stripCenterIndex, setStripCenterIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement | null>(null);

  // certificate carousel state for expanded user
  const [certIndex, setCertIndex] = useState(0);

  useEffect(() => {
    if (!issueId) return;
    setIsLoading(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    fetch(`${PUBLIC_URL}/api/issues/my/requests/${issueId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
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

  // If few users (<5), we still show the strip appropriately
  const visibleStripCount = Math.min(5, proUsers.length || 0);

  // helper: open expanded view (with small click animation + spinner)
  const openExpanded = async (user: ProUser, indexInList: number) => {
    setIsExpanding(true);
    // small visual delay to show click animation / spinner
    await new Promise((r) => setTimeout(r, 330));
    setExpandedUser(user);
    setStripCenterIndex(indexInList); // align strip on this user
    setCertIndex(0);
    setIsExpanding(false);
    // scroll strip to center on selected item after a tick
    setTimeout(() => scrollStripToIndex(indexInList), 50);
  };

  const closeExpanded = () => {
    setExpandedUser(null);
    setCertIndex(0);
  };

  // Scroll logic for the strip: center a selected child by index.
  const scrollStripToIndex = (index: number) => {
    const strip = stripRef.current;
    if (!strip) return;
    const children = Array.from(strip.children) as HTMLElement[];
    if (!children[index]) return;

    const child = children[index];
    const offset =
      child.offsetLeft +
      child.offsetWidth / 2 -
      strip.clientWidth / 2;
    strip.scrollTo({ left: offset, behavior: "smooth" });
  };

  // detect which item is centered on scroll using IntersectionObserver-like technique
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let raf = 0;

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const children = Array.from(strip.children) as HTMLElement[];
        const center = strip.scrollLeft + strip.clientWidth / 2;
        let closestIndex = 0;
        let minDist = Infinity;
        children.forEach((c, i) => {
          const cCenter = c.offsetLeft + c.clientWidth / 2;
          const d = Math.abs(cCenter - center);
          if (d < minDist) {
            minDist = d;
            closestIndex = i;
          }
        });
        setStripCenterIndex(closestIndex);
      });
    };

    strip.addEventListener("scroll", onScroll, { passive: true });
    // initial update
    onScroll();

    return () => {
      strip.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [proUsers]);

  useEffect(() => {
    // Whenever center index changes while expanded, update the main profile
    if (expandedUser && proUsers[stripCenterIndex]) {
      // small delay to allow "glass grow" animation
      setIsExpanding(true);
      const t = setTimeout(() => {
        setExpandedUser(proUsers[stripCenterIndex]);
        setIsExpanding(false);
      }, 220);
      return () => clearTimeout(t);
    }
  }, [stripCenterIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // certificate helpers
  const currentCertificates = expandedUser?.certificates ?? [];
  const isPdf = (url: string) => url.toLowerCase().endsWith(".pdf");

  if (isLoading) return <p className="text-center py-8">Loading pro users...</p>;
  if (error)
    return (
      <div className="text-center py-16 text-red-500 font-semibold">{error}</div>
    );
  if (!proUsers.length)
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

  // Small spinner component
  const Spinner = () => (
    <div className="w-10 h-10 rounded-full border-4 border-[rgba(255,255,255,0.2)] border-t-[rgba(255,255,255,0.8)] animate-spin" />
  );

  return (
    <div className="min-h-screen p-6">
      {/* Grid fallback: only show when not expanded */}
      <AnimatePresence>
        {!expandedUser && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {proUsers.map((user, i) => (
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

                  {user.skill && user.skill.length > 0 && (
                    <p className="text-sm text-[var(--foreground)]">
                      <strong>Skills:</strong> {user.skill.join(", ")}
                    </p>
                  )}

                  <div className="pt-3 flex gap-3">
                    <Button
                      onClick={() => openExpanded(user, i)}
                      className="flex-1 border border-[var(--primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                    >
                      {isExpanding ? (
                        <div className="flex items-center justify-center gap-2">
                          <Spinner /> Opening
                        </div>
                      ) : (
                        "View Profile"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Layout */}
      <AnimatePresence>
        {expandedUser && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-[rgba(0,0,0,0.4)] backdrop-blur-sm p-6"
          >
            <div className="max-w-[1400px] mx-auto w-full h-full bg-transparent flex gap-6">
              {/* Main large profile area */}
              <motion.section
                layout
                className="flex-1 rounded-3xl overflow-hidden bg-[var(--card)]/80 shadow-2xl relative"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 24 }}
              >
                {/* top bar */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]/30">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={closeExpanded}
                      className="p-2 rounded-md hover:bg-[var(--muted)]"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                    <h2 className="text-xl font-bold text-[var(--card-foreground)]">
                      {expandedUser.name}
                    </h2>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {expandedUser.occupation ?? ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => {
                        // placeholder for contact / hire / message action
                        window.open(`mailto:${expandedUser.email ?? ""}`);
                      }}
                    >
                      Contact
                    </Button>
                  </div>
                </div>

                {/* content */}
                <div className="p-6 overflow-auto h-[calc(100%-72px)]">
                  <div className="flex flex-col lg:flex-row gap-6 h-full">
                    {/* left: visual + basic info */}
                    <div className="flex flex-col h-fit items-center justify-center space-y-4 flex-1 pd-100">
                      <div className="flex h-fit w-full max-w rounded-2xl overflow-hidden">
                        <AspectRatio ratio={4 / 3}>
                          {expandedUser.profilePic ? (
                            <img
                              src={expandedUser.profilePic}
                              alt={expandedUser.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                              No Image
                            </div>
                          )}
                        </AspectRatio>
                      </div>


                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-[var(--card-foreground)]">
                          {expandedUser.name}
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {expandedUser.degree ? `🎓 ${expandedUser.degree}` : ""}
                        </p>
                        {expandedUser.description && (
                          <p className="text-[var(--foreground)] leading-relaxed">
                            {expandedUser.description}
                          </p>
                        )}

                        {expandedUser.skill && expandedUser.skill.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-[var(--card-foreground)]">
                              Skills
                            </h4>
                            <p className="text-sm text-[var(--foreground)]">
                              {expandedUser.skill.join(", ")}
                            </p>
                          </div>
                        )}

                        {expandedUser.certifications &&
                          expandedUser.certifications.length > 0 && (
                            <div>
                              <h2 className="text font-medium text-[var(--card-foreground)]">
                                Certifications
                              </h2>
                              <Carousel className="w-full max-w-xl">
                                <CarouselContent>
                                  {expandedUser.certifications.map((cert, index) => {
                                    const isPdf = cert.toLowerCase().endsWith(".pdf")

                                    return (
                                      <CarouselItem key={index}>
                                        <div className="p-2 border rounded-lg bg-white flex justify-center items-center">
                                          {isPdf ? (
                                            <embed
                                              src={cert}
                                              type="application/pdf"
                                              width="100%"
                                              height="400px"
                                              className="rounded-lg border border-gray-300"
                                            />
                                          ) : (
                                            <img
                                              src={cert}
                                              alt={`Certification ${index + 1}`}
                                              className="rounded-lg border border-gray-300 w-full h-[400px] object-contain"
                                            />
                                          )}
                                        </div>
                                      </CarouselItem>
                                    )
                                  })}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                              </Carousel> 
                            </div>
                            
                          )}
                      </div>
                      <div className="mt-6 w-fit ">
                        <h4 className="text-md font-bold text-[var(--card-foreground)]">
                          Contact & Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                          <div className="p-3 rounded-lg border border-[var(--border)]/30">
                            <div className="text-sm text-[var(--muted-foreground)]">
                              Email
                            </div>
                            <div className="font-medium">{expandedUser.email}</div>
                          </div>

                          <div className="p-3 rounded-lg border border-[var(--border)]/30">
                            <div className="text-sm text-[var(--muted-foreground)]">
                              Phone
                            </div>
                            <div className="font-medium">{expandedUser.phoneNumber}</div>
                          </div>

                          <div className="p-3 rounded-lg border border-[var(--border)]/30">
                            <div className="text-sm text-[var(--muted-foreground)]">
                              Occupation
                            </div>
                            <div className="font-medium">{expandedUser.occupation}</div>
                          </div>
                        </div>
                  </div>
                    </div>

                    {/* right: certificates / details carousel */}
                  </div>

                  {/* optional: contact / hire / more details */}
                  
                  
                </div>
              </motion.section>

              {/* Right strip (carousel-like) */}
              <aside className="w-[340px] flex-shrink-0">
                <div className="h-full rounded-2xl bg-[var(--card)]/90 p-4 border border-[var(--border)]/40 overflow-hidden flex flex-col">
                  <h4 className="text-sm font-semibold text-[var(--card-foreground)] mb-3">
                    Applicants
                  </h4>

                  <div
                    ref={stripRef}
                    className="flex gap-3 overflow-x-auto snap-x snap-mandatory py-2 px-1"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {proUsers.map((u, idx) => {
                      const isCenter = idx === stripCenterIndex;
                      const small = (
                        <motion.div
                          key={u._id}
                          layout
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            // scroll to this item; this will trigger center logic
                            scrollStripToIndex(idx);
                            setStripCenterIndex(idx);
                          }}
                          className={`snap-center shrink-0 w-28 md:w-32 p-2 rounded-xl border ${
                            isCenter
                              ? "ring-2 ring-offset-2 ring-[rgba(255,255,255,0.06)]"
                              : "border-[var(--border)]/30"
                          } bg-[var(--card)]`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 rounded-lg overflow-hidden">
                              {u.profilePic ? (
                                <img
                                  src={u.profilePic}
                                  alt={u.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-[var(--muted)]" />
                              )}
                            </div>
                            <div className="text-xs text-center truncate w-full">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-[var(--muted-foreground)]">
                              {u.occupation ?? ""}
                            </div>
                          </div>
                        </motion.div>
                      );

                      return small;
                    })}
                  </div>

                  {/* hint text + controls */}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <div className="text-xs text-[var(--muted-foreground)]">
                      Drag / scroll to choose applicant
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          scrollStripToIndex(Math.max(0, stripCenterIndex - 1))
                        }
                        className="p-2 rounded-md hover:bg-[var(--muted)]"
                        aria-label="Prev applicant"
                      >
                        ◀
                      </button>
                      <button
                        onClick={() =>
                          scrollStripToIndex(Math.min(proUsers.length - 1, stripCenterIndex + 1))
                        }
                        className="p-2 rounded-md hover:bg-[var(--muted)]"
                        aria-label="Next applicant"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
