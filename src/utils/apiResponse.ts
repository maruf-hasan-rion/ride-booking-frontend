import type { PaginatedMeta } from "@/types/domain";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const readFirstArrayMessage = (value: unknown): string | null => {
  if (!Array.isArray(value)) return null;

  for (const item of value) {
    if (typeof item === "string" && item.trim()) {
      return item;
    }

    if (isRecord(item) && typeof item.message === "string" && item.message.trim()) {
      return item.message;
    }
  }

  return null;
};

const readEnvelopeData = (value: unknown): unknown => {
  if (!isRecord(value) || !("data" in value)) {
    return null;
  }

  return value.data;
};

export const extractData = <T>(response: unknown): T | null => {
  const payload = readEnvelopeData(response);

  if (payload === null || payload === undefined) {
    return null;
  }

  if (isRecord(payload) && "data" in payload && !("meta" in payload)) {
    return payload.data as T;
  }

  return payload as T;
};

export const extractArrayData = <T>(response: unknown): T[] => {
  const payload = readEnvelopeData(response);

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (isRecord(payload) && Array.isArray(payload.data)) {
    return payload.data as T[];
  }

  if (isRecord(payload) && isRecord(payload.data) && Array.isArray(payload.data.data)) {
    return payload.data.data as T[];
  }

  return [];
};

export const extractMeta = (response: unknown): PaginatedMeta | null => {
  const payload = readEnvelopeData(response);

  if (isRecord(payload) && isRecord(payload.meta)) {
    return payload.meta as PaginatedMeta;
  }

  if (isRecord(payload) && isRecord(payload.data) && isRecord(payload.data.meta)) {
    return payload.data.meta as PaginatedMeta;
  }

  return null;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!isRecord(error)) {
    return fallback;
  }

  const errorData = error.data;

  if (typeof errorData === "string" && errorData.trim()) {
    return errorData;
  }

  const directArrayMessage = readFirstArrayMessage(errorData);
  if (directArrayMessage) {
    return directArrayMessage;
  }

  if (isRecord(errorData) && typeof errorData.message === "string" && errorData.message.trim()) {
    return errorData.message;
  }

  if (isRecord(errorData)) {
    const nestedArrayMessage =
      readFirstArrayMessage(errorData.errorSources) ||
      readFirstArrayMessage(errorData.issues) ||
      readFirstArrayMessage(errorData.errors);

    if (nestedArrayMessage) {
      return nestedArrayMessage;
    }
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
};
