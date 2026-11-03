import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { NetworkStatus } from './components/NetworkStatus';
import { Loader2 } from 'lucide-react';

import Home from './pages/Home';

// Lazy Load Pages
// const Home = React.lazy(() => import('./pages/Home')); // Loaded eagerly for LCP
const Features = React.lazy(() => import('./pages/Features'));
const Help = React.lazy(() => import('./pages/Help'));
const Consultation = React.lazy(() => import('./pages/Consultation'));
const DailyPanchang = React.lazy(() => import('./pages/DailyPanchang'));
const Kundli = React.lazy(() => import('./pages/Kundli'));
const KundliResults = React.lazy(() => import('./pages/KundliResults'));
const KPKundliResults = React.lazy(() => import('./pages/KPKundliResults'));

const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Refunds = React.lazy(() => import('./pages/Refunds'));
const Track = React.lazy(() => import('./pages/Track'));



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

function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20 bg-[#FFFAF0] dark:bg-slate-950">
            <div className="text-center max-w-md">
                <p className="text-6xl font-serif font-bold text-orange-500 mb-4">404</p>
                <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">The page you are looking for does not exist or has moved.</p>
                <Link to="/" className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold shadow-lg hover:shadow-orange-500/30 transition-shadow">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

// Review links in consultation emails open the review form on the home page
function ReviewLinkRedirect() {
    const params = new URLSearchParams(useLocation().search);
    const search = new URLSearchParams({ writeReview: '1' });
    if (params.get('name')) search.set('name', params.get('name'));
    return <Navigate to={`/?${search}#reviews`} replace />;
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
                    <Route path="/kundli" element={<Kundli />} />
                    <Route path="/kundli/vedic" element={<KundliResults />} />
                    <Route path="/kundli/kp" element={<KPKundliResults />} />
                    <Route path="/free-kundli" element={<Navigate to="/kundli" replace />} />
                    <Route path="/kp-kundli" element={<Navigate to="/kundli?system=kp" replace />} />
                    <Route path="/kp-kundli/results" element={<Navigate to="/kundli/kp" replace />} />
                    <Route path="/review" element={<ReviewLinkRedirect />} />
                    <Route path="/track" element={<Track />} />
                    <Route path="/track/:transactionId" element={<Track />} />

                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/refunds" element={<Refunds />} />



                    <Route path="/contact" element={<Help />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </React.Suspense>
        </AnimatePresence>
    );
}

function App() {


    return (
        <Router>
            <ScrollToTop />
            <NetworkStatus />
            <Layout>
                <AnimatedRoutes />
            </Layout>
        </Router>
    );
}

export default App;

