import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LuDownload, LuPhone, LuUser, LuHeart, LuCalendar, LuUserCheck, LuUsers } from 'react-icons/lu';
import axios from 'axios';

const Showdata = () => {
  const { hn } = useParams();
  const [patients, setPatients] = useState([]);
  const [latestCheckup, setLatestCheckup] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [allCheckups, setAllCheckups] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const postureMap = {
    0: { label: 'อยู่นิ่ง', color: '#66c2a5' },
    1: { label: 'นอน', color: '#fc8d62' },
    2: { label: 'นั่ง', color: '#8da0cb' },
    3: { label: 'ยื่น', color: '#e78ac3' },
    4: { label: 'ล้ม', color: '#66c2a5' },
  };

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลผู้ป่วย, การตรวจล่าสุด และข้อมูลเซ็นเซอร์
    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://localhost:4000/hospital/register/');
        setPatients(res.data.data || []);
      } catch {
        setPatients([]);
      }
    };
    // ฟังก์ชันดึงข้อมูลการตรวจล่าสุด
    const fetchLatestCheckup = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/hospital/checkups/${hn}`); 
        const data = res.data.data;

        if (Array.isArray(data) && data.length > 0) {
          const latest = data
            .filter(item => item.datepresent)
            .sort((a, b) => new Date(b.datepresent) - new Date(a.datepresent))[0];

          setLatestCheckup(latest || null);
        } else {
          setLatestCheckup(null);
        }
      } catch {
        setLatestCheckup(null);
      }
    };
    // ฟังก์ชันดึงข้อมูลเซ็นเซอร์ล่าสุด
    const fetchSensorslates = async () => {
      try {
        const res = await axios.get('http://localhost:4000/hospital/sensor/latest');
        setSensorData(res.data.sensor || null);
      } catch {
        setSensorData(null);
      }
    };

    // ฟังก์ชันดึงข้อมูลการติดต่อญาติ
    const fetchEmergencyContacts = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/hospital/emergencyContacts/`);
        const contacts = res.data.data || [];
        // กรองข้อมูลการติดต่อตาม HN
        const filteredContacts = contacts.filter(contact => contact.hn === hn);
        setEmergencyContacts(filteredContacts);
      } catch (error) {
        console.error('Error fetching emergency contacts:', error);
        setEmergencyContacts([]);
      }
    };

    // ดึงข้อมูลเซ็นเซอร์ทั้งหมด
    const fetchSensors = async () => {
      try {
        const res = await axios.get('http://localhost:4000/hospital/sensor/');
        setSensorData(res.data.sensor || null);
      } catch {
        setSensorData(null);
      }
    };
    // ดึงข้อมูลผูการตรวจทั้งหมด 
    const fetchCheckup = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/hospital/checkups/${hn}`);
      const data = res.data.data;

      if (Array.isArray(data) && data.length > 0) {
        setAllCheckups(data); // ✅ เก็บทั้งหมดไว้

        // ✅ แยกหาตัวล่าสุด
        const latest = data
          .filter(item => item.datepresent)
          .sort((a, b) => new Date(b.datepresent) - new Date(a.datepresent))[0];

        setLatestCheckup(latest || null);
      } else {
        setAllCheckups([]);
        setLatestCheckup(null);
      }
    } catch {
      setAllCheckups([]);
      setLatestCheckup(null);
    }
  };

    fetchPatients();
    fetchLatestCheckup();
    fetchSensorslates();
    fetchSensors();
    fetchCheckup();
    fetchEmergencyContacts();

    // ตั้งค่า loading เป็น false เมื่อโหลดเสร็จ
    setTimeout(() => setLoading(false), 1000);

    const sensorlatesInterval = setInterval(fetchSensorslates, 1000 * 60 *  2); // ทุก 2 นาที
    const sensorsInterval = setInterval(fetchSensors, 1000 * 60 * 2); // ทุก 2 นาที
    const checkupInterval = setInterval(fetchLatestCheckup, 1000 * 60); // ทุก 1 นาที
    const checkupAllInterval = setInterval(fetchCheckup, 1000 * 60); // ทุก 1 นาที
    const emergencyInterval = setInterval(fetchEmergencyContacts, 1000 * 60 * 5); // ทุก 5 นาที

    return () => {
      clearInterval(sensorlatesInterval);
      clearInterval(checkupInterval);
      clearInterval(sensorsInterval);
      clearInterval(checkupAllInterval);
      clearInterval(emergencyInterval);
    };
  }, [hn]);

  const latestPatient = patients.find((p) => p.hn === hn);
  const latestSensor = sensorData?.length > 0 ? sensorData[sensorData.length - 1] : sensorData;

  // ดึงข้อมูลการตรวจล่าสุด
  const exportToExcel = () => {
    if (!latestPatient) return;
    
    // รวมข้อมูลการติดต่อญาติ
    const emergencyContactsData = emergencyContacts.map((contact, index) => ({
      [`ชื่อผู้ติดต่อ ${index + 1}`]: `${contact.prefix}${contact.nameemergency} ${contact.surnameemergency}`,
      [`ความสัมพันธ์ ${index + 1}`]: contact.relation,
      [`เบอร์โทร ${index + 1}`]: contact.phone,
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {});
    
    const dataToExport = [
      {
    'วันที่เข้ารักษาครั้งแรก': latestPatient.datepat?.split('T')[0],
    'เลขเครื่องที่ติด': latestPatient.emi,
    'เลขประจำตัวผู้ป่วย': latestPatient.hn,
    //ข้อมูลส่วนตัว
    'คำนำหน้า': latestPatient.prefix,
    'ชื่อ': latestPatient.namepat,
    'นามสกุล': latestPatient.surnamepat,
    'เพศ': latestPatient.gender,
    'เบอร์โทร': latestPatient.phone,
    'ที่อยู่': latestPatient.address,
    //ข้อมูลการติดต่อญาติ
    'คำนำหน้าญาติ': emergencyContactsData.prefix,
    'ชื่อญาติผู้ติดต่อ': emergencyContactsData.nameemergency,
    'นามสกุลญาติผู้ติดต่อ': emergencyContactsData.surnameemergency,
    'ความสัมพันธ์ญาติผู้ติดต่อ': emergencyContactsData.relation,
    'เบอร์โทรญาติผู้ติดต่อ': emergencyContactsData.phone,

    //อาการรักษา
    'วันที่ตรวจ': latestCheckup?.datepresent?.split('T')[0] || '-',
    'อาการปัจจุบัน': latestCheckup?.symptoms || '-',
    'ผลการตรวจ': latestCheckup?.initialresult || '-',
    'โรคที่พบ': latestCheckup?.disease || '-',
    //วัดร่างกายล่าสุด
    'ค่าความดันสูง (Diastolic)': latestCheckup?.diastolic || '-',
    'ค่าความดันต่ำ (systolic)': latestCheckup?.systolic || '-',
    'สถานะแบตเตอรี่': latestPatient?.BatteryPercent || '-',
    'สถานะสัญญาณชีพ': latestPatient?.heart_rate || '-',
    'สถานะอุณหภูมิ': latestPatient?.temperature || '-',
    'สถานะท่าทาง': postureMap[latestPatient?.posture]?.label || '-',
    //ข้อมูลการตรวจล่าสุด
    'น้ำหนัก (kg)': latestPatient?.weight || '-',
    'ส่วนสูง (cm)': latestPatient?.height || '-',
    'หมอ': latestPatient.doctorpat || latestPatient.doctor || '-', // เผื่อ doctor มาจาก checkup
    'โรคประจำตัว': latestPatient.disease || '-',
    'แพ้ยา': latestPatient.allergy || '-',
    'ประวัติการรักษา': latestPatient.treatmenthistory || '-',
    'ประวัติการผ่าตัด': latestPatient.surgeryhistory || '-',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, `ข้อมูลคนไข้_${latestPatient.hn}.xlsx`);
  };

  const exportAllCheckupsToExcel = () => {
    if (!latestPatient || allCheckups.length === 0) return;

    const dataToExport = allCheckups.map((checkup) => ({
      // ข้อมูลทั่วไป
      'วันที่เข้ารักษาครั้งแรก': latestPatient.datepat?.split('T')[0],
      'เลขเครื่องที่ติด': latestPatient.emi,
      'เลขประจำตัวผู้ป่วย': latestPatient.hn,
      //ข้อมูลส่วนตัว
      'ชื่อ': latestPatient.namepat,
      'นามสกุล': latestPatient.surnamepat,
      'เพศ': latestPatient.gender,
      'วันเกิด': latestPatient.born?.split('T')[0],
      'ที่อยู่': latestPatient.address,
      //อาการรักษา
      'วันที่ตรวจ': checkup.datepresent?.split('T')[0] || '-',
      'อาการปัจจุบัน': checkup.symptoms || '-',
      'ผลการตรวจ': checkup.initialresult || '-',
      'โรคที่พบ': checkup.disease || '-',
      //วัดร่างกายล่าสุด
      'ค่าความดันสูง (Diastolic)': latestCheckup?.diastolic || '-',
      'ค่าความดันต่ำ (systolic)': latestCheckup?.systolic || '-',
      'สถานะแบตเตอรี่': latestPatient?.BatteryPercent || '-',
      'สถานะสัญญาณชีพ': latestPatient?.heart_rate || '-',
      'สถานะอุณหภูมิ': latestPatient?.temperature || '-',
      'สถานะท่าทาง': postureMap[latestPatient?.posture]?.label || '-',
      //ข้อมูลการตรวจล่าสุด
      'น้ำหนัก (kg)': latestPatient.weight || '-',
      'ส่วนสูง (cm)': latestPatient.height || '-',
      'หมอ': latestPatient.doctorpat || latestPatient.doctor || '-', // เผื่อ doctor มาจาก checkup
      'โรคประจำตัว': latestPatient.disease || '-',
      'แพ้ยา': latestPatient.allergy || '-',
      'ประวัติการรักษา': latestPatient.treatmenthistory || '-',
      'ประวัติการผ่าตัด': latestPatient.surgeryhistory || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Checkups');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, `ประวัติการตรวจ_${latestPatient.hn}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <LuUserCheck className="text-5xl" />
                  รายละเอียดข้อมูลผู้ป่วย
                </h1>
                {latestPatient && (
                  <p className="text-blue-100 text-xl">
                    HN: {latestPatient.hn} | {latestPatient.namepat} {latestPatient.surnamepat}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <LuDownload className="text-xl" />
                  ดาวน์โหลดประวัติล่าสุด
                </button>
                <button
                  onClick={exportAllCheckupsToExcel}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                >
                  <LuDownload className="text-xl" />
                  ดาวน์โหลดประวัติทั้งหมด
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {latestPatient ? (
              <div className="space-y-8">
                {/* Patient Information Cards */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <Section title="ข้อมูลทั่วไป" icon={<LuUser className="text-2xl" />}>
                    <InfoGrid>
                      <Info label="วันที่เข้ารักษาครั้งแรก" value={latestPatient.datepat?.split('T')[0]} />
                      <Info label="วันที่เข้ารักษา (ปัจจุบัน)" value={latestCheckup?.datepresent?.split('T')[0] || '-'} />
                      <Info label="เลขเครื่องที่ติด" value={latestPatient.emi} />
                      <Info label="เลขประจำตัวผู้ป่วย" value={latestPatient.hn} />
                      <Info label="อายุ" value={latestPatient.age || '-'} />
                      <Info label="น้ำหนัก (kg)" value={latestPatient.weight || '-'} />
                      <Info label="ส่วนสูง (cm)" value={latestPatient.height || '-'} />
                    </InfoGrid>
                  </Section>

                  <Section title="ข้อมูลส่วนตัว" icon={<LuUser className="text-2xl" />}>
                    <InfoGrid>
                      <Info label="ชื่อ" value={latestPatient.namepat} />
                      <Info label="นามสกุล" value={latestPatient.surnamepat} />
                      <Info label="เพศ" value={latestPatient.gender} />
                      <Info label="วันเกิด" value={latestPatient.born?.split('T')[0]} />
                      <Info label="ที่อยู่" value={latestPatient.address}   />
                    </InfoGrid>
                  </Section>
                </div>

                {/* Emergency Contacts Section */}
                <Section title="ข้อมูลการติดต่อญาติ" icon={<LuUsers className="text-2xl" />}>
                  {emergencyContacts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {emergencyContacts.map((contact, index) => (
                        <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-500 text-white p-3 rounded-full">
                              <LuUsers className="text-xl" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-green-800 text-lg">
                                ผู้ติดต่อฉุกเฉิน {index + 1}
                              </h3>
                              <p className="text-green-600 text-sm">{contact.relation}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <LuUser className="text-green-600" />
                              <span className="text-gray-700 font-medium">
                                {contact.prefix}{contact.nameemergency} {contact.surnameemergency}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <LuPhone className="text-green-600" />
                              <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                {contact.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <LuUsers className="mx-auto text-6xl mb-4 text-gray-300" />
                      <p className="text-lg">ไม่มีข้อมูลการติดต่อญาติ</p>
                    </div>
                  )}
                </Section>

                {/* Medical Information */}
                <Section title="อาการรักษา" icon={<LuHeart className="text-2xl" />}>
                  <InfoGrid>
                    <Info label="อาการ" value={latestPatient.symptomspat || latestPatient.symptoms || '-'} />
                    <Info label="หมอที่ดูแล" value={latestPatient.doctorpat || '-'} />
                    <Info label="โรคประจำตัว" value={latestPatient.disease || '-'} />
                    <Info label="แพ้ยา" value={latestPatient.allergy || '-'} />
                    <Info label="ประวัติการรักษา" value={latestPatient.treatmenthistory || '-'} />
                    <Info label="ประวัติการผ่าตัด" value={latestPatient.surgeryhistory || '-'} />
                  </InfoGrid>
                </Section>

                {/* Vital Signs */}
                <Section title="การวัดร่างกายล่าสุด" icon={<LuHeart className="text-2xl text-red-500" />}>
                  {latestSensor ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <VitalCard label="อัตราการเต้นหัวใจ" value={latestSensor.heart_rate} unit="bpm" color="red" />
                      <VitalCard label="ความดันซิสโตลิก" value={latestCheckup?.systolic} unit="mmHg" color="blue" />
                      <VitalCard label="ความดันไดแอสโตลิก" value={latestCheckup?.diastolic} unit="mmHg" color="blue" />
                      <VitalCard label="อุณหภูมิ" value={latestSensor.temperature} unit="°C" color="orange" />
                      <VitalCard label="ท่าทาง" value={postureMap[latestSensor.posture]?.label} unit="" color="green" />
                      <VitalCard label="สถานะแบตเตอรี่" value={latestSensor.BatteryPercent} unit=" " color="purple" />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <LuHeart className="mx-auto text-6xl mb-4 text-gray-300" />
                      <p className="text-lg">ไม่มีข้อมูลการวัดร่างกายล่าสุด</p>
                    </div>
                  )}
                </Section>

                {/* Latest Checkup */}
                <Section title="ข้อมูลการตรวจล่าสุด" icon={<LuCalendar className="text-2xl" />}>
                  {latestCheckup ? (
                    <InfoGrid>
                      <Info label="วันที่ตรวจ" value={latestCheckup.datepresent?.split('T')[0] || '-'} />
                      <Info label="น้ำหนัก (kg)" value={latestPatient.weight || '-'} />
                      <Info label="ส่วนสูง (cm)" value={latestPatient.height || '-'} />
                      <Info label="อาการปัจจุบัน" value={latestCheckup.symptoms || '-'} />
                      <Info label="โรคที่พบ" value={latestCheckup.disease || '-'} />
                      <Info label="ผลการตรวจ" value={latestCheckup.initialresult || '-'} />
                    </InfoGrid>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <LuCalendar className="mx-auto text-6xl mb-4 text-gray-300" />
                      <p className="text-lg">ไม่มีข้อมูลการตรวจล่าสุด</p>
                    </div>
                  )}
                </Section>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <LuUser className="mx-auto text-8xl mb-6 text-gray-300" />
                <p className="text-2xl">ไม่พบข้อมูลคนไข้</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// VitalCard Component สำหรับแสดงข้อมูลสัญญาณชีพ
const VitalCard = ({ label, value, unit, color }) => {
  const colorClasses = {
    red: 'from-red-50 to-red-100 border-red-200 text-red-800',
    blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
    green: 'from-green-50 to-green-100 border-green-200 text-green-800',
    orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-800',
    purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-800',
  };

  const iconClasses = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    orange: 'bg-orange-500 text-white',
    purple: 'bg-purple-500 text-white',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl border-2 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`${iconClasses[color]} p-2 rounded-full`}>
          <LuHeart className="text-lg" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{value || '-'}</p>
          {unit && <p className="text-sm opacity-70">{unit}</p>}
        </div>
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
        {icon}
        {title}
      </h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
    <strong className="text-gray-700 text-sm">{label}</strong>
    <p className="text-right text-gray-900 font-medium">{value}</p>
  </div>
);

export default Showdata;
