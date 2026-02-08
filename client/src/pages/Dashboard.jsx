import { useContext, useEffect, useState } from 'react';
import AuthContext from '../auth/AuthContext';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, gradient, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="card-stat"
    >
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div className={gradient} style={{ padding: '0.75rem', borderRadius: '0.75rem', display: 'inline-flex', boxShadow: 'var(--shadow-md)' }}>
                    <Icon size={24} color="white" strokeWidth={2.5} />
                </div>
            </div>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1 }}>{value}</h3>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{title}</p>
        </div>
        {/* Decorative gradient overlay handled by CSS ::before */}
    </motion.div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (user?.role !== 'citizen') {
            const fetchStats = async () => {
                try {
                    const { data } = await API.get('/analytics/stats');
                    setStats(data);
                } catch (error) {
                    console.error("Error fetching dashboard stats", error);
                }
            };
            fetchStats();
        }
    }, [user]);

    return (
        <div className="container">
            <header className="page-header">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="page-title"
                    >
                        Dashboard
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="page-subtitle"
                    >
                        Welcome back, <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.full_name}</span>
                    </motion.p>
                </div>
            </header>

            <div className="grid-cols-4" style={{ marginBottom: '2rem' }}>
                <StatCard
                    title="Total Violations"
                    value={stats?.totalViolations || 0}
                    icon={Shield}
                    gradient="gradient-primary"
                    delay={0.1}
                />
                <StatCard
                    title="Active Cases"
                    value={stats?.pendingFines ? "Active" : "Stable"}
                    icon={AlertTriangle}
                    gradient="gradient-warning"
                    delay={0.2}
                />
                <StatCard
                    title="Collected Fines"
                    value={`₹${stats?.collectedFines || 0}`}
                    icon={CheckCircle}
                    gradient="gradient-success"
                    delay={0.3}
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats?.totalFines || 0}`}
                    icon={TrendingUp}
                    gradient="gradient-secondary"
                    delay={0.4}
                />
            </div>

        </div>
    );
};

export default Dashboard;
