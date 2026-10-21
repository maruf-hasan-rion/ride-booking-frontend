import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChangePasswordCard } from "@/components/shared/account/ChangePasswordCard";
import { useAccount } from "@/hooks/useAccount";
import { useToastAction } from "@/hooks/useToastAction";
import { useUpdateUserProfileMutation } from "@/redux/features/auth/auth.api";
import { validateName, validatePhone } from "@/utils/formValidation";

type UserProfileFormState = {
  name: string;
  contactNo: string;
  email: string;
  createdAt: string;
};

const INITIAL_PROFILE_STATE: UserProfileFormState = {
  name: "",
  contactNo: "",
  email: "",
  createdAt: "",
};

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfileFormState>(INITIAL_PROFILE_STATE);

  const { user } = useAccount();
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();
  const runAction = useToastAction();

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.name || "",
      contactNo: user.contactNo || "",
      email: user.email || "",
      createdAt: user.createdAt || "",
    });
  }, [user]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const userId = user?._id;
    if (!userId) {
      toast.error("Unable to find user profile.");
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

    const result = await runAction(
      () =>
        updateProfile({
          id: userId,
          data: {
            name: profile.name,
            contactNo: profile.contactNo,
          },
        }).unwrap(),
      {
        success: "Profile updated successfully.",
        fallback: "Failed to update profile.",
      },
    );

    if (result) {
      setIsEditing(false);
    }
  };

  const memberSince = profile.createdAt ? profile.createdAt.slice(0, 10) : "N/A";

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </div>
              <Button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    void handleProfileSubmit();
                    return;
                  }
                  setIsEditing(true);
                }}
              >
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {profile.name?.trim()?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{profile.name || "User"}</p>
                  <p className="text-sm text-muted-foreground">Member since {memberSince}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNo">Phone Number</Label>
                  <Input
                    id="contactNo"
                    name="contactNo"
                    value={profile.contactNo}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={profile.email} disabled />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!isEditing || isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <ChangePasswordCard />
      </div>
    </div>
  );
}

