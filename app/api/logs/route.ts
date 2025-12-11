import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Ambil parameter 'date' dari URL (format: YYYY-MM-DD)
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    let sql = '';
    let params: any[] = [];

    // 2. Jika user memilih tanggal, filter berdasarkan tanggal tersebut
    if (dateParam) {
      // Syntax ::date di Postgres mengubah TIMESTAMP menjadi DATE (hari saja)
      sql = `
        SELECT * FROM sensor_readings 
        WHERE created_at::date = $1 
        ORDER BY created_at DESC;
      `;
      params = [dateParam];
    } else {
      // Jika tidak ada tanggal, tampilkan 50 data terakhir saja (default)
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