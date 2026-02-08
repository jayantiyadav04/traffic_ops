import { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, QrCode, X, CheckCircle } from 'lucide-react';
import AuthContext from '../auth/AuthContext';

const ViewViolations = () => {
    const { user } = useContext(AuthContext);
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedViolation, setSelectedViolation] = useState(null);

    const handleManualPay = async (id) => {
        if (!window.confirm('Are you sure you want to mark this violation as PAID? This cannot be undone.')) return;
        try {
            await API.put(`/violations/${id}/pay`);
            // Update local state to reflect change
            setViolations(violations.map(v => v._id === id ? { ...v, status: 'paid' } : v));
        } catch (error) {
            console.error('Error marking as paid', error);
            alert('Failed to mark as paid: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    useEffect(() => {
        const fetchViolations = async () => {
            try {
                const { data } = await API.get('/violations');
                setViolations(data);
            } catch (error) {
                console.error('Error fetching violations', error);
            } finally {
                setLoading(false);
            }
        };

        fetchViolations();
    }, []);

    const getStatusBadge = (status) => {
        const badgeClass = {
            paid: 'badge badge-paid',
            unpaid: 'badge badge-unpaid',
            disputed: 'badge badge-disputed',
        }[status] || 'badge badge-info';

        return (
            <span className={badgeClass}>
                {status?.toUpperCase() || 'UNKNOWN'}
            </span>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="container relative">
            <AnimatePresence>
                {selectedViolation && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                            style={{ background: 'white', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', width: '100%', maxWidth: '24rem' }}
                        >
                            <div className="relative p-6 text-center" style={{ padding: '2rem', textAlign: 'center' }}>
                                <button
                                    onClick={() => setSelectedViolation(null)}
                                    style={{ position: 'absolute', right: '1rem', top: '1rem', padding: '0.5rem', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}
                                >
                                    <X size={20} color="#64748b" />
                                </button>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Scan to Pay</h3>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>Use any UPI app to pay fine</p>

                                <div style={{ background: 'white', padding: '1rem', borderRadius: '1rem', border: '2px dashed #e2e8f0', display: 'inline-block', marginBottom: '1.5rem' }}>
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=traffic@gov&pn=TrafficDepartment&am=${selectedViolation.fine_amount}&cu=INR`}
                                        alt="Payment QR Code"
                                        style={{ width: '200px', height: '200px', display: 'block' }}
                                    />
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Amount Due</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>₹{selectedViolation.fine_amount.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div style={{ background: '#f1f5f9', padding: '1rem', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Violation ID: {selectedViolation.vehicle_number}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <header className="page-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <h2 className="page-title">Violations</h2>
                    <p className="page-subtitle">View and manage all traffic violation records</p>
                </div>
                <div style={{ position: 'relative', width: '100%', maxWidth: '20rem' }}>
                    <Search size={18} className="text-gray-400" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        placeholder="Search violations..."
                        className="form-control"
                        style={{ paddingLeft: '2.75rem' }}
                    />
                </div>
            </header>

            {violations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '6rem 0', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '2px dashed var(--border)', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--bg-muted)', borderRadius: '50%', marginBottom: '1rem' }}>
                        <AlertCircle size={48} strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No violations found</h3>
                    <p>There are no records to display at this time.</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="table-container"
                >
                    <div style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Vehicle</th>
                                    <th>Owner</th>
                                    <th>Type</th>
                                    <th>Fine</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {violations.map((v, index) => (
                                    <motion.tr
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        key={v._id}
                                    >
                                        <td style={{ whiteSpace: 'nowrap', width: '1%' }}>{new Date(v.violation_date).toLocaleDateString('en-IN')}</td>
                                        <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{v.vehicle_number}</td>
                                        <td>{v.owner_name}</td>
                                        <td>{v.violation_type?.type_name || v.violation_type}</td>
                                        <td style={{ fontWeight: 700 }}>₹{v.fine_amount.toLocaleString('en-IN')}</td>
                                        <td style={{ width: '1%' }}>
                                            {getStatusBadge(v.status)}
                                        </td>
                                        <td style={{ width: '1%' }}>
                                            {v.status === 'unpaid' && (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => setSelectedViolation(v)}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                                    >
                                                        <QrCode size={14} /> Pay
                                                    </button>
                                                    {(user?.role === 'admin' || user?.role === 'officer') && (
                                                        <button
                                                            onClick={() => handleManualPay(v._id)}
                                                            className="btn"
                                                            style={{
                                                                padding: '0.4rem 0.8rem',
                                                                fontSize: '0.75rem',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.4rem',
                                                                background: '#10b981',
                                                                color: 'white',
                                                                border: 'none'
                                                            }}
                                                            title="Mark as Paid Manually"
                                                        >
                                                            <CheckCircle size={14} /> Mark Paid
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ViewViolations;
