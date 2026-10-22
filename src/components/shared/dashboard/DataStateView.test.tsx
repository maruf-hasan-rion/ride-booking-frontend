import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataStateView } from "./DataStateView";

describe("DataStateView", () => {
  it("renders an error and calls the retry action", async () => {
    const onRetry = vi.fn();

    render(
      <DataStateView
        isLoading={false}
        hasData={false}
        errorMessage="Boom"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("Boom")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("shows the empty message when there is no error", () => {
    render(
      <DataStateView
        isLoading={false}
        hasData={false}
        emptyMessage="Nothing here"
      />,
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });
});
