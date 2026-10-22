import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the humanized label for a known status", () => {
    render(<StatusBadge status="IN_TRANSIT" />);
    expect(screen.getByText("IN TRANSIT")).toBeInTheDocument();
  });

  it("uses token classes, so dark mode needs no extra variants", () => {
    render(<StatusBadge status="COMPLETED" />);
    const badge = screen.getByText("COMPLETED").closest("[data-slot]");
    expect(badge?.className).toContain("bg-primary/10");
    expect(badge?.className).toContain("text-primary");
    expect(badge?.className).not.toContain("bg-emerald");
  });

  it("marks destructive statuses with the destructive token", () => {
    render(<StatusBadge status="CANCELLED" />);
    expect(screen.getByText("CANCELLED")).toBeInTheDocument();
    const badge = screen.getByText("CANCELLED").closest("[data-slot]");
    expect(badge?.className).toContain("text-destructive");
  });
});
