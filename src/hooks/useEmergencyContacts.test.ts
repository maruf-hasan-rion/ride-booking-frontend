import { describe, expect, it } from "vitest";
import { getEmergencyContactsStorageKey } from "./useEmergencyContacts";

describe("emergency contact storage scope", () => {
  it("isolates contacts by user and role", () => {
    const riderKey = getEmergencyContactsStorageKey("user-a", "RIDER");
    const sameUserDriverKey = getEmergencyContactsStorageKey("user-a", "DRIVER");
    const otherUserKey = getEmergencyContactsStorageKey("user-b", "RIDER");

    expect(riderKey).not.toBe(sameUserDriverKey);
    expect(riderKey).not.toBe(otherUserKey);
    expect(riderKey).toContain("user-a");
    expect(otherUserKey).toContain("user-b");
  });
});
