"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PUBLIC_URL } from "config";

export default function CreateIssue() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setIsSubmitting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const token = localStorage.getItem("accessToken");
          if (!token) throw new Error("User not authenticated");

          const formData = new FormData();
          formData.append("title", title);
          formData.append("description", description);
          formData.append("category", category);
          formData.append("latitude", latitude.toString());
          formData.append("longitude", longitude.toString());
          imageFiles.forEach((file) => formData.append("images", file));

          const res = await fetch(`${PUBLIC_URL}/api/issues`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "Failed to create issue");

          navigate("/");
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Something went wrong");
        } finally {
          setIsSubmitting(false);
        }
      },
      () => {
        setError("Unable to get your location.");
        setIsSubmitting(false);
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-800">
            Create New Issue
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Attach Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setImageFiles(Array.from(e.target.files || []))
                }
              />
            </div>

            {imageFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {imageFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx}`}
                    className="h-24 w-full rounded-lg object-cover border"
                  />
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label>Category (optional)</Label>
              <Select onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <CardFooter className="pt-4">
              <Button
                type="submit"
                className="w-full text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Create Issue"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
