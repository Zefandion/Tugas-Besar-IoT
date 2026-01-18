"use client";
import { useState } from 'react';

// Interface sesuai kolom database
interface LogData {
  id: number;
  node_id: number;
  x_g: number;
  y_g: number;
  z_g: number;
  magnitude_g: number;
  magnitude_ms2: number;
  created_at: string;
}

export default function RiwayatPage() {
  // State untuk menyimpan tanggal dan data
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fungsi Fetch Data ke API
  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Panggil API dengan parameter tanggal
      const url = selectedDate 
        ? `/api/logs?date=${selectedDate}` 
        : '/api/logs'; // Kalau kosong ambil default
      
      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        console.error("Format data salah", data);
        setLogs([]);
      }
    } catch (err) {
      console.error("Gagal ambil history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk format tanggal agar enak dibaca
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  // Helper Status Warna & Teks (Sama seperti Dashboard)
  // const getStatusInfo = (val: number) => {
  //   if (val < 0.02) return { text: "Aman", color: "bg-green-500 text-white" };
  //   if (val <= 0.03) return { text: "Sedang", color: "bg-yellow-500 text-black" };
  //   return { text: "Bahaya", color: "bg-red-500 text-white" };
  // };
  const getStatusInfo = (val: number) => {
    if (val < 0.2) return { text: "Aman", color: "bg-green-500 text-white" };
    if (val <= 0.3) return { text: "Sedang", color: "bg-yellow-500 text-black" };
    return { text: "Bahaya", color: "bg-red-500 text-white" };
  };


  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-2">Riwayat Data (Log)</h2>
      <p className="text-slate-400 mb-8">Rekaman data sensor terdahulu dari Database</p>

      {/* --- Filter Section --- */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
        <label className="text-slate-300 text-sm mb-2 block">Pilih Tanggal</label>
        <div className="flex gap-4">
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 text-white border border-slate-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500 [&::-webkit-calendar-picker-indicator]:invert"
          />
          <button 
            onClick={fetchLogs}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Memuat...' : 'Tampilkan Data'}
          </button>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Node ID</th>
                <th className="px-6 py-4">X (g)</th>
                <th className="px-6 py-4">Y (g)</th>
                <th className="px-6 py-4">Z (g)</th>
                <th className="px-6 py-4">Total (m/s²)</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {logs.length > 0 ? (
                logs.map((log) => {
                  // const status = getStatusInfo(log.magnitude_g);
                  const status = getStatusInfo(log.magnitude_ms2);
                  return (
                    <tr key={log.id} className="hover:bg-slate-700/50 transition">
                      <td className="px-6 py-4 font-mono text-sm text-white">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-6 py-4">Node {log.node_id}</td>
                      <td className="px-6 py-4 text-xs font-mono">{log.x_g.toFixed(2)}</td>
                      <td className="px-6 py-4 text-xs font-mono">{log.y_g.toFixed(2)}</td>
                      <td className="px-6 py-4 text-xs font-mono">{log.z_g.toFixed(2)}</td>
                      <td className="px-6 py-4 font-bold text-white font-mono">
                        {Number.isFinite(log.magnitude_ms2)
                        ? log.magnitude_ms2.toFixed(2)
                        : '--'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-xs font-bold ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 italic">
                    {loading ? 'Sedang mengambil data...' : 'Tidak ada data untuk tanggal ini.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Table Info */}
        <div className="bg-slate-900 px-6 py-3 text-xs text-slate-500 flex justify-between">
            <span>Menampilkan {logs.length} data</span>
        </div>
      </div>
    </div>
  );
}