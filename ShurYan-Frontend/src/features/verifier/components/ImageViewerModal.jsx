import React from 'react';
import { FaTimes, FaExpand, FaCompress } from 'react-icons/fa';

/**
 * Image Viewer Modal Component
 * 
 * Premium popup for viewing document images
 */
const ImageViewerModal = ({ imageUrl, documentName, onClose }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Close on ESC key
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all ${
          isFullscreen ? 'w-full h-full' : 'max-w-6xl max-h-[90vh] w-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent z-10 p-4">
          <div className="flex items-center justify-between">
            {/* Document Name */}
            <h3 className="text-white font-bold text-lg truncate flex-1">
              {documentName || 'عرض المستند'}
            </h3>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all"
                title={isFullscreen ? 'تصغير' : 'ملء الشاشة'}
              >
                {isFullscreen ? (
                  <FaCompress className="text-white text-sm" />
                ) : (
                  <FaExpand className="text-white text-sm" />
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-red-500/80 hover:bg-red-600 backdrop-blur-sm rounded-full transition-all"
                title="إغلاق"
              >
                <FaTimes className="text-white text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Container */}
        <div className="w-full h-full flex items-center justify-center bg-slate-100 p-8">
          <img
            src={imageUrl}
            alt={documentName}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;
