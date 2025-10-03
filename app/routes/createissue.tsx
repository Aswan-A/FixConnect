import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { PUBLIC_URL } from "config";

export default function CreateIssue() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]); // multiple files
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

          // Append multiple images
          imageFiles.forEach((file) => formData.append("images", file));

          const res = await fetch(`${PUBLIC_URL}/api/issues`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // only auth header
            },
            body: formData,
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "Failed to create issue");

          navigate("/"); // redirect after success
        } catch (err: any) {
          console.error(err);
          setError(err.message || "Something went wrong");
        } finally {
          setIsSubmitting(false);
        }
      },
      (err) => {
        console.error(err);
        setError("Unable to get your location.");
        setIsSubmitting(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <form
        className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-lg space-y-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-slate-800">Create New Issue</h1>

        {error && <p className="text-red-600">{error}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg h-32"
          required
        />

        <input
          type="file"
          name="images" // Must match backend field
          accept="image/*"
          multiple
          onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
          className="w-full"
        />

        {/* Preview selected images */}
        {imageFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {imageFiles.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx}`}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Create Issue"}
        </Button>
      </form>
    </div>
  );
}
