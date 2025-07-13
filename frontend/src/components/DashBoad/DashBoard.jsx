import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FaFileDownload, FaStethoscope, FaHeartbeat, FaThermometerHalf, FaUserMd, FaChartLine, FaExclamationTriangle, FaCheck, FaSpinner } from "react-icons/fa";
import { BiPulse } from "react-icons/bi";
import { MdMonitorHeart } from "react-icons/md";
import BatteryPercent from '../Chart/BatteryPercent';
import Temp from '../Chart/Temp';
import HR from '../Chart/HR';

const DashBoard = () => {
  const { hn } = useParams();

  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [_isLoading, setIsLoading] = useState(true);
  const [icdAnalysis, _setIcdAnalysis] = useState(null);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [vitalsLoading, setVitalsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [_dataFetching, setDataFetching] = useState(false);

  // Enhanced Chart Loading Component
  const ChartLoadingSpinner = ({ title, icon, color, bgColor }) => (
    <div className={`flex flex-col items-center justify-center h-full ${bgColor} rounded-xl p-8 border-2 border-dashed border-gray-300`}>
      <div className="relative mb-6">
        <div className={`w-20 h-20 ${color} rounded-full flex items-center justify-center animate-pulse shadow-lg`}>
          <span className="text-3xl">{icon}</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-spin">
          <FaSpinner className="text-white text-sm" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">กำลังโหลดและประมวลผลข้อมูล...</p>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );

  // Enhanced Vital Signs Loading Component with Professional Styling
  const VitalSignLoader = ({ icon, title, color }) => (
    <div className={`group bg-gradient-to-br ${color} via-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-500 animate-pulse shadow-2xl`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer transform skew-x-12"></div>
          <span className="text-2xl opacity-70 animate-pulse relative z-10">{icon}</span>
        </div>
        <div className="text-right space-y-2">
          <div className="w-20 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse shadow-inner"></div>
          <div className="w-12 h-4 bg-gradient-to-r from-gray-150 to-gray-250 rounded animate-pulse ml-auto"></div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-700">{title}</h3>
          <div className="w-20 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse shadow-inner"></div>
        </div>
        
        <div className="bg-white bg-opacity-80 rounded-lg p-3 shadow-inner space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-24 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div className="h-3 bg-gradient-to-r from-blue-300 via-purple-300 to-cyan-300 rounded-full animate-pulse transform transition-all duration-2000" style={{ width: '75%' }}></div>
          </div>
        </div>
        
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-3 text-gray-600 text-sm font-medium">
            <FaSpinner className="animate-spin text-blue-500 text-lg" />
            <span>Loading {title} data...</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Table Loading Component
  const TableLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-2xl text-white">📋</span>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-spin">
          <FaSpinner className="text-white text-xs" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Loading Medical Records</h3>
        <p className="text-sm text-gray-600 mb-4">กำลังโหลดประวัติการรักษา...</p>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2 h-8 bg-blue-300 rounded animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
          ))}
        </div>
      </div>
    </div>
  );

  // Critical Alert Banner Component
  const CriticalAlertBanner = ({ alerts }) => {
    if (!alerts || alerts.length === 0) return null;
    
    return (
      <div className="container mx-auto px-6 py-4">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-6 shadow-2xl border-l-8 border-red-800">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
                <FaExclamationTriangle className="text-2xl text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold">🚨 CRITICAL MEDICAL ALERT</h3>
                <span className="px-3 py-1 bg-red-800 rounded-full text-xs font-bold">URGENT</span>
              </div>
              <div className="space-y-2">
                {alerts.map((alert, index) => (
                  <div key={index} className="bg-white bg-opacity-10 rounded-lg p-3">
                    <div className="font-semibold">{alert.diagnosis} ({alert.code})</div>
                    <div className="text-sm opacity-90">{alert.thai}</div>
                    <div className="text-xs mt-1 opacity-75">Confidence: {alert.confidence}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const postureMap = {
    0: { label: 'อยู่นิ่ง', color: '#81c784' },
    1: { label: 'นั่ง', color: '#64b5f6' },
    2: { label: 'นอน', color: '#ffb74d' },
    3: { label: 'ยืน', color: '#e57373' },
    4: { label: 'เดิน', color: '#ba68c8' },
  };

  // Enhanced Data Fetching with Loading States
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setDataFetching(true);
      setVitalsLoading(true);
      setChartsLoading(true);
      setTableLoading(true);

      const response = await axios.get('http://localhost:4000/hospital/sensor/');
      const sensor = response.data.sensor || [];
      setData(sensor);

      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Perform ICD-10 Analysis
      if (sensor.length > 0) {
        
        const timestamps = sensor
          .map((item) => DateTime.fromISO(item.timestamp))
          .filter((t) => t.isValid);

        if (timestamps.length > 0) {
          const min = timestamps.reduce((a, b) => (a < b ? a : b));
          const max = timestamps.reduce((a, b) => (a > b ? a : b));

          setMinDate(min.toFormat("yyyy-MM-dd'T'HH:mm"));
          setMaxDate(max.toFormat("yyyy-MM-dd'T'HH:mm"));
        }
      }

      // Enhanced loading with staggered completion for professional UX
      setVitalsLoading(true);
      setChartsLoading(true);
      setTableLoading(true);
      
      // Staggered loading completion for smooth professional experience
      setTimeout(() => setVitalsLoading(false), 1000 * 60);   // Vitals load first (critical data)
      setTimeout(() => setChartsLoading(false), 1000 * 60);   // Charts load next (visualization)  
      setTimeout(() => setTableLoading(false), 1000 * 60);    // Table loads last (detailed data)

    } catch (error) {
      console.error('Error fetching medical data:', error);
      setCriticalAlerts([]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setDataFetching(false);
      }, 1000 * 60); // 1 minute
    }
  };

  // ดึงข้อมูลคนไข้จาก HN
  const fetchDataByHN = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/hospital/register/${hn}`);
      // ข้อมูลคนไข้สำหรับใช้งานอื่นๆ ในอนาคต
      console.log('Patient data:', response.data.data);
    } catch (error) {
      console.error('Error fetching data by HN:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataByHN();

    // Enhanced real-time monitoring with medical analysis
    const interval = setInterval(() => {
      fetchData();
      fetchDataByHN();
    }, 1000 * 30); // Update every 30 seconds for better medical monitoring

    return () => clearInterval(interval);
  }, [hn]); // eslint-disable-line react-hooks/exhaustive-deps

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
  const [filterEnd, setFilterEnd] = useState('');
  
  const [filteredTenData, setFilteredTenData] = useState([]);
  const dataToDisplay = filteredTenData.length > 0 ? filteredTenData : filteredData;

  // Filter Management Functions
  const handleFitter = () => {
    if (!filterStart) {
      alert("กรุณาเลือกวันที่เริ่มต้น");
      return;
    }

    const start = DateTime.fromISO(filterStart);
    const end = filterEnd ? DateTime.fromISO(filterEnd) : DateTime.now();

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

  const resetFilter = () => {
    setFilteredTenData([]);
    setFilterStart('');
    setFilterEnd('');
  };

  // ระบบวิเคราะห์ความเสี่ยงทางการแพทย์
  const analyzeHealthRisk = (data) => {
    if (!data || data.length === 0) return { level: 'unknown', risks: [], recommendations: [] };

    const latest = data[data.length - 1];
    const risks = [];
    const recommendations = [];
    let riskLevel = 'normal';

    // วิเคราะห์อัตราการเต้นหัวใจ
    if (latest.heart_rate) {
      if (latest.heart_rate > 120) {
        risks.push('อัตราการเต้นหัวใจสูงมาก (Tachycardia)');
        recommendations.push('ควรตรวจสอบภาวะผิดปกติของหัวใจ');
        riskLevel = 'high';
      } else if (latest.heart_rate > 100) {
        risks.push('อัตราการเต้นหัวใจสูงเล็กน้อย');
        recommendations.push('ติดตามอาการและหลีกเลี่ยงกิจกรรมหนัก');
        if (riskLevel === 'normal') riskLevel = 'medium';
      } else if (latest.heart_rate < 50) {
        risks.push('อัตราการเต้นหัวใจต่ำมาก (Bradycardia)');
        recommendations.push('ควรตรวจสอบการทำงานของหัวใจ');
        riskLevel = 'high';
      } else if (latest.heart_rate < 60) {
        risks.push('อัตราการเต้นหัวใจต่ำเล็กน้อย');
        recommendations.push('ติดตามอาการ หากมีอาการเวียนหัวให้ปรึกษาแพทย์');
        if (riskLevel === 'normal') riskLevel = 'medium';
      }
    }

    // วิเคราะห์อุณหภูมิ
    if (latest.temperature) {
      if (latest.temperature >= 38.5) {
        risks.push('มีไข้สูง (High Fever)');
        recommendations.push('ให้ยาลดไข้และติดตามอาการอย่างใกล้ชิด');
        riskLevel = 'high';
      } else if (latest.temperature >= 38.0) {
        risks.push('มีไข้ (Fever)');
        recommendations.push('ให้ยาลดไข้และดื่มน้ำให้เพียงพอ');
        if (riskLevel === 'normal') riskLevel = 'medium';
      } else if (latest.temperature < 35.0) {
        risks.push('อุณหภูมิร่างกายต่ำ (Hypothermia)');
        recommendations.push('ให้ความอุ่นและติดตามอาการ');
        riskLevel = 'high';
      }
    }

    // วิเคราะห์ท่าทาง
    const stillCount = data.filter(d => d.posture === 0).length;
    const stillPercentage = (stillCount / data.length) * 100;
    
    if (stillPercentage > 80) {
      risks.push('นอนนิ่งมากเกินไป (Prolonged Immobility)');
      recommendations.push('ควรเปลี่ยนท่าทางและออกกำลังกายเบาๆ');
      if (riskLevel === 'normal') riskLevel = 'medium';
    }

    return { level: riskLevel, risks, recommendations };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Professional Medical Loading Screen */}
      {/* Critical Medical Alerts */}
      <CriticalAlertBanner alerts={criticalAlerts} />

      {/* Professional Medical Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 shadow-2xl border-b-4 border-blue-400">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Enhanced Medical Title Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-6 mb-4">
                <div className="relative">
                  <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm border border-white border-opacity-30">
                    <FaUserMd className="text-4xl text-blue-900" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white text-xs" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">Medical Dashboard</h1>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                      <span className="text-blue-300 text-sm font-bold tracking-wider">HOSPITAL MANAGEMENT SYSTEM</span>
                    </div>
                    {icdAnalysis && (
                      <div className={`px-4 py-2 rounded-full backdrop-blur-sm ${
                        icdAnalysis.riskLevel === 'critical' ? 'bg-red-500 bg-opacity-90' :
                        icdAnalysis.riskLevel === 'moderate' ? 'bg-yellow-500 bg-opacity-90' :
                        'bg-green-500 bg-opacity-90'
                      }`}>
                        <span className="text-white text-xs font-bold">
                          {icdAnalysis.riskLevel === 'critical' ? '🚨 HIGH RISK' :
                           icdAnalysis.riskLevel === 'moderate' ? '⚠️ MODERATE RISK' :
                           '✅ LOW RISK'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-blue-100 text-xl leading-relaxed">
                ระบบติดตามสุขภาพผู้ป่วยแบบเรียลไทม์ | Real-time Patient Monitoring System
              </p>
              <p className="text-blue-200 text-sm mt-2 opacity-80">
                 📊 Professional Healthcare Dashboard
              </p>
            </div>

            {/* Enhanced Professional Patient Information Card */}
            <div className="bg-white bg-opacity-15 backdrop-blur-xl rounded-3xl p-8 text-black min-w-[400px] border border-white border-opacity-30 shadow-2xl">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-white bg-opacity-25 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <FaStethoscope className="text-3xl text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-1">PATIENT ID</p>
                  <p className="text-3xl font-bold">{hn}</p>
                  <p className="text-sm text-blue-200 opacity-80">Hospital Number</p>
                </div>
              </div>
              
              {/* Professional Medical Status Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <FaHeartbeat className="text-red-400 text-lg" />
                    <span className="text-xs font-bold uppercase tracking-wider">VITALS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-300 font-medium">Monitoring</span>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-15 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <MdMonitorHeart className="text-blue-400 text-lg" />
                    <span className="text-xs font-bold uppercase tracking-wider">STATUS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      icdAnalysis?.riskLevel === 'critical' ? 'bg-red-400 animate-pulse' :
                      icdAnalysis?.riskLevel === 'moderate' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`}></div>
                    <span className={`text-sm font-medium ${
                      icdAnalysis?.riskLevel === 'critical' ? 'text-red-300' :
                      icdAnalysis?.riskLevel === 'moderate' ? 'text-yellow-300' :
                      'text-green-300'
                    }`}>
                      {icdAnalysis?.riskLevel === 'critical' ? 'Critical' :
                       icdAnalysis?.riskLevel === 'moderate' ? 'Moderate' :
                       'Stable'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* ICD-10 Analysis Summary */}
              {icdAnalysis && icdAnalysis.diagnoses.length > 0 && (
                <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaChartLine className="text-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">ICD-10 Analysis</span>
                  </div>
                  <div className="text-xs space-y-1">
                    {icdAnalysis.diagnoses.slice(0, 2).map((diagnosis, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-blue-200">{diagnosis.code}</span>
                        <span className="text-orange-300 font-medium">{diagnosis.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Enhanced System Status */}
              <div className="border-t border-white border-opacity-20 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 font-medium">System Online</span>
                    </div>
                  </div>
                  <div className="text-blue-200 font-mono">
                    {DateTime.now().toFormat('dd/MM/yyyy HH:mm')}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 opacity-75">
                  <span>Last Update: {DateTime.now().toFormat('HH:mm:ss')}</span>
                  <span>Data Points: {data.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Medical Vital Signs Dashboard */}
      <div className="container mx-auto px-6 mb-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BiPulse className="text-2xl text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Vital Signs Monitor</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Real-time Medical Monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {icdAnalysis && (
                <div className={`px-4 py-2 rounded-xl font-bold text-sm ${
                  icdAnalysis.riskLevel === 'critical' ? 'bg-red-100 text-red-800 border border-red-300' :
                  icdAnalysis.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                  'bg-green-100 text-green-800 border border-green-300'
                }`}>
                  Risk Level: {icdAnalysis.riskLevel.toUpperCase()}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
                <FaChartLine className="text-blue-600" />
                <span>{dataToDisplay.length} Data Points</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Enhanced Heart Rate Card with Loading */}
            {vitalsLoading ? (
              <VitalSignLoader 
                icon="❤️" 
                title="Heart Rate" 
                color="from-red-50 to-pink-50"
              />
            ) : (
              <div className="group bg-gradient-to-br from-red-50 via-pink-50 to-red-100 rounded-2xl p-6 border-2 border-red-100 hover:border-red-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaHeartbeat className="text-2xl text-white drop-shadow-lg" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-red-700 drop-shadow-sm">
                      {dataToDisplay.length > 0 ? dataToDisplay[dataToDisplay.length - 1].heart_rate || 'N/A' : 'N/A'}
                    </p>
                    <p className="text-sm text-red-600 font-semibold">bpm</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Heart Rate</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      dataToDisplay.length > 0 && dataToDisplay[dataToDisplay.length - 1].heart_rate
                        ? (dataToDisplay[dataToDisplay.length - 1].heart_rate >= 60 && dataToDisplay[dataToDisplay.length - 1].heart_rate <= 100)
                          ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {dataToDisplay.length > 0 && dataToDisplay[dataToDisplay.length - 1].heart_rate
                        ? (dataToDisplay[dataToDisplay.length - 1].heart_rate >= 60 && dataToDisplay[dataToDisplay.length - 1].heart_rate <= 100)
                          ? 'NORMAL' : 'ABNORMAL'
                        : 'NO DATA'
                      }
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 bg-white bg-opacity-80 rounded-lg p-3 shadow-inner">
                    <div className="flex justify-between mb-2">
                      <span>Normal Range:</span>
                      <span className="font-semibold text-green-700">60-100 bpm</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                          dataToDisplay.length > 0 && dataToDisplay[dataToDisplay.length - 1].heart_rate 
                            ? (dataToDisplay[dataToDisplay.length - 1].heart_rate >= 60 && dataToDisplay[dataToDisplay.length - 1].heart_rate <= 100)
                              ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                        style={{ width: '85%' }}
                      />
                    </div>
                  </div>

                  {/* ICD-10 Indicator for Heart Rate */}
                  {icdAnalysis && icdAnalysis.diagnoses.some(d => d.triggeredBy && d.triggeredBy.includes('Heart Rate')) && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-xs text-orange-800">
                        <FaExclamationTriangle className="text-orange-600" />
                        <span className="font-semibold">ICD-10 Alert</span>
                      </div>
                      {icdAnalysis.diagnoses
                        .filter(d => d.triggeredBy && d.triggeredBy.includes('Heart Rate'))
                        .map((diagnosis, index) => (
                          <div key={index} className="text-xs text-orange-700 mt-1">
                            {diagnosis.code}: {diagnosis.confidence}%
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Enhanced Temperature Card with Loading */}
            {vitalsLoading ? (
              <VitalSignLoader 
                icon="🌡️" 
                title="Temperature" 
                color="from-orange-50 to-red-50"
              />
            ) : (
              <div className="group bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-100 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaThermometerHalf className="text-2xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-orange-700">
                    {dataToDisplay.length > 0 ? (dataToDisplay[dataToDisplay.length - 1].temperature || 'N/A') : 'N/A'}
                  </p>
                  <p className="text-sm text-orange-600 font-semibold">°C</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">Temperature</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    dataToDisplay.length > 0 && dataToDisplay[dataToDisplay.length - 1].temperature
                      ? (dataToDisplay[dataToDisplay.length - 1].temperature >= 36.0 && dataToDisplay[dataToDisplay.length - 1].temperature <= 37.2)
                        ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-400 text-white'
                  }`}>
                    {dataToDisplay.length > 0 && dataToDisplay[dataToDisplay.length - 1].temperature
                      ? (dataToDisplay[dataToDisplay.length - 1].temperature >= 36.0 && dataToDisplay[dataToDisplay.length - 1].temperature <= 37.2)
                        ? 'NORMAL' : 'ABNORMAL'
                      : 'NO DATA'
                    }
                  </span>
                </div>
                
                <div className="text-xs text-gray-600 bg-white bg-opacity-60 rounded-lg p-2">
                  <div className="flex justify-between mb-1">
                    <span>Normal Range:</span>
                    <span className="font-semibold">36.0-37.2°C</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        dataToDisplay.length > 0 && dataToDisplay[dataToDisplay.length - 1].temperature 
                          ? (dataToDisplay[dataToDisplay.length - 1].temperature >= 36.0 && dataToDisplay[dataToDisplay.length - 1].temperature <= 37.2)
                            ? 'bg-green-500' : 'bg-red-500'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>

                {/* ICD-10 Indicator for Temperature */}
                {icdAnalysis && icdAnalysis.diagnoses.some(d => d.triggeredBy && d.triggeredBy.includes('Temperature')) && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                    <div className="flex items-center gap-2 text-xs text-orange-800">
                      <FaExclamationTriangle className="text-orange-600" />
                      <span className="font-semibold">ICD-10 Alert</span>
                    </div>
                    {icdAnalysis.diagnoses
                      .filter(d => d.triggeredBy && d.triggeredBy.includes('Temperature'))
                      .map((diagnosis, index) => (
                        <div key={index} className="text-xs text-orange-700 mt-1">
                          {diagnosis.code}: {diagnosis.confidence}%
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Enhanced Activity Card with Loading */}
            {vitalsLoading ? (
              <VitalSignLoader 
                icon="🏃" 
                title="Activity" 
                color="from-blue-50 to-cyan-50"
              />
            ) : (
              <div className="group bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl drop-shadow-lg">🏃</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-700 drop-shadow-sm">
                      {dataToDisplay.length > 0 ? 
                        postureMap[dataToDisplay[dataToDisplay.length - 1].posture]?.label || 'Unknown' : 'N/A'}
                    </p>
                    <p className="text-sm text-blue-600 font-semibold">Activity</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Patient Activity</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      dataToDisplay.length > 0 
                        ? (dataToDisplay[dataToDisplay.length - 1].posture !== 0)
                          ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {dataToDisplay.length > 0 
                        ? (dataToDisplay[dataToDisplay.length - 1].posture !== 0)
                          ? 'ACTIVE' : 'INACTIVE'
                        : 'NO DATA'
                      }
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 bg-white bg-opacity-80 rounded-lg p-3 shadow-inner">
                    <div className="flex justify-between mb-2">
                      <span>Mobility Status:</span>
                      <span className="font-semibold text-green-700">
                        {dataToDisplay.length > 0 
                          ? (dataToDisplay.filter(d => d.posture !== 0).length / dataToDisplay.length * 100).toFixed(0) + '% Active'
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                          dataToDisplay.length > 0 
                            ? (dataToDisplay[dataToDisplay.length - 1].posture !== 0)
                              ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`}
                        style={{ width: dataToDisplay.length > 0 ? `${(dataToDisplay.filter(d => d.posture !== 0).length / dataToDisplay.length * 100)}%` : '0%' }}
                      />
                    </div>
                  </div>

                  {/* ICD-10 Indicator for Activity */}
                  {icdAnalysis && icdAnalysis.diagnoses.some(d => d.triggeredBy && d.triggeredBy.includes('Inactive')) && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                      <div className="flex items-center gap-2 text-xs text-orange-800">
                        <FaExclamationTriangle className="text-orange-600" />
                        <span className="font-semibold">ICD-10 Alert</span>
                      </div>
                      {icdAnalysis.diagnoses
                        .filter(d => d.triggeredBy && d.triggeredBy.includes('Inactive'))
                        .map((diagnosis, index) => (
                          <div key={index} className="text-xs text-orange-700 mt-1">
                            {diagnosis.code}: {diagnosis.confidence}%
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Medical Control Panel */}
      <div className="container mx-auto px-6 mb-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Enhanced System Information Panel */}
            <div className="flex items-center gap-6">
              {minDate && maxDate && (
                <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-6 py-4 rounded-2xl border border-blue-200 shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl text-white">📅</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Data Range</p>
                    <p className="text-sm font-bold text-blue-800">
                      {DateTime.fromISO(minDate).toFormat('dd/MM/yyyy')} - {DateTime.fromISO(maxDate).toFormat('dd/MM/yyyy')}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">{data.length} total records</p>
                  </div>
                </div>
              )}
              
              {filteredTenData.length > 0 && (
                <div className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 px-6 py-4 rounded-2xl border border-green-200 shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl text-white">🔍</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">Filter Status</p>
                    <p className="text-sm font-bold text-green-800">Active Filter</p>
                    <p className="text-xs text-green-600 mt-1">{filteredTenData.length} filtered records</p>
                  </div>
                </div>
              )}

              {/* ICD-10 Analysis Status */}
              {icdAnalysis && (
                <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-md ${
                  icdAnalysis.riskLevel === 'critical' 
                    ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200' 
                    : icdAnalysis.riskLevel === 'moderate'
                      ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200'
                      : 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    icdAnalysis.riskLevel === 'critical' 
                      ? 'bg-gradient-to-br from-red-500 to-red-600' 
                      : icdAnalysis.riskLevel === 'moderate'
                        ? 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                        : 'bg-gradient-to-br from-green-500 to-green-600'
                  }`}>
                    <FaStethoscope className="text-xl text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">ICD-10 Analysis</p>
                    <p className="text-sm font-bold">
                      {icdAnalysis.riskLevel === 'critical' ? 'Critical Risk' :
                       icdAnalysis.riskLevel === 'moderate' ? 'Moderate Risk' : 'Low Risk'}
                    </p>
                    <p className="text-xs mt-1">{icdAnalysis.diagnoses.length} potential diagnoses</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Medical Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPopupFitter(true)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl font-medium transform hover:-translate-y-1"
              >
                <FaChartLine className="text-lg" />
                <span>Filter Data</span>
              </button>
              
              {filteredTenData.length > 0 && (
                <button
                  onClick={resetFilter}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl font-medium transform hover:-translate-y-1"
                >
                  <span className="text-lg">🔄</span>
                  <span>Reset Filter</span>
                </button>
              )}
              
              <button
                onClick={() => setShowPopup(true)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl font-medium transform hover:-translate-y-1"
              >
                <FaFileDownload className="text-lg" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional ICD-10 Medical Analysis Panel */}
      {icdAnalysis && icdAnalysis.diagnoses.length > 0 && (
        <div className="container mx-auto px-6 mb-8">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FaStethoscope className="text-2xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">ICD-10 Medical Analysis</h2>
                    <p className="text-indigo-100">International Classification of Diseases - 10th Revision</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold ${
                  icdAnalysis.riskLevel === 'critical' ? 'bg-red-500 text-white' :
                  icdAnalysis.riskLevel === 'moderate' ? 'bg-yellow-500 text-white' :
                  'bg-green-500 text-white'
                }`}>
                  RISK: {icdAnalysis.riskLevel.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {icdAnalysis.diagnoses.map((diagnosis, index) => (
                  <div key={index} className={`rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    diagnosis.severity === 'high' 
                      ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300' 
                      : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          diagnosis.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}>
                          {diagnosis.severity === 'high' ? 
                            <FaExclamationTriangle className="text-xl text-white" /> :
                            <span className="text-xl text-white">⚠️</span>
                          }
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{diagnosis.code}</h3>
                          <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                            {diagnosis.severity} severity
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          diagnosis.confidence >= 80 ? 'text-red-600' :
                          diagnosis.confidence >= 60 ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {diagnosis.confidence}%
                        </div>
                        <p className="text-xs text-gray-500">Confidence</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">{diagnosis.name}</h4>
                        <p className="text-gray-700 font-medium">{diagnosis.thai}</p>
                      </div>
                      
                      <div className="bg-white bg-opacity-60 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <span>🔍</span>
                          Triggered by:
                        </h5>
                        <p className="text-sm text-gray-700 font-medium">{diagnosis.triggeredBy}</p>
                      </div>
                      
                      {diagnosis.symptoms && diagnosis.symptoms.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <span>🩺</span>
                            Associated Symptoms:
                          </h5>
                          <ul className="space-y-1">
                            {diagnosis.symptoms.map((symptom, sIndex) => (
                              <li key={sIndex} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-xs mt-1 font-bold text-gray-500">•</span>
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {diagnosis.recommendations && diagnosis.recommendations.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <span>💡</span>
                            Medical Recommendations:
                          </h5>
                          <ul className="space-y-1">
                            {diagnosis.recommendations.map((rec, rIndex) => (
                              <li key={rIndex} className="text-sm text-blue-700 flex items-start gap-2">
                                <span className="text-xs mt-1 font-bold text-blue-500">•</span>
                                <span className="font-medium">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">📊</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Analysis Generated</p>
                      <p className="text-xs text-gray-600">{DateTime.fromISO(icdAnalysis.timestamp).toFormat('dd/MM/yyyy HH:mm:ss')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Based on latest vital signs</p>
                    <p className="text-xs text-gray-500">ICD-10 Classification System</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto px-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">📈</span>
              </div>
              Medical Charts & Analytics
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📊</span>
              <span>Real-time Data Visualization</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Enhanced Battery Percent Chart with Loading */}
            {chartsLoading ? (
              <ChartLoadingSpinner 
                title="Battery Percent" 
                icon="🔋" 
                color="from-purple-600 to-indigo-600"
                bgColor="from-purple-50 to-indigo-50"
              />
            ) : (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border-2 border-purple-200 transform hover:-translate-y-1 hover:scale-105">
                <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-3 relative z-10">
                    <div className="bg-white bg-opacity-25 p-3 rounded-xl backdrop-blur-sm shadow-lg">
                      <span className="text-lg drop-shadow-lg">🔋</span>
                    </div>
                    Battery Percent
                  </h3>
                  <p className="text-purple-100 text-sm mt-2 relative z-10 font-medium">Battery health monitoring</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-white via-purple-50 to-indigo-50" style={{ height: '1100px' }}>
                  <BatteryPercent sensorData={dataToDisplay} />
                </div>
              </div>
            )}

            {/* Enhanced Heart Rate Chart with Loading */}
            {chartsLoading ? (
              <ChartLoadingSpinner 
                title="Heart Rate" 
                icon="❤️" 
                color="from-red-600 to-pink-600"
                bgColor="from-red-50 to-pink-50"
              />
            ) : (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border-2 border-red-200 transform hover:-translate-y-1 hover:scale-105">
                <div className="bg-gradient-to-r from-red-600 via-red-700 to-pink-600 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-3 relative z-10">
                    <div className="bg-white bg-opacity-25 p-3 rounded-xl backdrop-blur-sm shadow-lg">
                      <span className="text-lg drop-shadow-lg">❤️</span>
                    </div>
                    Heart Rate
                  </h3>
                  <p className="text-red-100 text-sm mt-2 relative z-10 font-medium">Cardiac rhythm analysis</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-white via-red-50 to-pink-50" style={{ height: '400px' }}>
                  <HR sensorData={dataToDisplay} />
                </div>
              </div>
            )}

            {/* Enhanced Temperature Chart with Loading */}
            {chartsLoading ? (
              <ChartLoadingSpinner 
                title="Temperature" 
                icon="🌡️" 
                color="from-orange-600 to-red-600"
                bgColor="from-orange-50 to-red-50"
              />
            ) : (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border-2 border-orange-200 transform hover:-translate-y-1 hover:scale-105">
                <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-3 relative z-10">
                    <div className="bg-white bg-opacity-25 p-3 rounded-xl backdrop-blur-sm shadow-lg">
                      <span className="text-lg drop-shadow-lg">🌡️</span>
                    </div>
                    Temperature
                  </h3>
                  <p className="text-orange-100 text-sm mt-2 relative z-10 font-medium">Thermal regulation tracking</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-white via-orange-50 to-red-50" style={{ height: '400px' }}>
                  <Temp sensorData={dataToDisplay} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Medical Data Table & Posture Chart */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex flex-wrap justify-between gap-8 w-full">
          {/* Enhanced Medical Data Table with Loading */}
          {tableLoading ? (
            <TableLoadingSpinner />
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex-1 min-w-[320px] max-w-[100%] h-[45rem]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📋</span>
                </div>
                Medical Records
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                  <span className="text-sm font-medium text-blue-700">📊 {dataToDisplay.length} records</span>
                </div>
                {filteredTenData.length > 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">FILTERED</span>
                )}
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-5rem)] bg-gray-50 rounded-xl border border-gray-200">
              <table className="w-full table-auto text-sm">
                <thead className="sticky top-0 bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Time</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">HR</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Temp</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Activity</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {dataToDisplay.map((item, i) => {
                    const risk = analyzeHealthRisk([item]);
                    return (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {DateTime.fromISO(item.timestamp).toFormat('HH:mm:ss')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${
                            item.heart_rate >= 60 && item.heart_rate <= 100 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {item.heart_rate || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${
                            item.temperature >= 36.0 && item.temperature <= 37.2 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {item.temperature || 'N/A'}
                          </span>
                        </td>
                        
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.posture === 0 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {postureMap[item.posture]?.label || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            risk.level === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : risk.level === 'medium' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {risk.level === 'high' ? 'ความเสี่ยงสูง' : 
                             risk.level === 'medium' ? 'ความเสี่ยงปานกลาง' : 'ความเสี่ยงต่ำ'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Enhanced Posture Chart with Loading */}
          
        </div>
      </div>

      {/* Modern Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileDownload className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Export Medical Data</h2>
              <p className="text-gray-600">Choose your preferred export format</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  exportAllSensorDataToExcel();
                  setShowPopup(false);
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-medium transition-colors"
              >
                📊 Export All Data
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📅 Start Date</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">📅 End Date</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={minDate}
                    max={DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm")}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  exportFilteredSensorDataToExcel();
                  setShowPopup(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
              >
                📈 Export Date Range
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Filter Popup */}
      {popupFitter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Filter Medical Data</h2>
              <p className="text-gray-600">Select time range for data analysis</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📅 Start Date</label>
                <input
                  type="datetime-local"
                  value={filterStart}
                  onChange={(e) => setFilterStart(e.target.value)}
                  min={minDate}
                  max={DateTime.now().toISO().slice(0, 16)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📅 End Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={filterEnd}
                  onChange={(e) => setFilterEnd(e.target.value)}
                  min={filterStart || minDate}
                  max={DateTime.now().toISO().slice(0, 16)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">*If not specified, current time will be used</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleFitter}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors"
                >
                  🔍 Apply Filter
                </button>

                <button
                  onClick={() => setPopupFitter(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern System Status */}
      

    </div>
  );
};

export default DashBoard;