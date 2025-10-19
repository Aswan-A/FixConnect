import type { Route } from './+types/login.tsx';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';
import { PUBLIC_URL } from 'config.js';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Login' }];
}

const FormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .min(1, { message: 'Email is required.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

export function InputForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    try {
      const res = await fetch(`${PUBLIC_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Login failed');

      // Store user info and tokens
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('accessToken', result.tokens.accessToken);
      localStorage.setItem('refreshToken', result.tokens.refreshToken);

      toast.success('Login successful!', {
        description: 'Welcome back! Redirecting you now...',
      });

      window.location.href = '/';
    } catch (error: any) {
      toast.error('Login failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl transition-colors"
      >
        {/* Heading */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Input fields */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      disabled={isSubmitting}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              disabled={isSubmitting}
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90">
          {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Sign in'}
        </Button>
      </form>
    </Form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <InputForm />
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
