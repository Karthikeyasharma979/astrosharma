import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Loader2 } from 'lucide-react';

import Home from './pages/Home';

// Lazy Load Pages
// const Home = React.lazy(() => import('./pages/Home')); // Loaded eagerly for LCP
const Features = React.lazy(() => import('./pages/Features'));
const Help = React.lazy(() => import('./pages/Help'));
const Consultation = React.lazy(() => import('./pages/Consultation'));
const DailyPanchang = React.lazy(() => import('./pages/DailyPanchang'));

const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Refunds = React.lazy(() => import('./pages/Refunds'));


// Scroll Handling Component
function ScrollToTop() {
    const { pathname } = useLocation();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

// Loading Fallback
function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFAF0] dark:bg-slate-950">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-serif animate-pulse">Consulting the Stars...</p>
            </div>
        </div>
    );
}

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <React.Suspense fallback={<PageLoader />}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />

                    <Route path="/features" element={<Features />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/consultation" element={<Consultation />} />
                    <Route path="/daily-panchang" element={<DailyPanchang />} />

                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/refunds" element={<Refunds />} />

                    <Route path="/contact" element={<Help />} />
                </Routes>
            </React.Suspense>
        </AnimatePresence>
    );
}

function App() {


    React.useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        window.addEventListener('contextmenu', handleContextMenu);

        // Cleanup
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <Layout>
                <AnimatedRoutes />
            </Layout>
        </Router>
    );
}

export default App;

