import { describe, expect, it } from "vitest";
import { extractArrayData, extractData, extractMeta, getApiErrorMessage } from "./apiResponse";

describe("extractData", () => {
  it("unwraps the standard envelope", () => {
    const response = { statusCode: 200, data: { name: "rider" } };
    expect(extractData<{ name: string }>(response)).toEqual({ name: "rider" });
  });

  it("unwraps nested data.data only when no meta accompanies it", () => {
    expect(extractData({ data: { data: [1, 2] } })).toEqual([1, 2]);
    expect(extractData({ data: { data: [1], meta: { total: 9 } } })).toEqual({
      data: [1],
      meta: { total: 9 },
    });
  });

  it("handles missing payloads", () => {
    expect(extractData(null)).toBeNull();
    expect(extractData({})).toBeNull();
  });
});

describe("extractArrayData", () => {
  it("pulls arrays from flat, wrapped and double-wrapped payloads", () => {
    expect(extractArrayData({ data: [1] })).toEqual([1]);
    expect(extractArrayData({ data: { data: [2] } })).toEqual([2]);
    expect(
      extractArrayData({ data: { data: { data: [3] }, meta: {} } }),
    ).toEqual([3]);
  });
});

describe("extractMeta", () => {
  it("reads meta from the outer or inner envelope", () => {
    expect(extractMeta({ data: { meta: { total: 4 } } })).toEqual({ total: 4 });
    expect(extractMeta({ data: 5 })).toBeNull();
  });
});

describe("getApiErrorMessage", () => {
  it("prefers a string body, then the message field", () => {
    expect(getApiErrorMessage({ data: "Oops" }, "fallback")).toBe("Oops");
    expect(
      getApiErrorMessage({ data: { message: "Invalid OTP" } }, "fallback"),
    ).toBe("Invalid OTP");
  });

  it("reads zod-style errorSources arrays", () => {
    const error = {
      data: {
        errorSources: [
          { path: "email", message: "A valid email address is required." },
        ],
      },
    };
    expect(getApiErrorMessage(error, "fallback")).toBe(
      "A valid email address is required.",
    );
  });

  it("falls back when nothing usable is present", () => {
    expect(getApiErrorMessage({ data: null }, "fallback")).toBe("fallback");
    expect(getApiErrorMessage(new Error("boom"), "fallback")).toBe("boom");
  });
});
