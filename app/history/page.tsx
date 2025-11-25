"use client";
import { useState } from "react";

export default function HistoryPage() {
  // Definisi struktur data log
  interface LogData {
    id: number;
    time: string;
    node: number;
    x: number;
    y: number;
    z: number;
    total: number;
    status: string;
  }

  const dummyData: LogData[] = [
    { id: 1, time: "2025-11-19 10:05:00", node: 1, x: 0.02, y: 0.01, z: 0.25, total: 0.25, status: "Sedang" },
    { id: 2, time: "2025-11-19 10:05:02", node: 2, x: 0.01, y: 0.01, z: 0.05, total: 0.05, status: "Aman" },
    { id: 3, time: "2025-11-19 10:05:04", node: 1, x: 0.10, y: 0.05, z: 0.32, total: 0.34, status: "Bahaya" },
    { id: 4, time: "2025-11-19 10:05:06", node: 3, x: 0.02, y: 0.02, z: 0.08, total: 0.09, status: "Aman" },
    { id: 5, time: "2025-11-19 10:05:08", node: 4, x: 0.01, y: 0.01, z: 0.06, total: 0.06, status: "Aman" },
  ];

  const [filterDate, setFilterDate] = useState("");

  const handleFilter = () => {
    alert("Ini hanya prototype UI. Di sistem asli, ini akan query ke PostgreSQL.");
  };

  return (
    <div>
       <header className="mb-8">
          <h2 className="text-3xl font-bold text-white">Riwayat Data (Log)</h2>
          <p className="text-slate-400">Rekaman data sensor terdahulu</p>
        </header>

        {/* Filter Section */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6 flex gap-4 items-end">
           <div>
             <label className="block text-sm text-slate-400 mb-1">Pilih Tanggal</label>
             <input 
               type="date" 
               className="bg-slate-900 border border-slate-600 rounded p-2 text-white"
               onChange={(e) => setFilterDate(e.target.value)}
             />
           </div>
           <button 
             onClick={handleFilter}
             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition h-10"
           >
             Tampilkan Data
           </button>
        </div>

        {/* Table Section */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900 text-slate-300">
                 <tr>
                    <th className="p-4 border-b border-slate-700">Waktu</th>
                    <th className="p-4 border-b border-slate-700">Node ID</th>
                    <th className="p-4 border-b border-slate-700">X (g)</th>
                    <th className="p-4 border-b border-slate-700">Y (g)</th>
                    <th className="p-4 border-b border-slate-700">Z (g)</th>
                    <th className="p-4 border-b border-slate-700">Total (g)</th>
                    <th className="p-4 border-b border-slate-700">Status</th>
                 </tr>
              </thead>
              <tbody>
                 {dummyData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-700 transition">
                       <td className="p-4 border-b border-slate-700">{row.time}</td>
                       <td className="p-4 border-b border-slate-700">Node {row.node}</td>
                       <td className="p-4 border-b border-slate-700 text-slate-400">{row.x}</td>
                       <td className="p-4 border-b border-slate-700 text-slate-400">{row.y}</td>
                       <td className="p-4 border-b border-slate-700 text-slate-400">{row.z}</td>
                       <td className="p-4 border-b border-slate-700 font-bold">{row.total}</td>
                       <td className="p-4 border-b border-slate-700">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                             row.status === 'Bahaya' ? 'bg-red-500 text-black' : 
                             row.status === 'Sedang' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-black'
                          }`}>
                             {row.status}
                          </span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           <div className="p-4 text-center text-sm text-slate-500">
              Menampilkan 5 dari 1284 data...
           </div>
        </div>
    </div>
  );
}