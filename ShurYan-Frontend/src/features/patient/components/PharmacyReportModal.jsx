import React from 'react';
import { FaTimes, FaClock, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaExchangeAlt, FaPills, FaMoneyBillWave } from 'react-icons/fa';
import { AVAILABILITY_STATUS } from '../data/mockPharmacyReports';

/**
 * PharmacyReportModal Component
 * Displays pharmacy's response to prescription request
 */
const PharmacyReportModal = ({ isOpen, onClose, pharmacy, report }) => {
  if (!isOpen) return null;

  // Check if pharmacy has responded
  const hasResponded = report && report.status !== 'pending';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
          >
            <FaTimes className="text-white text-lg" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white/30 flex-shrink-0">
              <img
                src={pharmacy?.profileImageUrl}
                alt={pharmacy?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150/00b19f/ffffff?text=صيدلية';
                }}
              />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white mb-1">تقرير الصيدلية</h2>
              <p className="text-sm text-white/80 font-semibold">{pharmacy?.name}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {!hasResponded ? (
            // Waiting for Response
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaClock className="text-5xl text-amber-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">في انتظار الرد</h3>
              <p className="text-slate-600 font-semibold text-lg mb-6">
                لم ترد الصيدلية حتى الآن
              </p>
              <p className="text-slate-500 text-sm">
                سيتم إشعارك فور استلام رد الصيدلية على الروشتة
              </p>
              
              <div className="mt-8 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <p className="text-blue-700 font-semibold text-sm">
                  💡 عادةً ما تستغرق الصيدليات من 15-30 دقيقة للرد على الطلبات
                </p>
              </div>
            </div>
          ) : (
            // Report Content
            <div className="space-y-6">
              {/* Summary Stats */}
              {report.summary && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 text-center">
                    <div className="text-2xl font-black text-green-700">{report.summary.availableItems}</div>
                    <div className="text-xs font-semibold text-green-600 mt-1">متوفر</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200 text-center">
                    <div className="text-2xl font-black text-amber-700">{report.summary.alternativeItems}</div>
                    <div className="text-xs font-semibold text-amber-600 mt-1">بديل متوفر</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200 text-center">
                    <div className="text-2xl font-black text-red-700">{report.summary.unavailableItems}</div>
                    <div className="text-xs font-semibold text-red-600 mt-1">غير متوفر</div>
                  </div>
                </div>
              )}

              {/* Medications List */}
              <div className="space-y-3">
                <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <FaPills className="text-teal-600" />
                  تفاصيل الأدوية
                </h4>
                
                {report.medications && report.medications.map((med) => {
                  const statusConfig = AVAILABILITY_STATUS[med.availability];
                  
                  return (
                    <div
                      key={med.id}
                      className={`${statusConfig.bgColor} border-2 ${statusConfig.borderColor} rounded-xl p-4`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Medication Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-black text-slate-800">{med.name}</h5>
                            <span className={`px-2 py-1 ${statusConfig.bgColor} ${statusConfig.textColor} text-xs font-bold rounded-lg border ${statusConfig.borderColor}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          
                          {/* Alternative Info */}
                          {med.availability === 'has_alternative' && (
                            <div className="flex items-start gap-2 mt-2 bg-white/50 rounded-lg p-2">
                              <FaExchangeAlt className="text-amber-600 text-sm mt-1 flex-shrink-0" />
                              <div className="text-xs">
                                <p className="font-semibold text-slate-700">
                                  <span className="text-amber-700 font-black">البديل:</span> {med.alternativeName}
                                </p>
                                {med.alternativeReason && (
                                  <p className="text-slate-600 mt-1">{med.alternativeReason}</p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Unavailable Reason */}
                          {med.availability === 'unavailable' && med.reason && (
                            <p className="text-xs text-red-600 font-semibold mt-1">
                              <FaTimesCircle className="inline mr-1" />
                              {med.reason}
                            </p>
                          )}
                        </div>
                        
                        {/* Price Info */}
                        <div className="text-left flex-shrink-0">
                          {med.unitPrice !== null ? (
                            <>
                              <div className="text-xs text-slate-600 font-semibold mb-1">
                                {med.unit} × {med.quantity}
                              </div>
                              <div className="text-sm font-bold text-slate-700">
                                {med.unitPrice.toFixed(2)} ج.م / {med.unit}
                              </div>
                              <div className="text-lg font-black text-teal-700 mt-1">
                                {med.totalPrice.toFixed(2)} ج.م
                              </div>
                            </>
                          ) : (
                            <div className="text-sm font-bold text-red-600">
                              -
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notes */}
              {report.notes && (
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <h5 className="font-black text-blue-800 text-sm mb-2">ملاحظات الصيدلية:</h5>
                  <p className="text-blue-700 text-sm font-semibold">{report.notes}</p>
                </div>
              )}

              {/* Total Summary */}
              {report.summary && (
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FaMoneyBillWave className="text-teal-600 text-xl" />
                    <h4 className="text-lg font-black text-slate-800">ملخص التكلفة</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-semibold">إجمالي الأدوية:</span>
                      <span className="text-slate-800 font-bold">{report.summary.subtotal.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-semibold">رسوم التوصيل:</span>
                      <span className="text-slate-800 font-bold">{report.summary.deliveryFee.toFixed(2)} ج.م</span>
                    </div>
                    <div className="h-px bg-teal-300 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-teal-800 font-black text-lg">الإجمالي:</span>
                      <span className="text-teal-700 font-black text-2xl">{report.summary.total.toFixed(2)} ج.م</span>
                    </div>
                  </div>
                  
                  {/* Order Button */}
                  <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black rounded-xl transition-all shadow-md hover:shadow-lg">
                    تأكيد الطلب
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Close Button */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PharmacyReportModal;
