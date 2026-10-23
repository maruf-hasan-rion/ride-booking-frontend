const readOptionalEnv = (key: keyof ImportMetaEnv): string | undefined => {
  const value = import.meta.env[key];
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const readBooleanEnv = (key: keyof ImportMetaEnv): boolean | undefined => {
  const value = readOptionalEnv(key);
  if (!value) return undefined;

  const normalized = value.toLowerCase();
  if (normalized === "true" || normalized === "1") return true;
  if (normalized === "false" || normalized === "0") return false;
  return undefined;
};

const resolveBaseUrl = (): string => {
  const devBaseUrl = readOptionalEnv("VITE_API_URL_DEV");
  const prodBaseUrl = readOptionalEnv("VITE_API_URL_PROD");
  const modeBasedUrl = import.meta.env.PROD ? prodBaseUrl : devBaseUrl;

  if (!modeBasedUrl) {
    const missingKey = import.meta.env.PROD
      ? "VITE_API_URL_PROD"
      : "VITE_API_URL_DEV";
    throw new Error(`Missing required environment variable: ${missingKey}`);
  }

  return modeBasedUrl;
};

const resolveDemoLoginEnabled = (): boolean => {
  const explicitValue = readBooleanEnv("VITE_ENABLE_DEMO_LOGIN");
  if (explicitValue !== undefined) return explicitValue;
  return !import.meta.env.PROD;
};

const config = {
  baseUrl: resolveBaseUrl(),
  isDemoLoginEnabled: resolveDemoLoginEnabled(),
  demoCredentials: {
    admin: {
      email: readOptionalEnv("VITE_DEMO_ADMIN_EMAIL"),
      password: readOptionalEnv("VITE_DEMO_ADMIN_PASSWORD"),
    },
    driver: {
      email: readOptionalEnv("VITE_DEMO_DRIVER_EMAIL"),
      password: readOptionalEnv("VITE_DEMO_DRIVER_PASSWORD"),
    },
    rider: {
      email: readOptionalEnv("VITE_DEMO_RIDER_EMAIL"),
      password: readOptionalEnv("VITE_DEMO_RIDER_PASSWORD"),
    },
  },
};

export default config;
