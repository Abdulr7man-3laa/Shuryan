import { FaExclamationCircle } from 'react-icons/fa';

const ErrorAlert = ({ error, onClear }) => {
  if (!error) return null;

  // return (
  //   <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg flex items-start gap-3">
  //     <FaExclamationCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
  //     <div className="flex-1">
  //       <p className="text-red-800 font-semibold">{error}</p>
  //       <button onClick={onClear} className="mt-2 text-sm text-red-600 hover:text-red-700 underline">
  //         إخفاء
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default ErrorAlert;
