import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PUBLIC_URL } from "config.js";
console.log(import.meta.url);
import '../app.css';


// import your theme

const schema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  email: z.string().email("Invalid email").min(1, "Email required"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\d+$/, "Phone number must contain digits only"),
  password: z.string().min(6, "Password too short").max(100, "Password too long"),
  isPro: z.boolean().optional(),
  profilePic: z.any().optional(),
});

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values: any) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("password", values.password);
      formData.append("isPro", values.isPro ? "true" : "false");
      if (values.profilePic?.[0]) formData.append("profilePic", values.profilePic[0]);

      const res = await fetch(`${PUBLIC_URL}/api/auth/register`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Signup failed");

      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);

      alert("Account created successfully!");
      if (values.isPro) window.location.href = "/pro-register";
      else window.location.href = "/";
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 rounded shadow w-96 flex flex-col gap-4"
        style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
      >
        <h2 className="text-2xl font-bold text-center" style={{ color: "var(--foreground)" }}>
          Create Account
        </h2>

        <div className="flex flex-col">
          <label>Name</label>
          <input {...register("name")} className="p-2 rounded border" style={{ borderColor: "var(--border)", backgroundColor: "var(--input)", color: "var(--foreground)" }} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col">
          <label>Email</label>
          <input {...register("email")} className="p-2 rounded border" style={{ borderColor: "var(--border)", backgroundColor: "var(--input)", color: "var(--foreground)" }} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col">
          <label>Phone</label>
          <input {...register("phoneNumber")} className="p-2 rounded border" style={{ borderColor: "var(--border)", backgroundColor: "var(--input)", color: "var(--foreground)" }} />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
        </div>

        <div className="flex flex-col">
          <label>Password</label>
          <input type="password" {...register("password")} className="p-2 rounded border" style={{ borderColor: "var(--border)", backgroundColor: "var(--input)", color: "var(--foreground)" }} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col">
          <label>Profile Picture</label>
          <input type="file" {...register("profilePic")} className="p-2" style={{ color: "var(--foreground)" }} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isPro")} className="mr-2" />
          <label>Are you a Pro?</label>
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
          {isSubmitting ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm" style={{ color: "var(--foreground)" }}>
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </form>
    </div>
  );
}
