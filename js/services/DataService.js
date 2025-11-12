// DataService — small helper for loading JSON data and manifests

export async function fetchJson(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path} — ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('DataService.fetchJson error', e);
    return null;
  }
}

export default { fetchJson };