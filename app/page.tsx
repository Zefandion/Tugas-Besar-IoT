"use client";
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface NodeData {
  id: number;
  val: number;
  battery: number;
}

export default function Dashboard() {
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: 1, val: 0.0, battery: 100 }, // Pastikan ID 99 ada
    { id: 2, val: 0.0, battery: 100 },
    { id: 3, val: 0.0, battery: 100 },
    
  ]);

  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [{
      label: 'Node 99 (Magnitude)',
      data: [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.4,
    }],
  });

  const fetchData = async () => {
    try {
      const response = await fetch('/api/sensors');
      
      // Cek jika API Error
      if (!response.ok) {
        console.error("Gagal koneksi API:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
       console.log("Data API:", data); // Uncomment untuk debug

      if (!Array.isArray(data)) return;

      const now = new Date().toLocaleTimeString();
      //let node99Value = 0; // Ubah variabel jadi node99Value biar jelas
      const nodeValues: Record<number, number> = {};
      const latestByNode: Record<number, number> = {};

      // data.forEach((row: any) => {
      //   latestByNode[row.node_id] = parseFloat(row.magnitude_g);
      // });

      data.forEach((row: any) => {
        const ms2 = Number(row.magnitude_ms2);
        const g   = Number(row.magnitude_g);

        if (Number.isFinite(ms2)) {
          latestByNode[row.node_id] = ms2;
        } else if (Number.isFinite(g)) {
          // fallback kalau ms2 belum ada
          latestByNode[row.node_id] = g * 9.80665;
        }
      });

      setNodes((prevNodes) => prevNodes.map(node => {
        // Cari data di DB yang node_id nya sama dengan node.id di state
        const reading = data.find((row: any) => row.node_id === node.id);
        
        // Gunakan nilai dari DB, jika tidak ada pakai nilai lama
        const newVal = latestByNode[node.id] ?? node.val;
        
        //if (node.id === 99) node99Value = newVal;
        if (reading) {
          nodeValues[node.id] = newVal;
        }


        return {
          ...node,
          val: newVal,
          battery: Math.max(0, node.battery - 0.01) 
        };
      }));
      if (Object.keys(latestByNode).length === 0) return;

      setChartData((prev) => {
  const labels = [...(prev.labels as string[]), now].slice(-10);

  const getData = (index: number, id: number) =>
    [
      ...(prev.datasets[index]?.data as number[] ?? []),
      nodeValues[id] ?? 0,
    ].slice(-10);

  return {
    labels,
    datasets: [
      {
        label: 'Node 1',
        data: getData(0, 1),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.5)',
        tension: 0.4,
      },
      {
        label: 'Node 2',
        data: getData(1, 2),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.5)',
        tension: 0.4,
      },
      {
        label: 'Node 3',
        data: getData(2, 3),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249,115,22,0.5)',
        tension: 0.4,
      },
    ],
  };
});


    } catch (err) {
      console.error("Error Fetching:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 500);
    return () => clearInterval(interval);
  }, []);

  // const getStatusColor = (val: number) => {
  //   if (val < 0.02) return "bg-green-500";
  //   if (val <= 0.03) return "bg-yellow-500";
  //   return "bg-red-500 animate-pulse";
  // };

  // const getStatusText = (val: number) => {
  //   if (val < 0.02) return "Rendah";
  //   if (val <= 0.03) return "Sedang";
  //   return "Tinggi";
  // };

  const getStatusColor = (val: number) => {
    if (val < 0.2) return "bg-green-500";
    if (val <= 0.3) return "bg-yellow-500";
    return "bg-red-500 animate-pulse";
  };

  const getStatusText = (val: number) => {
    if (val < 0.2) return "Rendah";
    if (val <= 0.3) return "Sedang";
    return "Tinggi";
  };


  return (
    <div>
        <header className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Monitoring Mikrozonasi</h2>
              <p className="text-slate-400">Data Real-time dari Rooftop Gedung 9</p>
            </div>
        </header>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Peta Visualisasi Zona</h3>
            <div className="grid grid-cols-2 gap-4 aspect-video relative bg-slate-900 p-4 rounded-lg">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-xl border-4 border-slate-800">
                    <span className="font-bold text-xs">SINK</span>
                </div>
                </div>
                {nodes.map((node) => (
                <div key={node.id} className={`${getStatusColor(node.val)} rounded-lg flex flex-col items-center justify-center p-4 text-slate-900 transition-colors duration-500`}>
                    <div className="flex justify-between w-full mb-2 px-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full border-2 border-slate-900 ${
                          node.id === 1
                            ? 'bg-blue-500'
                            : node.id === 2
                            ? 'bg-green-500'
                            : 'bg-orange-500'
                        }`}
                      />
                      <span className="font-bold text-sm">Node {node.id}</span>
                    </div>
                    {/* <span className="font-bold text-sm">Node {node.id}</span> */}
                    {/* <span className="text-xs opacity-80">🔋 {Math.floor(node.battery)}%</span> */}
                    </div>
                    {/* Tampilkan 2 angka di belakang koma saja agar rapi */}
                    <span className="text-4xl font-mono font-bold">{node.val.toFixed(2)}</span>
                    <span className="text-xs font-semibold mt-1">{getStatusText(node.val)} (m/s²)</span>
                </div>
                ))}
            </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Grafik Akselerasi</h3>
            <div className="flex-1 w-full h-full">
                <Line 
                    data={chartData} 
                    options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        // FIX: Hapus Max 0.5 agar grafik bisa naik tinggi
                        y: { beginAtZero: true, grid: { color: '#334155' } },
                        x: { grid: { display: false } }
                    },
                    plugins: { legend: { display: false } }
                    }} 
                />
            </div>
            </div>
        </div>
    </div>
  );
}