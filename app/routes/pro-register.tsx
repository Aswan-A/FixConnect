import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PUBLIC_URL } from "config.js";
import '../app.css'; // ✅ import your theme

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

      const accessToken = localStorage.getItem("accessToken");
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
      window.location.href = "/";
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 rounded shadow w-96 flex flex-col gap-4"
        style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
      >
        <h2
          className="text-2xl font-bold text-center"
          style={{ color: "var(--foreground)" }}
        >
          Pro Registration
        </h2>

        <div className="flex flex-col">
          <label>Occupation</label>
          <input
            {...register("occupation")}
            className="p-2 rounded border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--input)",
              color: "var(--foreground)",
            }}
          />
          {errors.occupation && (
            <p className="text-red-500 text-sm">{errors.occupation.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>Skill(s) (comma-separated)</label>
          <input
            {...register("skill")}
            className="p-2 rounded border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--input)",
              color: "var(--foreground)",
            }}
          />
          {errors.skill && (
            <p className="text-red-500 text-sm">{errors.skill.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label>Degree</label>
          <input
            {...register("degree")}
            className="p-2 rounded border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--input)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div className="flex flex-col">
          <label>Description</label>
          <textarea
            {...register("description")}
            className="p-2 rounded border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--input)",
              color: "var(--foreground)",
            }}
          />
        </div>

        <div className="flex flex-col">
          <label>Certificates (up to 3)</label>
          <input
            type="file"
            {...register("certificates")}
            multiple
            className="p-2"
            style={{ color: "var(--foreground)" }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="p-2 rounded"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Registering..." : "Register as Pro"}
        </button>
      </form>
    </div>
  );
}
