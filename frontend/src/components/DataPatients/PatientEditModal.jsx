import React, { useState } from 'react';

const PatientEditModal = ({ 
  showEditPopup, 
  selectedPatient, 
  editFormData, 
  handleFormChange, 
  handleUpdate, 
  closeEditPopup 
}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showEditPopup || !selectedPatient) return null;

  // Validate form before submit
  const validateForm = () => {
    const newErrors = {};
    
    if (!editFormData.namepat?.trim()) {
      newErrors.namepat = 'กรุณากรอกชื่อ';
    }
    
    if (!editFormData.surnamepat?.trim()) {
      newErrors.surnamepat = 'กรุณากรอกนามสกุล';
    }
    
    if (editFormData.phonepat && !/^[0-9]{9,10}$/.test(editFormData.phonepat.replace(/[-\s]/g, ''))) {
      newErrors.phonepat = 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง';
    }
    
    if (editFormData.weight && (isNaN(editFormData.weight) || editFormData.weight <= 0)) {
      newErrors.weight = 'น้ำหนักต้องเป็นตัวเลขที่มากกว่า 0';
    }
    
    if (editFormData.height && (isNaN(editFormData.height) || editFormData.height <= 0)) {
      newErrors.height = 'ส่วนสูงต้องเป็นตัวเลขที่มากกว่า 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await handleUpdate();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    handleFormChange(e);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
          <h3 className="text-xl font-semibold flex items-center">✏️ แก้ไขข้อมูลผู้ป่วย</h3>
          <p className="text-blue-100 text-sm mt-1">
            HN: {selectedPatient?.hn} | {selectedPatient?.namepat} {selectedPatient?.surnamepat}
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">👤 ข้อมูลส่วนตัว</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำนำหน้า</label>
                  <select
                    name="prefix"
                    value={editFormData.prefix}
                    onChange={handleInputChange}
                    autoComplete="honorific-prefix"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">เลือกคำนำหน้า</option>
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="นาง">นาง</option>
                    <option value="เด็กชาย">เด็กชาย</option>
                    <option value="เด็กหญิง">เด็กหญิง</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ *</label>
                  <input
                    type="text"
                    name="namepat"
                    value={editFormData.namepat}
                    onChange={handleInputChange}
                    autoComplete="given-name"
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.namepat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="กรอกชื่อ"
                    required
                  />
                  {errors.namepat && <span className="text-red-500 text-xs mt-1">{errors.namepat}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">นามสกุล *</label>
                  <input
                    type="text"
                    name="surnamepat"
                    value={editFormData.surnamepat}
                    onChange={handleInputChange}
                    autoComplete="family-name"
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.surnamepat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="กรอกนามสกุล"
                    required
                  />
                  {errors.surnamepat && <span className="text-red-500 text-xs mt-1">{errors.surnamepat}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">วันเกิด *</label>
                  <input
                    type="date"
                    name="born"
                    value={editFormData.born}
                    onChange={handleInputChange}
                    autoComplete="bday"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เพศ</label>
                  <select
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">เลือกเพศ</option>
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                    <option value="ไม่ระบุ">ไม่ระบุ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    name="phonepat"
                    value={editFormData.phonepat}
                    onChange={handleInputChange}
                    autoComplete="tel"
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phonepat ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="กรอกเบอร์โทรศัพท์ (9-10 หลัก)"
                    pattern="[0-9]{9,10}"
                  />
                  {errors.phonepat && <span className="text-red-500 text-xs mt-1">{errors.phonepat}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ส่วนสูง (ซม.)</label>
                  <input
                    type="number"
                    name="height"
                    value={editFormData.height}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.height ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="กรอกส่วนสูง"
                    min="0"
                    step="0.1"
                  />
                  {errors.height && <span className="text-red-500 text-xs mt-1">{errors.height}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">น้ำหนัก (กก.)</label>
                  <input
                    type="number"
                    name="weight"
                    value={editFormData.weight}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="กรอกน้ำหนัก"
                    min="0"
                    step="0.1"
                  />
                  {errors.weight && <span className="text-red-500 text-xs mt-1">{errors.weight}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">กรุ๊ปเลือด</label>
                  <select
                    name="bloodgroup"
                    value={editFormData.bloodgroup}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">เลือกกรุ๊ปเลือด</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Treatment Information */}
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">🏥 ข้อมูลการรักษา</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">วันที่รักษา</label>
                  <input
                    type="date"
                    name="datepat"
                    value={editFormData.datepat}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">แพทย์ผู้รักษา</label>
                  <select
                    name="doctorpat"
                    value={editFormData.doctorpat}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">เลือกแพทย์</option>
                    <option value="นายแพทย์สมชาย สวัสดี">นายแพทย์สมชาย สวัสดี</option>
                    <option value="แพทย์หญิงสมหญิง วัฒนา">แพทย์หญิงสมหญิง วัฒนา</option>
                    <option value="นายแพทย์หมอสมศักดิ์ คุ้มครองโรจน์">นายแพทย์หมอสมศักดิ์ คุ้มครองโรจน์</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">📝 ข้อมูลเพิ่มเติม</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่</label>
                  <textarea
                    name="address"
                    value={editFormData.address}
                    onChange={handleInputChange}
                    rows="3"
                    autoComplete="address-line1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="กรอกที่อยู่"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">อาการ/หมายเหตุ</label>
                  <textarea
                    name="symptomspat"
                    value={editFormData.symptomspat}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="กรอกอาการหรือหมายเหตุ"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">โรคประจำตัว</label>
                    <textarea
                      name="disease"
                      value={editFormData.disease}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="กรอกโรคประจำตัว (ถ้ามี)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ประวัติแพ้ยา/อาหาร</label>
                    <textarea
                      name="allergy"
                      value={editFormData.allergy}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="กรอกประวัติการแพ้ (ถ้ามี)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeEditPopup}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
          >
            ❌ ยกเลิก
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={Object.keys(errors).length > 0 || isSubmitting}
            className={`px-6 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm ${
              Object.keys(errors).length > 0 || isSubmitting
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? '⏳ กำลังบันทึก...' : '💾 บันทึกการแก้ไข'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientEditModal;
