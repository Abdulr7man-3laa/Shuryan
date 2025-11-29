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
        filteredDoctors: [], // Filtered doctors (computed from doctors + filters)
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
         * Fetch doctors from API with server-side pagination and filtering
         */
        fetchDoctors: async () => {
          set({ loading: true, error: null });
          try {
            const {
              pageNumber,
              pageSize,
              searchTerm,
              selectedSpecialties,
              selectedCities,
              minRating,
              priceRange,
              availableToday
            } = get();

            // Build API parameters with pagination
            const params = {
              pageNumber,
              pageSize,
            };

            // Add filters to API request (server-side filtering)
            if (searchTerm?.trim()) {
              params.SearchTerm = searchTerm.trim();
            }

            // Backend accepts MedicalSpecialty as single integer, not array
            // If multiple specialties selected, send the first one for now
            if (selectedSpecialties.length > 0) {
              params.MedicalSpecialty = selectedSpecialties[0];
            }

            // Backend accepts Governorate as integer ID
            // If multiple governorates selected, send the first one for now
            if (selectedCities.length > 0) {
              params.Governorate = selectedCities[0];
            }

            if (minRating > 0) {
              params.MinRating = minRating;
            }

            if (priceRange[0] > 0) {
              params.MinPrice = priceRange[0];
            }

            if (priceRange[1] < 1000) {
              params.MaxPrice = priceRange[1];
            }

            if (availableToday) {
              params.AvailableToday = true;
            }

            console.log('📡 Fetching doctors with filters:', params);

            const response = await patientService.getDoctorsList(params);

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
                filteredDoctors: data || [], // Server already filtered, no need for client-side filtering
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
         * Apply client-side filters and update filteredDoctors state
         * This triggers re-renders when called
         */
        updateFilteredDoctors: () => {
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
            filtered = filtered.filter((doc) => {
              if (!doc.fullName) return false;

              // Remove common doctor title prefixes for better search
              const cleanName = doc.fullName
                .toLowerCase()
                .replace(/^(د\.|dr\.|دكتور|doctor)\s*/i, '');

              // Also check the original name in case user includes the title
              return cleanName.includes(term) || doc.fullName.toLowerCase().includes(term);
            });
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

          set({ filteredDoctors: filtered });
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
         * Set search term and fetch from backend
         */
        setSearchTerm: (searchTerm) => {
          set({ searchTerm, pageNumber: 1 });
          get().fetchDoctors();
        },

        /**
         * Set selected specialties and fetch from backend
         */
        setSelectedSpecialties: (specialties) => {
          set({ selectedSpecialties: specialties, pageNumber: 1 });
          get().fetchDoctors();
        },

        /**
         * Set selected cities and fetch from backend
         */
        setSelectedCities: (cities) => {
          set({ selectedCities: cities, pageNumber: 1 });
          get().fetchDoctors();
        },

        /**
         * Set minimum rating filter and fetch from backend
         */
        setMinRating: (rating) => {
          set({ minRating: rating, pageNumber: 1 });
          get().fetchDoctors();
        },

        /**
         * Set price range filter and fetch from backend
         */
        setPriceRange: (range) => {
          set({ priceRange: range, pageNumber: 1 });
          get().fetchDoctors();
        },

        /**
         * Set available today filter and fetch from backend
         */
        setAvailableToday: (available) => {
          set({ availableToday: available, pageNumber: 1 });
          get().fetchDoctors();
        },

        /**
         * Reset all filters and fetch from backend
         */
        resetFilters: () => {
          set({
            searchTerm: '',
            selectedSpecialties: [],
            selectedCities: [],
            minRating: 0,
            priceRange: [0, 1000],
            availableToday: false,
            pageNumber: 1,
          });
          get().fetchDoctors();
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
