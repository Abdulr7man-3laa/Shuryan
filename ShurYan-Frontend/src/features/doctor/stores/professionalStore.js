import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import doctorService from '@/api/services/doctor.service';

/**
 * Professional Info Store - Manages doctor's professional information
 * 
 * Features:
 * - Professional data (specialty, experience, education)
 * - Required documents (5 types)
 * - Research papers and awards
 * - Parallel document upload
 * - Optimistic updates
 */
export const useProfessionalStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==================== State ====================
        
        // Professional Info
        professionalInfo: {
          specialty: '',
          experience: '',
          education: '',
          professionalMemberships: '',
        },
        
        // Specialty & Experience
        specialtyExperience: {
          medicalSpecialty: 0,
          yearsOfExperience: 0,
        },
        
        // Required Documents
        requiredDocuments: {
          nationalId: null,
          medicalLicense: null,
          syndicateMembership: null,
          graduationCertificate: null,
          specializationCertificate: null,
        },
        
        // Additional Documents
        researchPapers: [],
        awards: [],
        
        // Loading States
        loading: {
          fetching: false,
          saving: false,
          uploadingDocuments: false,
        },
        
        // Error State
        error: null,
        
        // Success Message
        success: null,

        // ==================== Actions ====================
        
        /**
         * Fetch all professional data in parallel
         */
        fetchAllProfessionalData: async () => {
          set({ loading: { ...get().loading, fetching: true }, error: null });

          try {
            const results = await Promise.allSettled([
              doctorService.getProfessionalInfo(),
              doctorService.getSpecialtyExperience(),
              doctorService.getRequiredDocuments(),
              doctorService.getResearchDocuments(),
              doctorService.getAwardDocuments(),
            ]);

            // Process results
            const [profInfo, specExp, reqDocs, research, awards] = results;

            // Professional Info
            if (profInfo.status === 'fulfilled') {
              const data = profInfo.value?.data || profInfo.value;
              set((state) => ({
                professionalInfo: {
                  specialty: data.specialty || '',
                  experience: data.experience || '',
                  education: data.education || '',
                  professionalMemberships: data.professionalMemberships || '',
                },
              }));
            }

            // Specialty & Experience
            if (specExp.status === 'fulfilled') {
              const data = specExp.value?.data || specExp.value;
              set((state) => ({
                specialtyExperience: {
                  medicalSpecialty: data.medicalSpecialty || 0,
                  yearsOfExperience: data.yearsOfExperience || 0,
                },
              }));
            }

            // Required Documents
            if (reqDocs.status === 'fulfilled') {
              const data = reqDocs.value?.data || reqDocs.value;
              const docs = Array.isArray(data) ? data : data.documents || [];
              
              const docMap = {
                nationalId: null,
                medicalLicense: null,
                syndicateMembership: null,
                graduationCertificate: null,
                specializationCertificate: null,
              };

              docs.forEach(doc => {
                switch(doc.documentType) {
                  case 0: docMap.nationalId = doc; break;
                  case 1: docMap.medicalLicense = doc; break;
                  case 2: docMap.syndicateMembership = doc; break;
                  case 3: docMap.graduationCertificate = doc; break;
                  case 4: docMap.specializationCertificate = doc; break;
                }
              });

              set({ requiredDocuments: docMap });
            }

            // Research Papers
            if (research.status === 'fulfilled') {
              const data = research.value?.data || research.value;
              const papers = Array.isArray(data) ? data : data.documents || [];
              set({ researchPapers: papers });
            }

            // Awards
            if (awards.status === 'fulfilled') {
              const data = awards.value?.data || awards.value;
              const awardsList = Array.isArray(data) ? data : data.documents || [];
              set({ awards: awardsList });
            }

            set({ loading: { ...get().loading, fetching: false } });
          } catch (error) {
            set({
              loading: { ...get().loading, fetching: false },
              error: error.response?.data?.message || 'فشل تحميل المعلومات المهنية',
            });
            throw error;
          }
        },

        /**
         * Update specialty and experience
         * @param {Object} data - Specialty and experience data
         */
        updateSpecialtyExperience: async (data) => {
          const previous = get().specialtyExperience;

          set({
            specialtyExperience: data,
            loading: { ...get().loading, saving: true },
            error: null,
          });

          try {
            await doctorService.updateSpecialtyExperience(data);

            set({
              loading: { ...get().loading, saving: false },
              success: 'تم حفظ التخصص والخبرة بنجاح',
            });

            setTimeout(() => set({ success: null }), 3000);
          } catch (error) {
            set({
              specialtyExperience: previous,
              loading: { ...get().loading, saving: false },
              error: error.response?.data?.message || 'فشل حفظ التخصص والخبرة',
            });
            throw error;
          }
        },

        /**
         * Upload required document
         * @param {File} file - Document file
         * @param {number} type - Document type (0-4)
         */
        uploadRequiredDocument: async (file, type) => {
          set({
            loading: { ...get().loading, uploadingDocuments: true },
            error: null,
          });

          try {
            const response = await doctorService.uploadRequiredDocument(file, type);
            const doc = response.data || response;

            // Update the specific document
            set((state) => {
              const docMap = { ...state.requiredDocuments };
              switch(type) {
                case 0: docMap.nationalId = doc; break;
                case 1: docMap.medicalLicense = doc; break;
                case 2: docMap.syndicateMembership = doc; break;
                case 3: docMap.graduationCertificate = doc; break;
                case 4: docMap.specializationCertificate = doc; break;
              }
              return {
                requiredDocuments: docMap,
                loading: { ...state.loading, uploadingDocuments: false },
                success: 'تم رفع المستند بنجاح',
              };
            });

            setTimeout(() => set({ success: null }), 3000);
          } catch (error) {
            set({
              loading: { ...get().loading, uploadingDocuments: false },
              error: error.response?.data?.message || 'فشل رفع المستند',
            });
            throw error;
          }
        },

        /**
         * Upload multiple documents in parallel
         * @param {Array} documents - Array of {file, type}
         */
        uploadMultipleDocuments: async (documents) => {
          set({
            loading: { ...get().loading, uploadingDocuments: true },
            error: null,
          });

          try {
            const promises = documents.map(({ file, type }) => 
              doctorService.uploadRequiredDocument(file, type)
            );

            const results = await Promise.allSettled(promises);

            // Process results
            const failures = results.filter(r => r.status === 'rejected');
            
            if (failures.length > 0) {
              throw new Error(`فشل رفع ${failures.length} مستند`);
            }

            // Refresh documents
            await get().fetchAllProfessionalData();

            set({
              loading: { ...get().loading, uploadingDocuments: false },
              success: 'تم رفع جميع المستندات بنجاح',
            });

            setTimeout(() => set({ success: null }), 3000);
          } catch (error) {
            set({
              loading: { ...get().loading, uploadingDocuments: false },
              error: error.message || 'فشل رفع المستندات',
            });
            throw error;
          }
        },

        /**
         * Upload research paper
         * @param {File} file - Research paper file
         */
        uploadResearchPaper: async (file) => {
          try {
            const response = await doctorService.uploadResearchDocument(file);
            const doc = response.data || response;

            set((state) => ({
              researchPapers: [...state.researchPapers, doc],
              success: 'تم رفع البحث العلمي بنجاح',
            }));

            setTimeout(() => set({ success: null }), 3000);
          } catch (error) {
            set({
              error: error.response?.data?.message || 'فشل رفع البحث العلمي',
            });
            throw error;
          }
        },

        /**
         * Upload award document
         * @param {File} file - Award document file
         */
        uploadAward: async (file) => {
          try {
            const response = await doctorService.uploadAwardDocument(file);
            const doc = response.data || response;

            set((state) => ({
              awards: [...state.awards, doc],
              success: 'تم رفع الجائزة بنجاح',
            }));

            setTimeout(() => set({ success: null }), 3000);
          } catch (error) {
            set({
              error: error.response?.data?.message || 'فشل رفع الجائزة',
            });
            throw error;
          }
        },

        /**
         * Clear error
         */
        clearError: () => set({ error: null }),

        /**
         * Clear success
         */
        clearSuccess: () => set({ success: null }),

        /**
         * Reset professional store
         */
        resetProfessionalStore: () => {
          set({
            professionalInfo: {
              specialty: '',
              experience: '',
              education: '',
              professionalMemberships: '',
            },
            specialtyExperience: {
              medicalSpecialty: 0,
              yearsOfExperience: 0,
            },
            requiredDocuments: {
              nationalId: null,
              medicalLicense: null,
              syndicateMembership: null,
              graduationCertificate: null,
              specializationCertificate: null,
            },
            researchPapers: [],
            awards: [],
            loading: {
              fetching: false,
              saving: false,
              uploadingDocuments: false,
            },
            error: null,
            success: null,
          });
        },
      }),
      {
        name: 'professional-storage',
        partialize: (state) => ({
          professionalInfo: state.professionalInfo,
          specialtyExperience: state.specialtyExperience,
        }),
      }
    ),
    { name: 'ProfessionalStore' }
  )
);
