/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL_DEV?: string;
  readonly VITE_API_URL_PROD?: string;
  readonly VITE_ENABLE_DEMO_LOGIN?: string;
  readonly VITE_ORS_API_KEY?: string;
  readonly VITE_DEMO_ADMIN_EMAIL?: string;
  readonly VITE_DEMO_ADMIN_PASSWORD?: string;
  readonly VITE_DEMO_DRIVER_EMAIL?: string;
  readonly VITE_DEMO_DRIVER_PASSWORD?: string;
  readonly VITE_DEMO_RIDER_EMAIL?: string;
  readonly VITE_DEMO_RIDER_PASSWORD?: string;
}
