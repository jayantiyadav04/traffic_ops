import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FilePlus,
    FileText,
    BarChart3,
    LogOut,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import AuthContext from '../../auth/AuthContext';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);

    const menuItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'officer', 'citizen'] },
        { path: '/register-violation', icon: FilePlus, label: 'Register', roles: ['admin', 'officer'] },
        { path: '/violations', icon: FileText, label: 'Violations', roles: ['admin', 'officer', 'citizen'] },
        { path: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['admin'] },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            style={{ width: '16rem', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50, display: 'flex', flexDirection: 'column' }} // Force layout
            className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-r border-slate-700/50"
        >
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-700/50" style={{ padding: '1.5rem' }}>
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
                        <ShieldCheck size={24} strokeWidth={2.5} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                            TrafficOps
                        </h1>
                        <p className="text-xs text-slate-400 font-medium" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Management Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto" style={{ padding: '1.5rem 1rem', flex: 1 }}>
                {filteredMenu.map((item, index) => (
                    <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm group ${isActive
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }`
                            }
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', marginBottom: '0.5rem' }}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        size={20}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={isActive ? 'drop-shadow-sm' : 'group-hover:scale-110 transition-transform'}
                                    />
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    </motion.div>
                ))}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-950/50 backdrop-blur-sm">
                <div className="mb-3 px-2">
                    <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">Logged in</p>
                    <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <p className="text-xs text-emerald-400 capitalize font-medium">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all text-sm font-medium group"
                >
                    <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                    Sign Out
                </button>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
