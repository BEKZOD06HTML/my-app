import React, { useState } from 'react';

const NasiyaModal = ({ isOpen, onClose, onConfirm, totalAmount }) => {
  const [selectedMonths, setSelectedMonths] = useState(3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Nasiya bo'yicha to'lov</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-gray-600 mb-2">Umumiy summa:</p>
            <p className="text-2xl font-bold text-gray-800">{totalAmount.toLocaleString()} so'm</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-3">Muddati:</label>
            <div className="grid grid-cols-3 gap-3">
              {[3, 6, 12].map((months) => (
                <button
                  key={months}
                  onClick={() => setSelectedMonths(months)}
                  className={`py-3 px-4 rounded-xl text-center transition-all ${
                    selectedMonths === months
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {months} oy
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              onClick={() => onConfirm(selectedMonths)}
              className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Tasdiqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NasiyaModal; 