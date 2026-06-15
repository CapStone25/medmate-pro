import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { lazy, Suspense } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import PageLoader from "@/components/PageLoader";
import MedicineChatbot from "@/components/MedicineChatbot";
import PageTransition from "@/components/PageTransition";
import { AnimatePresence } from "framer-motion";

const Index = lazy(() => import("./pages/Index"));
const Medicines = lazy(() => import("./pages/Medicines"));
const MedicineDetail = lazy(() => import("./pages/MedicineDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CompanyDashboard = lazy(() => import("./pages/CompanyDashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SettingsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/medicines" element={<Medicines />} />
                    <Route path="/medicine/:id" element={<MedicineDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/company" element={<CompanyDashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
              </AnimatePresence>
            </Suspense>
            <MedicineChatbot />
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
