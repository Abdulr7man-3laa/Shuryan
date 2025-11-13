import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaNotesMedical, FaPrint, FaCalendarAlt,
  FaUser, FaFileAlt, FaStethoscope, FaClipboardList,
  FaHeartbeat, FaDiagnoses, FaTasks, FaClock
} from 'react-icons/fa';

/**
 * SessionDocumentationModal Component - Premium Design
 * Modal for viewing patient session documentation
 */
const SessionDocumentationModal = ({ isOpen, onClose, patient }) => {
  const [sessionDoc, setSessionDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch session documentation data
  useEffect(() => {
    if (isOpen && patient) {
      fetchSessionDocumentation();
    }
  }, [isOpen, patient]);

  const fetchSessionDocumentation = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock session documentation data
    setSessionDoc({
      id: 1,
      sessionDate: '2025-10-28',
      sessionTime: '10:30 ص',
      sessionType: 'كشف أول',
      duration: '45 دقيقة',
      chiefComplaint: 'ألم شديد في الصدر مع ضيق في التنفس منذ يومين، يزداد مع المجهود البدني',
      presentIllness: {
        onset: 'بدأ الألم منذ يومين بشكل مفاجئ',
        duration: 'مستمر مع فترات تحسن وتدهور',
        character: 'ألم ضاغط في منتصف الصدر، ينتشر إلى الذراع الأيسر',
        severity: 'شدة الألم 7/10',
        aggravatingFactors: 'يزداد مع المجهود البدني والتوتر',
        relievingFactors: 'يخف مع الراحة التامة',
        associatedSymptoms: 'ضيق تنفس، تعرق، غثيان خفيف'
      },
      physicalExam: {
        vitalSigns: {
          bloodPressure: '145/92 mmHg',
          heartRate: '88 نبضة/دقيقة',
          temperature: '37.2°C',
          respiratoryRate: '20 نفس/دقيقة',
          oxygenSaturation: '96%'
        },
        generalAppearance: 'المريض يبدو متعباً، قلق، يجلس في وضع مريح',
        cardiovascular: 'أصوات القلب منتظمة، لا يوجد نفخات قلبية',
        respiratory: 'أصوات التنفس طبيعية في كلا الرئتين',
        abdomen: 'البطن لين، لا يوجد ألم عند الضغط',
        neurological: 'المريض واعٍ تماماً، الاستجابة العصبية طبيعية'
      },
      assessment: {
        primaryDiagnosis: 'الذبحة الصدرية غير المستقرة (Unstable Angina)',
        differentialDiagnosis: ['احتشاء عضلة القلب', 'التهاب التامور', 'ارتجاع المريء'],
        clinicalImpression: 'المريض يعاني من أعراض نموذجية للذبحة الصدرية مع عوامل خطر قلبية',
        riskFactors: ['ارتفاع ضغط الدم', 'السكري', 'التدخين']
      },
      treatmentPlan: {
        immediate: ['تحويل فوري لقسم الطوارئ', 'إعطاء أسبرين 300 مجم'],
        investigations: ['تخطيط القلب ECG', 'فحص إنزيمات القلب', 'صورة أشعة للصدر'],
        medications: ['أسبرين 100 مجم يومياً', 'كلوبيدوجريل 75 مجم', 'أتورفاستاتين 40 مجم'],
        lifestyle: ['الراحة التامة', 'نظام غذائي صحي', 'الإقلاع عن التدخين'],
        followUp: 'متابعة بعد 3 أيام أو فوراً عند تدهور الأعراض'
      }
    });
    setLoading(false);
  };

  const handlePrint = () => window.print();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaNotesMedical className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">توثيق الجلسة</h2>
                  <p className="text-white/90 text-sm font-medium">{patient?.fullName || 'مريض'}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                <FaTimes className="text-white text-lg" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">جاري تحميل توثيق الجلسة...</p>
                </div>
              </div>
            ) : !sessionDoc ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-slate-400 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">لا يوجد توثيق</h3>
                <p className="text-slate-600 font-medium">لم يتم توثيق جلسة لهذا المريض بعد</p>
              </div>
            ) : (
              <>
                {/* Session Info */}
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 mb-6 shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: FaCalendarAlt, label: 'تاريخ الجلسة', value: sessionDoc.sessionDate },
                      { icon: FaClock, label: 'الوقت', value: sessionDoc.sessionTime },
                      { icon: FaClipboardList, label: 'نوع الجلسة', value: sessionDoc.sessionType },
                      { icon: FaClock, label: 'المدة', value: sessionDoc.duration }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                          <item.icon className="text-white text-lg" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white/80">{item.label}</p>
                          <p className="text-sm font-black text-white">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* 1. Chief Complaint */}
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border-2 border-red-200 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 px-5 py-4">
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <FaClipboardList className="text-xl" />
                        الشكوى الرئيسية
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="bg-white rounded-xl p-5 border-2 border-red-200 shadow-sm">
                        <p className="text-base font-semibold text-slate-800 leading-relaxed">{sessionDoc.chiefComplaint}</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Present Illness */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-5 py-4">
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <FaFileAlt className="text-xl" />
                        تاريخ المرض الحالي
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(sessionDoc.presentIllness).map(([key, value]) => (
                          <div key={key} className="bg-white rounded-xl p-4 border-2 border-orange-200 shadow-sm">
                            <h4 className="text-sm font-bold text-orange-700 mb-2">{key === 'onset' ? '🕐 البداية' : key === 'duration' ? '⏱️ المدة' : key === 'character' ? '📝 الطبيعة' : key === 'severity' ? '⚡ الشدة' : key === 'aggravatingFactors' ? '📈 المحفزات' : key === 'relievingFactors' ? '📉 المخففات' : '🔗 الأعراض المصاحبة'}</h4>
                            <p className="text-sm font-medium text-slate-800">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. Physical Exam */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-5 py-4">
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <FaStethoscope className="text-xl" />
                        الفحص الجسدي
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-sm">
                        <h4 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                          <FaHeartbeat className="text-blue-600" />
                          العلامات الحيوية
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {Object.entries(sessionDoc.physicalExam.vitalSigns).map(([key, value]) => (
                            <div key={key} className="bg-blue-50 rounded-lg p-3 text-center">
                              <p className="text-xs font-semibold text-blue-700 mb-1">{key === 'bloodPressure' ? 'ضغط الدم' : key === 'heartRate' ? 'النبض' : key === 'temperature' ? 'الحرارة' : key === 'respiratoryRate' ? 'التنفس' : 'الأكسجين'}</p>
                              <p className="text-sm font-black text-slate-900">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: '👤 المظهر العام', value: sessionDoc.physicalExam.generalAppearance },
                          { label: '❤️ القلب', value: sessionDoc.physicalExam.cardiovascular },
                          { label: '🫁 التنفس', value: sessionDoc.physicalExam.respiratory },
                          { label: '🫃 البطن', value: sessionDoc.physicalExam.abdomen },
                          { label: '🧠 العصبي', value: sessionDoc.physicalExam.neurological, span: true }
                        ].map((item, i) => (
                          <div key={i} className={`bg-white rounded-xl p-4 border-2 border-blue-200 shadow-sm ${item.span ? 'md:col-span-2' : ''}`}>
                            <h4 className="text-sm font-bold text-blue-700 mb-2">{item.label}</h4>
                            <p className="text-sm font-medium text-slate-800">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. Assessment */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-4">
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <FaDiagnoses className="text-xl" />
                        التقييم والتشخيص
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-5 border-2 border-purple-300 shadow-md">
                        <h4 className="text-base font-black text-purple-900 mb-3">🎯 التشخيص الأساسي</h4>
                        <p className="text-base font-bold text-slate-900">{sessionDoc.assessment.primaryDiagnosis}</p>
                      </div>
                      <div className="bg-white rounded-xl p-5 border-2 border-purple-200 shadow-sm">
                        <h4 className="text-sm font-bold text-purple-700 mb-3">🔍 التشخيص التفريقي</h4>
                        <ul className="space-y-2">
                          {sessionDoc.assessment.differentialDiagnosis.map((d, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm font-medium text-slate-800">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white rounded-xl p-5 border-2 border-purple-200 shadow-sm">
                        <h4 className="text-sm font-bold text-purple-700 mb-3">💭 الانطباع السريري</h4>
                        <p className="text-sm font-medium text-slate-800 leading-relaxed">{sessionDoc.assessment.clinicalImpression}</p>
                      </div>
                      <div className="bg-white rounded-xl p-5 border-2 border-purple-200 shadow-sm">
                        <h4 className="text-sm font-bold text-purple-700 mb-3">⚠️ عوامل الخطر</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {sessionDoc.assessment.riskFactors.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 bg-purple-50 rounded-lg p-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm font-medium text-slate-800">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Treatment Plan */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-4">
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <FaTasks className="text-xl" />
                        الخطة العلاجية
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {[
                        { title: '🚨 الإجراءات الفورية', items: sessionDoc.treatmentPlan.immediate, color: 'red' },
                        { title: '🔬 الفحوصات', items: sessionDoc.treatmentPlan.investigations, color: 'emerald' },
                        { title: '💊 الأدوية', items: sessionDoc.treatmentPlan.medications, color: 'emerald' },
                        { title: '🏃 نمط الحياة', items: sessionDoc.treatmentPlan.lifestyle, color: 'emerald' }
                      ].map((section, i) => (
                        <div key={i} className={`bg-white rounded-xl p-5 border-2 border-${section.color}-${section.color === 'red' ? '300' : '200'} shadow-sm`}>
                          <h4 className={`text-sm font-bold text-${section.color}-700 mb-3`}>{section.title}</h4>
                          <ul className="space-y-2">
                            {section.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm font-medium text-slate-800">
                                {section.color === 'red' ? <span className="text-red-600 font-bold mt-0.5">{j + 1}.</span> : <div className={`w-2 h-2 bg-${section.color}-500 rounded-full mt-1.5`}></div>}
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-xl p-5 border-2 border-teal-300 shadow-md">
                        <h4 className="text-sm font-bold text-teal-900 mb-2">📅 المتابعة</h4>
                        <p className="text-sm font-bold text-slate-900">{sessionDoc.treatmentPlan.followUp}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t-2 border-slate-200">
            <div className="flex items-center justify-between gap-3">
              <button onClick={onClose} className="px-6 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-sm">
                إغلاق
              </button>
              <button onClick={handlePrint} disabled={!sessionDoc} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <FaPrint />
                طباعة التوثيق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDocumentationModal;
