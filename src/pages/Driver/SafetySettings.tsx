import { EmergencyContactsSettings } from "@/components/shared/safety/EmergencyContactsSettings";

export default function DriverSafetySettings() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <EmergencyContactsSettings
        role="DRIVER"
        title="Safety Settings"
        description="Manage contacts stored on this device for your driver account. GoMove does not send them to a server."
      />
    </div>
  );
}
