// app/api/properties/route.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { STATEMENT_STATUSES } from '@/src/constants';

const testDbPath = path.join(process.cwd(), 'src/data/db.json');

describe('API: /api/properties', () => {
  let backupContent: string | null = null;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      backupContent = fs.readFileSync(testDbPath, 'utf-8');
    }
  });

  afterEach(() => {
    if (backupContent !== null) {
      fs.writeFileSync(testDbPath, backupContent, 'utf-8');
    }
  });

  it('GET /api/properties should return success and properties list', async () => {
    const req = new NextRequest('http://localhost:3000/api/properties');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.properties)).toBe(true);
  });

  it('POST /api/properties should add new property and return 201', async () => {
    const newProperty = { 
      propertyName: 'Beachfront Villa', 
      ownerName: 'John Doe', 
      hostaway_id: 'hw_999',
      qbo_class_name: 'SMC-BFV'
    };
    
    const req = new NextRequest('http://localhost:3000/api/properties', {
      method: 'POST',
      body: JSON.stringify(newProperty),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.property.propertyName).toBe('Beachfront Villa');
    expect(data.property.status).toBe(STATEMENT_STATUSES.NOT_GENERATED);
  });
});