import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';


const AddDataDashBoardData = () => {
  const { hn } = useParams();

  const [patients, setPatients] = useState([]);
  const [age, setAge] = useState(null);
  

  // โหลดข้อมูล sensor
  useEffect(() => {
  const fetchPatient = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/hospital/register/${hn}`);
      setPatients(response.data.data ? [response.data.data] : []);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setPatients([]);
    }
  };

  fetchPatient();
  const interval = setInterval(fetchPatient, 1000 * 60 * 60 * 2); // ทุก 2 ชั่วโมง

  return () => clearInterval(interval);
}, [hn]);



const currentPatient = patients.find(p => p.hn === hn);
// โหลดข้อมูลผู้ป่วยจาก localStorage
useEffect(() => {
if (currentPatient?.born) {
  const birthYear = new Date(currentPatient.born).getFullYear();
  const currentYear = new Date().getFullYear();
  setAge(currentYear - birthYear);
}
}, [currentPatient]);

  return (
    <div className=" items-center justify-center ">
      <div className="">
        <form className="">
          <h1 className="text-4xl font-bold text-center text-[#2563EB]">การรักษาคนไข้</h1>

          {currentPatient ? (
            <div className="border border-gray-300 rounded-lg p-8 shadow-md bg-white mt-6 
            ">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 mb-8 text-lg">
                <div>
                  <span className="font-semibold">วันที่เข้ารักษาครั้งแรก:</span>{' '}
                  <span className="text-blue-700">{currentPatient.datepat?.split('T')[0]}</span>
                </div>
                
                <div>
                  <span className="font-semibold">เลขประจำตัวผู้ป่วย:</span>{' '}
                  <span className="text-blue-700">{currentPatient.hn || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold">เลขเครื่อง EMI:</span>{' '}
                  <span className="text-blue-700">{currentPatient.emi || '-'}</span>
                </div>
                <div>
                  <span className="font-semibold">ชื่อผู้ป่วย:</span>{' '}
                  <span className="text-blue-700">{currentPatient.namepat}</span>
                </div>
                <div>
                  <span className="font-semibold">นามสกุล:</span>{' '}
                  <span className="text-blue-700">{currentPatient.surnamepat}</span>
                </div>
                <div>
                  <span className="font-semibold">เพศ:</span>{' '}
                  <span className="text-blue-700">{currentPatient.gender}</span>
                </div>
                <div>
                  <span className="font-semibold">อาการ:</span>{' '}
                  <span className="text-blue-700">{currentPatient.symptomspat}</span>
                </div>
                <div>
                  <span className="font-semibold">อายุ:</span>{' '}
                  <span className="text-blue-700">{age ?? '-'}</span>
                </div>
                <div>
                  <span className="font-semibold">หมอที่ดูแล:</span>{' '}
                  <span className="text-blue-700">{currentPatient.doctorpat}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-6">ไม่พบข้อมูลคนไข้</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddDataDashBoardData;
