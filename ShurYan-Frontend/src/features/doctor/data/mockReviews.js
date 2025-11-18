/**
 * Mock Reviews Data
 * 
 * ⚠️ TEMPORARY DATA - FOR DEVELOPMENT ONLY
 * 
 * This file contains mock data for reviews based on the new backend model.
 * Delete this file when connecting to real API endpoints.
 * 
 * Backend Model Structure:
 * - Multiple rating categories (1-5 scale)
 * - Anonymous reviews support
 * - Doctor reply functionality
 * - Patient information
 * - Appointment references
 */

// Mock Reviews Data - Based on Backend DoctorReview Model
export const mockReviews = [
  {
    id: "rev_001",
    appointmentId: "apt_12345",
    patientId: "pat_001",
    doctorId: "doc_001",
    
    // Rating Categories (1-5 scale)
    overallSatisfaction: 5,
    waitingTime: 4,
    communicationQuality: 5,
    clinicCleanliness: 5,
    valueForMoney: 4,
    
    // Review Content
    comment: "دكتور ممتاز جداً، متابعة دقيقة واهتمام بالتفاصيل. شرح الحالة بشكل واضح وطمأنني كثيراً. أنصح بالتعامل معه بشدة.",
    isAnonymous: false,
    isEdited: false,
    
    // Doctor Reply
    doctorReply: "شكراً جزيلاً لك على كلماتك الطيبة. أسعدني أن الخدمة كانت على مستوى توقعاتك. أتمنى لك دوام الصحة والعافية.",
    doctorRepliedAt: "2024-11-15T14:30:00Z",
    
    // Patient Info
    patient: {
      fullName: "أحمد محمد علي",
      profileImageUrl: null
    },
    
    // Timestamps
    createdAt: "2024-11-14T10:15:00Z",
    updatedAt: "2024-11-15T14:30:00Z",
    
    // Computed
    averageRating: 4.6
  },
  
  {
    id: "rev_002",
    appointmentId: "apt_12346",
    patientId: "pat_002",
    doctorId: "doc_001",
    
    overallSatisfaction: 4,
    waitingTime: 3,
    communicationQuality: 5,
    clinicCleanliness: 4,
    valueForMoney: 4,
    
    comment: "تجربة جيدة جداً، الدكتور صبور ويستمع للمريض. العيادة نظيفة والموظفين محترمين. الوقت كان أطول من المتوقع قليلاً لكن الخدمة ممتازة.",
    isAnonymous: false,
    isEdited: true,
    
    doctorReply: null,
    doctorRepliedAt: null,
    
    patient: {
      fullName: "فاطمة حسن محمود",
      profileImageUrl: null
    },
    
    createdAt: "2024-11-13T16:45:00Z",
    updatedAt: "2024-11-13T17:20:00Z",
    
    averageRating: 4.0
  },
  
  {
    id: "rev_003",
    appointmentId: "apt_12347",
    patientId: "pat_003",
    doctorId: "doc_001",
    
    overallSatisfaction: 5,
    waitingTime: 5,
    communicationQuality: 5,
    clinicCleanliness: 5,
    valueForMoney: 5,
    
    comment: "أفضل دكتور تعاملت معه في حياتي! خبرة عالية وتشخيص دقيق جداً. شرح لي كل شيء بالتفصيل وأعطاني خطة علاج واضحة. شكراً جزيلاً دكتور.",
    isAnonymous: false,
    isEdited: false,
    
    doctorReply: "أشكرك من القلب على ثقتك الغالية. سعيد جداً أن العلاج كان فعالاً. لا تتردد في التواصل معي في أي وقت.",
    doctorRepliedAt: "2024-11-12T09:15:00Z",
    
    patient: {
      fullName: "محمود السيد أحمد",
      profileImageUrl: null
    },
    
    createdAt: "2024-11-11T14:20:00Z",
    updatedAt: "2024-11-12T09:15:00Z",
    
    averageRating: 5.0
  },
  
  {
    id: "rev_004",
    appointmentId: "apt_12348",
    patientId: null, // Anonymous review
    doctorId: "doc_001",
    
    overallSatisfaction: 3,
    waitingTime: 2,
    communicationQuality: 4,
    clinicCleanliness: 4,
    valueForMoney: 3,
    
    comment: "الدكتور جيد ومتمكن، لكن وقت الانتظار كان طويل جداً. انتظرت أكثر من ساعة رغم أن موعدي كان محدد. أتمنى تحسين إدارة الوقت.",
    isAnonymous: true,
    isEdited: false,
    
    doctorReply: "أعتذر بشدة عن التأخير. نحن نعمل على تحسين إدارة المواعيد لضمان الالتزام بالأوقات المحددة. شكراً لصبرك وتفهمك.",
    doctorRepliedAt: "2024-11-10T11:45:00Z",
    
    patient: null, // Anonymous
    
    createdAt: "2024-11-09T15:30:00Z",
    updatedAt: "2024-11-10T11:45:00Z",
    
    averageRating: 3.2
  },
  
  {
    id: "rev_005",
    appointmentId: "apt_12349",
    patientId: "pat_005",
    doctorId: "doc_001",
    
    overallSatisfaction: 5,
    waitingTime: 4,
    communicationQuality: 5,
    clinicCleanliness: 5,
    valueForMoney: 5,
    
    comment: "ممتاز في التعامل والتشخيص. شرح مفصل للحالة والعلاج المطلوب. أسلوب راقي ومهني جداً. أنصح به بشدة لكل من يبحث عن طبيب متميز.",
    isAnonymous: false,
    isEdited: false,
    
    doctorReply: null,
    doctorRepliedAt: null,
    
    patient: {
      fullName: "سارة أحمد عبدالله",
      profileImageUrl: null
    },
    
    createdAt: "2024-11-08T13:10:00Z",
    updatedAt: "2024-11-08T13:10:00Z",
    
    averageRating: 4.8
  },
  
  {
    id: "rev_006",
    appointmentId: "apt_12350",
    patientId: "pat_006",
    doctorId: "doc_001",
    
    overallSatisfaction: 4,
    waitingTime: 5,
    communicationQuality: 4,
    clinicCleanliness: 5,
    valueForMoney: 4,
    
    comment: "تجربة رائعة، الدكتور متمكن جداً ويعطي وقت كافي للمريض. العيادة نظيفة ومرتبة. الموعد كان في الوقت المحدد تماماً. شكراً لك دكتور.",
    isAnonymous: false,
    isEdited: false,
    
    doctorReply: "شكراً لك على تقييمك الإيجابي. أسعدني أن الخدمة كانت مرضية لك. أتطلع لخدمتك مرة أخرى.",
    doctorRepliedAt: "2024-11-07T16:20:00Z",
    
    patient: {
      fullName: "خالد عبدالله محمد",
      profileImageUrl: null
    },
    
    createdAt: "2024-11-07T12:45:00Z",
    updatedAt: "2024-11-07T16:20:00Z",
    
    averageRating: 4.4
  },
  
  {
    id: "rev_007",
    appointmentId: "apt_12351",
    patientId: null, // Anonymous
    doctorId: "doc_001",
    
    overallSatisfaction: 2,
    waitingTime: 1,
    communicationQuality: 3,
    clinicCleanliness: 4,
    valueForMoney: 2,
    
    comment: "للأسف التجربة لم تكن كما توقعت. انتظرت وقت طويل جداً والسعر مرتفع مقارنة بالخدمة. الدكتور جيد لكن أتوقع خدمة أفضل.",
    isAnonymous: true,
    isEdited: false,
    
    doctorReply: null,
    doctorRepliedAt: null,
    
    patient: null,
    
    createdAt: "2024-11-06T17:30:00Z",
    updatedAt: "2024-11-06T17:30:00Z",
    
    averageRating: 2.4
  },
  
  {
    id: "rev_008",
    appointmentId: "apt_12352",
    patientId: "pat_008",
    doctorId: "doc_001",
    
    overallSatisfaction: 5,
    waitingTime: 4,
    communicationQuality: 5,
    clinicCleanliness: 5,
    valueForMoney: 4,
    
    comment: "دكتور محترم جداً ومتخصص. اهتم بحالتي وتابعني حتى بعد الجلسة. أسلوب مهني وودود في نفس الوقت. جزاك الله خيراً دكتور.",
    isAnonymous: false,
    isEdited: false,
    
    doctorReply: "بارك الله فيك وشكراً لثقتك الغالية. متابعة المرضى جزء مهم من عملي. أتمنى لك الشفاء العاجل.",
    doctorRepliedAt: "2024-11-05T10:30:00Z",
    
    patient: {
      fullName: "نورا عبدالرحمن",
      profileImageUrl: null
    },
    
    createdAt: "2024-11-05T08:15:00Z",
    updatedAt: "2024-11-05T10:30:00Z",
    
    averageRating: 4.6
  }
];

// Mock Statistics Data
export const mockStatistics = {
  averageRating: 4.1,
  totalReviews: 8,
  verifiedReviews: 6, // Non-anonymous reviews
  ratingDistribution: {
    5: 3, // 3 reviews with 5 stars
    4: 3, // 3 reviews with 4 stars  
    3: 1, // 1 review with 3 stars
    2: 1, // 1 review with 2 stars
    1: 0  // 0 reviews with 1 star
  },
  categoryAverages: {
    overallSatisfaction: 4.1,
    waitingTime: 3.5,
    communicationQuality: 4.5,
    clinicCleanliness: 4.6,
    valueForMoney: 3.9
  }
};

// Mock Pagination Response
export const createMockPaginationResponse = (reviews, pageNumber = 1, pageSize = 20) => {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReviews = reviews.slice(startIndex, endIndex);
  
  return {
    reviews: paginatedReviews,
    pageNumber,
    pageSize,
    totalCount: reviews.length,
    totalPages: Math.ceil(reviews.length / pageSize),
    hasNextPage: endIndex < reviews.length,
    hasPreviousPage: pageNumber > 1
  };
};

// Helper function to filter reviews by rating
export const filterReviewsByRating = (reviews, minRating) => {
  if (!minRating) return reviews;
  return reviews.filter(review => review.averageRating >= minRating);
};

// Helper function to sort reviews
export const sortReviews = (reviews, sortBy = 'date', sortOrder = 'desc') => {
  const sorted = [...reviews].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'rating':
        aValue = a.averageRating;
        bValue = b.averageRating;
        break;
      case 'overallSatisfaction':
        aValue = a.overallSatisfaction;
        bValue = b.overallSatisfaction;
        break;
      case 'date':
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return sorted;
};

/**
 * 🗑️ DELETE THIS FILE WHEN CONNECTING TO REAL API
 * 
 * Steps to remove mock data:
 * 1. Delete this file: mockReviews.js
 * 2. Update reviewsStore.js to use real API calls
 * 3. Remove mock imports from components
 * 4. Test with real backend endpoints
 */
