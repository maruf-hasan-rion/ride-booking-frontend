import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "@/hooks/useAccount";
import { getEmergencyContactsStorageKey } from "@/utils/emergencyContacts";

export type EmergencyRole = "RIDER" | "DRIVER";

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
};

const parseContacts = (value: string | null): EmergencyContact[] => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is EmergencyContact => {
      if (!item || typeof item !== "object") return false;

      const candidate = item as Record<string, unknown>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.phone === "string"
      );
    });
  } catch {
    return [];
  }
};

const persistContacts = (storageKey: string, contacts: EmergencyContact[]) => {
  localStorage.setItem(storageKey, JSON.stringify(contacts));
};

export const useEmergencyContacts = (role: EmergencyRole) => {
  const { user } = useAccount();
  const userId = user?._id;
  const storageKey = useMemo(
    () => (userId ? getEmergencyContactsStorageKey(userId, role) : null),
    [role, userId],
  );
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !storageKey) {
      setContacts([]);
      return;
    }
    setContacts(parseContacts(localStorage.getItem(storageKey)));
  }, [storageKey]);

  const saveContacts = useCallback(
    (nextContacts: EmergencyContact[]) => {
      setContacts(nextContacts);
      if (storageKey) {
        persistContacts(storageKey, nextContacts);
      }
    },
    [storageKey]
  );

  const upsertContact = useCallback(
    (payload: Omit<EmergencyContact, "id">, id?: string) => {
      const nextContact: EmergencyContact = {
        id: id || `ec-${Date.now()}`,
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        relationship: payload.relationship?.trim() || "",
      };

      const nextContacts = id
        ? contacts.map((contact) =>
            contact.id === id ? nextContact : contact
          )
        : [...contacts, nextContact];

      saveContacts(nextContacts);
      return nextContact;
    },
    [contacts, saveContacts]
  );

  const removeContact = useCallback(
    (id: string) => {
      const nextContacts = contacts.filter((contact) => contact.id !== id);
      saveContacts(nextContacts);
    },
    [contacts, saveContacts]
  );

  return {
    contacts,
    upsertContact,
    removeContact,
  };
};
