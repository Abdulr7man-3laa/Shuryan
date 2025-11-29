import { create } from 'zustand';
import { getServices, createService, updateService, deleteService, updateServiceAvailability } from '../../../api/services/laboratory.service';

/**
 * Laboratory Services Store
 * Manages laboratory services state with Zustand
 */
const useServicesStore = create((set, get) => ({
    // State
    services: [],
    loading: false,
    error: null,

    /**
     * Fetch all laboratory services
     */
    fetchServices: async () => {
        set({ loading: true, error: null });
        try {
            const services = await getServices();
            set({ services, loading: false });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل في تحميل الخدمات';
            set({ error: errorMessage, loading: false });
            console.error('❌ Error in fetchServices:', error);
        }
    },

    /**
     * Create a new service
     * @param {Object} serviceData - Service data
     */
    createService: async (serviceData) => {
        set({ loading: true, error: null });
        try {
            const newService = await createService(serviceData);
            set((state) => ({
                services: [...state.services, newService],
                loading: false,
            }));
            return { success: true, service: newService };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل في إضافة الخدمة';
            set({ error: errorMessage, loading: false });
            console.error('❌ Error in createService:', error);
            return { success: false, error: errorMessage };
        }
    },

    /**
     * Update service price and notes
     * @param {string} serviceId - Service ID
     * @param {Object} updateData - Update data
     */
    updateService: async (serviceId, updateData) => {
        set({ loading: true, error: null });
        try {
            const updatedService = await updateService(serviceId, updateData);
            set((state) => ({
                services: state.services.map((service) =>
                    service.id === serviceId ? updatedService : service
                ),
                loading: false,
            }));
            return { success: true, service: updatedService };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل في تحديث الخدمة';
            set({ error: errorMessage, loading: false });
            console.error('❌ Error in updateService:', error);
            return { success: false, error: errorMessage };
        }
    },

    /**
     * Delete a service
     * @param {string} serviceId - Service ID
     */
    deleteService: async (serviceId) => {
        set({ loading: true, error: null });
        try {
            await deleteService(serviceId);
            set((state) => ({
                services: state.services.filter((service) => service.id !== serviceId),
                loading: false,
            }));
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل في حذف الخدمة';
            set({ error: errorMessage, loading: false });
            console.error('❌ Error in deleteService:', error);
            return { success: false, error: errorMessage };
        }
    },

    /**
     * Toggle service availability
     * @param {string} serviceId - Service ID
     * @param {boolean} isAvailable - New availability status
     */
    toggleServiceAvailability: async (serviceId, isAvailable) => {
        // Optimistic update
        const prevServices = get().services;
        set((state) => ({
            services: state.services.map((service) =>
                service.id === serviceId ? { ...service, isAvailable } : service
            ),
        }));

        try {
            const updatedService = await updateServiceAvailability(serviceId, isAvailable);
            set((state) => ({
                services: state.services.map((service) =>
                    service.id === serviceId ? updatedService : service
                ),
            }));
            return { success: true, service: updatedService };
        } catch (error) {
            // Rollback on error
            set({ services: prevServices });
            const errorMessage = error.response?.data?.message || 'فشل في تحديث حالة الخدمة';
            set({ error: errorMessage });
            console.error('❌ Error in toggleServiceAvailability:', error);
            return { success: false, error: errorMessage };
        }
    },

    /**
     * Clear error
     */
    clearError: () => set({ error: null }),

    /**
     * Reset store
     */
    reset: () => set({ services: [], loading: false, error: null }),
}));

export default useServicesStore;
