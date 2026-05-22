import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaUserPlus, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  if (!data) return <div className="text-center py-20 text-gray-500">Memuat data dashboard...</div>;

  const { stats, trenHarian } = data;

  const barChartData = {
    labels: ['Pending', 'Lolos', 'Gagal'],
    datasets: [
      {
        label: 'Jumlah Siswa',
        data: [stats.pending, stats.lolos, stats.gagal],
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          '#f59e0b',
          '#10b981',
          '#ef4444',
        ],
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };

  const doughnutData = {
    labels: ['Lolos', 'Pending', 'Gagal'],
    datasets: [
      {
        data: [stats.lolos, stats.pending, stats.gagal],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.parsed.y} siswa`
        }
      }
    },
    scales: { 
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1, font: { size: 12 } },
        grid: { color: 'rgba(0,0,0,0.05)' }
      },
      x: {
        ticks: { font: { size: 13, weight: 'bold' } },
        grid: { display: false }
      }
    }
  };

  const StatCard = ({ title, value, icon, colorClass, bgClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-dark mt-1">{value}</p>
      </div>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${bgClass} ${colorClass}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pendaftar" value={stats.total} icon={<FaUserPlus />} colorClass="text-blue-500" bgClass="bg-blue-50" />
        <StatCard title="Menunggu Verifikasi" value={stats.pending} icon={<FaHourglassHalf />} colorClass="text-yellow-500" bgClass="bg-yellow-50" />
        <StatCard title="Lolos Seleksi" value={stats.lolos} icon={<FaCheckCircle />} colorClass="text-primary" bgClass="bg-primary/10" />
        <StatCard title="Tidak Lolos" value={stats.gagal} icon={<FaTimesCircle />} colorClass="text-red-500" bgClass="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-dark mb-4">Jumlah Pendaftar Berdasarkan Status</h3>
          <div className="h-[300px] w-full">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-dark mb-4">Proporsi Status</h3>
          <div className="h-[250px] w-full flex justify-center mt-4">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
