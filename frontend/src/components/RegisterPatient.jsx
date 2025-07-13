import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// import { useParams } from 'react-router-dom'; // ไม่ใช้งานในขณะนี้
import { 
  FaUserPlus, 
  FaHospital, 
  FaShieldAlt, 
  FaUserMd, 
  FaStethoscope,
  FaCalendarAlt,
  FaIdCard,
  FaMapMarkerAlt,
  FaNotesMedical,
  FaPills,
  FaHistory,
  FaExclamationTriangle,
  FaSave,
  FaCheck,
  FaClock,
  FaLock,
  FaPhoneAlt,
  FaUserFriends,
  FaPlus,
  FaTrash,
  FaTint,
  FaWeight,
  FaRulerVertical
} from 'react-icons/fa';

function Registerpatient() {
  // const { hn } = useParams(); // <-- ดึง hn จาก URL (ไม่ใช้งานในขณะนี้)

 const [form, setForm] = useState({
  prefix: '',
  namepat: '',
  surnamepat: '',
  datepat: '',
  born: '',
  gender: '',
  address: '',
  phonepat: '',
  bloodgroup: '',
  weight: '',
  height: '',
  symptomspat: '',
  doctorpat: '',
  emi: '',
  disease: '',
  allergy: '',
  treatmenthistory: '',
  surgeryhistory: '',
});

// Emergency Contacts State
const [emergencyContacts, setEmergencyContacts] = useState([
  {
    prefix: '',
    nameemergency: '',
    surnameemergency: '',
    phone: '',
    relation: ''
  }
]);



  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Emergency Contact Changes
  const handleEmergencyContactChange = (index, field, value) => {
    const updatedContacts = [...emergencyContacts];
    updatedContacts[index][field] = value;
    setEmergencyContacts(updatedContacts);
  };

  // Add new emergency contact
  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, {
      prefix: '',
      nameemergency: '',
      surnameemergency: '',
      phone: '',
      relation: ''
    }]);
  };

  // Remove emergency contact
  const removeEmergencyContact = (index) => {
    if (emergencyContacts.length > 1) {
      const updatedContacts = emergencyContacts.filter((_, i) => i !== index);
      setEmergencyContacts(updatedContacts);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
      bloodgroup, weight, height, symptomspat, doctorpat, emi, disease, 
      allergy, treatmenthistory, surgeryhistory
    } = form;

    if (!prefix) return toast.error('กรุณาเลือกคำนำหน้า');
    if (!namepat.match(/^[a-zA-Zก-๙\s]+$/)) return toast.error('กรุณากรอกชื่อเป็นตัวอักษรเท่านั้น');
    if (!surnamepat.match(/^[a-zA-Zก-๙\s]+$/)) return toast.error('กรุณากรอกนามสกุลเป็นตัวอักษรเท่านั้น');
    if (!born) return toast.error('กรุณากรอกวันเกิด');
    if (!datepat.match(/^\d{4}-\d{2}-\d{2}$/)) return toast.error('กรุณากรอกวันที่ในรูปแบบ YYYY-MM-DD');
    if (!gender) return toast.error('กรุณาเลือกเพศ');
    if (!phonepat.match(/^[0-9-]+$/)) return toast.error('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
    if (!bloodgroup) return toast.error('กรุณาเลือกกรุ๊ปเลือด');
    if (!weight || isNaN(weight)) return toast.error('กรุณากรอกน้ำหนักเป็นตัวเลข');
    if (!height || isNaN(height)) return toast.error('กรุณากรอกส่วนสูงเป็นตัวเลข');
    if (!emi) return toast.error('กรุณากรอก EMI');
    if (!address.match(/^[a-zA-Zก-๙0-9\s,.-]+$/)) return toast.error('กรุณากรอกที่อยู่ให้ถูกต้อง');
    if (!symptomspat.match(/^[a-zA-Zก-๙\s]+$/)) return toast.error('กรุณากรอกอาการให้ถูกต้อง');
    if (!doctorpat || doctorpat === 'doctorpat') return toast.error('กรุณาเลือกแพทย์ผู้รักษา');
    if (!disease) return toast.error('กรุณากรอกโรคประจำตัว');
    if (!allergy) return toast.error('กรุณากรอกแพ้ยา');
    if (!treatmenthistory) return toast.error('กรุณากรอกประวัติการรักษา');
    if (!surgeryhistory) return toast.error('กรุณากรอกประวัติการผ่าตัด');

    // Validate Emergency Contacts
    if (emergencyContacts.some(contact => 
      !contact.prefix || !contact.nameemergency || !contact.surnameemergency || 
      !contact.phone || !contact.relation
    )) {
      return toast.error('กรุณากรอกข้อมูลผู้ติดต่อฉุกเฉินให้ครบถ้วน');
    }

    // Validate phone numbers
    const phoneRegex = /^[0-9-]+$/;
    if (emergencyContacts.some(contact => !phoneRegex.test(contact.phone))) {
      return toast.error('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
    }

       try {
    const response = await axios.post('http://localhost:4000/hospital/register', form);
    const hnGenerated = response.data.hn; // รับ hn ที่ backend สร้างมา

    // บันทึกข้อมูลผู้ติดต่อฉุกเฉิน
    for (const contact of emergencyContacts) {
      await axios.post('http://localhost:4000/hospital/emergencyContacts/', {
        ...contact,
        hn: hnGenerated
      });
    }

    toast.success(`✅ ส่งข้อมูลสำเร็จ! รหัสผู้ป่วย (HN): ${hnGenerated}`);
    setTimeout(() => setShowPopup(true), 1000);
  } catch (error) {
    console.error('Error:', error);
    toast.error('❌ เกิดข้อผิดพลาดในการส่งข้อมูล');
  }

  setForm({
    hn: '',
    prefix: '',
    namepat: '',
    surnamepat: '',
    datepat: '',
    born: '',
    gender: '',
    address: '',
    phonepat: '',
    bloodgroup: '',
    weight: '',
    height: '',
    symptomspat: '',
    doctorpat: '',
    emi: '',
    disease: '',
    allergy: '',
    treatmenthistory: '',
    surgeryhistory: '',
  });

  // Reset emergency contacts
  setEmergencyContacts([{
    prefix: '',
    nameemergency: '',
    surnameemergency: '',
    phone: '',
    relation: ''
  }]);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      {/* Professional Header with Trust Indicators */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 text-white rounded-2xl shadow-2xl p-8 border border-blue-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <FaUserPlus className="text-3xl text-blue-200" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">ลงทะเบียนผู้ป่วยใหม่</h1>
                <p className="text-blue-200 text-lg flex items-center gap-2">
                  <FaHospital className="text-blue-300" />
                  National Heart Institute - ระบบบันทึกข้อมูลผู้ป่วย
                </p>
              </div>
            </div>
            
            {/* Trust & Security Indicators */}
            <div className="hidden lg:flex flex-col gap-2 text-right">
              <div className="flex items-center gap-2 text-sm bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
                <FaShieldAlt className="text-green-400" />
                <span className="text-green-300">ข้อมูลปลอดภัย</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                <FaLock className="text-blue-400" />
                <span className="text-blue-300">เข้ารหัส SSL</span>
              </div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FaCheck className="text-white text-sm" />
              </div>
              <span className="text-sm font-medium">เริ่มต้น</span>
            </div>
            <div className="w-12 h-1 bg-white/30 rounded-full">
              <div className="w-1/3 h-full bg-green-400 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <FaUserMd className="text-white text-sm" />
              </div>
              <span className="text-sm font-medium">กรอกข้อมูล</span>
            </div>
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                <FaSave className="text-white/60 text-sm" />
              </div>
              <span className="text-sm font-medium opacity-60">บันทึก</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Form Container */}
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaStethoscope className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">แบบฟอร์มข้อมูลผู้ป่วย</h2>
                  <p className="text-sm text-gray-600">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
                </div>
              </div>
              
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="px-8 py-8">
            <SectionTitle 
              title="ข้อมูลส่วนตัวของผู้ป่วย" 
              icon={<FaIdCard className="text-blue-600" />}
              description="ข้อมูลพื้นฐานสำหรับการระบุตัวตนผู้ป่วย"
            />
            <div className="grid md:grid-cols-2 gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <SelectField 
                label="คำนำหน้า" 
                name="prefix" 
                value={form.prefix} 
                onChange={handleChange} 
                options={["นาย", "นาง", "นางสาว", "เด็กชาย", "เด็กหญิง"]} 
                icon={<FaIdCard />}
                required
              />
              <InputField 
                label="ชื่อผู้ป่วย" 
                name="namepat" 
                value={form.namepat} 
                onChange={handleChange} 
                placeholder="กรอกชื่อผู้ป่วย" 
                icon={<FaUserMd />}
                required
              />
              <InputField 
                label="นามสกุลผู้ป่วย" 
                name="surnamepat" 
                value={form.surnamepat} 
                onChange={handleChange} 
                placeholder="กรอกนามสกุลผู้ป่วย" 
                icon={<FaUserMd />}
                required
              />
              <InputField 
                label="วันเกิด" 
                name="born" 
                type="date" 
                value={form.born} 
                onChange={handleChange} 
                icon={<FaCalendarAlt />}
                required
              />
              <SelectField 
                label="เพศ" 
                name="gender" 
                value={form.gender} 
                onChange={handleChange} 
                options={["ชาย", "หญิง", "อื่นๆ"]} 
                icon={<FaIdCard />}
                required
              />
              <InputField 
                label="เบอร์โทรศัพท์" 
                name="phonepat" 
                value={form.phonepat} 
                onChange={handleChange} 
                placeholder="เช่น 081-234-5678" 
                icon={<FaPhoneAlt />}
                required
              />
            </div>

            <div className="mt-6 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-100">
              <TextareaField 
                label="ที่อยู่" 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                placeholder="กรอกที่อยู่ปัจจุบันของผู้ป่วย" 
                icon={<FaMapMarkerAlt />}
                required
              />
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="px-8 py-8 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-gray-200">
            <SectionTitle 
              title="ข้อมูลทางการแพทย์" 
              icon={<FaStethoscope className="text-green-600" />}
              description="ข้อมูลสำคัญสำหรับการรักษาและติดตามผู้ป่วย"
            />
            
            {/* Physical Information */}
            <div className="mb-6 bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaNotesMedical className="text-green-600" />
                ข้อมูลทางกายภาพ
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <SelectField 
                  label="กรุ๊ปเลือด" 
                  name="bloodgroup" 
                  value={form.bloodgroup} 
                  onChange={handleChange} 
                  options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]} 
                  icon={<FaTint />}
                  required
                />
                <InputField 
                  label="น้ำหนัก (กก.)" 
                  name="weight" 
                  type="number" 
                  value={form.weight} 
                  onChange={handleChange} 
                  placeholder="เช่น 68.5" 
                  icon={<FaWeight />}
                  required
                />
                <InputField 
                  label="ส่วนสูง (ซม.)" 
                  name="height" 
                  type="number" 
                  value={form.height} 
                  onChange={handleChange} 
                  placeholder="เช่น 172.0" 
                  icon={<FaRulerVertical />}
                  required
                />
              </div>
            </div>

            {/* Medical Details */}
            <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUserMd className="text-green-600" />
                รายละเอียดการรักษา
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <InputField 
                  label="วันที่เข้ารักษา" 
                  name="datepat" 
                  type="date" 
                  value={form.datepat} 
                  onChange={handleChange} 
                  icon={<FaCalendarAlt />}
                  required
                />
                <InputField 
                  label="รหัสเครื่อง EMI" 
                  name="emi" 
                  value={form.emi} 
                  onChange={handleChange} 
                  placeholder="กรอกรหัสเครื่องมือแพทย์" 
                  icon={<FaStethoscope />}
                  required
                />
                <SelectField 
                  label="แพทย์ผู้รักษา" 
                  name="doctorpat" 
                  value={form.doctorpat} 
                  onChange={handleChange} 
                  options={["นายแพทย์สมชาย สวัสดี", "แพทย์หญิงสมหญิง วัฒนา", "นายแพทย์หมอสมศักดิ์ คุ้มครองโรจน์"]} 
                  defaultLabel="เลือกแพทย์ผู้รักษา" 
                  icon={<FaUserMd />}
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical History Section */}
          <div className="px-8 py-8 border-t border-gray-200">
            <SectionTitle 
              title="ประวัติทางการแพทย์" 
              icon={<FaNotesMedical className="text-purple-600" />}
              description="ข้อมูลประวัติสุขภาพและการรักษาที่ผ่านมา"
            />
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
                  <TextareaField 
                    label="อาการที่พบ" 
                    name="symptomspat" 
                    value={form.symptomspat} 
                    onChange={handleChange} 
                    placeholder="เช่น ไข้สูง 3 วัน ไอแห้ง หอบเหนื่อย มีเสมหะ" 
                    icon={<FaExclamationTriangle />}
                    required
                  />
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-100">
                  <TextareaField 
                    label="โรคประจำตัว" 
                    name="disease" 
                    value={form.disease} 
                    onChange={handleChange} 
                    placeholder="เช่น เบาหวาน, ความดันโลหิตสูง, โรคหัวใจ" 
                    icon={<FaNotesMedical />}
                    required
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100">
                  <TextareaField 
                    label="แพ้ยา / สารก่อภูมิแพ้" 
                    name="allergy" 
                    value={form.allergy} 
                    onChange={handleChange} 
                    placeholder="เช่น ยาแอสไพริน, เพนิซิลิน, อาหารทะเล" 
                    icon={<FaPills />}
                    required
                  />
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                  <TextareaField 
                    label="ประวัติการรักษา" 
                    name="treatmenthistory" 
                    value={form.treatmenthistory} 
                    onChange={handleChange} 
                    placeholder="เช่น เคยรักษาโรคหัวใจ, ได้รับการรักษาจากแพทย์เฉพาะทาง" 
                    icon={<FaHistory />}
                    required
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100">
                <TextareaField 
                  label="ประวัติการผ่าตัด" 
                  name="surgeryhistory" 
                  value={form.surgeryhistory} 
                  onChange={handleChange} 
                  placeholder="เช่น เคยผ่าตัดหัวใจ, ผ่าตัดไส้ติ่ง, ผ่าตัดกระดูก" 
                  icon={<FaHistory />}
                  required
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts Section */}
          <div className="px-8 py-8 bg-gradient-to-r from-red-50 to-pink-50 border-t border-gray-200">
            <SectionTitle 
              title="ผู้ติดต่อฉุกเฉิน" 
              icon={<FaPhoneAlt className="text-red-600" />}
              description="ข้อมูลผู้ติดต่อในกรณีเกิดเหตุฉุกเฉิน"
            />
            
            <div className="space-y-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaUserFriends className="text-red-600" />
                      ผู้ติดต่อฉุกเฉิน {index + 1}
                    </h4>
                    {emergencyContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmergencyContact(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SelectField
                      label="คำนำหน้า"
                      name={`prefix-${index}`}
                      value={contact.prefix}
                      onChange={(e) => handleEmergencyContactChange(index, 'prefix', e.target.value)}
                      options={["นาย", "นาง", "นางสาว", "เด็กชาย", "เด็กหญิง"]}
                      icon={<FaIdCard />}
                      required
                    />
                    
                    <InputField
                      label="ชื่อ"
                      name={`nameemergency-${index}`}
                      value={contact.nameemergency}
                      onChange={(e) => handleEmergencyContactChange(index, 'nameemergency', e.target.value)}
                      placeholder="กรอกชื่อผู้ติดต่อฉุกเฉิน"
                      icon={<FaUserMd />}
                      required
                    />
                    
                    <InputField
                      label="นามสกุล"
                      name={`surnameemergency-${index}`}
                      value={contact.surnameemergency}
                      onChange={(e) => handleEmergencyContactChange(index, 'surnameemergency', e.target.value)}
                      placeholder="กรอกนามสกุลผู้ติดต่อฉุกเฉิน"
                      icon={<FaUserMd />}
                      required
                    />
                    
                    <InputField
                      label="เบอร์โทรศัพท์"
                      name={`phone-${index}`}
                      value={contact.phone}
                      onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                      placeholder="เช่น 081-234-5678"
                      icon={<FaPhoneAlt />}
                      required
                    />
                    
                    <SelectField
                      label="ความสัมพันธ์"
                      name={`relation-${index}`}
                      value={contact.relation}
                      onChange={(e) => handleEmergencyContactChange(index, 'relation', e.target.value)}
                      options={["พ่อ", "แม่", "พี่", "น้อง", "ญาติ", "เพื่อน", "แฟน", "อื่นๆ"]}
                      icon={<FaUserFriends />}
                      required
                    />
                  </div>
                </div>
              ))}
              
              
            </div>
          </div>

          {/* Submit Section */}
          <div className="px-8 py-8 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
            <div className="text-center">
              <div className="mb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-full border border-green-200">
                    <FaShieldAlt className="text-green-600" />
                    <span>ข้อมูลจะถูกเข้ารหัสและปลอดภัย</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
                    <FaLock className="text-blue-600" />
                    <span>ปฏิบัติตามมาตรฐาน HIPAA</span>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
              >
                <FaSave className="text-xl group-hover:scale-110 transition-transform" />
                บันทึกข้อมูลผู้ป่วยและผู้ติดต่อฉุกเฉิน
                <div className="ml-2 opacity-75">→</div>
              </button>
              
              <p className="text-sm text-gray-600 mt-4">
                กรุณาตรวจสอบข้อมูลผู้ป่วยและผู้ติดต่อฉุกเฉินให้ถูกต้องก่อนบันทึก
              </p>
            </div>
          </div>
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">ลงทะเบียนสำเร็จ!</h2>
              <p className="text-green-100">ระบบได้บันทึกข้อมูลผู้ป่วยและผู้ติดต่อฉุกเฉินเรียบร้อยแล้ว</p>
            </div>
            
            {/* Success Content */}
            <div className="p-6 text-center">
              <div className="mb-6">
                <div className="flex items-center gap-2 justify-center text-sm text-gray-600 mb-3">
                  <FaShieldAlt className="text-green-500" />
                  <span>ข้อมูลถูกเข้ารหัสและจัดเก็บอย่างปลอดภัย</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-sm text-gray-600">
                  <FaClock className="text-blue-500" />
                  <span>เวลาบันทึก: {new Date().toLocaleString('th-TH')}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setShowPopup(false)} 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FaUserPlus className="text-lg" />
                  ลงทะเบียนผู้ป่วยต่อ
                </button>
                <Link to="/datapat">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <FaNotesMedical className="text-lg" />
                    ดูข้อมูลผู้ป่วย
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-center" 
        autoClose={4000} 
        theme="colored"
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

const SectionTitle = ({ title, icon, description }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center border border-blue-200">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
    <div className="w-full h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-full"></div>
  </div>
);

const InputField = ({ label, name, value, onChange, type = 'text', placeholder = '', icon, required = false }) => (
  <div className="flex flex-col group">
    <label className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
      {icon && <span className="text-blue-600">{icon}</span>}
      {label}
      {required && <span className="text-red-500 text-sm">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 group-hover:border-gray-300 bg-white shadow-sm"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  </div>
);

const TextareaField = ({ label, name, value, onChange, placeholder, icon, required = false }) => (
  <div className="flex flex-col group">
    <label className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
      {icon && <span className="text-blue-600">{icon}</span>}
      {label}
      {required && <span className="text-red-500 text-sm">*</span>}
    </label>
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 group-hover:border-gray-300 bg-white shadow-sm resize-none"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options, defaultLabel = '-- กรุณาเลือก --', icon, required = false }) => (
  <div className="flex flex-col group">
    <label className="mb-2 font-semibold text-gray-700 flex items-center gap-2">
      {icon && <span className="text-blue-600">{icon}</span>}
      {label}
      {required && <span className="text-red-500 text-sm">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 group-hover:border-gray-300 bg-white shadow-sm appearance-none cursor-pointer"
      >
        <option value="">{defaultLabel}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  </div>
);

export default Registerpatient;
