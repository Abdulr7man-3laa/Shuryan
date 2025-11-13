// src/Router.jsx
import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout, AuthLayout, PatientLayout, DoctorLayout, PharmacyLayout } from '@/components/layout';
import { ProtectedRoute } from '@/features/auth';
import { AppLoader } from '@/components/common';
import ScrollToTop from '@/components/common/ScrollToTop';

// ==========================================
// Lazy Loading for Better Performance
// ==========================================
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const VerifyResetOtpPage = lazy(() => import('@/features/auth/pages/VerifyResetOtpPage'));
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'));

// Doctor Pages
const DoctorDashboard = lazy(() => import('@/features/doctor/pages/DoctorDashboard'));
const DoctorProfilePage = lazy(() => import('@/features/doctor/pages/DoctorProfilePage'));
const PatientsPage = lazy(() => import('@/features/doctor/pages/PatientsPage'));
const AppointmentsPage = lazy(() => import('@/features/doctor/pages/AppointmentsPage'));
const ReviewsPage = lazy(() => import('@/features/doctor/pages/ReviewsPage'));
const SessionModalWrapper = lazy(() => import('@/features/doctor/pages/SessionModalWrapper'));

// Patient Pages
const SearchDoctorsPage = lazy(() => import('@/features/patient/pages/SearchDoctorsPage'));
const ProfilePage = lazy(() => import('@/features/patient/pages/ProfilePage'));
const PatientAppointmentsPage = lazy(() => import('@/features/patient/pages/AppointmentsPage'));
const PatientPrescriptionsPage = lazy(() => import('@/features/patient/pages/PrescriptionsPage'));

// Pharmacy Pages
const PharmacyDashboard = lazy(() => import('@/features/pharmacy/pages/PharmacyDashboard'));
const PharmacyOrdersPage = lazy(() => import('@/features/pharmacy/pages/OrdersPage'));
const PharmacyProfilePage = lazy(() => import('@/features/pharmacy/pages/PharmacyProfilePage'));

// Verifier Pages
const StatisticsPage = lazy(() => import('@/features/verifier/pages/StatisticsPage'));
const DoctorsPage = lazy(() => import('@/features/verifier/pages/DoctorsPage'));
const PharmaciesPage = lazy(() => import('@/features/verifier/pages/PharmaciesPage'));
const LaboratoriesPage = lazy(() => import('@/features/verifier/pages/LaboratoriesPage'));

// Error & Utility Pages
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

// ==========================================
// Loading Fallback Component
// ==========================================
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<AppLoader />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'unauthorized',
        element: (
          <SuspenseWrapper>
            <UnauthorizedPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: '/doctor',
    element: <DoctorLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute roles={['doctor']}>
            <SuspenseWrapper>
              <DoctorDashboard />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute roles={['doctor']}>
            <SuspenseWrapper>
              <DoctorProfilePage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'patients',
        element: (
          <ProtectedRoute roles={['doctor']}>
            <SuspenseWrapper>
              <PatientsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute roles={['doctor']}>
            <SuspenseWrapper>
              <AppointmentsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'reviews',
        element: (
          <ProtectedRoute roles={['doctor']}>
            <SuspenseWrapper>
              <ReviewsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'session/:appointmentId',
        element: (
          <ProtectedRoute roles={['doctor']}>
            <SuspenseWrapper>
              <SessionModalWrapper />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/patient',
    element: <PatientLayout />,
    children: [
      {
        path: 'search',
        element: (
          <ProtectedRoute roles={['patient']}>
            <SuspenseWrapper>
              <SearchDoctorsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute roles={['patient']}>
            <SuspenseWrapper>
              <PatientAppointmentsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'prescriptions',
        element: (
          <ProtectedRoute roles={['patient']}>
            <SuspenseWrapper>
              <PatientPrescriptionsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'lab-results',
        element: (
          <ProtectedRoute roles={['patient']}>
            <SuspenseWrapper>
              <SearchDoctorsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute roles={['patient']}>
            <SuspenseWrapper>
              <ProfilePage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/pharmacy',
    element: <PharmacyLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute roles={['pharmacy']}>
            <SuspenseWrapper>
              <PharmacyDashboard />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute roles={['pharmacy']}>
            <SuspenseWrapper>
              <PharmacyOrdersPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute roles={['pharmacy']}>
            <SuspenseWrapper>
              <PharmacyProfilePage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/verifier',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/verifier/statistics" replace />,
      },
      {
        path: 'statistics',
        element: (
          <ProtectedRoute roles={['verifier']}>
            <SuspenseWrapper>
              <StatisticsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'doctors',
        element: (
          <ProtectedRoute roles={['verifier']}>
            <SuspenseWrapper>
              <DoctorsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'pharmacies',
        element: (
          <ProtectedRoute roles={['verifier']}>
            <SuspenseWrapper>
              <PharmaciesPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'laboratories',
        element: (
          <ProtectedRoute roles={['verifier']}>
            <SuspenseWrapper>
              <LaboratoriesPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'register',
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'verify-email',
        element: (
          <SuspenseWrapper>
            <VerifyEmailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <SuspenseWrapper>
            <ForgotPasswordPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'verify-reset-otp',
        element: (
          <SuspenseWrapper>
            <VerifyResetOtpPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <SuspenseWrapper>
            <ResetPasswordPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // Legacy routes for backward compatibility
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <SuspenseWrapper>
        <VerifyEmailPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <SuspenseWrapper>
        <ForgotPasswordPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verify-reset-otp',
    element: (
      <SuspenseWrapper>
        <VerifyResetOtpPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <SuspenseWrapper>
        <ResetPasswordPage />
      </SuspenseWrapper>
    ),
  },
  // ==========================================
  // 404 - Not Found (Must be last)
  // ==========================================
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;