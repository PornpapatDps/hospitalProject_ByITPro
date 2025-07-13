import React from 'react';

const PatientSearch = ({ 
  searchValue, 
  setSearchValue, 
  searchType, 
  setSearchType, 
  statusFilter, 
  setStatusFilter,
  handleSearch,
  handleClearSearch,
  handleStatusFilter
}) => {
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <span className="text-blue-600 text-xl">🔍</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            ระบบค้นหาและกรองข้อมูลผู้ป่วยขั้นสูง
          </h3>
          <p className="text-sm text-gray-600">
            ค้นหาผู้ป่วยด้วยเงื่อนไขต่างๆ และกรองตามสถานะ Vital Signs แบบ Real-time
          </p>
        </div>
      </div>
      
      {/* Enhanced Search Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          🎯 เครื่องมือค้นหา
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประเภทการค้นหา
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-colors"
            >
              <option value="hn">🏥 HN (รหัสผู้ป่วย)</option>
              <option value="namepat">👤 ชื่อผู้ป่วย</option>
              <option value="surnamepat">👤 นามสกุล</option>
              <option value="phonepat">📞 เบอร์โทรศัพท์</option>
              <option value="doctorpat">👨‍⚕️ แพทย์ผู้ดูแล</option>
              <option value="emi">📡 EMI (รหัสอุปกรณ์)</option>
             
            </select>
          </div>

          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ข้อมูลที่ต้องการค้นหา
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`ค้นหาด้วย${
                  searchType === 'hn' ? 'HN (เช่น hn001, 001)' :
                  searchType === 'namepat' ? 'ชื่อผู้ป่วย' :
                  searchType === 'surnamepat' ? 'นามสกุล' :
                  searchType === 'phonepat' ? 'เบอร์โทรศัพท์' :
                  searchType === 'doctorpat' ? 'ชื่อแพทย์' :
                  searchType === 'emi' ? 'รหัส EMI' :
                  'สถานะผู้ป่วย'
                }`}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-colors"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              การดำเนินการ
            </label>
            <button
              onClick={handleSearch}
              disabled={!searchValue.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
            >
              <span className="text-lg">🔍</span>
              ค้นหา
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          🏷️ กรองตามสถานะ Vital Signs
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลือกสถานะ
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:border-gray-400 transition-colors"
            >
              <option value="all">📋 ทั้งหมด</option>
              <option value="critical">🚨 วิกฤติ (Critical)</option>
              <option value="warning">⚠️ เฝ้าระวัง (Warning)</option>
              <option value="normal">✅ ปกติ (Normal)</option>
              <option value="unknown">❓ ไม่มีข้อมูล</option>
            </select>
          </div>

          {/* Filter Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              กรองข้อมูล
            </label>
            <button
              onClick={handleStatusFilter}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="text-lg">🏷️</span>
              กรองสถานะ
            </button>
          </div>

          {/* Clear Button */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ล้างข้อมูล
            </label>
            <button
              onClick={handleClearSearch}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="text-lg">🔄</span>
              ล้างการค้นหา
            </button>
          </div>
        </div>
      </div>

      {/* Search Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
          💡 เคล็ดลับการค้นหา
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-700">
          <div>
            <p><strong>🏥 HN:</strong> สามารถใส่ "hn001" หรือ "001" ได้</p>
            <p><strong>👤 ชื่อ/นามสกุล:</strong> ค้นหาแบบบางส่วนได้</p>
            <p><strong>📞 เบอร์โทร:</strong> สามารถใส่บางส่วนได้</p>
          </div>
          <div>
            <p><strong>👨‍⚕️ แพทย์:</strong> ค้นหาด้วยชื่อแพทย์</p>
            <p><strong>📡 EMI:</strong> รหัสอุปกรณ์เซ็นเซอร์</p>
            <p><strong>⌨️ Enter:</strong> กดเพื่อค้นหาเร็ว</p>
          </div>
        </div>
      </div>

      {/* Current Search Status */}
      {(searchValue || statusFilter !== 'all') && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-semibold text-green-800 mb-2">🔍 สถานะการค้นหาปัจจุบัน</h4>
          <div className="flex flex-wrap gap-2">
            {searchValue && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                ค้นหา: "{searchValue}" ใน {
                  searchType === 'hn' ? 'HN' :
                  searchType === 'namepat' ? 'ชื่อ' :
                  searchType === 'surnamepat' ? 'นามสกุล' :
                  searchType === 'phonepat' ? 'เบอร์โทร' :
                  searchType === 'doctorpat' ? 'แพทย์' :
                  searchType === 'emi' ? 'EMI' :
                  'สถานะ'
                }
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                กรอง: {
                  statusFilter === 'critical' ? '� วิกฤติ' :
                  statusFilter === 'warning' ? '⚠️ เฝ้าระวัง' :
                  statusFilter === 'normal' ? '✅ ปกติ' :
                  '❓ ไม่มีข้อมูล'
                }
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
