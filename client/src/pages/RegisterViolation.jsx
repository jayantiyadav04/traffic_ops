import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Car, User, AlertCircle, MapPin, Banknote, FileText } from 'lucide-react';

const RegisterViolation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehicle_number: '',
        owner_name: '',
        violation_type: '',
        area: '',
        fine_amount: 0,
        notes: '',
    });
    const [types, setTypes] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [newUser, setNewUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const typesRes = await API.get('/violations/types');
                const areasRes = await API.get('/violations/areas');
                setTypes(typesRes.data);
                setAreas(areasRes.data);
            } catch (error) {
                console.error("Error fetching reference data", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (e) => {
        const typeId = e.target.value;
        const selectedType = types.find(t => t._id === typeId);
        setFormData({
            ...formData,
            violation_type: typeId,
            fine_amount: selectedType ? selectedType.base_fine : 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post('/violations', formData);

            if (res.data.newUser) {
                setMessage('Violation Registered! Account Created.');
                setNewUser(res.data.newUser);
                // Do NOT navigate automatically if we need to show credentials
            } else {
                setMessage('Violation Registered Successfully!');
                setTimeout(() => navigate('/violations'), 1500);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error registering violation');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setNewUser(null);
        navigate('/violations');
    };

    return (
        <div className="container relative">
            {/* Success Modal for New User */}
            {newUser && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4"
                        style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', width: '100%', maxWidth: '24rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                    >
                        <div className="text-center mb-6" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600" style={{ width: '4rem', height: '4rem', background: '#e0e7ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#4f46e5' }}>
                                <User size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Account Created</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Share these credentials with the violator.</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl space-y-4 mb-6 border border-slate-200" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Email</span>
                                <p style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{newUser.email}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Password</span>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <p style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4f46e5', fontSize: '1.125rem' }}>{newUser.password}</p>
                                    <span style={{ fontSize: '0.75rem', color: '#059669', background: '#d1fae5', padding: '0.25rem 0.5rem', borderRadius: '99px' }}>Auto-generated</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCloseModal}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.875rem' }}
                        >
                            Done & View Violations
                        </button>
                    </motion.div>
                </div>
            )}

            <header className="page-header">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="page-title"
                >
                    Register Violation
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="page-subtitle"
                >
                    Create a new traffic violation record.
                </motion.p>
            </header>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl border ${message.includes('Success') || message.includes('Created')
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}
                    style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.75rem', border: '1px solid', borderColor: message.includes('Success') || message.includes('Created') ? '#a7f3d0' : '#fecaca', backgroundColor: message.includes('Success') || message.includes('Created') ? '#ecfdf5' : '#fef2f2', color: message.includes('Success') || message.includes('Created') ? '#047857' : '#b91c1c' }}
                >
                    <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {message.includes('Success') || message.includes('Created') ? <div className="w-2 h-2 rounded-full bg-emerald-500" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> : <AlertCircle size={16} />}
                        {message}
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
            >
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600" style={{ padding: '0.5rem', background: '#e0e7ff', borderRadius: '0.5rem', color: '#4f46e5' }}>
                        <FileText size={20} />
                    </div>
                    <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Violation Details</h3>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
                    <div className="grid-cols-2" style={{ gap: '2rem' }}>
                        {/* Vehicle Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vehicle Information</h4>
                            <div className="form-group">
                                <label className="form-label">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Car size={16} color="var(--text-muted)" /> Vehicle Number</span>
                                </label>
                                <input
                                    name="vehicle_number"
                                    className="form-control"
                                    style={{ textTransform: 'uppercase', fontWeight: 500 }}
                                    placeholder="e.g. MH-12-AB-1234"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} color="var(--text-muted)" /> Owner Name</span>
                                </label>
                                <input
                                    name="owner_name"
                                    className="form-control"
                                    placeholder="Driver's Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Banknote size={16} color="var(--text-muted)" /> Fine Amount (₹)</span>
                                </label>
                                <input
                                    name="fine_amount"
                                    type="number"
                                    className="form-control"
                                    style={{ fontWeight: 600 }}
                                    onChange={handleChange}
                                    value={formData.fine_amount}
                                    required
                                />
                            </div>
                        </div>

                        {/* Violation Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Incident Details</h4>
                            <div className="form-group">
                                <label className="form-label">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={16} color="var(--text-muted)" /> Violation Type</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        name="violation_type"
                                        className="form-control"
                                        style={{ appearance: 'none', cursor: 'pointer' }}
                                        onChange={handleTypeChange}
                                        required
                                        value={formData.violation_type}
                                    >
                                        <option value="">Select Type</option>
                                        {types.map((type) => (
                                            <option key={type._id} value={type._id}>
                                                {type.type_name}
                                            </option>
                                        ))}
                                    </select>
                                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} color="var(--text-muted)" /> Location</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        name="area"
                                        className="form-control"
                                        style={{ appearance: 'none', cursor: 'pointer' }}
                                        onChange={handleChange}
                                        required
                                        value={formData.area}
                                    >
                                        <option value="">Select Area</option>
                                        {areas.map((area) => (
                                            <option key={area._id} value={area._id}>
                                                {area.area_name}, {area.city}
                                            </option>
                                        ))}
                                    </select>
                                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} color="var(--text-muted)" /> Notes</span>
                                </label>
                                <textarea
                                    name="notes"
                                    rows={3}
                                    className="form-control"
                                    style={{ resize: 'none' }}
                                    onChange={handleChange}
                                    placeholder="Additional details..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.875rem' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" style={{ width: '1.25rem', height: '1.25rem', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <><Save size={18} /> Register Violation</>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterViolation;
