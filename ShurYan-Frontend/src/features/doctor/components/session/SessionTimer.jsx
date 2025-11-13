import { FaClock, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Session Timer Component
 * Displays countdown timer for active session
 */
const SessionTimer = ({ timeRemaining, isExpiring }) => {
  // Format time
  const formatTime = () => {
    if (timeRemaining === null) return '--:--';
    
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
        isExpiring
          ? 'bg-red-50 border-red-300 animate-pulse'
          : 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200'
      }`}
    >
      {isExpiring ? (
        <FaExclamationTriangle className="text-2xl text-red-500" />
      ) : (
        <FaClock className="text-2xl text-teal-600" />
      )}
      
      <div className="flex-1">
        <p className="text-xs text-slate-600 font-semibold mb-1">
          {isExpiring ? '⚠️ الوقت المتبقي' : 'الوقت المتبقي'}
        </p>
        <p
          className={`text-3xl font-black ${
            isExpiring ? 'text-red-600' : 'text-teal-700'
          }`}
          dir="ltr"
        >
          {formatTime()}
        </p>
      </div>

      {isExpiring && (
        <div className="text-right">
          <p className="text-xs text-red-600 font-bold">
            أقل من 5 دقائق!
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionTimer;
