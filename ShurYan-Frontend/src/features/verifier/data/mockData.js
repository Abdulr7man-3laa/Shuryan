/**
 * ⚠️ MOCK DATA - TO BE REMOVED WHEN API IS READY
 * 
 * Centralized mock data for Verifier feature
 * Delete this entire file when connecting to real API endpoints
 */

// Application Status Enum
export const APPLICATION_STATUS = {
  PENDING: 0,
  UNDER_REVIEW: 1,
  APPROVED: 2,
  REJECTED: 3,
};

// Application Type
export const APPLICATION_TYPE = {
  DOCTOR: 'doctor',
  PHARMACY: 'pharmacy',
  LABORATORY: 'laboratory',
};

// Document Status
export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CLARIFICATION_NEEDED: 'clarification_needed',
};

// Mock Doctor Applications
export const mockDoctorApplications = [
  {
    id: '1',
    type: APPLICATION_TYPE.DOCTOR,
    status: APPLICATION_STATUS.PENDING,
    applicantName: 'د. أحمد محمد علي',
    email: 'ahmed.mohamed@example.com',
    phoneNumber: '01234567890',
    specialty: 'طب العظام',
    yearsOfExperience: 10,
    profileImageUrl: 'https://i.pravatar.cc/150?img=12',
    submittedAt: '2025-01-15T10:30:00Z',
    documents: [
      {
        id: 'doc1',
        type: 'NationalId',
        typeName: 'البطاقة الشخصية',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc1.pdf',
        notes: '',
      },
      {
        id: 'doc2',
        type: 'MedicalLicense',
        typeName: 'الترخيص الطبي',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc2.pdf',
        notes: '',
      },
      {
        id: 'doc3',
        type: 'SyndicateMembership',
        typeName: 'عضوية النقابة',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc3.pdf',
        notes: '',
      },
      {
        id: 'doc4',
        type: 'GraduationCertificate',
        typeName: 'شهادة التخرج',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc4.pdf',
        notes: '',
      },
      {
        id: 'doc5',
        type: 'SpecializationCertificate',
        typeName: 'شهادة التخصص',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc5.pdf',
        notes: '',
      },
    ],
    generalNotes: '',
  },
  {
    id: '2',
    type: APPLICATION_TYPE.DOCTOR,
    status: APPLICATION_STATUS.UNDER_REVIEW,
    applicantName: 'د. فاطمة حسن',
    email: 'fatma.hassan@example.com',
    phoneNumber: '01123456789',
    specialty: 'طب الأطفال',
    yearsOfExperience: 8,
    profileImageUrl: 'https://i.pravatar.cc/150?img=45',
    submittedAt: '2025-01-14T14:20:00Z',
    documents: [
      {
        id: 'doc6',
        type: 'NationalId',
        typeName: 'البطاقة الشخصية',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc6.pdf',
        notes: '',
      },
      {
        id: 'doc7',
        type: 'MedicalLicense',
        typeName: 'الترخيص الطبي',
        status: DOCUMENT_STATUS.CLARIFICATION_NEEDED,
        fileUrl: 'https://example.com/doc7.pdf',
        notes: 'الصورة غير واضحة، يرجى رفع نسخة أوضح',
      },
      {
        id: 'doc8',
        type: 'SyndicateMembership',
        typeName: 'عضوية النقابة',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc8.pdf',
        notes: '',
      },
      {
        id: 'doc9',
        type: 'GraduationCertificate',
        typeName: 'شهادة التخرج',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc9.pdf',
        notes: '',
      },
      {
        id: 'doc10',
        type: 'SpecializationCertificate',
        typeName: 'شهادة التخصص',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc10.pdf',
        notes: '',
      },
    ],
    generalNotes: 'تم طلب توضيح للترخيص الطبي',
  },
  {
    id: '3',
    type: APPLICATION_TYPE.DOCTOR,
    status: APPLICATION_STATUS.APPROVED,
    applicantName: 'د. محمود سعيد',
    email: 'mahmoud.saeed@example.com',
    phoneNumber: '01098765432',
    specialty: 'جراحة القلب',
    yearsOfExperience: 15,
    profileImageUrl: 'https://i.pravatar.cc/150?img=33',
    submittedAt: '2025-01-13T09:15:00Z',
    approvedAt: '2025-01-15T11:00:00Z',
    documents: [
      {
        id: 'doc11',
        type: 'NationalId',
        typeName: 'البطاقة الشخصية',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc11.pdf',
        notes: '',
      },
      {
        id: 'doc12',
        type: 'MedicalLicense',
        typeName: 'الترخيص الطبي',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc12.pdf',
        notes: '',
      },
      {
        id: 'doc13',
        type: 'SyndicateMembership',
        typeName: 'عضوية النقابة',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc13.pdf',
        notes: '',
      },
      {
        id: 'doc14',
        type: 'GraduationCertificate',
        typeName: 'شهادة التخرج',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc14.pdf',
        notes: '',
      },
      {
        id: 'doc15',
        type: 'SpecializationCertificate',
        typeName: 'شهادة التخصص',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc15.pdf',
        notes: '',
      },
    ],
    generalNotes: 'جميع المستندات مطابقة',
  },
  {
    id: '4',
    type: APPLICATION_TYPE.DOCTOR,
    status: APPLICATION_STATUS.REJECTED,
    applicantName: 'د. سارة أحمد',
    email: 'sara.ahmed@example.com',
    phoneNumber: '01156789012',
    specialty: 'طب الأسنان',
    yearsOfExperience: 5,
    profileImageUrl: 'https://i.pravatar.cc/150?img=47',
    submittedAt: '2025-01-12T16:45:00Z',
    rejectedAt: '2025-01-14T10:30:00Z',
    documents: [
      {
        id: 'doc16',
        type: 'NationalId',
        typeName: 'البطاقة الشخصية',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc16.pdf',
        notes: '',
      },
      {
        id: 'doc17',
        type: 'MedicalLicense',
        typeName: 'الترخيص الطبي',
        status: DOCUMENT_STATUS.REJECTED,
        fileUrl: 'https://example.com/doc17.pdf',
        notes: 'الترخيص منتهي الصلاحية',
      },
      {
        id: 'doc18',
        type: 'SyndicateMembership',
        typeName: 'عضوية النقابة',
        status: DOCUMENT_STATUS.REJECTED,
        fileUrl: 'https://example.com/doc18.pdf',
        notes: 'العضوية غير مفعلة',
      },
      {
        id: 'doc19',
        type: 'GraduationCertificate',
        typeName: 'شهادة التخرج',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc19.pdf',
        notes: '',
      },
      {
        id: 'doc20',
        type: 'SpecializationCertificate',
        typeName: 'شهادة التخصص',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc20.pdf',
        notes: '',
      },
    ],
    generalNotes: 'تم الرفض بسبب انتهاء صلاحية الترخيص وعدم تفعيل العضوية',
  },
];

// Mock Pharmacy Applications
export const mockPharmacyApplications = [
  {
    id: '5',
    type: APPLICATION_TYPE.PHARMACY,
    status: APPLICATION_STATUS.PENDING,
    applicantName: 'صيدلية النور',
    email: 'alnoor.pharmacy@example.com',
    phoneNumber: '01234567891',
    ownerName: 'أ. خالد محمود',
    address: 'القاهرة، مدينة نصر، شارع عباس العقاد',
    profileImageUrl: 'https://i.pravatar.cc/150?img=60',
    submittedAt: '2025-01-15T11:00:00Z',
    documents: [
      {
        id: 'doc21',
        type: 'CommercialRegister',
        typeName: 'السجل التجاري',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc21.pdf',
        notes: '',
      },
      {
        id: 'doc22',
        type: 'PharmacyLicense',
        typeName: 'ترخيص الصيدلية',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc22.pdf',
        notes: '',
      },
      {
        id: 'doc23',
        type: 'OwnerNationalId',
        typeName: 'بطاقة المالك',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc23.pdf',
        notes: '',
      },
    ],
    generalNotes: '',
  },
  {
    id: '6',
    type: APPLICATION_TYPE.PHARMACY,
    status: APPLICATION_STATUS.APPROVED,
    applicantName: 'صيدلية الشفاء',
    email: 'alshefaa.pharmacy@example.com',
    phoneNumber: '01123456780',
    ownerName: 'د. منى حسن',
    address: 'الجيزة، المهندسين، شارع جامعة الدول',
    profileImageUrl: 'https://i.pravatar.cc/150?img=48',
    submittedAt: '2025-01-13T13:30:00Z',
    approvedAt: '2025-01-15T09:00:00Z',
    documents: [
      {
        id: 'doc24',
        type: 'CommercialRegister',
        typeName: 'السجل التجاري',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc24.pdf',
        notes: '',
      },
      {
        id: 'doc25',
        type: 'PharmacyLicense',
        typeName: 'ترخيص الصيدلية',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc25.pdf',
        notes: '',
      },
      {
        id: 'doc26',
        type: 'OwnerNationalId',
        typeName: 'بطاقة المالك',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc26.pdf',
        notes: '',
      },
    ],
    generalNotes: 'جميع المستندات صحيحة',
  },
];

// Mock Laboratory Applications
export const mockLaboratoryApplications = [
  {
    id: '7',
    type: APPLICATION_TYPE.LABORATORY,
    status: APPLICATION_STATUS.PENDING,
    applicantName: 'معمل الدقة',
    email: 'aldekka.lab@example.com',
    phoneNumber: '01234567892',
    ownerName: 'د. أحمد فتحي',
    address: 'الإسكندرية، سموحة، شارع فوزي معاذ',
    profileImageUrl: 'https://i.pravatar.cc/150?img=51',
    submittedAt: '2025-01-15T12:00:00Z',
    documents: [
      {
        id: 'doc27',
        type: 'CommercialRegister',
        typeName: 'السجل التجاري',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc27.pdf',
        notes: '',
      },
      {
        id: 'doc28',
        type: 'LaboratoryLicense',
        typeName: 'ترخيص المعمل',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc28.pdf',
        notes: '',
      },
      {
        id: 'doc29',
        type: 'OwnerNationalId',
        typeName: 'بطاقة المالك',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc29.pdf',
        notes: '',
      },
      {
        id: 'doc30',
        type: 'QualityControl',
        typeName: 'شهادة الجودة',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc30.pdf',
        notes: '',
      },
    ],
    generalNotes: '',
  },
  {
    id: '8',
    type: APPLICATION_TYPE.LABORATORY,
    status: APPLICATION_STATUS.UNDER_REVIEW,
    applicantName: 'معمل المختبر',
    email: 'almokhtar.lab@example.com',
    phoneNumber: '01123456781',
    ownerName: 'د. هشام علي',
    address: 'القاهرة، مصر الجديدة، شارع الحجاز',
    profileImageUrl: 'https://i.pravatar.cc/150?img=52',
    submittedAt: '2025-01-14T10:00:00Z',
    documents: [
      {
        id: 'doc31',
        type: 'CommercialRegister',
        typeName: 'السجل التجاري',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc31.pdf',
        notes: '',
      },
      {
        id: 'doc32',
        type: 'LaboratoryLicense',
        typeName: 'ترخيص المعمل',
        status: DOCUMENT_STATUS.CLARIFICATION_NEEDED,
        fileUrl: 'https://example.com/doc32.pdf',
        notes: 'يرجى تقديم الترخيص الأصلي',
      },
      {
        id: 'doc33',
        type: 'OwnerNationalId',
        typeName: 'بطاقة المالك',
        status: DOCUMENT_STATUS.APPROVED,
        fileUrl: 'https://example.com/doc33.pdf',
        notes: '',
      },
      {
        id: 'doc34',
        type: 'QualityControl',
        typeName: 'شهادة الجودة',
        status: DOCUMENT_STATUS.PENDING,
        fileUrl: 'https://example.com/doc34.pdf',
        notes: '',
      },
    ],
    generalNotes: 'في انتظار الترخيص الأصلي',
  },
];

// Combined mock data
export const mockAllApplications = [
  ...mockDoctorApplications,
  ...mockPharmacyApplications,
  ...mockLaboratoryApplications,
];

// Mock stats
export const mockStats = {
  totalPending: mockAllApplications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
  totalUnderReview: mockAllApplications.filter(app => app.status === APPLICATION_STATUS.UNDER_REVIEW).length,
  totalApprovedToday: mockAllApplications.filter(app => 
    app.status === APPLICATION_STATUS.APPROVED && 
    app.approvedAt && 
    new Date(app.approvedAt).toDateString() === new Date().toDateString()
  ).length,
  totalDoctors: mockDoctorApplications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
  totalPharmacies: mockPharmacyApplications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
  totalLaboratories: mockLaboratoryApplications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
};
