import { EmergencyContactsSettings } from "@/components/shared/safety/EmergencyContactsSettings";

export default function UserSafetySettings() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6">
      <EmergencyContactsSettings
        role="RIDER"
        title="Safety Settings"
        description="Manage contacts stored on this device for your rider account. GoMove does not send them to a server."
      />
    </div>
  );
}
