import { describe, expect, it } from "vitest";
import { getCurrentDriverIncome, getDhakaPeriodKeys } from "./rideStats";

const NOW = new Date("2026-10-22T12:00:00.000Z");

describe("getDhakaPeriodKeys", () => {
  it("uses the Dhaka calendar day, month and ISO week", () => {
    expect(getDhakaPeriodKeys(NOW)).toEqual({
      dayKey: "2026-10-22",
      monthKey: "2026-10",
      isoYear: 2026,
      isoWeek: 43,
    });
  });
});

describe("getCurrentDriverIncome", () => {
  it("only sums the current day, ISO week and month buckets", () => {
    const income = getCurrentDriverIncome(
      [
        { _id: "2026-10-22", totalIncome: 500 },
        { _id: "2026-10-21", totalIncome: 300 },
      ],
      [
        { _id: { year: 2026, week: 43 }, totalIncome: 1200 },
        { _id: { year: 2026, week: 42 }, totalIncome: 900 },
      ],
      [
        { _id: "2026-10", totalIncome: 4000 },
        { _id: "2026-09", totalIncome: 3500 },
      ],
      NOW,
    );

    expect(income).toEqual({ daily: 500, weekly: 1200, monthly: 4000 });
  });

  it("returns zeros when the current periods have no buckets", () => {
    expect(getCurrentDriverIncome([], [], [], NOW)).toEqual({
      daily: 0,
      weekly: 0,
      monthly: 0,
    });
  });
});
