import { APPLICATION_STATUS, STATUS_LABELS, STATUS_COLORS } from '../constants/verifierConstants';

/**
 * Status Filter Component
 * 
 * Filter buttons for application status
 */
const StatusFilter = ({ activeStatus, onStatusChange, stats }) => {
  const statuses = [
    APPLICATION_STATUS.PENDING,
    APPLICATION_STATUS.UNDER_REVIEW,
    APPLICATION_STATUS.APPROVED,
    APPLICATION_STATUS.REJECTED,
  ];

  // Get count from stats (works for all tabs even when not active)
  const getCount = (status) => {
    switch (status) {
      case APPLICATION_STATUS.PENDING: // 5 - Sent
        return stats?.totalPending || 0;
      case APPLICATION_STATUS.UNDER_REVIEW: // 1 - UnderReview
        return stats?.totalUnderReview || 0;
      case APPLICATION_STATUS.APPROVED: // 2 - Verified
        return stats?.totalApprovedToday || 0;
      case APPLICATION_STATUS.REJECTED: // 3 - Rejected
        return stats?.totalRejected || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statuses.map((status) => {
        const colors = STATUS_COLORS[status];
        const count = getCount(status);
        
        return (
          <button
            key={status}
            onClick={() => {
              console.log('🔘 [StatusFilter] Button clicked! Status:', status, 'Label:', STATUS_LABELS[status]);
              onStatusChange(status);
            }}
            className={`
              flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-base
              transition-all duration-200 border-2
              ${
                activeStatus === status
                  ? `${colors.bg} ${colors.text} ${colors.border} shadow-lg scale-105 ring-2 ring-offset-2 ${colors.border.replace('border-', 'ring-')}`
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-102'
              }
            `}
          >
            <span className="text-lg">{STATUS_LABELS[status]}</span>
            <span
              className={`
                px-3 py-1.5 rounded-full text-sm font-black min-w-[2.5rem] text-center
                ${
                  activeStatus === status 
                    ? 'bg-white/40 backdrop-blur-sm' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700'
                }
              `}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;
