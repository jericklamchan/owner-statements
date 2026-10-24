import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GET, PATCH } from './route';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { STATEMENT_STATUSES, YEARS, MONTHS } from '@/src/constants';

const testDbPath = path.join(process.cwd(), 'src/data/db.json');

describe('API: /api/statements/[id]', () => {
  let backupContent: string | null = null;
  const testYear = YEARS[0] || 2026;
  const testMonth = MONTHS[0]?.value || 10;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      backupContent = fs.readFileSync(testDbPath, 'utf-8');
    }
    // Seed database with a test property
    fs.mkdirSync(path.dirname(testDbPath), { recursive: true });
    fs.writeFileSync(
      testDbPath,
      JSON.stringify({
        properties: [
          {
            id: 'prop-test-1',
            propertyName: 'Alpine Loft',
            ownerName: 'Jane Smith',
            hostaway_id: 'hw_123',
            qbo_class_name: 'Alpine',
          },
        ],
        users: [],
        statements: {},
      })
    );
  });

  afterEach(() => {
    if (backupContent !== null) {
      fs.writeFileSync(testDbPath, backupContent, 'utf-8');
    } else if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it('GET should return 404 if property does not exist', async () => {
    const req = new NextRequest(`http://localhost:3000/api/statements/invalid-id?year=${testYear}&month=${testMonth}`);
    const res = await GET(req, { params: Promise.resolve({ id: 'invalid-id' }) });
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.success).toBe(false);
  });

  it('GET should aggregate statement and calculate payouts correctly for valid property', async () => {
    const req = new NextRequest(`http://localhost:3000/api/statements/prop-test-1?year=${testYear}&month=${testMonth}`);
    const res = await GET(req, { params: Promise.resolve({ id: 'prop-test-1' }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.statement.propertyId).toBe('prop-test-1');
    expect(data.statement.propertyName).toBe('Alpine Loft');
    expect(typeof data.statement.grossRevenue).toBe('number');
    expect(typeof data.statement.totalPayout).toBe('number');
    expect(typeof data.statement.mgmtFee).toBe('number');
  });

  it('PATCH should update statement snapshot status and save adjustments', async () => {
    const patchBody = {
      status: STATEMENT_STATUSES.PUBLISHED,
      adjustments: [
        { id: 'ADJ-1', date: `${testYear}-10-15`, description: 'Late checkout fee', amount: 50 },
      ],
      year: String(testYear),
      month: String(testMonth),
    };

    const req = new NextRequest('http://localhost:3000/api/statements/prop-test-1', {
      method: 'PATCH',
      body: JSON.stringify(patchBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: 'prop-test-1' }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.statement.status).toBe(STATEMENT_STATUSES.PUBLISHED);
    expect(data.statement.adjustments).toHaveLength(1);
    expect(data.statement.adjustments[0].description).toBe('Late checkout fee');
  });
});