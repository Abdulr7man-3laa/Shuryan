import { useState } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Cancel Appointment Modal
 * Modal for cancelling an appointment with reason
 */
const CancelAppointmentModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Optional validation: if user enters reason, it must be at least 10 chars
    if (cancellationReason.trim() && cancellationReason.trim().length < 10) {
      setError('إذا أردت إدخال سبب، يرجى إدخال سبب أكثر تفصيلاً (10 أحرف على الأقل)');
      return;
    }

    onConfirm(cancellationReason.trim() || null);
  };

  const handleClose = () => {
    if (!loading) {
      setCancellationReason('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaExclamationTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">إلغاء الموعد</h2>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ لن تتمكن من التراجع عن هذا الإجراء.
            </p>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              سبب الإلغاء <span className="text-slate-400 text-xs">(اختياري)</span>
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => {
                setCancellationReason(e.target.value);
                setError('');
              }}
              placeholder="يرجى توضيح سبب إلغاء الموعد..."
              rows={4}
              disabled={loading}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            تراجع
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;
