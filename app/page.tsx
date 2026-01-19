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
    { id: 1, val: 0.0, battery: 100 }, 
    { id: 2, val: 0.0, battery: 100 },
    { id: 6, val: 0.0, battery: 100 },
    
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
      
      if (!response.ok) {
        console.error("Gagal koneksi API:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      if (!Array.isArray(data)) return;

      const now = new Date().toLocaleTimeString();
      const nodeValues: Record<number, number> = {};
      const latestByNode: Record<number, number> = {};

      data.forEach((row: any) => {
        const ms2 = Number(row.magnitude_ms2);
        const g   = Number(row.magnitude_g);

        if (Number.isFinite(ms2)) {
          const mappedId = row.node_id === 3 ? 6 : row.node_id;
          latestByNode[mappedId] = ms2;
        } else if (Number.isFinite(g)) {
          latestByNode[row.node_id] = g * 9.80665;
        }
      });

      setNodes((prevNodes) =>
        prevNodes.map(node => {
          const newVal = latestByNode[node.id] ?? node.val;

          nodeValues[node.id] = newVal;

          return {
            ...node,
            val: newVal,
            battery: Math.max(0, node.battery - 0.01),
          };
        })
      );  

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
        label: 'Node 6',
        data: getData(2, 6),
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

  const getStatusColor = (val: number) => {
    if (val === 0) return "bg-slate-500";     
    if (val < 0.2) return "bg-green-500";    
    if (val <= 0.3) return "bg-yellow-500";    
    return "bg-red-500 animate-pulse";        
  };

  const getStatusText = (val: number) => {
    if (val === 0) return "Tidak Aktif";
    if (val < 0.2) return "Rendah";
    if (val <= 0.3) return "Sedang";
    return "Tinggi";
  };

  const TOTAL_SLOTS = 10;
  const slots = Array.from({ length: TOTAL_SLOTS }, (_, i) => i + 1);

  const nodeColors: Record<number, string> = {
    1: 'bg-blue-500',
    2: 'bg-green-500',
    3: 'bg-orange-500',
    4: 'bg-purple-500',
    5: 'bg-pink-500',
    6: 'bg-red-500',
    7: 'bg-yellow-500',
    8: 'bg-teal-500',
    9: 'bg-indigo-500',
    10: 'bg-cyan-500',
  };

  return (
    <div>
        <header className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Monitoring Mikrozonasi</h2>
              <p className="text-slate-400">Data Real-time dari Rooftop Gedung 9</p>
            </div>
        </header>

         <div className="flex flex-col gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Peta Visualisasi Zona</h3>
              <div className="grid grid-cols-5 grid-rows-2 gap-4 bg-slate-900 p-4 rounded-lg">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                </div>
                {slots.map((slotId) => {
                  const node = nodes.find(n => n.id === slotId);
                  const value = node ? node.val : 0.0;

                  return (
                    <div
                      key={slotId}
                      className={`${getStatusColor(value)} rounded-lg flex flex-col items-center justify-center p-4 text-slate-900 transition-colors duration-500`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`w-3 h-3 rounded-full border-2 border-slate-900 ${
                            nodeColors[slotId] ?? 'bg-slate-300'
                          }`}
                        />
                        <span className="font-bold text-sm">Node {slotId}</span>
                      </div>

                      <span className="text-4xl font-mono font-bold">
                        {value.toFixed(2)}
                      </span>

                      <span className="text-xs font-semibold mt-1">
                        {value === 0
                          ? "Tidak Aktif"
                          : `${getStatusText(value)} (m/s²)`
                        }
                      </span>
                    </div>
                  );
                })}
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