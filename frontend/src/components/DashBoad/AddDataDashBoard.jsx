import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddDataDashBoardData from './AddDataDashBoardData';


const AddDataDashBoard = () => {
  // ฟังก์ชันคืนค่าวันที่ปัจจุบัน
  const today = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // State ฟอร์ม
  const [formData, setFormData] = useState({
    datePresent: today(),
    weight: '',
    height: '',
    symptoms: '',
    disease: '',
    initialResult: '',
    hn: '', // ✅ เพิ่ม HN
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
    const hn = formData.hn.trim();

    if (!hn) {
      toast.error('กรุณากรอก HN ก่อนบันทึกข้อมูล');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/hospital/checkups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }

      const data = await response.json();
      toast.success('บันทึกข้อมูลสำเร็จ');
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  
  return (
    <div className="flex items-center justify-center">
  <div className="bg-white shadow-lg rounded-lg w-full h-full px-[8rem] pt-[4rem] pb-[4rem]">
    <form onSubmit={handleSubmit} className="text-gray-800">
      <AddDataDashBoardData />

      {/* วันที่เข้ารักษา + HN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-6 mt-6 text-gray-700">
        {/* วันที่เข้ารักษา */}
        <div className="flex flex-col">
          <label className="font-medium">วันที่เข้ารักษา:</label>
          <input
            type="date"
            name="datePresent"
            value={formData.datePresent}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {/* HN */}
        <div className="flex flex-col">
          <label className="font-medium">HN (เลขประจำตัวผู้ป่วย):</label>
          <input
            type="text"
            name="hn"
            value={formData.hn}
            onChange={handleChange}
            placeholder="กรุณากรอก HN เช่น hn001"
            className="border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
      </div>

      {/* วัดร่างกาย */}
      <div className="mt-6">
        <label className="font-bold text-xl block mb-4">วัดร่างกาย</label>
        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium">น้ำหนัก (kg):</label>
            <input
              type="number"
              name="weight"
              min={30}
              max={200}
              placeholder="เช่น 70"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium">ส่วนสูง (cm):</label>
            <input
              type="number"
              name="height"
              min={100}
              max={200}
              placeholder="เช่น 170"
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
        </div>
      </div>

      {/* การรักษา */}
      <div className="mt-8">
        <label className="font-bold text-xl block mb-4">การรักษา</label>
        <div className="grid grid-cols-2 gap-4">
          {/* อาการปัจจุบัน */}
          <div className="flex flex-col col-span-2">
            <label className="font-medium">อาการปัจจุบัน:</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="เช่น ไข้สูง 3 วัน ไอแห้ง หอบเหนื่อย"
              className="border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          {/* โรคที่พบ */}
          <div className="flex flex-col col-span-2 mt-4">
            <label className="font-medium">โรคที่พบ:</label>
            <textarea
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              placeholder="เช่น เบาหวานชนิดที่ 2, หลอดลมอักเสบ ฯลฯ"
              className="border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          {/* ผลตรวจเบื้องต้น */}
          <div className="flex flex-col col-span-2">
            <label className="font-medium">ผลตรวจเบื้องต้น:</label>
            <textarea
              name="initialResult"
              value={formData.initialResult}
              onChange={handleChange}
              placeholder="Lab results, X-Ray, หรือ ECG หากมี"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>
      </div>

      {/* ปุ่มบันทึก */}
      <div className="flex justify-center mt-8">
        <button
          type="submit"
          className="bg-[#4CAF50] hover:bg-[#2E7D32] text-white font-semibold px-8 py-2 rounded-lg transition-all"
        >
          บันทึกข้อมูล
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default AddDataDashBoard;
