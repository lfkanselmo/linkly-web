const STORAGE_KEY = 'linkly.my-links';

export function loadMyLinkCodes(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveMyLinkCode(shortCode: string): void {
  const codes = loadMyLinkCodes();
  if (codes.includes(shortCode)) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([shortCode, ...codes]));
  } catch {
    /* localStorage lleno o no disponible: perder el registro local es aceptable, el link igual existe */
  }
}
