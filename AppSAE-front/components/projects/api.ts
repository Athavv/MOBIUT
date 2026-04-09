import { apiBaseUrl } from "../../theme";
import type { Sae, SaeProjectResponse, Groupe, Ue } from "./types";

export async function fetchSaes(): Promise<Sae[]> {
  const response = await fetch(`${apiBaseUrl}/sae/public/all`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchSaeById(id: number): Promise<Sae | null> {
  const response = await fetch(`${apiBaseUrl}/sae/public/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function fetchSaesByDomain(domain: string): Promise<Sae[]> {
  const response = await fetch(`${apiBaseUrl}/sae/public/by-domain?domain=${encodeURIComponent(domain)}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchProjectsBySaeId(saeId: number): Promise<SaeProjectResponse[]> {
  const response = await fetch(`${apiBaseUrl}/sae/public/${saeId}/projects`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchProjectsByYear(year: string): Promise<SaeProjectResponse[]> {
  const response = await fetch(`${apiBaseUrl}/sae-project/public/by-year?year=${encodeURIComponent(year)}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchProjectsByDomain(domain: string): Promise<SaeProjectResponse[]> {
  const response = await fetch(`${apiBaseUrl}/sae-project/public/by-domain?domain=${encodeURIComponent(domain)}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchProjectById(id: number): Promise<SaeProjectResponse | null> {
  const response = await fetch(`${apiBaseUrl}/sae-project/public/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function fetchGroupes(): Promise<Groupe[]> {
  const response = await fetch(`${apiBaseUrl}/groupe/public/all`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchUes(): Promise<Ue[]> {
  const response = await fetch(`${apiBaseUrl}/ue/public/all`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function createSae(token: string, payload: { title: string; description: string; domain: string; semester: string; startDate: string; endDate: string; ueId?: number | null; imageUrl?: string | null }): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(`${apiBaseUrl}/sae/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return { ok: response.ok };
  } catch {
    return { ok: false };
  }
}

export async function createGroupe(token: string, payload: { name: string; year: string }): Promise<{ ok: boolean; id?: number }> {
  try {
    const response = await fetch(`${apiBaseUrl}/groupe/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    if (!response.ok) return { ok: false };
    const data = await response.json();
    return { ok: true, id: data.id };
  } catch {
    return { ok: false };
  }
}

export async function createUe(token: string, payload: { code: string; name: string }): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(`${apiBaseUrl}/ue/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return { ok: response.ok };
  } catch {
    return { ok: false };
  }
}

export async function createSaeProject(token: string, payload: { saeId: number; groupeId: number; imageUrls: string[]; humanResources: string; websiteUrl: string; sourceCodeUrl: string; studentGrades: number[] }): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(`${apiBaseUrl}/sae-project/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return { ok: response.ok };
  } catch {
    return { ok: false };
  }
}

export async function uploadImage(uri: string, webFile?: unknown): Promise<string | null> {
  const formData = new FormData();

  if (webFile && typeof webFile === "object") {
    // Web: use the File object directly (from expo-image-picker on web)
    formData.append("file", webFile as File);
  } else {
    // Native: use URI approach
    const lower = uri.toLowerCase();
    const isPng = lower.endsWith(".png") || lower.includes("image/png");
    formData.append("file", {
      uri,
      type: isPng ? "image/png" : "image/jpeg",
      name: isPng ? "photo.png" : "photo.jpg",
    } as unknown as Blob);
  }

  try {
    const response = await fetch(`${apiBaseUrl}/public/images/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) return null;
    const text = await response.text();
    return text.startsWith("http") ? text : null;
  } catch {
    return null;
  }
}
