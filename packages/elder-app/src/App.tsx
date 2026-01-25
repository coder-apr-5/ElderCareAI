import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Landing Pages (Public)
import WelcomeSplashPage from "@/pages/WelcomeSplashPage";
import LandingPage from "@/pages/LandingPage";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import FamilyLoginPage from "@/pages/auth/FamilyLoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ProfileSetupPage from "@/pages/auth/ProfileSetupPage";

// Protected Pages
import { HomePage } from "@/pages/HomePage";
import ChatPage from "@/pages/ChatPage";

import { ProtectedRoute } from "@elder-nest/shared";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#F8F9FA] text-[#2C3E50] font-sans">
          <Routes>
            {/* Public Landing Pages - First Impression */}
            <Route path="/" element={<WelcomeSplashPage />} />
            <Route path="/home" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/login/family" element={<FamilyLoginPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/profile-setup" element={<ProfileSetupPage />} />

            {/* Protected Routes - Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['elder']}>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute allowedRoles={['elder']}>
                <ChatPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
