import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Registerpatient() {
  const { hn } = useParams(); // <-- ดึง hn จาก URL

 const [form, setForm] = useState({
  namepat: '',
  surnamepat: '',
  datepat: '',
  born: '',
  gender: '',
  address: '',
  symptomspat: '',
  doctorpat: '',
  emi: '',
  disease: '',
  allergy: '',
  treatmenthistory: '',
  surgeryhistory: '',
});



  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      namepat, surnamepat, datepat, born, gender, address, symptomspat,
      doctorpat, emi, disease, allergy, treatmenthistory, surgeryhistory
    } = form;

    if (!namepat.match(/^[a-zA-Zก-๙\s]+$/)) return toast.error('กรุณากรอกชื่อเป็นตัวอักษรเท่านั้น');
    if (!surnamepat.match(/^[a-zA-Zก-๙\s]+$/)) return toast.error('กรุณากรอกนามสกุลเป็นตัวอักษรเท่านั้น');
    if (!born) return toast.error('กรุณากรอกวันเกิด');
    if (!datepat.match(/^\d{4}-\d{2}-\d{2}$/)) return toast.error('กรุณากรอกวันที่ในรูปแบบ YYYY-MM-DD');
    if (!gender) return toast.error('กรุณาเลือกเพศ');
    if (!emi) return toast.error('กรุณากรอก EMI');
    if (!address.match(/^[a-zA-Zก-๙0-9\s,.-]+$/)) return toast.error('กรุณากรอกที่อยู่ให้ถูกต้อง');
    if (!symptomspat.match(/^[a-zA-Zก-๙\s]+$/)) return toast.error('กรุณากรอกอาการให้ถูกต้อง');
    if (!doctorpat || doctorpat === 'doctorpat') return toast.error('กรุณาเลือกแพทย์ผู้รักษา');
    if (!disease) return toast.error('กรุณากรอกโรคประจำตัว');
    if (!allergy) return toast.error('กรุณากรอกแพ้ยา');
    if (!treatmenthistory) return toast.error('กรุณากรอกประวัติการรักษา');
    if (!surgeryhistory) return toast.error('กรุณากรอกประวัติการผ่าตัด');

       try {
    const response = await axios.post('http://localhost:4000/hospital/register', form);
    const hnGenerated = response.data.hn; // รับ hn ที่ backend สร้างมา

    toast.success(`✅ ส่งข้อมูลสำเร็จ! รหัสผู้ป่วย (HN): ${hnGenerated}`);
    setTimeout(() => setShowPopup(true), 1000);
  } catch (error) {
    console.error('Error:', error);
    toast.error('❌ เกิดข้อผิดพลาดในการส่งข้อมูล');
  }

  setForm({
    namepat: '',
    surnamepat: '',
    datepat: '',
    born: '',
    gender: '',
    address: '',
    symptomspat: '',
    doctorpat: '',
    emi: '',
    disease: '',
    allergy: '',
    treatmenthistory: '',
    surgeryhistory: '',
  });
};

  return (
    <div className=" py-10 px-4">
      <form onSubmit={handleSubmit} className="bg-white max-w-5xl w-screen mx-auto  px-12 py-10">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-[#2E7D32]">ลงทะเบียนผู้ป่วยใหม่</h1>
        <p className="text-lg mb-8 text-center text-[#424242]">National Heart Institute</p>

        <SectionTitle title="ข้อมูลส่วนตัวของผู้ป่วย" />
        <div className="grid md:grid-cols-2 gap-6 p-6 rounded-lg mb-6">
          <InputField label="ชื่อผู้ป่วย" name="namepat" value={form.namepat} onChange={handleChange} placeholder="ชื่อผู้ป่วย" />
          <InputField label="นามสกุลผู้ป่วย" name="surnamepat" value={form.surnamepat} onChange={handleChange} placeholder="นามสกุลผู้ป่วย" />
          <InputField label="วันเกิด" name="born" type="date" value={form.born} onChange={handleChange} />
          <SelectField label="เพศ" name="gender" value={form.gender} onChange={handleChange} options={["ชาย", "หญิง", "อื่นๆ"]} />
        </div>

        <div className="p-6 rounded-lg mb-6">
          <TextareaField label="ที่อยู่" name="address" value={form.address} onChange={handleChange} placeholder="ที่อยู่" />
        </div>

        <SectionTitle title="ข้อมูลทางการแพทย์" />
        <div className="grid md:grid-cols-2 gap-6 p-6 rounded-lg mb-6">
          <InputField label="วันที่เข้ารักษา" name="datepat" type="date" value={form.datepat} onChange={handleChange} />
          <InputField label="รหัสเครื่อง EMI" name="emi" value={form.emi} onChange={handleChange} placeholder="กรอกรหัสเครื่อง" />
          <SelectField label="แพทย์ผู้รักษา" name="doctorpat" value={form.doctorpat} onChange={handleChange} options={["หมอสมชาย", "หมอสมหญิง", "หมอสมศักดิ์"]} defaultLabel="เลือกแพทย์ผู้รักษา" />
        </div>

        <div className="p-6 rounded-lg mb-6 space-y-4">
          <TextareaField label="อาการที่พบ" name="symptomspat" value={form.symptomspat} onChange={handleChange} placeholder="เช่น ไข้สูง 3 วัน ไอแห้ง หอบเหนื่อย" />
          <TextareaField label="โรคประจำตัว" name="disease" value={form.disease} onChange={handleChange} placeholder="เช่น เบาหวาน, ความดันโลหิตสูง" />
          <TextareaField label="แพ้ยา" name="allergy" value={form.allergy} onChange={handleChange} placeholder="เช่น ยาแอสไพริน, ยาแก้ปวด" />
          <TextareaField label="ประวัติการรักษา" name="treatmenthistory" value={form.treatmenthistory} onChange={handleChange} placeholder="เช่น เคยรักษาโรคหัวใจ, โรคเบาหวาน" />
          <TextareaField label="ประวัติการผ่าตัด" name="surgeryhistory" value={form.surgeryhistory} onChange={handleChange} placeholder="เช่น เคยผ่าตัดหัวใจ, ผ่าตัดไส้ติ่ง" />
        </div>

        <div className="flex justify-center mt-8">
          <button type="submit" className="bg-green-700 text-white px-10 py-3 rounded-full hover:bg-green-800 transition text-lg font-semibold">
            ส่งข้อมูล
          </button>
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-2 text-green-700">ลงทะเบียนสำเร็จ!</h2>
            <p className="mb-4">ระบบได้บันทึกข้อมูลของคุณเรียบร้อยแล้ว</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowPopup(false)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                ลงทะเบียนผู้ป่วยต่อ
              </button>
              <Link to="/datapat">
                <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">
                  ข้อมูลผู้ป่วย
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
}

const SectionTitle = ({ title }) => (
  <h2 className="font-bold text-2xl mb-4 text-[#424242]">{title}</h2>
);

const InputField = ({ label, name, value, onChange, type = 'text', placeholder = '' }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-bold text-[#424242]">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange, placeholder }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-bold text-[#424242]">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, defaultLabel = '-- กรุณาเลือก --' }) => (
  <div className="flex flex-col">
    <label className="mb-1 font-bold text-[#424242]">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      <option value="">{defaultLabel}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default Registerpatient;
