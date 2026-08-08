const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Sanitize API_URL to fix typos like extra slashes (e.g. https:///) and remove trailing slash
export const API_URL = rawApiUrl
    .trim()
    .replace(/^(https?:\/\/)\/+/i, "$1")
    .replace(/\/+$/, "");
