// src/features/auth/store/authStore.js
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import authService from '@/api/services/auth.service';

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      // Login
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.login(email, password);
          
          // Debug: Log what we received from API
          console.log('🔐 Login Response:', {
            fullData: data,
            user: data.data?.user || data.user,
            accessToken: data.data?.accessToken || data.accessToken ? '✅ exists' : '❌ missing',
            refreshToken: data.data?.refreshToken || data.refreshToken ? '✅ exists' : '❌ missing',
          });
          
          // Extract user from nested data structure
          const user = data.data?.user || data.user;
          const accessToken = data.data?.accessToken || data.accessToken;
          const refreshToken = data.data?.refreshToken || data.refreshToken;
          
          console.log('🔍 Raw user object from API:', JSON.stringify(user, null, 2));
          console.log('🔍 User properties:', {
            role: user?.role,
            roles: user?.roles,
            userType: user?.userType,
            type: user?.type,
            accountType: user?.accountType
          });
          
          // Normalize user object - convert roles array to single role
          if (user && user.roles && Array.isArray(user.roles)) {
            user.role = user.roles[0]?.toLowerCase(); // Take first role and convert to lowercase
            console.log('✅ Normalized role from array:', user.roles, '→', user.role);
          }
          
          // Also check if role exists in other properties
          if (!user.role && user.userType) {
            user.role = user.userType.toLowerCase();
            console.log('✅ Using userType as role:', user.role);
          }
          
          // Check all possible role properties
          if (!user.role) {
            const possibleRoleProps = ['type', 'accountType', 'userRole', 'roleType'];
            for (const prop of possibleRoleProps) {
              if (user[prop]) {
                user.role = typeof user[prop] === 'string' ? user[prop].toLowerCase() : user[prop];
                console.log(`✅ Using ${prop} as role:`, user.role);
                break;
              }
            }
          }
          
          // Last resort: check if email contains patient/doctor
          if (!user.role && user.email) {
            // This is a temporary fallback - remove in production
            if (user.email.toLowerCase().includes('patient')) {
              user.role = 'patient';
              console.log('⚠️ FALLBACK: Detected patient from email');
            } else if (user.email.toLowerCase().includes('doctor')) {
              user.role = 'doctor';
              console.log('⚠️ FALLBACK: Detected doctor from email');
            }
          }
          
          // Ensure role is always lowercase
          if (user.role && typeof user.role === 'string') {
            user.role = user.role.toLowerCase();
          }
          
          // Normalize profile image field name
          if (user && user.profileImage && !user.profileImageUrl) {
            user.profileImageUrl = user.profileImage;
            console.log('✅ Normalized profileImage → profileImageUrl:', user.profileImageUrl);
          }
          
          console.log('💾 Storing user:', user);
          console.log('💾 Final user.role:', user?.role);
          console.log('🖼️ Profile Image URL:', user?.profileImageUrl);
          console.log('🔍 All user properties:', Object.keys(user || {}));
          
          set({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
            isAuthenticated: true,
            loading: false,
          });
          return data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'فشل تسجيل الدخول';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Register
      register: async (userData, userType) => {
        set({ loading: true, error: null });
        try {
          console.log(' محاولة التسجيل:', { userType, email: userData.email });
          console.log('🔄 محاولة التسجيل:', { userType, email: userData.email });
          
          const data = userType === 'doctor' 
            ? await authService.registerDoctor(userData)
            : await authService.registerPatient(userData);
          
          console.log('✅ نجح التسجيل:', data);
          set({ loading: false });
          return data;
        } catch (error) {
          console.error('❌ فشل التسجيل:', error);
          console.error('📋 تفاصيل الخطأ:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
          
          let errorMessage = 'فشل إنشاء الحساب';
          
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response?.data?.errors) {
            // Handle validation errors
            const errors = error.response.data.errors;
            errorMessage = Object.values(errors).flat().join(', ');
          } else if (error.message === 'Network Error') {
            errorMessage = 'خطأ في الاتصال بالخادم. تأكد من تشغيل الـ Backend';
          } else if (error.code === 'ERR_NETWORK') {
            errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من عنوان API';
          }
          
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Verify Email
      verifyEmail: async (email, otpCode) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.verifyEmail(email, otpCode);
          
          // Extract user from nested data structure
          const user = data.data?.user || data.user;
          const accessToken = data.data?.accessToken || data.accessToken;
          const refreshToken = data.data?.refreshToken || data.refreshToken;
          
          // Normalize user object - convert roles array to single role
          if (user && user.roles && Array.isArray(user.roles)) {
            user.role = user.roles[0];
            console.log('✅ Normalized role from array:', user.roles, '→', user.role);
          }
          
          // Normalize profile image field name
          if (user && user.profileImage && !user.profileImageUrl) {
            user.profileImageUrl = user.profileImage;
            console.log('✅ Normalized profileImage → profileImageUrl:', user.profileImageUrl);
          }
          
          set({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
            isAuthenticated: true,
            loading: false,
          });
          return data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'فشل التحقق من البريد';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Logout
      logout: async () => {
        const { accessToken, refreshToken } = get();
        set({ loading: true });
        try {
          if (accessToken && refreshToken) {
            await authService.logout(accessToken, refreshToken);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      },

      // Reset Password
      resetPassword: async (email, otpCode, newPassword, confirmPassword) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.resetPassword(email, otpCode, newPassword, confirmPassword);
          set({ loading: false });
          return data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'فشل إعادة تعيين كلمة المرور';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Forgot Password
      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.forgotPassword(email);
          set({ loading: false });
          return data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'فشل إرسال رمز التحقق';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Resend Verification
      resendVerification: async (email) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.resendVerification(email);
          set({ loading: false });
          return data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'فشل إعادة إرسال رمز التحقق';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Update User Profile (e.g., after uploading profile image)
      updateUserProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      // Clear Error
      clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);