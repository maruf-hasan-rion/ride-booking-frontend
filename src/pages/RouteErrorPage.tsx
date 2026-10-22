import { Button } from "@/components/ui/button";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

const getErrorMessage = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return error.data?.message || error.statusText || "Something went wrong.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};

export default function RouteErrorPage() {
  const error = useRouteError();
  const statusCode = isRouteErrorResponse(error) ? error.status : null;
  const message = getErrorMessage(error);

  return (
    <main className="section-shell flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {statusCode ? `Error ${statusCode}` : "Unexpected Error"}
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          We could not load this page
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="brand-gradient-bg">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button type="button" variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </main>
  );
}
