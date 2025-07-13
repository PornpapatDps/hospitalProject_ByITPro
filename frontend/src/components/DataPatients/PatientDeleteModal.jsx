import React from 'react';

const PatientDeleteModal = ({ 
  showDeletePopup, 
  selectedPatient, 
  handleDelete, 
  closeDeletePopup 
}) => {
  if (!showDeletePopup || !selectedPatient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-t-xl">
          <h3 className="text-xl font-semibold flex items-center">🗑️ ลบข้อมูลผู้ป่วย</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              คุณแน่ใจหรือไม่?
            </h4>
            <p className="text-gray-600 mb-4">
              คุณต้องการลบข้อมูลผู้ป่วยนี้ใช่หรือไม่?
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  <span className="text-gray-600">HN:</span> {selectedPatient.hn}
                </p>
                <p className="font-medium text-gray-900">
                  <span className="text-gray-600">ชื่อ:</span> {selectedPatient.namepat} {selectedPatient.surnamepat}
                </p>
                {selectedPatient.phonepat && (
                  <p className="text-sm text-gray-600">
                    <span className="text-gray-600">เบอร์โทร:</span> {selectedPatient.phonepat}
                  </p>
                )}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">
                <strong>⚠️ คำเตือน:</strong> การลบข้อมูลนี้ไม่สามารถย้อนกลับได้
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={closeDeletePopup}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
          >
            ❌ ยกเลิก
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm"
          >
            🗑️ ลบข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDeleteModal;
