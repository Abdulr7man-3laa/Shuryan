import { useState, useEffect } from 'react';
import {
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaFileAlt,
} from 'react-icons/fa';
import {
  APPLICATION_TYPE,
  STATUS_LABELS,
  DOCUMENT_STATUS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_STATUS_COLORS,
} from '../constants/verifierConstants';
import useVerifier from '../hooks/useVerifier';
import ImageViewerModal from './ImageViewerModal';

/**
 * Application Details Modal Component
 * 
 * Full details view with document review functionality
 */
const ApplicationDetailsModal = ({ application, onClose }) => {
  const { updateDocumentStatus, approveApplication, rejectApplication, startReview, requestClarification, approveDocument, rejectDocument, loading, getDocumentStatus, fetchDoctorDocuments } = useVerifier({ autoFetch: false });
  
  const [documentStatuses, setDocumentStatuses] = useState({});
  const [documentNotes, setDocumentNotes] = useState({});
  const [generalNotes, setGeneralNotes] = useState(application.generalNotes || '');
  const [actionLoading, setActionLoading] = useState(false);
  const [documents, setDocuments] = useState(application.documents || []);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [viewingImage, setViewingImage] = useState(null); // { url, name }

  // Fetch documents from API on mount
  useEffect(() => {
    const loadDocuments = async () => {
      if (!application.id) return;
      
      setLoadingDocuments(true);
      console.log('📄 [Modal] Fetching documents for doctor:', application.id);
      
      const result = await fetchDoctorDocuments(application.id);
      
      if (result.success && result.documents) {
        console.log('✅ [Modal] Documents loaded:', result.documents);
        setDocuments(result.documents);
      } else {
        console.error('❌ [Modal] Failed to load documents:', result.error);
        // Keep using application.documents as fallback
      }
      
      setLoadingDocuments(false);
    };
    
    loadDocuments();
  }, [application.id, fetchDoctorDocuments]);

  // Initialize document statuses from documents and store cache
  useEffect(() => {
    const statuses = {};
    const notes = {};
    documents.forEach((doc) => {
      // Use cached status from store if available, otherwise use doc.status
      statuses[doc.id] = getDocumentStatus(doc.id, doc.status);
      notes[doc.id] = doc.notes || '';
    });
    setDocumentStatuses(statuses);
    setDocumentNotes(notes);
  }, [documents, getDocumentStatus]);

  // Handle approve document
  const handleApproveDocument = async (documentId) => {
    setActionLoading(true);
    const result = await approveDocument(documentId);
    setActionLoading(false);
    
    if (result.success) {
      // Update local state
      setDocumentStatuses((prev) => ({
        ...prev,
        [documentId]: DOCUMENT_STATUS.APPROVED,
      }));
    } else {
      // Handle authentication errors
      if (result.error?.includes('refresh token') || result.error?.includes('401') || result.error?.includes('Unauthorized')) {
        onClose();
        alert('🔒 انتهت صلاحية الجلسة. سيتم توجيهك لتسجيل الدخول...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        alert(`❌ حدث خطأ أثناء قبول المستند: ${result.error || 'خطأ غير معروف'}`);
      }
    }
  };

  // Handle reject document
  const handleRejectDocument = async (documentId) => {
    setActionLoading(true);
    const rejectionReason = documentNotes[documentId] || null;
    const result = await rejectDocument(documentId, rejectionReason);
    setActionLoading(false);
    
    if (result.success) {
      // Update local state
      setDocumentStatuses((prev) => ({
        ...prev,
        [documentId]: DOCUMENT_STATUS.REJECTED,
      }));
    } else {
      // Handle authentication errors
      if (result.error?.includes('refresh token') || result.error?.includes('401') || result.error?.includes('Unauthorized')) {
        onClose();
        alert('🔒 انتهت صلاحية الجلسة. سيتم توجيهك لتسجيل الدخول...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        alert(`❌ حدث خطأ أثناء رفض المستند: ${result.error || 'خطأ غير معروف'}`);
      }
    }
  };

  // Handle document notes change
  const handleDocumentNotesChange = (documentId, notes) => {
    setDocumentNotes((prev) => ({
      ...prev,
      [documentId]: notes,
    }));
  };

  // Handle approve all
  const handleApproveAll = async () => {
    if (!window.confirm('هل أنت متأكد من قبول هذا الطلب؟')) return;
    
    setActionLoading(true);
    const result = await approveApplication(application.id, generalNotes);
    setActionLoading(false);
    
    if (result.success) {
      alert('✅ تم قبول الطلب بنجاح');
      onClose();
    } else {
      // Check if it's an authentication error
      if (result.error?.includes('refresh token') || result.error?.includes('401') || result.error?.includes('Unauthorized')) {
        onClose(); // ✅ Close modal first
        alert('🔒 انتهت صلاحية الجلسة. سيتم توجيهك لتسجيل الدخول...');
        // Redirect to login immediately
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        alert(`❌ حدث خطأ أثناء قبول الطلب: ${result.error || 'خطأ غير معروف'}`);
      }
    }
  };

  // Handle reject all
  const handleRejectAll = async () => {
    if (!generalNotes.trim()) {
      alert('⚠️ يرجى كتابة سبب الرفض في الملاحظات العامة');
      return;
    }
    
    if (!window.confirm('هل أنت متأكد من رفض هذا الطلب؟')) return;
    
    setActionLoading(true);
    const result = await rejectApplication(application.id, generalNotes);
    setActionLoading(false);
    
    if (result.success) {
      alert('✅ تم رفض الطلب');
      onClose();
    } else {
      // Check if it's an authentication error
      if (result.error?.includes('refresh token') || result.error?.includes('401') || result.error?.includes('Unauthorized')) {
        onClose(); // ✅ Close modal first
        alert('🔒 انتهت صلاحية الجلسة. سيتم توجيهك لتسجيل الدخول...');
        // Redirect to login immediately
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        alert(`❌ حدث خطأ أثناء رفض الطلب: ${result.error || 'خطأ غير معروف'}`);
      }
    }
  };

  // Handle under review
  const handleUnderReview = async () => {
    if (!window.confirm('هل تريد تحويل هذا الطلب إلى "تحت المراجعة"؟')) return;
    
    setActionLoading(true);
    const result = await startReview(application.id);
    setActionLoading(false);
    
    if (result.success) {
      alert('✅ تم تحويل الطلب إلى "تحت المراجعة"');
      onClose();
    } else {
      // Check if it's an authentication error
      if (result.error?.includes('refresh token') || result.error?.includes('401') || result.error?.includes('Unauthorized')) {
        onClose(); // ✅ Close modal first
        alert('🔒 انتهت صلاحية الجلسة. سيتم توجيهك لتسجيل الدخول...');
        // Redirect to login immediately
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        alert(`❌ حدث خطأ أثناء تحويل الطلب: ${result.error || 'خطأ غير معروف'}`);
      }
    }
  };

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header with Personal Info */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-7">
          <div className="flex items-start justify-between">
            {/* Profile Image + Info */}
            <div className="flex items-start gap-6">
              {/* Profile Image - spans 2 rows */}
              <img
                src={application.profileImageUrl || 'https://i.pravatar.cc/150?img=1'}
                alt={application.fullName || application.applicantName}
                className="w-24 h-24 rounded-full border-4 border-white/30 shadow-xl object-cover"
              />
              
              {/* Info Grid */}
              <div className="flex flex-col">
                {/* Row 1: Name + Specialty */}
                <div className="flex items-center gap-6 pb-3">
                  <h2 className="text-3xl font-bold text-white">{application.fullName || application.applicantName}</h2>
                  
                  {(application.type === APPLICATION_TYPE.DOCTOR || application.medicalSpecialtyName) && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg translate-y-1">
                      <FaBriefcase className="text-white text-sm" />
                      <span className="text-sm font-semibold text-white ">
                        {application.medicalSpecialtyName || application.specialty} • {application.yearsOfExperience || 0} سنوات خبرة
                      </span>
                    </div>
                  )}
                  
                  {application.type === APPLICATION_TYPE.PHARMACY && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <FaBriefcase className="text-white text-sm" />
                      <span className="text-sm font-semibold text-white">المالك: {application.ownerName}</span>
                    </div>
                  )}
                  
                  {application.type === APPLICATION_TYPE.LABORATORY && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <FaBriefcase className="text-white text-sm" />
                      <span className="text-sm font-semibold text-white">المالك: {application.ownerName}</span>
                    </div>
                  )}
                </div>
                
                {/* Divider Line */}
                <div className="border-t border-white/15 my-2"></div>
                
                {/* Row 2: Email + Phone */}
                <div className="flex items-center gap-6 pt-1">
                  {application.email && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <FaEnvelope className="text-white text-xs" />
                      </div>
                      <span className="text-l font-medium text-white/90">{application.email}</span>
                    </div>
                  )}
                  
                  {application.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <FaPhone className="text-white text-xs" />
                      </div>
                      <span className="text-l font-medium text-white/90">{application.phoneNumber}</span>
                    </div>
                  )}
                  
                  {(application.type === APPLICATION_TYPE.PHARMACY || application.type === APPLICATION_TYPE.LABORATORY) && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/15 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <FaMapMarkerAlt className="text-white text-xs" />
                      </div>
                      <span className="text-sm font-medium text-white/90 truncate max-w-xs">{application.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes size={22} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-gray-50">
          {/* Documents Review - Organized by Type */}
          <div className="space-y-6">
            {/* Required Documents Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-teal-500 flex items-center gap-2">
                <FaFileAlt className="text-teal-600" />
                المستندات المطلوبة
                {loadingDocuments && (
                  <span className="text-xs text-slate-500 font-normal">جاري التحميل...</span>
                )}
              </h3>
              
              {loadingDocuments ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
              ) : (
                <>
              {/* First Row: 3 Documents */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {documents
                  .filter(doc => [0, 1, 4].includes(doc.type)) // 0=البطاقة، 1=رخصة، 4=شهادة التخصص
                  .map((doc) => {
                // Always use cached status from store for consistency
                const currentStatus = getDocumentStatus(doc.id, documentStatuses[doc.id] || doc.status || DOCUMENT_STATUS.PENDING);
                const statusColor = DOCUMENT_STATUS_COLORS[currentStatus];
                
                return (
                  <div
                    key={doc.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-400 transition-all"
                  >
                    {/* Document Header - Compact */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaFileAlt className="text-teal-600 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{doc.typeName}</h4>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor?.bg || 'bg-gray-100'} ${statusColor?.text || 'text-gray-700'}`}>
                            {doc.statusName || DOCUMENT_STATUS_LABELS[currentStatus]}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewingImage({ url: doc.documentUrl, name: doc.typeName })}
                        className="w-9 h-9 flex items-center justify-center bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                        title="عرض المستند"
                      >
                        <FaEye className="text-teal-600 text-base" />
                      </button>
                    </div>

                    {/* Status Actions - Accept & Reject Only */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveDocument(doc.id)}
                        disabled={actionLoading}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          currentStatus === DOCUMENT_STATUS.APPROVED
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
                        } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FaCheckCircle className="text-sm" />
                        <span>قبول</span>
                      </button>
                      <button
                        onClick={() => handleRejectDocument(doc.id)}
                        disabled={actionLoading}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          currentStatus === DOCUMENT_STATUS.REJECTED
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                        } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FaTimesCircle className="text-sm" />
                        <span>رفض</span>
                      </button>
                    </div>

                    {/* Notes - Show only when rejected */}
                    {currentStatus === DOCUMENT_STATUS.REJECTED && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <textarea
                          value={documentNotes[doc.id] || ''}
                          onChange={(e) => handleDocumentNotesChange(doc.id, e.target.value)}
                          placeholder="سبب الرفض (اختياري)..."
                          className="w-full px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none placeholder:text-red-600/50"
                          rows="2"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
              
              {/* Second Row: 2 Documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents
                  .filter(doc => [2, 3].includes(doc.type)) // 2=عضوية النقابة، 3=شهادة التخرج
                  .map((doc) => {
                const currentStatus = getDocumentStatus(doc.id, documentStatuses[doc.id] || doc.status || DOCUMENT_STATUS.PENDING);
                const statusColor = DOCUMENT_STATUS_COLORS[currentStatus];
                
                return (
                  <div
                    key={doc.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 hover:border-teal-400 transition-all"
                  >
                    {/* Document Header - Compact */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaFileAlt className="text-teal-600 text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">{doc.typeName}</h4>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColor?.bg || 'bg-gray-100'} ${statusColor?.text || 'text-gray-700'}`}>
                            {doc.statusName || DOCUMENT_STATUS_LABELS[currentStatus]}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setViewingImage({ url: doc.documentUrl, name: doc.typeName })}
                        className="w-9 h-9 flex items-center justify-center bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                        title="عرض المستند"
                      >
                        <FaEye className="text-teal-600 text-base" />
                      </button>
                    </div>

                    {/* Status Actions - Accept & Reject Only */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveDocument(doc.id)}
                        disabled={actionLoading}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          currentStatus === DOCUMENT_STATUS.APPROVED
                            ? 'bg-green-500 text-white shadow-sm'
                            : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'
                        } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FaCheckCircle className="text-sm" />
                        <span>قبول</span>
                      </button>
                      <button
                        onClick={() => handleRejectDocument(doc.id)}
                        disabled={actionLoading}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          currentStatus === DOCUMENT_STATUS.REJECTED
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'bg-white text-red-600 border border-red-200 hover:bg-red-50'
                        } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <FaTimesCircle className="text-sm" />
                        <span>رفض</span>
                      </button>
                    </div>

                    {/* Notes - Show only when rejected */}
                    {currentStatus === DOCUMENT_STATUS.REJECTED && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <textarea
                          value={documentNotes[doc.id] || ''}
                          onChange={(e) => handleDocumentNotesChange(doc.id, e.target.value)}
                          placeholder="سبب الرفض (اختياري)..."
                          className="w-full px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none placeholder:text-red-600/50"
                          rows="2"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
                </>
              )}
            </div>

            {/* Research & Awards Section - Side by Side */}
            {(() => {
              const researchDocs = documents.filter(doc => doc.type === 7); // 7=الأبحاث المنشورة
              const awardDocs = documents.filter(doc => doc.type === 6); // 6=جوائز وتقديرات
              
              if (researchDocs.length === 0 && awardDocs.length === 0) return null;
              
              return (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Research Documents - Images Only */}
                    {researchDocs.length > 0 && (
                      <div>
                        <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FaFileAlt className="text-blue-600 text-sm" />
                          </div>
                          الأبحاث المنشورة ({researchDocs.length})
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {researchDocs.map((doc, index) => (
                            <button
                              key={doc.id}
                              onClick={() => setViewingImage({ url: doc.documentUrl, name: `${doc.typeName} - ${index + 1}` })}
                              className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 hover:border-blue-400 transition-all hover:shadow-lg"
                            >
                              {/* Document Image */}
                              <img
                                src={doc.documentUrl}
                                alt={doc.typeName}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Document Number Badge */}
                              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                                {index + 1}
                              </div>
                              
                              {/* View Icon on Hover */}
                              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                  <FaEye className="text-blue-600 text-xl" />
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Awards Documents - Images Only */}
                    {awardDocs.length > 0 && (
                      <div>
                        <h3 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                            <FaFileAlt className="text-amber-600 text-sm" />
                          </div>
                          جوائز وتقديرات ({awardDocs.length})
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {awardDocs.map((doc, index) => (
                            <button
                              key={doc.id}
                              onClick={() => setViewingImage({ url: doc.documentUrl, name: `${doc.typeName} - ${index + 1}` })}
                              className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 hover:border-amber-400 transition-all hover:shadow-lg"
                            >
                              {/* Document Image */}
                              <img
                                src={doc.documentUrl}
                                alt={doc.typeName}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Document Number Badge */}
                              <div className="absolute top-2 right-2 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                                {index + 1}
                              </div>
                              
                              {/* View Icon on Hover */}
                              <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                  <FaEye className="text-amber-600 text-xl" />
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
              );
            })()}
          </div>

          {/* General Notes - Cleaner */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-5 pb-3 border-b-2 border-teal-500">
              ملاحظات عامة
            </h3>
            <textarea
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              placeholder="اكتب ملاحظاتك العامة على الطلب..."
              className="w-full px-4 py-3 bg-gray-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none placeholder:text-slate-400"
              rows="4"
            />
          </div>
        </div>

        {/* Footer Actions - Verify, Under Review & Reject */}
        <div className="border-t border-slate-200 px-8 py-6 bg-white">
          <div className="flex gap-3">
            <button
              onClick={handleApproveAll}
              disabled={actionLoading || loading.action}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCheckCircle className="text-lg" />
              <span>{actionLoading || loading.action ? 'جاري المعالجة...' : 'توثيق'}</span>
            </button>
            <button
              onClick={handleUnderReview}
              disabled={actionLoading || loading.action}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaCheckCircle className="text-lg" />
              <span>{actionLoading || loading.action ? 'جاري المعالجة...' : 'تحت المراجعة'}</span>
            </button>
            <button
              onClick={handleRejectAll}
              disabled={actionLoading || loading.action}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTimesCircle className="text-lg" />
              <span>{actionLoading || loading.action ? 'جاري المعالجة...' : 'رفض الطلب'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewingImage && (
        <ImageViewerModal
          imageUrl={viewingImage.url}
          documentName={viewingImage.name}
          onClose={() => setViewingImage(null)}
        />
      )}
    </div>
  );
};

export default ApplicationDetailsModal;
