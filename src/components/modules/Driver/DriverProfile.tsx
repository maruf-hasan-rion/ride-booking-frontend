import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChangePasswordCard } from "@/components/shared/account/ChangePasswordCard";
import { StatusBadge } from "@/components/shared/dashboard/StatusBadge";
import {
  useUserInfoQuery,
  useUpdateUserProfileMutation,
} from "@/redux/features/auth/auth.api";
import {
  useCreateDriverProfileMutation,
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
} from "@/redux/features/driver/driver.api";
import { extractData, getApiErrorMessage } from "@/utils/apiResponse";
import { validateName, validatePhone, validateVehicleInfo } from "@/utils/formValidation";

type DriverProfileState = {
  isOnline?: boolean;
  isApproved?: boolean;
  vehicleInfo?: string;
};

type UserProfileForm = {
  name: string;
  contactNo: string;
  email: string;
};

const INITIAL_FORM: UserProfileForm = {
  name: "",
  contactNo: "",
  email: "",
};

export const DriverProfile = () => {
  const { data: userResponse, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  const { data: driverResponse, isLoading: isDriverLoading } = useGetDriverProfileQuery(undefined);

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [createDriverProfile, { isLoading: isCreatingDriverProfile }] =
    useCreateDriverProfileMutation();
  const [updateDriverProfile, { isLoading: isUpdatingDriverProfile }] =
    useUpdateDriverProfileMutation();

  const [profileForm, setProfileForm] = useState<UserProfileForm>(INITIAL_FORM);
  const [vehicleInfoInput, setVehicleInfoInput] = useState("");

  const user = userResponse?.data;
  const driverProfile = extractData<DriverProfileState>(driverResponse);

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user.name || "",
      contactNo: user.contactNo || "",
      email: user.email || "",
    });
  }, [user]);

  useEffect(() => {
    setVehicleInfoInput(driverProfile?.vehicleInfo || "");
  }, [driverProfile?.vehicleInfo]);

  const handleProfileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userId = user?._id;
    if (!userId) {
      toast.error("User profile not found.");
      return;
    }

    const nameError = validateName(profileForm.name);
    if (nameError) {
      toast.error(nameError);
      return;
    }

    const phoneError = validatePhone(profileForm.contactNo);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    try {
      await updateProfile({
        id: userId,
        data: {
          name: profileForm.name,
          contactNo: profileForm.contactNo,
        },
      }).unwrap();

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update profile."));
    }
  };

  const handleVehicleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateVehicleInfo(vehicleInfoInput);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const payload = vehicleInfoInput.trim();

      if (hasDriverProfile) {
        await updateDriverProfile(payload).unwrap();
        toast.success("Vehicle details updated successfully.");
      } else {
        await createDriverProfile(payload).unwrap();
        toast.success("Vehicle details saved successfully.");
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save vehicle details."));
    }
  };

  if (isUserLoading || isDriverLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const hasDriverProfile = Boolean(driverProfile);
  const accountStatus =
    typeof user?.status === "string" && user.status.trim()
      ? user.status
      : hasDriverProfile
        ? driverProfile?.isApproved
          ? "ACTIVE"
          : "PENDING"
        : "PENDING";

  return (
    <div className="container mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Driver Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your contact information, vehicle profile, and account security.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={accountStatus} />
          <StatusBadge
            status={hasDriverProfile ? (driverProfile?.isOnline ? "ONLINE" : "OFFLINE") : "N/A"}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileInput}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact Number</Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  value={profileForm.contactNo}
                  onChange={handleProfileInput}
                  placeholder="Enter your contact number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profileForm.email} disabled />
              </div>

              <Button type="submit" className="w-full" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVehicleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleInfo">Vehicle Info</Label>
                <Textarea
                  id="vehicleInfo"
                  value={vehicleInfoInput}
                  onChange={(event) => setVehicleInfoInput(event.target.value)}
                  placeholder="Example: Toyota Axio, White, DHAKA METRO-11-2233"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Include your vehicle model, color, and registration number in one clear line.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isCreatingDriverProfile || isUpdatingDriverProfile}
              >
                {isCreatingDriverProfile || isUpdatingDriverProfile
                  ? "Saving..."
                  : hasDriverProfile
                    ? "Update Vehicle Details"
                    : "Save Vehicle Details"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <ChangePasswordCard />
    </div>
  );
};
