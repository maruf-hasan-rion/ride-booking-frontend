import { describe, expect, it } from "vitest";
import { extractArrayData, extractData, extractMeta, getApiErrorMessage } from "./apiResponse";

describe("extractData", () => {
  it("reads the top-level data field", () => {
    const response = { statusCode: 200, data: { name: "rider" } };
    expect(extractData<{ name: string }>(response)).toEqual({ name: "rider" });
  });

  it("does not unwrap legacy nested payloads", () => {
    expect(extractData({ data: { data: [1, 2] } })).toEqual({ data: [1, 2] });
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
  it("reads a top-level data array", () => {
    expect(extractArrayData({ data: [1] })).toEqual([1]);
    expect(extractArrayData({ data: { data: [2] } })).toEqual([]);
    expect(extractArrayData({ data: 5 })).toEqual([]);
  });
});

describe("extractMeta", () => {
  it("reads top-level meta only", () => {
    expect(extractMeta({ data: [], meta: { total: 4 } })).toEqual({ total: 4 });
    expect(extractMeta({ data: { meta: { total: 4 } } })).toBeNull();
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
