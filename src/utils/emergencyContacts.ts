export type EmergencyContactRole = "RIDER" | "DRIVER";

const STORAGE_KEY_PREFIX = "gomove-emergency-contacts";

export const getEmergencyContactsStorageKey = (
  userId: string,
  role: EmergencyContactRole,
) => `${STORAGE_KEY_PREFIX}-${userId}-${role.toLowerCase()}`;
