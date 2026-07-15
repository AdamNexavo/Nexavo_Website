export interface AdminSettings {
  displayName: string;
  accentColor: string;
  companyLabel: string;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  displayName: "Admin",
  accentColor: "#7547F8",
  companyLabel: "Nexavo",
};

const KEY = "nexavo_admin_settings";

export function getAdminSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export function saveAdminSettings(settings: AdminSettings): void {
  localStorage.setItem(KEY, JSON.stringify(settings));
}
