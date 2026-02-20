import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import ReportSection from './pages/ReportSection';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/authority" element={<AuthorityDashboard />} />
        <Route path="/report" element={<ReportSection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
