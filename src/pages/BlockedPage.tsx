import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ban, Mail, Phone, Home } from "lucide-react";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Link } from "react-router";

export default function BlockedPage() {
  const { data } = useUserInfoQuery(undefined);
  const user = data?.data;
  const normalizedStatus =
    typeof user?.status === "string" ? user.status.toLowerCase() : undefined;

  const accountStatusLabel =
    user?.isBlocked === true || normalizedStatus === "blocked"
      ? "BLOCKED"
      : normalizedStatus === "suspended"
        ? "SUSPENDED"
        : "RESTRICTED";
  const statusMessage =
    accountStatusLabel === "SUSPENDED"
      ? "Your account is temporarily suspended. Please contact support to complete the review process and regain access."
      : "Your account is blocked from platform access. Please contact support if you believe this decision needs review.";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-200 dark:border-red-900 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <Ban className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">Account Restricted</CardTitle>
          <CardDescription className="text-lg mt-2">
            Current account status: <span className="font-semibold">{accountStatusLabel}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-4 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed">
              {statusMessage}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">What can you do?</h3>
            <div className="grid gap-3">
              <a
                href="mailto:support@gomove.app"
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-emerald-500/50 dark:border-gray-800 dark:bg-gray-900"
              >
                <Mail className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-xs text-muted-foreground">support@gomove.app</p>
                </div>
              </a>
              <a
                href="tel:16578"
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-emerald-500/50 dark:border-gray-800 dark:bg-gray-900"
              >
                <Phone className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium">Call Help Center</p>
                  <p className="text-xs text-muted-foreground">999 (Emergency) / 16578</p>
                </div>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button asChild variant="outline" className="w-full gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="w-full bg-red-600 text-white hover:bg-red-700">
              <Link to="/contact">Appeal Restriction</Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Support can review your account status using the email address on this account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
