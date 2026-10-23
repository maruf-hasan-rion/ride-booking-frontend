import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import config from "@/config";
import { getRoleDashboardPath } from "@/hooks/useRoleRedirect";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { getApiErrorMessage } from "@/utils/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type ApiError = {
  data?: {
    message?: string;
  };
};

type DemoCredential = {
  label: string;
  email?: string;
  password?: string;
};

const DEMO_CREDENTIALS: DemoCredential[] = config.isDemoLoginEnabled
  ? [
      {
        label: "Admin",
        email: config.demoCredentials.admin.email,
        password: config.demoCredentials.admin.password,
      },
      {
        label: "Driver",
        email: config.demoCredentials.driver.email,
        password: config.demoCredentials.driver.password,
      },
      {
        label: "Rider",
        email: config.demoCredentials.rider.email,
        password: config.demoCredentials.rider.password,
      },
    ].filter((credential) => Boolean(credential.email && credential.password))
  : [];

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const res = await login(data).unwrap();

      if (res.success) {
        toast.success("Logged in successfully");
        navigate(getRoleDashboardPath(res?.data?.role));
      }
    } catch (err) {
      const apiError = err as ApiError;
      const message = apiError?.data?.message;

      if (message === "Password does not match") {
        toast.error("Invalid credentials");
        return;
      }

      if (message === "User is not verified") {
        toast.error("Your account is not verified");
        navigate("/verify", { state: data.email });
        return;
      }

      toast.error(getApiErrorMessage(err, message || "Login failed. Please try again."));
    }
  };

  const handleQuickLogin = async (credential: DemoCredential) => {
    if (!credential.email || !credential.password) {
      return;
    }

    const quickLoginData = {
      email: credential.email,
      password: credential.password,
    };

    form.reset(quickLoginData);
    await onSubmit(quickLoginData);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email and password to continue
        </p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      {...field}
                      value={field.value || ""}
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
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r brand-gradient-bg hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        {DEMO_CREDENTIALS.length > 0 && (
          <div className="rounded-xl border border-border bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
              Quick Feature Check
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              One-click demo login using env credentials.
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {DEMO_CREDENTIALS.map((credential) => (
                <Button
                  key={credential.label}
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickLogin(credential)}
                  disabled={isLoading}
                  className="w-full"
                >
                  {credential.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button
          onClick={() => window.open(`${config.baseUrl}/auth/google`, "_self")}
          type="button"
          variant="outline"
          className="w-full cursor-pointer border-primary/40 hover:border-brand-400 hover:text-primary"
        >
          Login with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" replace className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </div>
  );
}
