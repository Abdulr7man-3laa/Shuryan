import { FaFlask, FaUserMd, FaCalendarAlt, FaNotesMedical, FaCheckCircle, FaClock } from 'react-icons/fa';

const LabPrescriptionCard = ({ prescription, onViewDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    if (prescription.hasOrder) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
          <FaCheckCircle />
          <span>{prescription.orderStatus || 'تم الطلب'}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
        <FaClock />
        <span>في انتظار الطلب</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {prescription.doctorProfileImage ? (
            <img
              src={prescription.doctorProfileImage}
              alt={prescription.doctorName}
              className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
              {prescription.doctorName?.charAt(0) || 'د'}
            </div>
          )}
          <div>
            <h3 className="text-lg font-black text-slate-800">{prescription.doctorName}</h3>
            <p className="text-sm text-slate-600">{prescription.doctorSpecialty}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
        <FaCalendarAlt className="text-cyan-500" />
        <span>{formatDate(prescription.createdAt)}</span>
      </div>

      {/* Tests */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FaFlask className="text-cyan-600" />
          <h4 className="font-bold text-slate-800">
            التحاليل المطلوبة ({prescription.tests?.length || 0})
          </h4>
        </div>
        <div className="space-y-2">
          {prescription.tests?.slice(0, 3).map((test, index) => (
            <div key={test.id} className="flex items-start gap-2">
              <span className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">
                  {test.testName} {test.testCode && <span className="text-cyan-600">({test.testCode})</span>}
                </p>
                {test.specialInstructions && (
                  <p className="text-xs text-slate-600 mt-1">
                    📌 {test.specialInstructions}
                  </p>
                )}
              </div>
            </div>
          ))}
          {prescription.tests?.length > 3 && (
            <p className="text-xs text-slate-500 text-center mt-2">
              + {prescription.tests.length - 3} تحاليل أخرى
            </p>
          )}
        </div>
      </div>

      {/* General Notes */}
      {prescription.generalNotes && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
          <div className="flex items-start gap-2">
            <FaNotesMedical className="text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-blue-700 mb-1">ملاحظات عامة:</p>
              <p className="text-sm text-slate-800">{prescription.generalNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <button
        onClick={() => onViewDetails(prescription)}
        className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
      >
        عرض التفاصيل الكاملة
      </button>
    </div>
  );
};

export default LabPrescriptionCard;
