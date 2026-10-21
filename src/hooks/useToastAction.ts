import { useCallback } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiResponse";

interface ToastActionOptions<T> {
  /** Message (or builder) shown after the action succeeds. */
  success?: string | ((result: T) => string);
  /** Extra side effects on success (navigation, refetches, ...). */
  onSuccess?: (result: T) => void;
  /** Message shown when the action fails, unless the API supplies one. */
  fallback: string;
}

/** The shared unwrap()/toast skeleton used by every mutation handler:
 * run the call, toast the success, otherwise toast the API message. */
export const useToastAction = () =>
  useCallback(
    async <T,>(
      action: () => Promise<T>,
      { success, onSuccess, fallback }: ToastActionOptions<T>,
    ): Promise<T | null> => {
      try {
        const result = await action();

        if (success) {
          toast.success(
            typeof success === "function" ? success(result) : success,
          );
        }

        onSuccess?.(result);
        return result;
      } catch (error) {
        toast.error(getApiErrorMessage(error, fallback));
        return null;
      }
    },
    [],
  );
