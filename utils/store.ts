import fs from 'fs';
import path from 'path';
import { PropertyRecord } from '@/types';
import { PropertyStatement } from '@/types/statement';

const filePath = path.join(process.cwd(), 'src/data/db.json');

export interface UserRecord {
  id: string;
  [key: string]: unknown;
}

export interface DatabaseSchema {
  properties: PropertyRecord[];
  users: UserRecord[];
  statements: Record<string, PropertyStatement>;
}

const DEFAULT_DB: DatabaseSchema = { 
  properties: [], 
  users: [], 
  statements: {} 
};

export function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(filePath)) {
      return { ...DEFAULT_DB };
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    if (!fileContent.trim()) {
      return { ...DEFAULT_DB };
    }

    const data = JSON.parse(fileContent) as Partial<DatabaseSchema>;
    return {
      properties: data.properties || [],
      users: data.users || [],
      statements: data.statements || {},
    };
  } catch (error) {
    console.error('[Database Error] Failed to read or parse db.json, returning fallback:', error);
    return { ...DEFAULT_DB };
  }
}

export function writeDb(data: DatabaseSchema): boolean {
  try {
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

export function getCollection(collectionName: 'properties'): PropertyRecord[];
export function getCollection(collectionName: 'users'): UserRecord[];
export function getCollection(collectionName: 'statements'): Record<string, PropertyStatement>;
export function getCollection(collectionName: 'properties' | 'users' | 'statements') {
  const db = readDb();
  if (collectionName === 'statements') {
    return db.statements;
  }
  return db[collectionName] || [];
}

export function addToCollection(collectionName: 'properties', newItem: PropertyRecord): PropertyRecord | null;
export function addToCollection(collectionName: 'users', newItem: UserRecord): UserRecord | null;
export function addToCollection(collectionName: 'properties' | 'users', newItem: PropertyRecord | UserRecord) {
  const db = readDb();
  if (!db[collectionName]) db[collectionName] = [];
  (db[collectionName] as Array<PropertyRecord | UserRecord>).push(newItem);
  
  const success = writeDb(db);
  return success ? newItem : null;
}

export function updateInCollection(collectionName: 'properties', id: string, updates: Partial<PropertyRecord>): PropertyRecord | null;
export function updateInCollection(collectionName: 'users', id: string, updates: Partial<UserRecord>): UserRecord | null;
export function updateInCollection(collectionName: 'properties' | 'users', id: string, updates: Partial<PropertyRecord> | Partial<UserRecord>) {
  const db = readDb();
  
  if (collectionName === 'properties') {
    const items = db.properties;
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem: PropertyRecord = { 
      ...items[index], 
      ...(updates as Partial<PropertyRecord>) 
    };
    items[index] = updatedItem;
    
    const success = writeDb(db);
    return success ? updatedItem : null;
  } else {
    const items = db.users;
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem: UserRecord = { 
      ...items[index], 
      ...(updates as Partial<UserRecord>) 
    };
    items[index] = updatedItem;
    
    const success = writeDb(db);
    return success ? updatedItem : null;
  }
}

export function deleteFromCollection(collectionName: 'properties' | 'users', id: string): boolean {
  const db = readDb();
  const items = db[collectionName] || [];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return false;

  items.splice(index, 1);
  return writeDb(db);
}

export function saveStatementsCollection(statements: Record<string, PropertyStatement>): boolean {
  const db = readDb();
  db.statements = statements;
  return writeDb(db);
}