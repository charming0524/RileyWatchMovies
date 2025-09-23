import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/api";
import { User } from "@/types";
import { useAuth } from "@/context/auth";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

const registerSchema = z.object({
  username: z.string({ required_error: "Username is required" }).trim(),
  email: z.string({ required_error: "Email is required" }).email().trim(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(18, "Password should not exceed 18 characters")
    .trim(),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RegisterInput) =>
      api
        .post<{
          token: string;
          user: User;
        }>("/auth/register", data)
        .then((res) => res.data),
    onSuccess: (data) => {
      auth.login(data.token, data.user);
      const from = location.state?.from?.pathname || "/";
      navigate(from);
      toast.success("Register successful");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "An error occurred");
    },
  });

  function onSubmit(data: RegisterInput) {
    mutation.mutate(data);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign up</CardTitle>
          <CardDescription>Create a free account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <FormControl>
                          <Input
                            id="username"
                            disabled={mutation.isPending}
                            placeholder="John Doe"
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
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            disabled={mutation.isPending}
                            placeholder="m@example.com"
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
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            disabled={mutation.isPending}
                            placeholder="*******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    Signup
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to={"/login"} className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Link
        to={"/"}
        className="underline text-white hover:no-underline hover:text-neutral-200 text-center text-sm"
      >
        Back to Home Page
      </Link>
    </div>
  );
}
