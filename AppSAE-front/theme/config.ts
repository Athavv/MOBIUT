const env = process.env.EXPO_PUBLIC_API_BASE_URL;
export const apiBaseUrl = env?.trim()
  ? env.trim().replace(/\/+$/, "")
  : "http://localhost:8080/api";
