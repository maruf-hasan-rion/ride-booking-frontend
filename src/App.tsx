import CommonLayout from "./components/layout/CommonLayout";
import RouteFallback from "./components/shared/RouteFallback";
import ScrollToTop from "./components/shared/ScrollToTop";
import { useAccount } from "./hooks/useAccount";
import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isLoggedIn, hasRole, isBlockedOrSuspended } =
    useAccount();

  useEffect(() => {
    if (isLoading || !isLoggedIn || isBlockedOrSuspended || hasRole) return;
    if (location.pathname === "/select-role") return;
    navigate("/select-role", { replace: true });
  }, [
    isBlockedOrSuspended,
    isLoading,
    isLoggedIn,
    hasRole,
    location.pathname,
    navigate,
  ]);

  return (
    <CommonLayout>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </CommonLayout>
  );
}

export default App;
