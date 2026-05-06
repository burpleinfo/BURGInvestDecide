import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Navbar from './widgets/Navbar/Navbar';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SearchProvider } from './contexts/SearchContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import CookieConsent from './components/CookieConsent';
import ToastContainer from './components/ToastContainer';

import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import AboutUs from './pages/AboutUs';
import BurgRideSafePage from './pages/BurgRideSafePage';
import BurgRideSafeCICFProposal from './pages/BurgRideSafeCICFProposal';
import Platform from './pages/Platform';
import Services from './pages/Services';
import Partners from './pages/Partners';
import Drivers from './pages/Drivers';
import Technology from './pages/Technology';
import Founder from './pages/Founder';
import AdminDashboard from './admin/AdminDashboard';
import AdminSigninPage from './pages/AdminSigninPage';
import AdminSignupPage from './pages/AdminSignupPage';
import RequireAdmin from './routes/RequireAdmin';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

function AppContent() {
  const location = useLocation();
  const { toasts, removeToast } = useToast();
  const isAdminPage = location.pathname.startsWith('/admin');
  const showNavbar = location.pathname !== "/signin" && location.pathname !== "/signup" && location.pathname !== "/register" && location.pathname !== "/forgot-password" && location.pathname !== "/reset-password" && location.pathname !== "/team/akash" && !location.pathname.startsWith("/ridesafe") && !isAdminPage;
  const showCookieConsent = location.pathname !== "/team/akash" && !isAdminPage;
  
  return (
    <>
      {showCookieConsent && <CookieConsent />}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/services" element={<Services />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/team/akash" element={<Founder />} />
        <Route path="/founder" element={<Navigate to="/team/akash" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/ridesafe" element={<BurgRideSafePage />} />
        <Route path="/ridesafe/cicf" element={<BurgRideSafeCICFProposal />} />
        <Route path="/admin" element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        } />
        <Route path="/admin/login" element={<AdminSigninPage />} />
        <Route path="/admin/signup" element={<AdminSignupPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <SearchProvider>
      <ToastProvider>
        <AdminAuthProvider>
          <AppContent />
        </AdminAuthProvider>
      </ToastProvider>
    </SearchProvider>
  );
}

export default App;
