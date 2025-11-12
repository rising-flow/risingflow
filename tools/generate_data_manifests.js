#!/usr/bin/env node
// Simple manifest generator for Rising Flow data folder
// Usage: node tools/generate_data_manifests.js
// It will scan data/events/upcoming and data/events/past folders and create data/_manifests/events.json

const fs = require('fs');
const path = require('path');

const dataRoot = path.join(__dirname, '..', 'data');
const manifestsDir = path.join(dataRoot, '_manifests');

function listFolders(p) {
  try {
    return fs.readdirSync(p).filter(f => fs.statSync(path.join(p, f)).isDirectory());
  } catch (e) {
    return [];
  }
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function main() {
  ensureDir(manifestsDir);

  const upcomingDir = path.join(dataRoot, 'events', 'upcoming');
  const pastDir = path.join(dataRoot, 'events', 'past');

  const upcoming = listFolders(upcomingDir);
  const past = listFolders(pastDir);

  const manifest = { upcoming, past };
  fs.writeFileSync(path.join(manifestsDir, 'events.json'), JSON.stringify(manifest, null, 2));
  console.log('Wrote data/_manifests/events.json');
}

main();