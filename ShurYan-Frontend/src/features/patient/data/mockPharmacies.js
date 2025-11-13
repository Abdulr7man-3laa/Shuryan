/**
 * Mock Data for Nearby Pharmacies
 * ⚠️ TO BE REMOVED when API endpoint is ready
 * 
 * This file contains temporary mock data for testing the pharmacy search feature.
 * Replace with actual API call: GET /api/pharmacies/nearby
 */

export const MOCK_NEARBY_PHARMACIES = [
  {
    id: '1',
    name: 'صيدلية النور',
    profileImageUrl: 'https://via.placeholder.com/150/00b19f/ffffff?text=صيدلية+النور',
    distanceKm: 0.8,
    hasDelivery: true,
    deliveryFee: 15,
    address: 'شارع الجامعة، مدينة نصر',
    phoneNumber: '01234567890',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'صيدلية الشفاء',
    profileImageUrl: 'https://via.placeholder.com/150/14b8a6/ffffff?text=صيدلية+الشفاء',
    distanceKm: 1.2,
    hasDelivery: true,
    deliveryFee: 20,
    address: 'شارع مصطفى النحاس، مدينة نصر',
    phoneNumber: '01234567891',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'صيدلية العافية',
    profileImageUrl: 'https://via.placeholder.com/150/10b981/ffffff?text=صيدلية+العافية',
    distanceKm: 1.5,
    hasDelivery: false,
    deliveryFee: 0,
    address: 'شارع عباس العقاد، مدينة نصر',
    phoneNumber: '01234567892',
    rating: 4.5,
  },
];

/**
 * Simulates API call to fetch nearby pharmacies
 * @param {string} prescriptionId - The prescription ID
 * @param {object} patientLocation - Patient's location {latitude, longitude}
 * @returns {Promise<Array>} - Array of nearby pharmacies
 */
export const fetchNearbyPharmacies = async (prescriptionId, patientLocation) => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('🔍 Fetching nearby pharmacies for prescription:', prescriptionId);
      console.log('📍 Patient location:', patientLocation);
      resolve(MOCK_NEARBY_PHARMACIES);
    }, 1500); // 1.5 second delay
  });
};
