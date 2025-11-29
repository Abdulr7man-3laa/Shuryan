import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import laboratoryService from '../../../api/services/laboratory.service';

/**
 * Laboratory Statistics Store
 * Manages laboratory statistics data
 */
const useLabStatsStore = create(
    devtools(
        (set) => ({
            // ==========================================
            // State
            // ==========================================
            statistics: null,
            loading: false,
            error: null,

            // ==========================================
            // Actions
            // ==========================================

            /**
             * Fetch laboratory statistics
             * @returns {Promise<Object>} Result with success status
             */
            fetchStatistics: async () => {
                console.log('📊 [LabStatsStore] Fetching statistics...');

                set({ loading: true, error: null });

                try {
                    const data = await laboratoryService.getStatistics();
                    console.log('✅ [LabStatsStore] Statistics fetched:', data);

                    set({
                        statistics: data,
                        loading: false,
                        error: null,
                    });

                    return { success: true, data };
                } catch (error) {
                    console.error('❌ [LabStatsStore] Error fetching statistics:', error);

                    const errorMessage = error.response?.data?.message || 'فشل في جلب الإحصائيات';

                    set({
                        statistics: null,
                        loading: false,
                        error: errorMessage,
                    });

                    return { success: false, error: errorMessage };
                }
            },

            /**
             * Clear statistics data
             */
            clearStatistics: () => {
                console.log('🧹 [LabStatsStore] Clearing statistics data');
                set({
                    statistics: null,
                    loading: false,
                    error: null,
                });
            },

            /**
             * Clear error
             */
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'laboratory-stats-store',
            partialize: (state) => ({
                // Don't persist loading states or errors
                statistics: state.statistics,
            }),
        }
    )
);

export default useLabStatsStore;
