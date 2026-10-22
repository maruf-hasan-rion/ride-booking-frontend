const DHAKA_TIMEZONE = "Asia/Dhaka";

export type IncomeBucket = {
  _id?: string;
  totalIncome?: number;
  totalRides?: number;
};

export type WeeklyIncomeBucket = {
  _id?: {
    year?: number;
    week?: number;
  };
  totalIncome?: number;
  totalRides?: number;
};

export type DriverPeriodIncome = {
  daily: number;
  weekly: number;
  monthly: number;
};

const getDhakaParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DHAKA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const valueOf = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: valueOf("year"),
    month: valueOf("month"),
    day: valueOf("day"),
  };
};

export const getDhakaPeriodKeys = (date = new Date()) => {
  const { year, month, day } = getDhakaParts(date);
  const dayKey = `${year}-${month}-${day}`;

  // ISO week, computed from the Dhaka calendar date to avoid local-time drift.
  const utc = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );
  const isoDay = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - isoDay);
  const isoYear = utc.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );

  return {
    dayKey,
    monthKey: `${year}-${month}`,
    isoYear,
    isoWeek: week,
  };
};

export const getCurrentDriverIncome = (
  daily: IncomeBucket[] = [],
  weekly: WeeklyIncomeBucket[] = [],
  monthly: IncomeBucket[] = [],
  now = new Date(),
): DriverPeriodIncome => {
  const { dayKey, monthKey, isoYear, isoWeek } = getDhakaPeriodKeys(now);

  return {
    daily: daily
      .filter((bucket) => bucket._id === dayKey)
      .reduce((sum, bucket) => sum + (bucket.totalIncome || 0), 0),
    weekly: weekly
      .filter(
        (bucket) =>
          bucket._id?.year === isoYear && bucket._id?.week === isoWeek,
      )
      .reduce((sum, bucket) => sum + (bucket.totalIncome || 0), 0),
    monthly: monthly
      .filter((bucket) => bucket._id === monthKey)
      .reduce((sum, bucket) => sum + (bucket.totalIncome || 0), 0),
  };
};
