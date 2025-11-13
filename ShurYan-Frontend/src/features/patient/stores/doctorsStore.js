/**
 * Doctors Store
 * Manages doctors list, filters, pagination, and selected doctor details
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import patientService from '@/api/services/patient.service';

export const useDoctorsStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        doctors: [], // Doctors from API (current page)
        selectedDoctor: null,
        loading: false,
        error: null,

        // Server-side Pagination
        pageNumber: 1,
        pageSize: 10, // Match backend default
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,

        // Filters (for UI only - not sent to backend yet)
        searchTerm: '',
        selectedSpecialties: [],
        selectedCities: [],
        minRating: 0,
        priceRange: [0, 1000],
        availableToday: false,

        // Actions

        /**
         * Fetch doctors from API with server-side pagination
         */
        fetchDoctors: async () => {
          set({ loading: true, error: null });
          try {
            const { pageNumber, pageSize } = get();
            
            console.log('📡 Fetching doctors - Page:', pageNumber, 'Size:', pageSize);
            
            const response = await patientService.getDoctorsList({
              pageNumber,
              pageSize,
            });

            console.log('📦 API Response:', response);

            if (response.isSuccess) {
              const { data, totalCount, totalPages, hasPreviousPage, hasNextPage } = response.data;
              
              console.log('✅ Doctors loaded:', {
                count: data?.length,
                totalCount,
                totalPages,
                currentPage: pageNumber,
                hasPreviousPage,
                hasNextPage
              });
              
              set({
                doctors: data || [],
                totalCount: totalCount || 0,
                totalPages: totalPages || 0,
                hasPreviousPage: hasPreviousPage || false,
                hasNextPage: hasNextPage || false,
                loading: false,
              });
            } else {
              set({ error: response.message || 'فشل تحميل الأطباء', loading: false });
            }
          } catch (error) {
            console.error('❌ Error fetching doctors:', error);
            set({
              error: error.message || 'حدث خطأ أثناء تحميل الأطباء',
              loading: false,
            });
          }
        },

        /**
         * Apply client-side filters (UI only for now)
         * TODO: Send filters to backend when API supports it
         */
        applyClientFilters: () => {
          const {
            doctors,
            searchTerm,
            selectedSpecialties,
            selectedCities,
            minRating,
            priceRange,
            availableToday,
          } = get();

          let filtered = [...doctors];

          // 1. Search by name (client-side)
          if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((doc) =>
              doc.fullName?.toLowerCase().includes(term)
            );
          }

          // 2. Filter by specialties (client-side)
          if (selectedSpecialties.length > 0) {
            filtered = filtered.filter((doc) =>
              selectedSpecialties.includes(doc.medicalSpecialty)
            );
          }

          // 3. Filter by cities (client-side)
          if (selectedCities.length > 0) {
            filtered = filtered.filter((doc) => {
              const matchCity = selectedCities.includes(doc.city);
              const matchGovernorate = selectedCities.includes(doc.governorate);
              return matchCity || matchGovernorate;
            });
          }

          // 4. Filter by rating (client-side)
          if (minRating > 0) {
            filtered = filtered.filter((doc) => (doc.averageRating || 0) >= minRating);
          }

          // 5. Filter by price range (client-side)
          if (priceRange[0] > 0 || priceRange[1] < 1000) {
            filtered = filtered.filter(
              (doc) =>
                doc.regularConsultationFee >= priceRange[0] &&
                doc.regularConsultationFee <= priceRange[1]
            );
          }

          // 6. Filter by available today (client-side)
          if (availableToday) {
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            
            filtered = filtered.filter((doc) => {
              if (!doc.nextAvailableSlot) return false;
              const slotDate = new Date(doc.nextAvailableSlot);
              return slotDate >= todayStart && slotDate <= todayEnd;
            });
          }

          return filtered;
        },

        /**
         * Fetch detailed information about a specific doctor
         */
        fetchDoctorDetails: async (doctorId) => {
          set({ loading: true, error: null });
          try {
            const response = await patientService.getDoctorDetails(doctorId);

            if (response.isSuccess) {
              set({ selectedDoctor: response.data, loading: false });
              return response.data;
            } else {
              set({
                error: response.message || 'فشل تحميل تفاصيل الطبيب',
                loading: false,
              });
              return null;
            }
          } catch (error) {
            console.error('Error fetching doctor details:', error);
            set({
              error: error.message || 'حدث خطأ أثناء تحميل تفاصيل الطبيب',
              loading: false,
            });
            return null;
          }
        },

        /**
         * Go to next page
         */
        goToNextPage: () => {
          const { hasNextPage, pageNumber } = get();
          if (hasNextPage) {
            set({ pageNumber: pageNumber + 1 });
            get().fetchDoctors();
          }
        },

        /**
         * Go to previous page
         */
        goToPreviousPage: () => {
          const { hasPreviousPage, pageNumber } = get();
          if (hasPreviousPage) {
            set({ pageNumber: pageNumber - 1 });
            get().fetchDoctors();
          }
        },

        /**
         * Set search term (UI only for now)
         */
        setSearchTerm: (searchTerm) => {
          set({ searchTerm });
        },

        /**
         * Set selected specialties (UI only for now)
         */
        setSelectedSpecialties: (specialties) => {
          set({ selectedSpecialties: specialties });
        },

        /**
         * Set selected cities (UI only for now)
         */
        setSelectedCities: (cities) => {
          set({ selectedCities: cities });
        },

        /**
         * Set minimum rating filter (UI only for now)
         */
        setMinRating: (rating) => {
          set({ minRating: rating });
        },

        /**
         * Set price range filter (UI only for now)
         */
        setPriceRange: (range) => {
          set({ priceRange: range });
        },

        /**
         * Set available today filter (UI only for now)
         */
        setAvailableToday: (available) => {
          set({ availableToday: available });
        },

        /**
         * Reset all filters
         */
        resetFilters: () => {
          set({
            searchTerm: '',
            selectedSpecialties: [],
            selectedCities: [],
            minRating: 0,
            priceRange: [0, 1000],
            availableToday: false,
          });
        },

        /**
         * Clear selected doctor
         */
        clearSelectedDoctor: () => {
          set({ selectedDoctor: null });
        },

        /**
         * Clear error
         */
        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'doctors-storage',
        partialize: (state) => ({
          pageSize: state.pageSize,
        }),
      }
    ),
    { name: 'DoctorsStore' }
  )
);
