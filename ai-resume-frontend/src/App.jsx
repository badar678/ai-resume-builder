import { Routes, Route, Navigate } from 'react-router-dom'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import EmailVerification from './pages/auth/EmailVerification'

// App Pages
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/builder/ResumeBuilder'
import TemplateSelection from './pages/TemplateSelection'
import PDFPreview from './pages/PDFPreview'
import NotFound from './pages/NotFound'
import ResetPassword from './pages/auth/ResetPassword'
import ATSAnalyzer from './pages/ATSAnalyzer'
import AISuggestions from './pages/AISuggestions'
import PricingPage from './pages/PricingPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import AdminPanel from './pages/admin/AdminPanel'

// Route Guards
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <div className="font-['Inter']">

      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Guest Only Routes (logged out users) */}
        <Route path="/login" element={
          <GuestRoute><Login /></GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute><Register /></GuestRoute>
        } />
        <Route path="/forgot-password" element={
          <GuestRoute><ForgotPassword /></GuestRoute>
        } />
        <Route path="/reset-password" element={
          <GuestRoute><ResetPassword /></GuestRoute>
        } />
        <Route path="/verify-email" element={
          <GuestRoute><EmailVerification /></GuestRoute>
        } />

        {/* Protected Routes (logged in users only) */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/builder/:resumeId" element={
          <ProtectedRoute><ResumeBuilder /></ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute><TemplateSelection /></ProtectedRoute>
        } />
        <Route path="/preview/:resumeId" element={
          <ProtectedRoute><PDFPreview /></ProtectedRoute>
        } />
        <Route path="/ats-analyzer" element={
  <ProtectedRoute><ATSAnalyzer /></ProtectedRoute>
} />
<Route path="/ai-suggestions" element={
  <ProtectedRoute><AISuggestions /></ProtectedRoute>
} />
<Route path="/pricing" element={
  <ProtectedRoute><PricingPage /></ProtectedRoute>
} />
<Route path="/payment-success" element={
  <ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>
} />
<Route path="/admin" element={
  <AdminRoute><AdminPanel /></AdminRoute>
} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}