import { FaUser, FaPhone, FaBirthdayCake, FaVenusMars } from 'react-icons/fa';

/**
 * Session Patient Info Component
 * Displays patient information in session
 */
const SessionPatientInfo = ({ patientInfo }) => {
  if (!patientInfo) {
    return (
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
        <p className="text-slate-400 text-center">لا توجد معلومات المريض</p>
      </div>
    );
  }

  const { patientFullName, phoneNumber, dateOfBirth, gender } = patientInfo;

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(dateOfBirth);

  return (
    <div className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl p-6 text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <FaUser className="text-3xl text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black mb-1">{patientFullName}</h3>
          <p className="text-sm text-white/80">معلومات المريض</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        {phoneNumber && (
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <FaPhone className="text-lg" />
            <div>
              <p className="text-xs text-white/70">رقم الهاتف</p>
              <p className="font-bold" dir="ltr">{phoneNumber}</p>
            </div>
          </div>
        )}

        {/* Age */}
        {age !== null && (
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <FaBirthdayCake className="text-lg" />
            <div>
              <p className="text-xs text-white/70">العمر</p>
              <p className="font-bold">{age} سنة</p>
            </div>
          </div>
        )}

        {/* Gender */}
        {gender && (
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <FaVenusMars className="text-lg" />
            <div>
              <p className="text-xs text-white/70">النوع</p>
              <p className="font-bold">{gender === 'Male' ? 'ذكر' : 'أنثى'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionPatientInfo;
