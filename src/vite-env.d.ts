/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_DOCTOR_TITLE: string;
  readonly VITE_APP_DOCTOR_LABEL: string;
  readonly VITE_APP_DOCTOR_SPEC: string;
  readonly VITE_APP_STAFF_NAME: string;
  readonly VITE_APP_STAFF_POS: string;
  readonly VITE_APP_HOSPITAL_NAME: string;
  readonly VITE_APP_HOSPITAL_ADDRESS: string;
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
