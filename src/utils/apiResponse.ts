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

export const extractData = <T>(response: unknown): T | null => {
  if (!isRecord(response) || !("data" in response)) {
    return null;
  }

  return (response.data as T) ?? null;
};

export const extractArrayData = <T>(response: unknown): T[] => {
  if (!isRecord(response) || !Array.isArray(response.data)) {
    return [];
  }

  return response.data as T[];
};

export const extractMeta = (response: unknown): PaginatedMeta | null => {
  if (!isRecord(response) || !isRecord(response.meta)) {
    return null;
  }

  return response.meta as PaginatedMeta;
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
