// ImageService — reads image manifests and provides helper methods for pages/components

export async function loadManifest(manifestId) {
  try {
    // Try domain root first (works for custom domains)
    const path = `${location.origin}/images/_manifests/${manifestId}.json`;
    console.debug(`[ImageService] Trying manifest: ${path}`);
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Manifest not found: ${path}`);
    const data = await res.json();
    console.debug(`[ImageService] Manifest loaded: ${manifestId}`);
    return data;
  } catch (e) {
    console.error('ImageService.loadManifest error', e);
    return null;
  }
}

export function buildImageElement(entry, opts = {}) {
  const img = document.createElement('img');
  img.src = `${location.origin}/images/${entry.file}`;
  img.alt = entry.alt || '';
  if (opts.className) img.className = opts.className;
  if (opts.dataset) {
    Object.keys(opts.dataset).forEach(k => img.dataset[k] = opts.dataset[k]);
  }
  return img;
}

export default {
  loadManifest,
  buildImageElement
};
