import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PUBLIC_URL } from "config.js";

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

      if (values.profilePic?.[0]) {
        formData.append("profilePic", values.profilePic[0]);
      }

      const res = await fetch(`${PUBLIC_URL}/api/auth/register`, {
        method: "POST",
        body: formData, // <-- multipart/form-data
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
if (res.ok) {
  localStorage.setItem("accessToken", data.tokens.accessToken);
  localStorage.setItem("refreshToken", data.tokens.refreshToken);

  alert("Account created successfully!");
if (values.isPro) {
  window.location.href = "/pro-register";
} else {
  window.location.href = "/dashboard";
}

}

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
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <div>
          <label>Name</label>
          <input {...register("name")} className="w-full border p-2 rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input {...register("email")} className="w-full border p-2 rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label>Phone</label>
          <input {...register("phoneNumber")} className="w-full border p-2 rounded" />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div>
          <label>Password</label>
          <input type="password" {...register("password")} className="w-full border p-2 rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label>Profile Picture</label>
          <input type="file" {...register("profilePic")} className="w-full" />
        </div>

        <div>
          <label>
            <input type="checkbox" {...register("isPro")} className="mr-2" /> Are you a Pro?
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {isSubmitting ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </form>
    </div>
  );
}
