// app/api/sensors/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = `
      SELECT DISTINCT ON (node_id) 
        node_id, 
        magnitude_g, 
        created_at 
      FROM sensor_readings 
      WHERE node_id IN (1, 2, 3, 4)
      ORDER BY node_id, created_at DESC;
    `;
    
    const result = await query(sql);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}