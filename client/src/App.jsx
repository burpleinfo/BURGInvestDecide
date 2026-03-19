import Navbar from './widgets/Navbar/Navbar';
import { Routes, Route, useLocation } from 'react-router-dom';


import HomePage from './pages/HomePage';
import VatikaGroupPage from './pages/VatikaGroupPage';
import BurgRealtyPage from './pages/BurgRealtyPage';
import ContactPage from './pages/ContactPage';

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/vatika-group" && location.pathname !== "/burg-realty";
  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vatika-group" element={<VatikaGroupPage />} />
        <Route path="/burg-realty" element={<BurgRealtyPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}

export default App;
