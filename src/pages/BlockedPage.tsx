import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ban, Mail, Phone, Home } from "lucide-react";
import { useAccount } from "@/hooks/useAccount";
import { Link } from "react-router";

export default function BlockedPage() {
  const { accountStatusLabel } = useAccount();

  const statusMessage =
    accountStatusLabel === "SUSPENDED"
      ? "Your account is temporarily suspended. Please contact support to complete the review process and regain access."
      : "Your account is blocked from platform access. Please contact support if you believe this decision needs review.";

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-destructive/40 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <Ban className="w-10 h-10 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">Account Restricted</CardTitle>
          <CardDescription className="text-lg mt-2">
            Current account status: <span className="font-semibold">{accountStatusLabel}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="bg-destructive/5 border border-destructive/25 p-4 rounded-lg">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {statusMessage}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">What can you do?</h3>
            <div className="grid gap-3">
              <a
                href="mailto:support@gomove.app"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/50"
              >
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-xs text-muted-foreground">support@gomove.app</p>
                </div>
              </a>
              <a
                href="tel:16578"
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/50"
              >
                <Phone className="h-5 w-5 text-primary" />
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
            <Button asChild variant="destructive" className="w-full">
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
