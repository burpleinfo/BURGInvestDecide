import ResetPasswordPage from './pages/ResetPasswordPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Navbar from './widgets/Navbar/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import { SearchProvider } from './contexts/SearchContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import CookieConsent from './components/CookieConsent';
import ToastContainer from './components/ToastContainer';


import HomePage from './pages/HomePage';
import VatikaGroupPage from './pages/VatikaGroupPage';
import BurgRealtyPage from './pages/BurgRealtyPage';
import ContactPage from './pages/ContactPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';


import AboutUs from './pages/AboutUs';
import ListYourFirmPage from './pages/ListYourFirmPage';
import ListYourFirmSuccessPage from './pages/ListYourFirmSuccessPage';
import Dashboard from './components/Dashboard';

function AppContent() {
  const location = useLocation();
  const { toasts, removeToast } = useToast();
  const showNavbar = location.pathname !== "/vatika-group" && location.pathname !== "/burg-realty" && location.pathname !== "/signin" && location.pathname !== "/signup" && location.pathname !== "/register" && location.pathname !== "/forgot-password" && location.pathname !== "/reset-password" && location.pathname !== "/dashboard";
  
  return (
    <>
      <CookieConsent />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vatika-group" element={<VatikaGroupPage />} />
        <Route path="/burg-realty" element={<BurgRealtyPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/list-your-firm" element={<ListYourFirmPage />} />
        <Route path="/list-your-firm/success" element={<ListYourFirmSuccessPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <SearchProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </SearchProvider>
  );
}

export default App;
