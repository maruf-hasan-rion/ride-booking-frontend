import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ShieldAlert } from "lucide-react";
import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-10">
      <Card className="w-full max-w-lg border-border/70 shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">You do not have access to this page</CardTitle>
            <CardDescription className="text-sm leading-6">
              This page is restricted to another account role. Return to a page that matches your
              current access level.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/dashboard">Go to my dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
