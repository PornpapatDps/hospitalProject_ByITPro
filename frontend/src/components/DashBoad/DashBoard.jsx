import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileDownload } from "react-icons/fa";
import BloodPressureChart from '../Chart/BloodPressureChart';
import Temp from '../Chart/Temp';
import HR from '../Chart/HR';

const DashBoard = () => {
  const { hn } = useParams();

  const [data, setData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  const postureMap = {
    0: { label: 'อยู่นิ่ง', color: '#81c784' },
    1: { label: 'นั่ง', color: '#64b5f6' },
    2: { label: 'นอน', color: '#ffb74d' },
    3: { label: 'ยืน', color: '#e57373' },
    4: { label: 'เดิน', color: '#ba68c8' },
  };

  // ดึงข้อมูล sensor
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/hospital/sensor/');
      const sensor = response.data.sensor || [];
      setData(sensor);

      if (sensor.length > 0) {
        const timestamps = sensor
          .map((item) => DateTime.fromISO(item.timestamp))
          .filter((t) => t.isValid);

        const min = timestamps.reduce((a, b) => (a < b ? a : b));
        const max = timestamps.reduce((a, b) => (a > b ? a : b));

        setMinDate(min.toFormat("yyyy-MM-dd'T'HH:mm"));
        setMaxDate(max.toFormat("yyyy-MM-dd'T'HH:mm"));

      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // ดึงข้อมูลคนไข้จาก HN
  const fetchDataByHN = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/hospital/register/${hn}`);
      setPatients(response.data.data);
    } catch (error) {
      console.error('Error fetching data by HN:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataByHN();

    const interval = setInterval(() => {
      fetchData();
      fetchDataByHN();
    }, 1000 * 60 * 60 * 2); 

    return () => clearInterval(interval);
  }, [hn]);

  // กรองข้อมูล 24 ชั่วโมงล่าสุด
  const now = DateTime.now();
  const cutoff = now.minus({ hours: 24 });

  const filteredData = data
    .filter(d => {
      const time = DateTime.fromISO(d.timestamp);
      return time.isValid && time >= cutoff && time <= now;
    })
    .slice(-10);

  // export ข้อมูลทั้งหมด
  const exportAllSensorDataToExcel = () => {
    if (!data || data.length === 0) {
      alert('ไม่พบข้อมูลสำหรับ export');
      return;
    }

    const exportData = data.map((item, index) => ({
      ลำดับ: index + 1,
      เวลา: DateTime.fromISO(item.timestamp).toFormat('dd-MM-yyyy HH:mm'),
      'ความดันสูง (Diastolic)': item.diastolic || '-',
      'ความดันต่ำ (Systolic)': item.systolic || '-',
      'อัตราการเต้นหัวใจ (HR)': item.heart_rate || '-',
      'อุณหภูมิร่างกาย (°C)': item.temperature || '-',
      'ท่าทาง': postureMap[item.posture]?.label || 'ไม่ทราบ',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Sensor Data');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const dateStr = DateTime.now().toFormat('yyyy-MM-dd');
    saveAs(fileData, `ข้อมูลทั้งหมด_${hn}_${dateStr}.xlsx`);
  };

  // export ตามช่วงเวลา
  const exportFilteredSensorDataToExcel = () => {
    if (!data || data.length === 0 || !startDate || !endDate) return;

    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);

    const exportData = data
      .filter((item) => {
        const time = DateTime.fromISO(item.timestamp);
        return time >= start && time <= end;
      })
      .map((item, index) => ({
        ลำดับ: index + 1,
        เวลา: DateTime.fromISO(item.timestamp).toFormat('dd-MM-yyyy HH:mm'),
        'ความดันสูง (Diastolic)': item.diastolic || '-',
        'ความดันต่ำ (Systolic)': item.systolic || '-',
        'อัตราการเต้นหัวใจ (HR)': item.heart_rate || '-',
        'อุณหภูมิร่างกาย (°C)': item.temperature || '-',
        'ท่าทาง': postureMap[item.posture]?.label || 'ไม่ทราบ',
      }));

    if (exportData.length === 0) {
      alert('ไม่พบข้อมูลในช่วงวันที่ที่เลือก');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sensor Range');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(fileData, `ข้อมูลช่วง_${start.toFormat('ddLLyy_HHmm')}_${end.toFormat('ddLLyy_HHmm')}.xlsx`);
  };

    const [popupFitter, setPopupFitter] = useState(false);
    const [filterStart, setFilterStart] = useState('');
    
    const [filteredTenData, setFilteredTenData] = useState([]);
    const dataToDisplay = filteredTenData.length > 0 ? filteredTenData : filteredData;

  const handleFitter = () => {
    if (!filterStart) {
      alert("กรุณาเลือกวันที่เริ่มต้น");
      return;
    }

    const start = DateTime.fromISO(filterStart);
    const end = DateTime.now();

    const filtered = data
      .filter((item) => {
        const time = DateTime.fromISO(item.timestamp);
        return time >= start && time <= end;
      })
      .sort((a, b) => DateTime.fromISO(b.timestamp) - DateTime.fromISO(a.timestamp))
      .slice(0, 10);

    setFilteredTenData(filtered);
    setPopupFitter(false);
  };


  return (
    <div className="w-screen bg-[#F9FAFB] text-gray-800 px-6 py-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10 gap-3">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-blue-700 flex items-center gap-2">
          Dashboard
        </h1>
        {/* Patient Code */}
        <p className="text-lg font-medium text-gray-700">
          รหัสผู้ป่วย: <span className="text-blue-600 font-semibold underline underline-offset-4">{hn}</span>
        </p>

        {/* Date range + Download button */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          {minDate && maxDate && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-2 rounded-full shadow-sm border border-blue-200 text-sm">
              <span>📅</span>
              <span>
                ช่วงข้อมูล: {DateTime.fromISO(minDate).toFormat('dd-MM-yyyy HH:mm')} - {DateTime.fromISO(maxDate).toFormat('dd-MM-yyyy HH:mm')}
              </span>
            </div>
          )}
          <button
            onClick={() => setShowPopup(true)}
            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white 
            font-semibold rounded-full shadow-md flex items-center gap-2 cursor-pointer">
            <FaFileDownload className="text-lg" />
          </button>
        </div>
        {/*  */}
          {/* <button
            onClick={() => setPopupFitter(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md flex items-center gap-2"
          >
            <span>กรองข้อมูลจากวันที่เริ่มต้น</span>
          </button> */}

      </div>

      {/* Charts Row 1: BP & HR */}
        <div className="flex flex-wrap justify-between gap-6 mb-8 w-screen">
          {/* Blood Pressure Chart */}
          <div className="bg-white rounded-xl shadow-md border p-6 flex-1 min-w-[320px] max-w-[40%] h-[40rem]">
            <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">ความดันโลหิต (BP)</h2>
            <BloodPressureChart sensorData={dataToDisplay } />
          </div>

          {/* Heart Rate Chart */}
          <div className="bg-white rounded-xl shadow-md border p-6 flex-1 min-w-[320px] max-w-[58%] h-[40rem]">
            <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">อัตราการเต้นหัวใจ (HR)</h2>
            <HR sensorData={dataToDisplay } />
          </div>
        </div>

        {/* Charts Row 2: Posture Table & Temperature */}
        <div className="flex flex-wrap justify-between gap-6 w-full">
          {/* Posture Table */}
          <div className="bg-white rounded-xl shadow-md border p-6 flex-1 min-w-[320px] max-w-[58%] h-[40rem]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-600">ท่าทาง (Posture)</h2>
              <span className="font-medium text-gray-500">📊 {dataToDisplay .length} records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-gray-700">
                <thead>
                  <tr className="text-sm bg-gray-100 border-b">
                    <th className="text-left py-2 px-2">เวลา</th>
                    <th className="text-left py-2 px-2">ท่าทาง</th>
                    <th className="text-left py-2 px-2">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {dataToDisplay .map((item, i) => {
                    const posture = postureMap[item.posture];
                    return (
                      <tr key={i} className="border-b hover:bg-gray-100">
                        <td className="py-2 px-2">{DateTime.fromISO(item.timestamp).toFormat('HH:mm')}</td>
                        <td className="py-2 px-2 font-semibold">{posture?.label || 'ไม่ทราบ'}</td>
                        <td className="py-2 px-2">
                          <div className="w-full bg-gray-300 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{ width: '100%', backgroundColor: posture?.color || '#ccc' }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Temperature Chart */}
          <div className="bg-white rounded-xl shadow-md border p-6 flex-1 min-w-[320px] max-w-[40%] h-[40rem]">
            <h2 className="text-2xl font-semibold text-center mb-4 text-blue-600">อุณหภูมิ (Temperature)</h2>
            <Temp sensorData={dataToDisplay } />
          </div>
        </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-bold text-blue-700 mb-4">เลือกรูปแบบการดาวน์โหลด</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  exportAllSensorDataToExcel();
                  setShowPopup(false);
                }}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded cursor-pointer"
              >
                ดาวน์โหลดทั้งหมด
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-700">วันที่เริ่มต้น</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="border px-2 py-1 rounded-md w-full cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">วันที่สิ้นสุด</label>
                <input
  type="datetime-local"
  value={filterStart}
  onChange={(e) => setFilterStart(e.target.value)}
  min={minDate}
  max={DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm")}
  className="border px-2 py-1 rounded-md w-full cursor-pointer"
/>

              </div>

              <button
                onClick={() => {
                  exportFilteredSensorDataToExcel();
                  setShowPopup(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
              >
                ดาวน์โหลดช่วงเวลา
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-600 mt-2 hover:underline cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup-Fitter */}
     {popupFitter && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-bold text-blue-700 mb-4">กรองข้อมูลจากวันที่เริ่มต้น</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">วันที่เริ่มต้น</label>
                <input
                  type="datetime-local"
                  value={filterStart}
                  onChange={(e) => setFilterStart(e.target.value)}
                  min={minDate}
                  max={DateTime.now().toISO().slice(0, 16)}
                  className="border px-2 py-1 rounded-md w-full cursor-pointer"
                />
              </div>

              <button
                onClick={handleFitter}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
              >
                กรองข้อมูล
              </button>

              <button
                onClick={() => setPopupFitter(false)}
                className="text-gray-600 mt-2 hover:underline cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashBoard;