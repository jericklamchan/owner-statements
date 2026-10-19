import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/db.json');

const DEFAULT_DB = { 
  properties: [], 
  users: [], 
  statements: {} 
};

export function readDb() {
  try {
    if (!fs.existsSync(filePath)) {
      return { ...DEFAULT_DB };
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Handle empty file edge case
    if (!fileContent.trim()) {
      return { ...DEFAULT_DB };
    }

    const data = JSON.parse(fileContent);
    return {
      properties: data.properties || [],
      users: data.users || [],
      statements: data.statements || {},
    };
  } catch (error) {
    console.error('[Database Error] Failed to read or parse db.json, returning fallback:', error);
    return { ...DEFAULT_DB }; // Prevents app crashes from malformed JSON
  }
}

export function writeDb(data: any): boolean {
  try {
    // Ensure the data directory exists before writing
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('[Database Error] Failed to write to db.json:', error);
    return false;
  }
}

export function getCollection(collectionName: 'properties' | 'users' | 'statements') {
  const db = readDb();
  if (collectionName === 'statements') {
    return db.statements;
  }
  return db[collectionName] || [];
}

export function addToCollection(collectionName: 'properties' | 'users', newItem: any) {
  const db = readDb();
  if (!db[collectionName]) db[collectionName] = [];
  db[collectionName].push(newItem);
  
  const success = writeDb(db);
  return success ? newItem : null;
}

export function updateInCollection(collectionName: 'properties' | 'users', id: string, updates: any) {
  const db = readDb();
  const items = db[collectionName] || [];
  const index = items.findIndex((item: any) => item.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], ...updates };
  const success = writeDb(db);
  return success ? items[index] : null;
}

export function deleteFromCollection(collectionName: 'properties' | 'users', id: string): boolean {
  const db = readDb();
  const items = db[collectionName] || [];
  const index = items.findIndex((item: any) => item.id === id);
  if (index === -1) return false;

  items.splice(index, 1);
  return writeDb(db);
}

// Specific helper to save/update the entire statements dictionary
export function saveStatementsCollection(statements: Record<string, any>): boolean {
  const db = readDb();
  db.statements = statements;
  return writeDb(db);
}