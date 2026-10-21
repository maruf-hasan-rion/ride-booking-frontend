import register from "@/assets/images/signUp.jpg";
import { Link, Navigate } from "react-router";
import Logo from "@/assets/icons/Logo";
import { RegisterForm } from "@/components/modules/Authentication/RegisterForm";
import { getRoleDashboardPath } from "@/hooks/useRoleRedirect";
import { useAccount } from "@/hooks/useAccount";

export default function Register() {
  const { user, isLoading, isLoggedIn, hasRole, isBlockedOrSuspended } =
    useAccount();

  if (!isLoading && isLoggedIn) {
    if (isBlockedOrSuspended) {
      return <Navigate to="/blocked" replace />;
    }

    if (!hasRole) {
      return <Navigate to="/select-role" replace />;
    }

    return <Navigate to={getRoleDashboardPath(user?.role)} replace />;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={register}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
