import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { readDb, writeDb, getCollection, addToCollection } from './store';

describe('Database Store Utility', () => {
  const testDbPath = path.join(process.cwd(), 'src/data/db.json');
  let backupContent: string | null = null;

  beforeEach(() => {
    // Backup existing db.json if it exists so we don't lose dev data
    if (fs.existsSync(testDbPath)) {
      backupContent = fs.readFileSync(testDbPath, 'utf-8');
    }
  });

  afterEach(() => {
    // Restore original db.json after each test
    if (backupContent !== null) {
      fs.writeFileSync(testDbPath, backupContent, 'utf-8');
      backupContent = null;
    } else if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('should return default structure when db.json does not exist', () => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }

    const db = readDb();
    expect(db).toEqual({
      properties: [],
      users: [],
      statements: {},
    });
  });

  it('should successfully write and read back collection data', () => {
    const testData = {
      properties: [{ id: 'prop-1', name: 'Sunset Villa' }],
      users: [],
      statements: {},
    };

    const written = writeDb(testData);
    expect(written).toBe(true);

    const properties = getCollection('properties');
    expect(properties).toEqual([{ id: 'prop-1', name: 'Sunset Villa' }]);
  });

  it('should add items to a collection correctly', () => {
    writeDb({ properties: [], users: [], statements: {} });

    const newItem = { id: 'prop-2', name: 'Ocean View' };
    const added = addToCollection('properties', newItem);

    expect(added).toEqual(newItem);
    expect(getCollection('properties')).toHaveLength(1);
    expect(getCollection('properties')[0].name).toBe('Ocean View');
  });
});