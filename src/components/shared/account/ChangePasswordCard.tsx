import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  authApi,
  useChangePasswordMutation,
  useLogoutMutation,
} from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { getApiErrorMessage } from "@/utils/apiResponse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePasswordStrength } from "@/utils/formValidation";

type ChangePasswordState = {
  oldPassword: string;
  newPassword: string;
};

export const ChangePasswordCard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [passwords, setPasswords] = useState<ChangePasswordState>({
    oldPassword: "",
    newPassword: "",
  });
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [logout] = useLogoutMutation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswords((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwords.oldPassword.trim()) {
      toast.error("Current password is required.");
      return;
    }

    const passwordError = validatePasswordStrength(passwords.newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      await changePassword(passwords).unwrap();
      toast.success("Password changed. Please log in again.");
      setPasswords({ oldPassword: "", newPassword: "" });

      // The backend increments tokenVersion, so the current session is no
      // longer valid. Clear the cookies/cache and return to login.
      await logout(undefined).unwrap().catch(() => undefined);
      dispatch(authApi.util.resetApiState());
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to change password. Please try again.")
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Keep your account secure with a strong password.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={passwords.oldPassword}
              onChange={handleChange}
              placeholder="Enter current password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handleChange}
              placeholder="Enter new password (min 8 characters)"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
