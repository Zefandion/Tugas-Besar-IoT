// types/sensor.ts
export interface SensorData {
  id: number;          // ID unik data
  node_id: number;     // ID Node (1, 2, 3, 4)
  timestamp: string;   // Waktu data
  acc_total: number;   // Nilai getaran total
  battery: number;     // Persentase baterai
  status: 'Aman' | 'Sedang' | 'Bahaya'; // Status visual
}