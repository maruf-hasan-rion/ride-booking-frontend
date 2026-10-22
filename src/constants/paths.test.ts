import { describe, expect, it } from "vitest";
import {
  DASHBOARD_PATH_BY_ROLE,
  HISTORY_PATH_BY_ROLE,
  PROFILE_PATH_BY_ROLE,
  SAFETY_PATH_BY_ROLE,
  getPathByRole,
} from "./paths";

describe("getPathByRole", () => {
  it("routes each role to its dashboard", () => {
    expect(getPathByRole("RIDER", DASHBOARD_PATH_BY_ROLE)).toBe("/user/dashboard");
    expect(getPathByRole("DRIVER", DASHBOARD_PATH_BY_ROLE)).toBe("/driver/dashboard");
    expect(getPathByRole("ADMIN", DASHBOARD_PATH_BY_ROLE)).toBe("/admin/dashboard");
    expect(getPathByRole("SUPER_ADMIN", DASHBOARD_PATH_BY_ROLE)).toBe("/admin/dashboard");
  });

  it("maps history, profile and safety targets consistently", () => {
    expect(getPathByRole("RIDER", HISTORY_PATH_BY_ROLE)).toBe("/user/dashboard/history");
    expect(getPathByRole("DRIVER", PROFILE_PATH_BY_ROLE)).toBe("/driver/dashboard/profile");
    expect(getPathByRole("RIDER", SAFETY_PATH_BY_ROLE)).toBe("/user/dashboard/safety");
  });

  it("falls back to the landing page for unknown roles", () => {
    expect(getPathByRole("HACKER", DASHBOARD_PATH_BY_ROLE)).toBe("/");
    expect(getPathByRole(undefined, DASHBOARD_PATH_BY_ROLE)).toBe("/");
  });
});
