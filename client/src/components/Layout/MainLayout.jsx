import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 relative" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Sidebar />
            <main
                className="transition-all duration-300 ease-in-out min-h-screen flex-1"
                style={{ marginLeft: '16rem', padding: '2rem', width: 'calc(100% - 16rem)' }} // Force margin and width
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
