import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PUBLIC_URL } from "config.js";

const schema = z.object({
  occupation: z.string().min(1, "Occupation is required"),
  skill: z.string().min(1, "At least one skill required"),
  degree: z.string().optional(),
  description: z.string().optional(),
  certificates: z.any().optional(),
});

export default function ProRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values: any) {
    try {
      const formData = new FormData();
      formData.append("occupation", values.occupation);
      formData.append("skill", values.skill);
      if (values.degree) formData.append("degree", values.degree);
      if (values.description) formData.append("description", values.description);

      if (values.certificates?.length) {
        (Array.from(values.certificates) as File[]).forEach((file: File) => {
          formData.append("certificates", file);
        });
      }

      const accessToken = localStorage.getItem("accessToken"); // must be logged in
      if (!accessToken) throw new Error("Not authenticated");

      const res = await fetch(`${PUBLIC_URL}/api/auth/pro-register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Pro registration failed");

      alert("Pro registration successful!");
      window.location.href = "/"; // redirect to dashboard or desired page
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Pro Registration</h2>

        <div>
          <label>Occupation</label>
          <input {...register("occupation")} className="w-full border p-2 rounded" />
          {errors.occupation && <p className="text-red-500 text-sm">{errors.occupation.message}</p>}
        </div>

        <div>
          <label>Skill(s) (comma-separated)</label>
          <input {...register("skill")} className="w-full border p-2 rounded" />
          {errors.skill && <p className="text-red-500 text-sm">{errors.skill.message}</p>}
        </div>

        <div>
          <label>Degree</label>
          <input {...register("degree")} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label>Description</label>
          <textarea {...register("description")} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label>Certificates (up to 3)</label>
          <input type="file" {...register("certificates")} multiple className="w-full" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {isSubmitting ? "Registering..." : "Register as Pro"}
        </button>
      </form>
    </div>
  );
}
