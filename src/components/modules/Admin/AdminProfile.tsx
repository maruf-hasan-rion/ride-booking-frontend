import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import Loader from "@/assets/icons/loader/Loader";
import { ChangePasswordCard } from "@/components/shared/account/ChangePasswordCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useUpdateUserProfileMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { getApiErrorMessage } from "@/utils/apiResponse";
import { validateName, validatePhone } from "@/utils/formValidation";

type AdminProfileFormState = {
  name: string;
  contactNo: string;
  email: string;
};

const INITIAL_PROFILE_STATE: AdminProfileFormState = {
  name: "",
  contactNo: "",
  email: "",
};

export const AdminProfile = () => {
  const [profile, setProfile] = useState<AdminProfileFormState>(INITIAL_PROFILE_STATE);

  const { data: userResponse, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  useEffect(() => {
    const user = userResponse?.data;
    if (!user) return;

    setProfile({
      name: user.name || "",
      contactNo: user.contactNo || "",
      email: user.email || "",
    });
  }, [userResponse]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userId = userResponse?.data?._id;
    if (!userId) {
      toast.error("Admin profile not found.");
      return;
    }

    const nameError = validateName(profile.name);
    if (nameError) {
      toast.error(nameError);
      return;
    }

    const phoneError = validatePhone(profile.contactNo);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    try {
      await updateProfile({
        id: userId,
        data: {
          name: profile.name,
          contactNo: profile.contactNo,
        },
      }).unwrap();
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile."));
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
            <CardDescription>Update your account information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNo">Phone Number</Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  value={profile.contactNo}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email} disabled />
              </div>

              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <ChangePasswordCard />
      </div>
    </div>
  );
};
