import { useState, useEffect } from 'react';
import doctorService from '@/api/services/doctor.service';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaStar, 
  FaDollarSign 
} from 'react-icons/fa';

/**
 * Custom Hook for Doctor Dashboard Statistics
 * Fetches real-time stats from backend and maps to UI format
 * @returns {Object} { stats, loading, error, refreshStats }
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Map API data to stats array format for UI
   */
  const mapStatsToArray = (apiData) => [
    {
      id: 'patients',
      label: 'إجمالي المرضى',
      value: apiData.totalPatients,
      unit: 'مريض',
      description: 'عدد المرضى المسجلين',
      icon: FaUsers,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      glowColor: 'hover:shadow-blue-100',
    },
    {
      id: 'appointments',
      label: 'المواعيد اليوم',
      value: apiData.todayAppointments,
      unit: 'موعد',
      description: 'مواعيد اليوم',
      icon: FaCalendarAlt,
      gradientFrom: 'from-teal-500',
      gradientTo: 'to-teal-600',
      glowColor: 'hover:shadow-teal-100',
    },
    {
      id: 'rating',
      label: 'التقييم العام',
      value: apiData.averageRating || 0,
      unit: '⭐',
      description: 'متوسط التقييمات',
      icon: FaStar,
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-amber-600',
      glowColor: 'hover:shadow-amber-100',
    },
    {
      id: 'revenue',
      label: 'الإيرادات الشهرية',
      value: apiData.monthlyRevenue.toLocaleString('ar-EG'),
      unit: 'ج.م',
      description: 'إيرادات هذا الشهر',
      icon: FaDollarSign,
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
      glowColor: 'hover:shadow-purple-100',
    },
  ];

  /**
   * Fetch dashboard statistics from API
   */
  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await doctorService.getDashboardStats();
      
      if (response.isSuccess && response.data) {
        // Map API object to array format for UI
        const statsArray = mapStatsToArray(response.data);
        setStats(statsArray);
      } else {
        throw new Error(response.message || 'فشل في تحميل الإحصائيات');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'فشل في تحميل الإحصائيات';
      setError(errorMessage);
      console.error('❌ Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};
