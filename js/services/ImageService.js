// ImageService — reads image manifests and provides helper methods for pages/components

export async function loadManifest(manifestId) {
  try {
    const path = `/images/_manifests/${manifestId}.json`;
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Manifest not found: ${path}`);
    return await res.json();
  } catch (e) {
    console.error('ImageService.loadManifest error', e);
    return null;
  }
}

export function buildImageElement(entry, opts = {}) {
  const img = document.createElement('img');
  img.src = `/images/${entry.file}`;
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
