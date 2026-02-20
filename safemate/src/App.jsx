import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import ReportSection from './pages/ReportSection';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/citizen" element={<UserDashboard />} />
        <Route path="/authority" element={<AuthorityDashboard />} />
        <Route path="/report" element={<ReportSection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
