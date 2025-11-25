"use client";
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface NodeData {
  id: number;
  val: number;
  battery: number;
}

export default function Dashboard() {
  const [nodes, setNodes] = useState<NodeData[]>([
    { id: 1, val: 0.0, battery: 92 },
    { id: 2, val: 0.0, battery: 88 },
    { id: 3, val: 0.0, battery: 76 },
    { id: 4, val: 0.0, battery: 95 },
  ]);

  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Node 1 (A-Total)',
        data: [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();

      setNodes((prevNodes) => prevNodes.map(node => ({
        ...node,
        val: parseFloat((Math.random() * 0.40).toFixed(3)) 
      })));

      setChartData((prev) => {
        const newLabels = [...(prev.labels as string[]), now].slice(-15);
        const oldData = prev.datasets[0].data as number[];
        const newData = [...oldData, Math.random() * 0.40].slice(-15);
        
        return {
          labels: newLabels,
          datasets: [{ ...prev.datasets[0], data: newData }]
        };
      });

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (val: number) => {
    if (val < 0.11) return "bg-green-500";
    if (val <= 0.30) return "bg-yellow-500";
    return "bg-red-500 animate-pulse";
  };

  const getStatusText = (val: number) => {
    if (val < 0.11) return "Rendah";
    if (val <= 0.30) return "Sedang";
    return "Tinggi";
  };

  return (
    <div>
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Monitoring Mikrozonasi</h2>
          <p className="text-slate-400">Data Real-time dari Rooftop Gedung 9</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition">
          Download Report (.CSV)
        </button>
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
                  <span className="font-bold text-sm">Node {node.id}</span>
                  <span className="text-xs opacity-80">🔋 {node.battery}%</span>
                </div>
                <span className="text-4xl font-mono font-bold">{node.val}</span>
                <span className="text-xs font-semibold uppercase mt-1">{getStatusText(node.val)} (g)</span>
              </div>
            ))}
          </div>
           <div className="flex gap-4 mt-4 text-xs text-slate-300 justify-center">
             <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> &lt; 0.11 g (Aman)</div>
             <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> 0.11-0.30 g (Sedang)</div>
             <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> &gt; 0.30 g (Bahaya)</div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Grafik Akselerasi (Node 1)</h3>
          <div className="flex-1 w-full h-full">
             <Line 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: { min: 0, max: 0.5, grid: { color: '#334155' } },
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