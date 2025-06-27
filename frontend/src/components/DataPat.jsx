import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const DataPat = () => {
  const [patients, setPatients] = useState([]);
  // const [sensor, setSensor] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:4000/hospital/register/');
        setPatients(response.data.data || []);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setPatients([]);
      }
    };
    fetchPatients();
  }, []);
 const handleDelete = async (hn) => {
    const confirmDelete = window.confirm('คุณต้องการลบข้อมูลผู้ป่วยใช่หรือไม่?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/hospital/register/${hn}`);
      setPatients((prev) => prev.filter((p) => p.hn !== hn));
    } catch (error) {
      console.error('ลบข้อมูลไม่สำเร็จ:', error);
    }
  };
const handleUpdate = async (hn, updatedData) => {
  try {
    await axios.put(`http://localhost:4000/hospital/register/${hn}`, updatedData);
    alert('อัปเดตข้อมูลสำเร็จ');
    // รีเฟรชข้อมูลใหม่
    setPatients((prev) =>
      prev.map((p) => (p.hn === hn ? { ...p, ...updatedData } : p))
    );
  } catch (error) {
    console.error('อัปเดตข้อมูลไม่สำเร็จ:', error);
  }
};

  return (
    <div className="w-full px-4 sm:px-8 py-10 bg-[var(--background-light)] min-h-screen ">
      <div className="bg-[var(--white)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-8">
        <h2 className="text-3xl font-semibold text-center text-[var(--dark-green)] mb-10">
          รายชื่อผู้ป่วยในระบบ
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm md:text-base border-separate border-spacing-y-4">
            <thead className="bg-[var(--light-green)] text-[var(--text-dark)] rounded-lg">
              <tr className="text-center">
                <th className="py-3 px-2 rounded-l-[var(--radius-sm)]">#</th>
                <th className="py-3 px-2">HN</th>
                <th className="py-3 px-2">EMI</th>
                <th className="py-3 px-2">วันที่รักษา</th>
                <th className="py-3 px-2">ชื่อ</th>
                <th className="py-3 px-2">นามสกุล</th>
                <th className="py-3 px-2">วันเกิด</th>
                <th className="py-3 px-2">เพศ</th>
                <th className="py-3 px-2">ที่อยู่</th>
                <th className="py-3 px-2">อาการ</th>
                <th className="py-3 px-2 rounded-r-[var(--radius-sm)]">หมอ</th>
                
              </tr>
            </thead>
            <tbody className="text-center text-[var(--text-gray)]">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-6 text-[var(--error-red)] font-medium">
                    ไม่พบข้อมูลผู้ป่วย
                  </td>
                </tr>
              ) : (
                patients.map((patient, index) => (
                  <tr
                    key={patient.hn}
                    className="bg-[var(--neutral-gray)] hover:bg-[var(--light-green)] transition-all duration-200 rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]"
                  >
                    <td className="py-3 px-2">{index + 1}</td>
                    <td className="py-3 px-2 font-semibold">
                      <Link
                        to={`/patient/${patient.hn}/`}
                        className="text-[var(--primary-blue)] hover:underline"
                      >
                        {patient.hn}
                      </Link>
                    </td>
                    <td className="py-3 px-2">{patient.emi}</td>
                    <td className="py-3 px-2">{patient.datepat?.split('T')[0]}</td>
                    <td className="py-3 px-2">{patient.namepat}</td>
                    <td className="py-3 px-2">{patient.surnamepat}</td>
                    <td className="py-3 px-2">{patient.born?.split('T')[0]}</td>
                    <td className="py-3 px-2">{patient.gender}</td>
                    <td className="py-3 px-2 text-left whitespace-normal">{patient.address}</td>
                    <td className="py-3 px-2 text-left whitespace-normal">{patient.symptomspat}</td>
                    <td className="py-3 px-2">{patient.doctorpat}</td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>


  );
};

export default DataPat;
