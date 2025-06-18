/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  // Add other VITE_ environment variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
