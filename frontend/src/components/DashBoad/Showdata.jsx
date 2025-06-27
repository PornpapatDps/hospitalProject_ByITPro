import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LuDownload } from 'react-icons/lu';
import axios from 'axios';

const Showdata = () => {
  const { hn } = useParams();
  const [patients, setPatients] = useState([]);
  const [latestCheckup, setLatestCheckup] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [allCheckups, setAllCheckups] = useState([]);

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
      } catch (err) {
        console.error('Error fetching patient data:', err);
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
      } catch (err) {
        console.error('Error fetching checkups:', err);
        setLatestCheckup(null);
      }
    };
    // ฟังก์ชันดึงข้อมูลเซ็นเซอร์ล่าสุด
    const fetchSensorslates = async () => {
      try {
        const res = await axios.get('http://localhost:4000/hospital/sensor/latest');
        setSensorData(res.data.sensor || null);
      } catch (err) {
        console.error('Error fetching sensor data:', err);
        setSensorData(null);
      }
    };

    // ดึงข้อมูลเซ็นเซอร์ทั้งหมด
    const fetchSensors = async () => {
      try {
        const res = await axios.get('http://localhost:4000/hospital/sensor/');
        setSensorData(res.data.sensor || null);
      } catch (err) {
        console.error('Error fetching sensor data:', err);
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
    } catch (err) {
      console.error('Error fetching checkups:', err);
      setAllCheckups([]);
      setLatestCheckup(null);
    }
  };

    fetchPatients();
    fetchLatestCheckup();
    fetchSensorslates();
    fetchSensors();
    fetchCheckup();

    const sensorlatesInterval = setInterval(fetchSensorslates, 1000 * 60 *  2); // ทุก 2 ชม.
    const sensorsInterval = setInterval(fetchSensors, 1000 * 60 * 2); // ทุก 2 ชม.
    const checkupInterval = setInterval(fetchLatestCheckup, 1000 * 60); // ทุก 1 นาที
    const checkupAllInterval = setInterval(fetchCheckup, 1000 * 60); // ทุก 1 นาที

    return () => {
      clearInterval(sensorlatesInterval);
      clearInterval(checkupInterval);
      clearInterval(sensorsInterval);
      clearInterval(checkupAllInterval);
    };
  }, [hn]);

  const latestPatient = patients.find((p) => p.hn === hn);
  const latestSensor = sensorData?.length > 0 ? sensorData[sensorData.length - 1] : sensorData;

  // ดึงข้อมูลการตรวจล่าสุด
  const exportToExcel = () => {
    if (!latestPatient) return;
    const dataToExport = [
      {
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
    'วันที่ตรวจ': latestCheckup.datepresent?.split('T')[0] || '-',
    'อาการปัจจุบัน': latestCheckup.symptoms || '-',
    'ผลการตรวจ': latestCheckup.initialresult || '-',
    'โรคที่พบ': latestCheckup.disease || '-',
    //วัดร่างกายล่าสุด
    'ค่าความดันสูง (Diastolic)': latestSensor?.diastolic || '-',
    'ค่าความดันต่ำ (systolic)': latestSensor?.systolic || '-',
    'HR': latestSensor?.heart_rate || '-',
    'Temperature': latestSensor?.temperature || '-',
    'Posture': postureMap[latestSensor?.posture]?.label || '-',
    //ข้อมูลการตรวจล่าสุด
    'น้ำหนัก (kg)': latestCheckup.weight || '-',
    'ส่วนสูง (cm)': latestCheckup.height || '-',
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
      'ค่าความดันสูง (Diastolic)': latestSensor?.diastolic || '-',
      'ค่าความดันต่ำ (systolic)': latestSensor?.systolic || '-',
      'HR': latestSensor?.heart_rate || '-',
      'Temperature': latestSensor?.temperature || '-',
      'Posture': postureMap[latestSensor?.posture]?.label || '-',
      //ข้อมูลการตรวจล่าสุด
      'น้ำหนัก (kg)': checkup.weight || '-',
      'ส่วนสูง (cm)': checkup.height || '-',
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
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          รายละเอียดข้อมูลผู้ป่วย
        </h1>

        <div className="flex justify-end md:flex-row mb-6 gap-4 col flex-col lg:flex-row ">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg shadow-sm hover:bg-blue-200 transition"
          >
            <LuDownload className="text-xl" />
            ดาวน์โหลดประวัติล่าสุด Excel
          </button>

          <button
            onClick={exportAllCheckupsToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg shadow-sm hover:bg-green-200 transition"
          >
            <LuDownload className="text-xl" />
            ดาวน์โหลดประวัติทั้งหมด Excel
          </button>
        </div>

        {(latestPatient ) ? (
          <div className="flex flex-col gap-2 text-gray-700 text-lg">
            <Section title="ข้อมูลทั่วไป">
              <InfoGrid>
                <Info label="วันที่เข้ารักษาครั้งแรก" value={latestPatient.datepat?.split('T')[0]} />
                <Info label="วันที่เข้ารักษา (ปัจจุบัน)" value={latestCheckup?.datepresent?.split('T')[0] || '-'} />
                <Info label="เลขเครื่องที่ติด" value={latestPatient.emi} />
                <Info label="เลขประจำตัวผู้ป่วย" value={latestPatient.hn} />
              </InfoGrid>
            </Section>

            <Section title="ข้อมูลส่วนตัว">
              <InfoGrid>
                <Info label="ชื่อ" value={latestPatient.namepat} />
                <Info label="นามสกุล" value={latestPatient.surnamepat} />
                <Info label="เพศ" value={latestPatient.gender} />
                <Info label="วันเกิด" value={latestPatient.born?.split('T')[0]} />
                <Info label="ที่อยู่" value={latestPatient.address} />
              </InfoGrid>
            </Section>

            <Section title="อาการรักษา">
              <InfoGrid>
                <Info label="อาการ" value={latestPatient.symptomspat || latestPatient.symptoms || '-'} />
                <Info label="หมอที่ดูแล" value={latestPatient.doctorpat || '-'} />
                <Info label="โรคประจำตัว" value={latestPatient.disease || '-'} />
                <Info label="แพ้ยา" value={latestPatient.allergy || '-'} />
                <Info label="ประวัติการรักษา" value={latestPatient.treatmenthistory || '-'} />
                <Info label="ประวัติการผ่าตัด" value={latestPatient.surgeryhistory || '-'} />
              </InfoGrid>
            </Section>

            <Section title="การวัดร่างกายล่าสุด">
              {latestSensor ? (
                <InfoGrid>
                  <Info label="อัตราการเต้นหัวใจ (HR)" value={latestSensor.heart_rate || '-'} />
                  <Info label="สถานะความดัน (bp_status)" value={latestSensor.bp_status || '-'} />
                  <Info label="ค่าความดันสูง (Diastolic)" value={latestSensor.diastolic || '-'} />
                  <Info label="ค่าความดันต่ำ (systolic)" value={latestSensor.systolic || '-'} />
                  <Info label="ท่าทาง (Posture)" value={postureMap[latestSensor.posture]?.label || '-'} />
                  <Info label="อุณหภูมิ (Temperature)" value={latestSensor.temperature || '-'} />
                </InfoGrid>
              ) : (
                <p className="text-gray-500 text-center">ไม่มีข้อมูลการวัดร่างกายล่าสุด</p>
              )}
            </Section>
            <Section title="ข้อมูลการตรวจล่าสุด">
              {latestCheckup ? (
                <InfoGrid>
                  <Info label="วันที่ตรวจ" value={latestCheckup.datepresent?.split('T')[0] || '-'} />
                  <Info label="น้ำหนัก (kg)" value={latestCheckup.weight || '-'} />
                  <Info label="ส่วนสูง (cm)" value={latestCheckup.height || '-'} />
                  <Info label="อาการปัจจุบัน" value={latestCheckup.symptoms || '-'} />
                  <Info label="โรคที่พบ" value={latestCheckup.disease || '-'} />
                  <Info label="ผลการตรวจ" value={latestCheckup.initialresult || '-'} />
                </InfoGrid>
              ) : (
                <p className="text-gray-500 text-center">ไม่มีข้อมูลการตรวจล่าสุด</p>
              )}
            </Section>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">ไม่พบข้อมูลคนไข้</p>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="gap-4 mb-12">
    <h2 className="text-xl font-semibold text-blue-500 mb-4 border-b border-gray-300 pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const InfoGrid = ({ children }) => (
  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 p-6 rounded-md border border-gray-200">
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between">
    <strong className="text-gray-600">{label}</strong>
    <p className="text-right text-gray-800 font-medium">{value}</p>
  </div>
);

export default Showdata;
