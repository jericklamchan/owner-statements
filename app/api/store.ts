import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/db.json');

export function readDb() {
  if (!fs.existsSync(filePath)) return { properties: [], users: [] };
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export function writeDb(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- DRY Collection Helpers ---
export function getCollection(collectionName: 'properties' | 'users') {
  const db = readDb();
  return db[collectionName] || [];
}

export function addToCollection(collectionName: 'properties' | 'users', newItem: any) {
  const db = readDb();
  if (!db[collectionName]) db[collectionName] = [];
  db[collectionName].push(newItem);
  writeDb(db);
  return newItem;
}

export function updateInCollection(collectionName: 'properties' | 'users', id: string, updates: any) {
  const db = readDb();
  const items = db[collectionName] || [];
  const index = items.findIndex((item: any) => item.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], ...updates };
  writeDb(db);
  return items[index];
}

export function deleteFromCollection(collectionName: 'properties' | 'users', id: string) {
  const db = readDb();
  const items = db[collectionName] || [];
  const index = items.findIndex((item: any) => item.id === id);
  if (index === -1) return false;

  items.splice(index, 1);
  writeDb(db);
  return true;
}