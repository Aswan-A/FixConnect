import type { Route } from './+types/signup.tsx';
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

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Sign Up' }];
}

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .min(1, { message: 'Email is required.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      toast.success('Account created!', {
        description: 'You can now log in.',
      });

      // Redirect to login
      window.location.href = '/login';
    } catch (error: any) {
      toast.error('Signup failed', {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create an account
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fill in your details to get started
          </p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={isSubmitting}
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isSubmitting}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Sign up'
          )}
        </Button>
      </form>
    </Form>
  );
}

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md space-y-6">
        <SignupForm />
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
