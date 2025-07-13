import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DateTime } from 'luxon';

const AddDataDashBoardData = () => {
  const { hn } = useParams();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [age, setAge] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data for checkup
  const [checkupData, setCheckupData] = useState({
    datePresent: DateTime.now().toFormat('yyyy-MM-dd'),
    systolic: '',
    diastolic: '',
    symptoms: '',
    disease: '',
    initialResult: '',
    hn: hn
  });

  // โหลดข้อมูลผู้ป่วย
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/hospital/register/${hn}`);
        setPatients(response.data.data ? [response.data.data] : []);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        toast.error('ไม่สามารถโหลดข้อมูลผู้ป่วยได้');
        setPatients([]);
      }
    };

    fetchPatient();
  }, [hn]);

  const currentPatient = patients.find(p => p.hn === hn);

  // คำนวณอายุ
  useEffect(() => {
    if (currentPatient?.born) {
      const birthYear = new Date(currentPatient.born).getFullYear();
      const currentYear = new Date().getFullYear();
      setAge(currentYear - birthYear);
    }
  }, [currentPatient]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit checkup data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!checkupData.systolic || !checkupData.diastolic || !checkupData.symptoms) {
        toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post('http://localhost:4000/hospital/checkups', checkupData);
      
      if (response.data.status === 'success') {
        toast.success('บันทึกข้อมูลการตรวจเรียบร้อย');
        // Reset form
        setCheckupData({
          datePresent: DateTime.now().toFormat('yyyy-MM-dd'),
          systolic: '',
          diastolic: '',
          symptoms: '',
          disease: '',
          initialResult: '',
          hn: hn
        });
        
        // Navigate back to dashboard after 2 seconds
        setTimeout(() => {
          navigate(`/dashboard/${hn}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting checkup:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Blood pressure classification
  const getBloodPressureStatus = (systolic, diastolic) => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    
    if (sys < 120 && dia < 80) return { status: 'ปกติ', color: 'text-green-600', bg: 'bg-green-100' };
    if (sys < 130 && dia < 80) return { status: 'เสี่ยง', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (sys < 140 || dia < 90) return { status: 'ระดับ 1', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (sys >= 140 || dia >= 90) return { status: 'ระดับ 2', color: 'text-red-600', bg: 'bg-red-100' };
    return { status: '-', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const bpStatus = getBloodPressureStatus(checkupData.systolic, checkupData.diastolic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* ===================== HEADER SECTION ===================== */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏥</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">บันทึกการตรวจคนไข้</h1>
                <p className="text-gray-600">Medical Checkup Record System</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>เวรดึก {DateTime.now().toFormat('dd/MM/yyyy HH:mm')}</span>
              </div>
            </div>
          </div>
        </div>

        {currentPatient ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800">ข้อมูลผู้ป่วย</h2>
                  <p className="text-gray-600">Patient Information</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm text-gray-500">เลขประจำตัวผู้ป่วย</span>
                    <p className="font-semibold text-lg text-blue-600">{currentPatient.hn}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm text-gray-500">เลขเครื่อง EMI</span>
                    <p className="font-semibold text-lg text-purple-600">{currentPatient.emi || '-'}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <span className="text-sm text-gray-500">ชื่อ-สกุล</span>
                  <p className="font-semibold text-xl text-gray-800">
                    {currentPatient.namepat} {currentPatient.surnamepat}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm text-gray-500">เพศ</span>
                    <p className="font-semibold text-gray-800">{currentPatient.gender}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm text-gray-500">อายุ</span>
                    <p className="font-semibold text-gray-800">{age ?? '-'} ปี</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="text-sm text-gray-500">หมอที่ดูแล</span>
                    <p className="font-semibold text-gray-800">{currentPatient.doctorpat}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <span className="text-sm text-gray-500">อาการเดิม</span>
                  <p className="font-semibold text-gray-800">{currentPatient.symptomspat}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <span className="text-sm text-gray-500">วันที่เข้ารักษาครั้งแรก</span>
                  <p className="font-semibold text-gray-800">{currentPatient.datepat?.split('T')[0]}</p>
                </div>
              </div>
            </div>

            {/* Checkup Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🩺</span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800">บันทึกการตรวจ</h2>
                  <p className="text-gray-600">Medical Checkup Form</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 วันที่ตรวจ
                  </label>
                  <input
                    type="date"
                    name="datePresent"
                    value={checkupData.datePresent}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Blood Pressure */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ❤️ ความดันโลหิต (mmHg)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Systolic (ความดันบน)</label>
                      <input
                        type="number"
                        name="systolic"
                        value={checkupData.systolic}
                        onChange={handleInputChange}
                        placeholder="120"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Diastolic (ความดันล่าง)</label>
                      <input
                        type="number"
                        name="diastolic"
                        value={checkupData.diastolic}
                        onChange={handleInputChange}
                        placeholder="80"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Blood Pressure Status */}
                  {checkupData.systolic && checkupData.diastolic && (
                    <div className={`mt-3 p-3 rounded-lg ${bpStatus.bg}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">สถานะความดัน:</span>
                        <span className={`font-bold ${bpStatus.color}`}>{bpStatus.status}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {checkupData.systolic}/{checkupData.diastolic} mmHg
                      </div>
                    </div>
                  )}
                </div>

                {/* Symptoms */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🤒 อาการที่พบ
                  </label>
                  <textarea
                    name="symptoms"
                    value={checkupData.symptoms}
                    onChange={handleInputChange}
                    placeholder="ระบุอาการที่ผู้ป่วยมีในการตรวจครั้งนี้..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                {/* Disease */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏥 การวินิจฉัย/โรค
                  </label>
                  <input
                    type="text"
                    name="disease"
                    value={checkupData.disease}
                    onChange={handleInputChange}
                    placeholder="ระบุการวินิจฉัยหรือโรคที่สงสัย..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Initial Result */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📋 ผลการตรวจเบื้องต้น
                  </label>
                  <textarea
                    name="initialResult"
                    value={checkupData.initialResult}
                    onChange={handleInputChange}
                    placeholder="ระบุผลการตรวจเบื้องต้น แผนการรักษา หรือคำแนะนำ..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        กำลังบันทึก...
                      </div>
                    ) : (
                      '💾 บันทึกการตรวจ'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate(`/patient/${hn}`)}
                    className="px-6 py-4 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                  >
                    ↩️ ย้อนกลับ
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ไม่พบข้อมูลผู้ป่วย</h2>
              <p className="text-gray-600 mb-6">ไม่สามารถโหลดข้อมูลผู้ป่วย HN: {hn}</p>
              <button
                onClick={() => navigate(`/patient/${hn}`)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
              >
                ↩️ กลับไปหน้าหลัก
              </button>
            </div>
          </div>
        )}
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AddDataDashBoardData;
