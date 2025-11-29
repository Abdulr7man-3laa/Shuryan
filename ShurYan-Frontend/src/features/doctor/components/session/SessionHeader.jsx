import { FaTimes, FaStopCircle, FaUser, FaPhone, FaCalendarAlt, FaHeart, FaPrescriptionBottleAlt, FaFlask, FaFileAlt } from 'react-icons/fa';

const SessionHeader = ({ 
  patientInfo, 
  currentSession, 
  loading, 
  onClose, 
  onEndSession,
  activeTab,
  onTabChange
}) => {
  const shouldShowEndButton = currentSession?.status !== 4 && currentSession?.status !== 'Completed';

  const tabs = [
    { id: 'medical', label: 'السجل الطبي', icon: FaHeart },
    { id: 'prescription', label: 'روشتة', icon: FaPrescriptionBottleAlt },
    { id: 'lab', label: 'تحاليل', icon: FaFlask },
    { id: 'documentation', label: 'التوثيق', icon: FaFileAlt },
  ];

  return (
    <div className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="relative z-10 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 z-10"
        >
          <FaTimes className="w-4 h-4" />
        </button>

        {/* Main Content - Split Layout */}
        <div className="flex items-start justify-between gap-6">
          
          {/* Right Side - Patient Info */}
          <div className="flex items-center gap-4 flex-1">
            {/* Avatar */}
            <div className="relative">
              {patientInfo?.patientProfileImageUrl ? (
                <img
                  src={patientInfo.patientProfileImageUrl}
                  alt={patientInfo.patientFullName}
                  className="w-20 h-20 rounded-2xl object-cover border-3 border-white/30 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border-3 border-white/30 flex items-center justify-center shadow-lg">
                  <FaUser className="w-10 h-10 text-white/80" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white/30 rounded-full"></div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-black mb-1">{patientInfo?.patientFullName || 'المريض'}</h2>
              <div className="flex items-center gap-3 text-sm text-white/90 mb-2">
                {patientInfo?.patientAge && (
                  <span className="flex items-center gap-1.5">
                    <FaUser className="w-3 h-3" />
                    {patientInfo.patientAge} سنة
                  </span>
                )}
                {patientInfo?.phoneNumber && (
                  <span className="flex items-center gap-1.5">
                    <FaPhone className="w-3 h-3" />
                    {patientInfo.phoneNumber}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentSession?.sessionType === 1 ? 'bg-blue-500/90' : 'bg-purple-500/90'
                }`}>
                  {currentSession?.sessionType === 1 ? '🩺 كشف جديد' : '📋 إعادة كشف'}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                  <FaCalendarAlt className="inline w-3 h-3 ml-1" />
                  {currentSession?.scheduledStartTime && new Date(currentSession.scheduledStartTime).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          </div>

          {/* Left Side - Tabs (2x2 Grid) */}
          <div className="flex flex-col gap-3 ml-12">
            <div className="grid grid-cols-2 gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const isDisabled = tab.id === 'medical' && loading;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    disabled={isDisabled}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 min-w-[130px] ${
                      isActive 
                        ? 'bg-white text-teal-600 shadow-xl scale-105 border-2 border-teal-200' 
                        : 'bg-white/15 backdrop-blur-md text-white hover:bg-white/25 hover:scale-105 border-2 border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* End Session Button */}
            {shouldShowEndButton && (
              <button
                onClick={onEndSession}
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 font-bold text-sm hover:scale-105"
              >
                <FaStopCircle className="w-4 h-4" />
                إنهاء الجلسة
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SessionHeader;
