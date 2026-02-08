import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart, BarChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [typeStats, setTypeStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsRes = await API.get('/analytics/stats');
                const typeRes = await API.get('/analytics/by-type');
                setStats(statsRes.data);
                setTypeStats(typeRes.data);
            } catch (error) {
                console.error('Error fetching analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-indigo-400 opacity-20"></div>
            </div>
        </div>
    );

    const pieData = {
        labels: ['Collected', 'Pending'],
        datasets: [
            {
                data: [stats?.collectedFines || 0, stats?.pendingFines || 0],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',  // Emerald
                    'rgba(239, 68, 68, 0.8)',    // Red
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
                hoverOffset: 8,
            },
        ],
    };

    const barData = {
        labels: typeStats.map(t => t.type_name),
        datasets: [
            {
                label: 'Violations Count',
                data: typeStats.map(t => t.count),
                backgroundColor: 'rgba(99, 102, 241, 0.8)',  // Indigo
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(79, 70, 229, 0.9)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                        weight: '600',
                    },
                    padding: 15,
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: {
                    size: 13,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 12,
                },
                padding: 12,
                cornerRadius: 8,
            },
        },
    };

    return (
        <div className="container">
            <header className="page-header">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="page-title"
                >
                    Analytics Dashboard
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="page-subtitle"
                >
                    Real-time insights and performance metrics.
                </motion.p>
            </header>

            <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-stat"
                >
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', display: 'inline-flex', background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)', color: '#4f46e5', boxShadow: 'var(--shadow-md)' }}>
                                <TrendingUp size={24} strokeWidth={2.5} />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1 }}>{stats?.totalViolations}</h3>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Total Violations</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-stat"
                >
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', display: 'inline-flex', background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)', color: '#059669', boxShadow: 'var(--shadow-md)' }}>
                                <TrendingUp size={24} strokeWidth={2.5} />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1 }}>₹{stats?.totalFines}</h3>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Total Revenue</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card-stat"
                >
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ padding: '0.75rem', borderRadius: '0.75rem', display: 'inline-flex', background: 'linear-gradient(135deg, #fee2e2 0%, #fce7f3 100%)', color: '#dc2626', boxShadow: 'var(--shadow-md)' }}>
                                <TrendingUp size={24} strokeWidth={2.5} />
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.25rem', lineHeight: 1 }}>₹{stats?.pendingFines}</h3>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Pending Amount</p>
                    </div>
                </motion.div>
            </div>

            <div className="grid-cols-2" style={{ gap: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card"
                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#f3e8ff', color: '#9333ea' }}>
                            <PieChart size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Collection Efficiency</h3>
                    </div>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                        <Pie data={pieData} options={chartOptions} />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                    style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: '#e0e7ff', color: '#4f46e5' }}>
                            <BarChart size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Violations by Type</h3>
                    </div>
                    <div style={{ flex: 1, minHeight: '300px' }}>
                        <Bar data={barData} options={{ ...chartOptions, maintainAspectRatio: false }} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;
