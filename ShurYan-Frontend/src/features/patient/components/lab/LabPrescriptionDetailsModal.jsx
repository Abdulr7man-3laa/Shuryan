import { FaTimes, FaFlask, FaUserMd, FaCalendarAlt, FaNotesMedical, FaCheckCircle, FaClock, FaHospital } from 'react-icons/fa';

const LabPrescriptionDetailsModal = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    if (prescription.hasOrder) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold">
          <FaCheckCircle />
          <span>{prescription.orderStatus || 'تم الطلب'}</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold">
        <FaClock />
        <span>في انتظار الطلب من المعمل</span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <FaTimes />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            {prescription.doctorProfileImage ? (
              <img
                src={prescription.doctorProfileImage}
                alt={prescription.doctorName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl border-4 border-white/30">
                {prescription.doctorName?.charAt(0) || 'د'}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-black mb-1">{prescription.doctorName}</h2>
              <p className="text-white/90">{prescription.doctorSpecialty}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/90">
              <FaCalendarAlt />
              <span>{formatDate(prescription.createdAt)}</span>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Tests Section */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                <FaFlask />
              </div>
              <h3 className="text-xl font-black text-slate-800">
                التحاليل المطلوبة ({prescription.tests?.length || 0})
              </h3>
            </div>

            <div className="space-y-4">
              {prescription.tests?.map((test, index) => (
                <div
                  key={test.id}
                  className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border-2 border-cyan-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg font-black text-slate-800">{test.testName}</h4>
                        {test.testCode && (
                          <span className="px-3 py-1 bg-cyan-600 text-white rounded-lg text-xs font-bold">
                            {test.testCode}
                          </span>
                        )}
                      </div>

                      {test.category && (
                        <p className="text-sm text-slate-600 mb-2">
                          <span className="font-bold">الفئة:</span> {test.category}
                        </p>
                      )}

                      {test.specialInstructions && (
                        <div className="bg-white rounded-lg p-3 border border-cyan-300 mb-2">
                          <p className="text-xs font-bold text-cyan-700 mb-1">تعليمات خاصة:</p>
                          <p className="text-sm text-slate-800">{test.specialInstructions}</p>
                        </div>
                      )}

                      {test.doctorNotes && (
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-xs font-bold text-blue-700 mb-1">ملاحظات الدكتور:</p>
                          <p className="text-sm text-slate-800">{test.doctorNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* General Notes */}
          {prescription.generalNotes && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                  <FaNotesMedical />
                </div>
                <h3 className="text-xl font-black text-slate-800">ملاحظات عامة</h3>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                <p className="text-slate-800 leading-relaxed">{prescription.generalNotes}</p>
              </div>
            </div>
          )}

          {/* Order Info */}
          {prescription.hasOrder && prescription.labOrderId && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <FaHospital className="text-green-600 text-xl" />
                <h3 className="text-lg font-black text-slate-800">معلومات الطلب</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-700">
                  <span className="font-bold">رقم الطلب:</span>{' '}
                  <span className="font-mono">{prescription.labOrderId}</span>
                </p>
                <p className="text-sm text-slate-700">
                  <span className="font-bold">الحالة:</span> {prescription.orderStatus}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t-2 border-slate-200">
          <div className="flex gap-3">
            {!prescription.hasOrder && (
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200">
                طلب من معمل
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all duration-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabPrescriptionDetailsModal;
