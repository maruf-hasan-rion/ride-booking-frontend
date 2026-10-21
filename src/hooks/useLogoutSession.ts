import { useCallback } from "react";
import { useNavigate } from "react-router";
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { useToastAction } from "@/hooks/useToastAction";

/** Clears the authenticated session: logs out through the API, resets the
 * RTK Query cache, and returns to the landing page. */
export const useLogoutSession = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const runAction = useToastAction();

  return useCallback(async () => {
    const result = await runAction(() => logout(undefined).unwrap(), {
      success: "Logged out successfully.",
      fallback: "Failed to logout. Please try again.",
    });

    if (result) {
      dispatch(authApi.util.resetApiState());
      navigate("/", { replace: true });
    }
  }, [dispatch, logout, navigate, runAction]);
};
