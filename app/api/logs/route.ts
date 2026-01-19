import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    let sql = '';
    let params: any[] = [];

    if (dateParam) {
      sql = `
        SELECT * FROM sensor_readings 
        WHERE created_at::date = $1 
        ORDER BY created_at DESC;
      `;
      params = [dateParam];
    } else {
      sql = `
        SELECT * FROM sensor_readings 
        ORDER BY created_at DESC 
        LIMIT 50;
      `;
    }

    const result = await query(sql, params);
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}