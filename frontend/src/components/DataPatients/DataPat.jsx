import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PatientSearch from "./PatientSearch";
import PatientEditModal from "./PatientEditModal";
import PatientDeleteModal from "./PatientDeleteModal";

const DataPat = () => {
  // ===================== STATE MANAGEMENT =====================
  // Patient Data States
  const [patients, setPatients] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Search & Filter States
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("hn");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // UI Control States
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  
  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    prefix: "", namepat: "", surnamepat: "", phonepat: "",
    address: "", datepat: "", doctorpat: "", symptomspat: "",
    disease: "", allergy: "", weight: "", height: "", bloodgroup: "",
    born: "", gender: "", emi: "",
  }); 

  // ===================== PATIENT HEALTH MONITORING =====================
  // Get patient's latest heart rate status
  const getPatientHeartRate = (patientEMI) => {
    if (!patientEMI || !sensorData.length) return null;
    
    // Find the latest sensor data for this patient
    const latestSensor = sensorData.find(sensor => sensor.heart_rate);
    
    if (!latestSensor) return null;
    
    const heartRateStatus = checkHeartRateStatus(latestSensor.heart_rate);
    
    // Calculate time elapsed
    const timeDiff = new Date() - new Date(latestSensor.timestamp);
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    
    return {
      heartRate: latestSensor.heart_rate,
      level: heartRateStatus.level,
      message: heartRateStatus.message,
      color: heartRateStatus.color,
      urgency: heartRateStatus.urgency,
      timestamp: latestSensor.timestamp,
      minutesAgo: minutesAgo,
      isRecent: minutesAgo <= 5 // Recent data within 5 minutes
    };
  };

  // Check heart rate status according to medical standards
  const checkHeartRateStatus = (heartRate) => {
    const hr = parseInt(heartRate);
    if (isNaN(hr)) return { status: "unknown", level: "normal", message: "ไม่พบข้อมูลอัตราการเต้นหัวใจ", color: "gray" };

    // Adult heart rate standards according to medical guidelines
    if (hr < 40) {
      return { 
        status: "severe_bradycardia", 
        level: "critical", 
        message: `อัตราการเต้นหัวใจต่ำมาก (${hr} bpm) - ภาวะหัวใจเต้นช้าอันตราย!`, 
        color: "red",
        urgency: "ต้องการความช่วยเหลือทันที!"
      };
    } else if (hr < 60) {
      return { 
        status: "bradycardia", 
        level: "warning", 
        message: `อัตราการเต้นหัวใจต่ำกว่าปกติ (${hr} bpm) - ภาวะหัวใจเต้นช้า`, 
        color: "yellow",
        urgency: "ควรติดตามอย่างใกล้ชิด"
      };
    } else if (hr <= 100) {
      return { 
        status: "normal", 
        level: "normal", 
        message: `อัตราการเต้นหัวใจปกติ (${hr} bpm)`, 
        color: "green",
        urgency: null
      };
    } else if (hr <= 120) {
      return { 
        status: "mild_tachycardia", 
        level: "warning", 
        message: `อัตราการเต้นหัวใจเร็วเล็กน้อย (${hr} bpm) - ภาวะหัวใจเต้นเร็วเบา`, 
        color: "yellow",
        urgency: "ควรติดตามและประเมิน"
      };
    } else if (hr <= 150) {
      return { 
        status: "tachycardia", 
        level: "danger", 
        message: `อัตราการเต้นหัวใจเร็วกว่าปกติ (${hr} bpm) - ภาวะหัวใจเต้นเร็ว`, 
        color: "orange",
        urgency: "ต้องการการดูแลโดยเร็ว"
      };
    } else {
      return { 
        status: "severe_tachycardia", 
        level: "critical", 
        message: `อัตราการเต้นหัวใจสูงมากอันตราย (${hr} bpm) - ภาวะฉุกเฉิน!`, 
        color: "red",
        urgency: "ต้องการความช่วยเหลือทันที!"
      };
    }
  };

  // ===================== DATA FETCHING =====================
  // Fetch latest sensor data
  const fetchSensorData = useCallback(async () => {
    try {
      // Fetch latest sensor data from endpoint
      const response = await axios.get("http://localhost:4000/hospital/sensor/latest");
      
      const latestSensorData = response.data.sensor || [];
      
      if (latestSensorData.length === 0) {
        setSensorData([]);
        return;
      }

      // Update state with latest data
      setSensorData(latestSensorData);
      
    } catch {
      setSensorData([]);
      return;
    }
  }, []); 

  // ===================== EFFECTS =====================
  // Fetch all patients when component loads
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/hospital/register/"
        );
        const patientsData = response.data.data || [];
        setPatients(patientsData);
      } catch {
        setPatients([]);
      }
    };
    fetchPatients();
  }, []);

  // Fetch sensor data and check heart rate every 2 minutes
  useEffect(() => {
    if (patients.length > 0) {
      fetchSensorData();
      
      // Set interval to update every 2 minutes
      const interval = setInterval(() => {
        fetchSensorData();
      }, 2 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [patients, fetchSensorData]);

  // Calculate patient status based on sensor data
  const calculatePatientStatus = useCallback((patient) => {
    if (!patient || !sensorData.length) {
      return { 
        status: "ไม่มีข้อมูล", 
        level: "unknown", 
        color: "gray", 
        icon: "❓" 
      };
    }

    // Find sensor data for this patient
    const latestSensor = sensorData.find(sensor => sensor.status === patient.status);
    
    if (!latestSensor) {
      return { 
        status: "ไม่มีข้อมูล sensor", 
        level: "unknown", 
        color: "gray", 
        icon: "📡" 
      };
    }

    // Check for fall (highest priority)
    if (latestSensor.posture === 4) {
      return { 
        status: "ฉุกเฉิน - ล้ม", 
        level: "critical", 
        color: "red", 
        icon: "🚨" 
      };
    }

    // Check Heart Rate
    const hr = parseInt(latestSensor.heart_rate);
    if (!isNaN(hr)) {
      if (hr < 40 || hr > 150) {
        return { 
          status: "วิกฤติ - หัวใจ", 
          level: "critical", 
          color: "red", 
          icon: "🚨" 
        };
      } else if (hr < 60 || hr > 120) {
        return { 
          status: "เฝ้าระวัง - หัวใจ", 
          level: "warning", 
          color: "orange", 
          icon: "⚠️" 
        };
      }
    }

    // Check temperature
    const temp = parseFloat(latestSensor.temperature);
    if (!isNaN(temp)) {
      if (temp < 35.0 || temp > 38.5) {
        return { 
          status: "วิกฤติ - อุณหภูมิ", 
          level: "critical", 
          color: "red", 
          icon: "🚨" 
        };
      } else if (temp < 36.1 || temp > 37.5) {
        return { 
          status: "เฝ้าระวัง - อุณหภูมิ", 
          level: "warning", 
          color: "orange", 
          icon: "⚠️" 
        };
      }
    }

    // Check battery
    const battery = parseInt(latestSensor.BatteryPercent);
    if (!isNaN(battery) && battery < 10) {
      return { 
        status: "เฝ้าระวัง - แบตเตอรี่", 
        level: "warning", 
        color: "orange", 
        icon: "🔋" 
      };
    }

    // Check data freshness
    const timeDiff = new Date() - new Date(latestSensor.timestamp);
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    
    if (minutesAgo > 30) {
      return { 
        status: "ขาดการติดต่อ", 
        level: "warning", 
        color: "yellow", 
        icon: "📡" 
      };
    }

    // If everything is normal
    return { 
      status: "ปกติ", 
      level: "normal", 
      color: "green", 
      icon: "✅" 
    };
  }, [sensorData]);

  // Filter patients by status
  const handleStatusFilter = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:4000/hospital/register/");
      const allPatients = response.data.data || [];
      
      if (statusFilter === "all") {
        setPatients(allPatients);
        toast.success("แสดงข้อมูลทั้งหมด");
      } else {
        // Filter by status calculated from sensor data
        const filteredPatients = allPatients.filter(patient => {
          const calculatedStatus = calculatePatientStatus(patient);
          
          // Map filter values to calculated status
          switch (statusFilter.toLowerCase()) {
            case "critical":
            case "วิกฤติ":
              return calculatedStatus.level === "critical";
            case "normal":
            case "ปกติ":
            case "ทั่วไป":
              return calculatedStatus.level === "normal";
            case "warning":
            case "เฝ้าระวัง":
            case "รอผล":
              return calculatedStatus.level === "warning";
            case "หายแล้ว":
              return calculatedStatus.status === "ปกติ";
            default:
              // Fallback filter by original status in database
              return patient.status && patient.status.toLowerCase().includes(statusFilter.toLowerCase());
          }
        });
        
        setPatients(filteredPatients);
        
        if (filteredPatients.length === 0) {
          toast.info(`ไม่พบผู้ป่วยสถานะ ${statusFilter}`);
        } else {
          toast.success(`พบผู้ป่วยสถานะ ${statusFilter} จำนวน ${filteredPatients.length} รายการ`);
        }
      }
    } catch {
      setPatients([]);
      toast.error("เกิดข้อผิดพลาดในการกรองข้อมูล");
    }
  }, [statusFilter, calculatePatientStatus]);

  // Auto-filter when statusFilter changes
  useEffect(() => {
    if (statusFilter !== "all" && patients.length > 0) {
      handleStatusFilter();
    }
  }, [statusFilter, patients.length, handleStatusFilter]);

  // ===================== SEARCH & FILTER FUNCTIONS =====================
  // Search patients by different criteria
  const handleSearch = async () => {
    if (!searchValue) {
      toast.error("กรุณากรอกข้อมูลเพื่อค้นหา");
      return;
    }

    try {
      let response;
      
      if (searchType === "hn") {
        // Check if HN starts with "hn", if not add "hn" prefix
        const searchHN = searchValue.startsWith("hn") ? searchValue : `hn${searchValue}`;
        response = await axios.get(`http://localhost:4000/hospital/register/${searchHN}`);
        setPatients([response.data.data]);
      } else {
        // Search all and filter by condition
        response = await axios.get("http://localhost:4000/hospital/register/");
        const allPatients = response.data.data || [];
        
        const filteredPatients = allPatients.filter(patient => {
          const searchLower = searchValue.toLowerCase();
          switch (searchType) {
            case "namepat":
              return patient.namepat && patient.namepat.toLowerCase().includes(searchLower);
            case "surnamepat":
              return patient.surnamepat && patient.surnamepat.toLowerCase().includes(searchLower);
            case "emi":
              return patient.emi && patient.emi.toLowerCase().includes(searchLower);
            case "doctorpat":
              return patient.doctorpat && patient.doctorpat.toLowerCase().includes(searchLower);
            case "status":
              return patient.status && patient.status.toLowerCase().includes(searchLower);
            default:
              return false;
          }
        });
        
        setPatients(filteredPatients);
        
        if (filteredPatients.length === 0) {
          toast.info("ไม่พบข้อมูลที่ค้นหา");
        } else {
          toast.success(`พบข้อมูล ${filteredPatients.length} รายการ`);
        }
      }
    } catch {
      setPatients([]);
      toast.error("เกิดข้อผิดพลาดในการค้นหา");
    }
  };

  // Clear search and load all data
  const handleClearSearch = async () => {
    setSearchValue(""); 
    try {
      const response = await axios.get("http://localhost:4000/hospital/register/");
      setPatients(response.data.data || []);
      toast.success("โหลดข้อมูลทั้งหมดแล้ว");
    } catch {
      setPatients([]);
    }
  };

  // ===================== PATIENT MANAGEMENT FUNCTIONS =====================
  // Open popup for editing patient data
  const openEditPopup = (patient) => {
    setSelectedPatient(patient);
    setEditFormData({
      prefix:        patient.prefix        || "", 
      namepat:       patient.namepat       || "", 
      surnamepat:    patient.surnamepat    || "",
      phonepat:      patient.phonepat      || "",
      address:       patient.address       || "",
      datepat:       patient.datepat?.split("T")[0] || "",
      doctorpat:     patient.doctorpat     || "",
      symptomspat:   patient.symptomspat   || "",
      disease:       patient.disease       || "",
      allergy:       patient.allergy       || "",
      weight:        patient.weight        || "",
      height:        patient.height        || "",
      bloodgroup:    patient.bloodgroup    || "",
      born:          patient.born?.split("T")[0] || "1990-01-01",
      gender:        patient.gender        || "",
      emi:           patient.emi           || "",
    });
    setShowEditPopup(true);
  };

  // Close edit popup
  const closeEditPopup = () => {
    setShowEditPopup(false);
    setSelectedPatient(null);
    setEditFormData({
      prefix: "", namepat: "", surnamepat: "", phonepat: "",
      address: "", datepat: "", doctorpat: "", symptomspat: "",
      disease: "", allergy: "", weight: "", height: "", bloodgroup: "",
      born: "", gender: "", emi: "",
    });
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Open delete popup
  const openDeletePopup = (patient) => {
    setSelectedPatient(patient);
    setShowDeletePopup(true);
  };

  // Close delete popup
  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedPatient(null);
  };

  // Delete patient data
  const handleDelete = async () => {
    if (!selectedPatient) return;

    try {
      await axios.delete(`http://localhost:4000/hospital/register/${selectedPatient.hn}`);
      setPatients((prev) => prev.filter((p) => p.hn !== selectedPatient.hn));
      toast.success("ลบข้อมูลผู้ป่วยเรียบร้อยแล้ว");
      closeDeletePopup();
    } catch {
      toast.error("ลบข้อมูลไม่สำเร็จ");
    }
  };

  // Update patient data
  const handleUpdate = async () => {
    if (!selectedPatient) return;

    // Validate required fields
    if (!editFormData.namepat || !editFormData.surnamepat) {
      toast.error("กรุณากรอกชื่อและนามสกุล");
      return;
    }

    try {
      // Prepare data with explicit field mapping and proper date handling
      const updateData = {
        prefix: editFormData.prefix || "",
        namepat: editFormData.namepat || "",
        surnamepat: editFormData.surnamepat || "",
        phonepat: editFormData.phonepat || "",
        address: editFormData.address || "",
        datepat: editFormData.datepat || "",
        doctorpat: editFormData.doctorpat || "",
        symptomspat: editFormData.symptomspat || "",
        disease: editFormData.disease || "",
        allergy: editFormData.allergy || "",
        weight: editFormData.weight || "",
        height: editFormData.height || "",
        bloodgroup: editFormData.bloodgroup || "",
        // Ensure born field is always included and properly formatted
        born: editFormData.born || selectedPatient.born?.split("T")[0] || "1990-01-01",
        gender: editFormData.gender || selectedPatient.gender || "ไม่ระบุ",
        emi: editFormData.emi || selectedPatient.emi || "",
        status: editFormData.status || selectedPatient.status || "ทั่วไป",
        treatmenthistory: selectedPatient.treatmenthistory || "",
        surgeryhistory: selectedPatient.surgeryhistory || ""
      };

      console.log("🔄 Updating patient data:", updateData);

      // Update patient data
      const _response = await axios.put(
        `http://localhost:4000/hospital/register/${selectedPatient.hn}`,
        updateData
      );

      toast.success("อัปเดตข้อมูลสำเร็จ");
      setPatients((prev) =>
        prev.map((p) => (p.hn === selectedPatient.hn ? { ...p, ...updateData } : p))
      );
      
      closeEditPopup();

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`อัปเดตข้อมูลไม่สำเร็จ: ${error.response.data.message}`);
      } else {
        toast.error("อัปเดตข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  // ===================== SENSOR DATA MONITORING =====================
  // Get patient's latest temperature data
  const getPatientTemperature = (patient) => {
    if (!patient || !sensorData.length) return null;
    
    // Find the latest sensor data for this patient
    const latestSensor = sensorData.find(sensor => sensor.temperature);
    
    if (!latestSensor) return null;
    
    const temp = parseFloat(latestSensor.temperature);
    
    let status = { level: "normal", color: "green", icon: "🌡️", message: "ปกติ" };
    
    if (temp < 35.0) {
      status = { level: "critical", color: "blue", icon: "🥶", message: "อุณหภูมิต่ำมาก" };
    } else if (temp < 36.1) {
      status = { level: "warning", color: "cyan", icon: "❄️", message: "อุณหภูมิต่ำ" };
    } else if (temp > 38.5) {
      status = { level: "critical", color: "red", icon: "🔥", message: "ไข้สูง" };
    } else if (temp > 37.5) {
      status = { level: "warning", color: "orange", icon: "🌡️", message: "ไข้เล็กน้อย" };
    }
    
    const timeDiff = new Date() - new Date(latestSensor.timestamp);
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    
    return {
      temperature: temp.toFixed(1),
      status: status.message,
      level: status.level,
      color: status.color,
      icon: status.icon,
      timestamp: latestSensor.timestamp,
      minutesAgo: minutesAgo,
      isRecent: minutesAgo <= 5
    };
  };

  // Get patient's latest battery data
  const getPatientBattery = (patient) => {
    if (!patient || !sensorData.length) return null;
    
    // Find the latest sensor data for this patient
    const latestSensor = sensorData.find(sensor => sensor.BatteryPercent);
    
    if (!latestSensor) return null;
    
    const battery = parseInt(latestSensor.BatteryPercent);
    
    let status = { level: "normal", color: "green", icon: "🔋", message: "ปกติ" };
    
    if (battery < 10) {
      status = { level: "critical", color: "red", icon: "🪫", message: "แบตเตอรี่ใกล้หมด" };
    } else if (battery < 20) {
      status = { level: "warning", color: "orange", icon: "🔋", message: "แบตเตอรี่ต่ำ" };
    } else if (battery > 80) {
      status = { level: "good", color: "green", icon: "🔋", message: "แบตเตอรี่เต็ม" };
    }
    
    const timeDiff = new Date() - new Date(latestSensor.timestamp);
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    
    return {
      battery: battery,
      status: status.message,
      level: status.level,
      color: status.color,
      icon: status.icon,
      timestamp: latestSensor.timestamp,
      minutesAgo: minutesAgo,
      isRecent: minutesAgo <= 5
    };
  };

  // Get patient's latest posture data
  const getPatientPosture = (patient) => {
    if (!patient || !sensorData.length) return null;
    
    // Find the latest sensor data for this patient
    const latestSensor = sensorData.find(sensor => sensor.posture !== undefined);
    
    if (!latestSensor) return null;
    
    const posture = parseInt(latestSensor.posture);
    
    const postureMap = {
      0: { label: "อยู่นิ่ง", icon: "🧘", color: "green", level: "normal" },
      1: { label: "นอน", icon: "🛏️", color: "purple", level: "normal" },
      2: { label: "ยืน", icon: "🧍", color: "gray", level: "normal" },
      3: { label: "เดิน", icon: "🚶", color: "green", level: "normal" },
      4: { label: "ล้ม", icon: "🚨", color: "red", level: "critical" }
    };
    
    const postureInfo = postureMap[posture] || { 
      label: "ไม่ทราบ", 
      icon: "❓", 
      color: "gray", 
      level: "unknown" 
    };
    
    const timeDiff = new Date() - new Date(latestSensor.timestamp);
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    
    return {
      posture: posture,
      postureLabel: postureInfo.label,
      status: postureInfo.label,
      level: postureInfo.level,
      color: postureInfo.color,
      icon: postureInfo.icon,
      timestamp: latestSensor.timestamp,
      minutesAgo: minutesAgo,
      isRecent: minutesAgo <= 5,
      isFall: posture === 4
    };
  };

  // ===================== COMPONENT RENDER =====================
  return (
    <div className="w-full px-4 sm:px-8 py-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Medical Header with Enhanced Security */}
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <div className="text-white text-2xl">🏥</div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                ระบบติดตามผู้ป่วย Real-time Monitor
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  🔒 ระบบปลอดภัย SSL
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  👨‍⚕️ สำหรับแพทย์เท่านั้น
                </span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  📊 อัพเดตทุก 2 นาที
                </span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  🔍 ค้นหาขั้นสูง
                </span>
              </p>
            </div>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchSensorData();
                toast.info("🔄 กำลังซิงค์ข้อมูล Vital Signs...");
              }}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🔄 ซิงค์ข้อมูล
            </button>
            
            <button
              onClick={() => {
                window.open('tel:1669', '_blank');
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-pulse"
            >
              🚑 ฉุกเฉิน 1669
            </button>
          </div>
        </div>

        {/* Critical Alerts Banner */}
        {patients.length > 0 && sensorData.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <span className="text-red-600 text-lg animate-pulse">🚨</span>
                </div>
                <div>
                  <h3 className="font-bold text-red-800 text-lg">แจ้งเตือนฉุกเฉิน Real-time</h3>
                  <div className="flex gap-4 text-sm">
                    {(() => {
                      const criticalCount = patients.filter(p => calculatePatientStatus(p).level === "critical").length;
                      const warningCount = patients.filter(p => calculatePatientStatus(p).level === "warning").length;
                      const fallPatients = patients.filter(p => {
                        const posture = getPatientPosture(p);
                        return posture?.isFall;
                      });
                      
                      return (
                        <>
                          {criticalCount > 0 && (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full font-semibold animate-pulse">
                              🚨 วิกฤติ: {criticalCount} ราย
                            </span>
                          )}
                          {fallPatients.length > 0 && (
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full font-semibold animate-bounce">
                              🤕 ตรวจพบการล้ม: {fallPatients.length} ราย
                            </span>
                          )}
                          {warningCount > 0 && (
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full font-semibold">
                              ⚠️ เฝ้าระวัง: {warningCount} ราย
                            </span>
                          )}
                          {criticalCount === 0 && warningCount === 0 && fallPatients.length === 0 && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full font-semibold">
                              ✅ ไม่มีการแจ้งเตือนฉุกเฉิน
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                อัพเดตล่าสุด: {new Date().toLocaleString('th-TH')}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Medical Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">ผู้ป่วยทั้งหมด</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
              <div className="text-3xl opacity-80">👥</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">สถานะวิกฤติ</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => calculatePatientStatus(p).level === "critical").length}
                </p>
              </div>
              <div className="text-3xl opacity-80 animate-pulse">🚨</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">ต้องเฝ้าระวัง</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => calculatePatientStatus(p).level === "warning").length}
                </p>
              </div>
              <div className="text-3xl opacity-80">⚠️</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">สถานะปกติ</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => calculatePatientStatus(p).level === "normal").length}
                </p>
              </div>
              <div className="text-3xl opacity-80">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">เชื่อมต่อ Sensor</p>
                <p className="text-2xl font-bold">{sensorData.length}</p>
              </div>
              <div className="text-3xl opacity-80">📡</div>
            </div>
          </div>
        </div>
      </div>

        {/* Enhanced Search Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
          <PatientSearch 
            searchType={searchType}
            setSearchType={setSearchType}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            handleSearch={handleSearch}
            handleClearSearch={handleClearSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            handleStatusFilter={handleStatusFilter}
          />
          
          {/* Enhanced Quick Filter Buttons */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              ⚡ การกรองด่วน (Quick Filters)
            </h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setStatusFilter("critical");
                  handleStatusFilter();
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                🚨 ผู้ป่วยวิกฤติ
              </button>
              <button
                onClick={() => {
                  setStatusFilter("warning");
                  handleStatusFilter();
                }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                ⚠️ ต้องเฝ้าระวัง
              </button>
              <button
                onClick={() => {
                  setStatusFilter("normal");
                  handleStatusFilter();
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                ✅ สถานะปกติ
              </button>
              <button
                onClick={() => {
                  const fallPatients = patients.filter(p => {
                    const posture = getPatientPosture(p);
                    return posture?.isFall;
                  });
                  setPatients(fallPatients);
                  if (fallPatients.length === 0) {
                    toast.info("🎉 ไม่พบผู้ป่วยที่ล้ม");
                  } else {
                    toast.warning(`🚨 พบผู้ป่วยที่ล้ม ${fallPatients.length} ราย`);
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 animate-pulse"
              >
                🤕 ตรวจพบการล้ม
              </button>
              <button
                onClick={handleClearSearch}
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                🔄 แสดงทั้งหมด
              </button>
              <button
                onClick={() => {
                  fetchSensorData();
                  toast.info("🔄 กำลังซิงค์ข้อมูล Vital Signs...");
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                📡 รีเฟรช Sensor
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Patient Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Enhanced Medical Table Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                  🏥 ระบบติดตามผู้ป่วย Real-time Monitor
                  <span className="text-sm bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    v2.0 Enhanced
                  </span>
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                    📊 แสดงผลลัพธ์: {patients.length} ราย
                  </span>
                  {sensorData.length > 0 && patients.length > 0 && (
                    <>
                      <span className="bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full font-semibold animate-pulse">
                        🚨 วิกฤติ: {patients.filter(p => calculatePatientStatus(p).level === "critical").length} ราย
                      </span>
                      <span className="bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded-full font-semibold">
                        ⚠️ เฝ้าระวัง: {patients.filter(p => calculatePatientStatus(p).level === "warning").length} ราย
                      </span>
                      <span className="bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full font-semibold">
                        ✅ ปกติ: {patients.filter(p => calculatePatientStatus(p).level === "normal").length} ราย
                      </span>
                    </>
                  )}
                  {sensorData.length > 0 && (
                    <span className="bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                      💓 Vital Signs อัพเดต: {new Date().toLocaleTimeString('th-TH')}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Enhanced Control Panel */}
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                  <div className="text-xs text-white/80">การเชื่อมต่อ</div>
                  <div className={`text-sm font-bold ${sensorData.length > 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {sensorData.length > 0 ? '🟢 เชื่อมต่อแล้ว' : '🔴 ไม่เชื่อมต่อ'}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          
          {/* Enhanced Medical Table with Smart Columns */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Smart Medical Table Header */}
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-blue-200">
                <tr className="text-center text-gray-800 font-semibold">
                  <th className="py-4 px-3 text-left font-bold text-blue-800 bg-blue-50 sticky left-0 z-10">
                    <div className="flex items-center gap-2">
                      <span>#</span>
                      <span className="text-xs text-gray-600">ลำดับ</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 font-bold text-red-600 bg-red-50 min-w-[140px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg animate-pulse">🚨</span>
                      <span>สถานะฉุกเฉิน</span>
                      <span className="text-xs text-gray-600">Emergency Status</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 font-bold text-red-500 bg-pink-50 min-w-[120px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">💓</span>
                      <span>Heart Rate</span>
                      <span className="text-xs text-gray-600">อัตราการเต้นหัวใจ</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 font-bold text-orange-500 bg-orange-50 min-w-[100px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">🌡️</span>
                      <span>อุณหภูมิ</span>
                      <span className="text-xs text-gray-600">Temperature</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 font-bold text-green-600 bg-green-50 min-w-[100px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">🔋</span>
                      <span>แบตเตอรี่</span>
                      <span className="text-xs text-gray-600">Battery</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 font-bold text-purple-600 bg-purple-50 min-w-[100px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">🧍</span>
                      <span>ท่าทาง</span>
                      <span className="text-xs text-gray-600">Posture</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 font-bold text-blue-600 bg-blue-50 min-w-[100px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">🏥</span>
                      <span>HN</span>
                      <span className="text-xs text-gray-600">รหัสผู้ป่วย</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 font-bold text-indigo-600 bg-indigo-50 min-w-[200px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">👤</span>
                      <span>ข้อมูลผู้ป่วย</span>
                      <span className="text-xs text-gray-600">Patient Info</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 font-bold text-blue-600 bg-blue-50 min-w-[150px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">👨‍⚕️</span>
                      <span>แพทย์ผู้ดูแล</span>
                      <span className="text-xs text-gray-600">Attending Doctor</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 font-bold text-teal-600 bg-teal-50 min-w-[120px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">📅</span>
                      <span>วันที่รักษา</span>
                      <span className="text-xs text-gray-600">Treatment Date</span>
                    </div>
                  </th>
                  <th className="py-4 px-3 text-center font-bold text-gray-700 bg-gray-50 min-w-[140px]">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">⚙️</span>
                      <span>การจัดการ</span>
                      <span className="text-xs text-gray-600">Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-8xl mb-6">🔍</div>
                        <p className="text-xl font-medium text-gray-600">ไม่พบข้อมูลผู้ป่วยที่ค้นหา</p>
                        <p className="text-sm text-gray-400 mt-2 mb-4">
                          ลองปรับเงื่อนไขการค้นหาหรือใช้ปุ่มด้านล่างเพื่อดูข้อมูลทั้งหมด
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleClearSearch}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold"
                          >
                            🔄 แสดงข้อมูลทั้งหมด
                          </button>
                          <button
                            onClick={() => {
                              setSearchValue("");
                              setSearchType("hn");
                              setStatusFilter("all");
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-semibold"
                          >
                            🗑️ ล้างการค้นหา
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  patients.map((patient, index) => {
                    const heart_rate = getPatientHeartRate(patient);
                    const temperature = getPatientTemperature(patient);
                    const BatteryPercent = getPatientBattery(patient);
                    const postureInfo = getPatientPosture(patient);
                    const patientStatus = calculatePatientStatus(patient);
                    
                    return (
                    <tr
                      key={patient.hn}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                        postureInfo?.isFall ? 'bg-red-50 border-red-300 animate-pulse' : ''
                      } ${
                        patientStatus.level === "critical" ? 'bg-red-50 border-l-4 border-l-red-500' :
                        patientStatus.level === "warning" ? 'bg-orange-50 border-l-4 border-l-orange-500' :
                        'hover:bg-blue-50'
                      }`}
                    >
                      {/* Enhanced Row Number with Priority Indicator */}
                      <td className="py-4 px-3 text-left bg-blue-50 sticky left-0 z-10">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600 bg-white px-2 py-1 rounded-full text-sm border">
                            {index + 1}
                          </span>
                          {patientStatus.level === "critical" && (
                            <div className="relative">
                              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </div>
                          )}
                          {postureInfo?.isFall && (
                            <span className="text-red-600 animate-bounce">🚨</span>
                          )}
                        </div>
                      </td>
                      
                      {/* Enhanced Emergency Status */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className={`inline-flex px-3 py-2 rounded-full text-xs font-bold border-2 min-w-[120px] ${
                            patientStatus.level === "critical" ? "bg-red-100 text-red-800 border-red-300 animate-pulse shadow-lg" :
                            patientStatus.level === "warning" ? "bg-orange-100 text-orange-800 border-orange-300 shadow-md" :
                            patientStatus.level === "normal" ? "bg-green-100 text-green-800 border-green-300 shadow-md" :
                            "bg-gray-100 text-gray-800 border-gray-300"
                          }`}>
                            {patientStatus.icon} {patientStatus.status}
                          </span>
                          {patientStatus.level === "critical" && (
                            <button
                              onClick={() => {
                                const alertMessage = `⚠️ MEDICAL ALERT ⚠️\n\nผู้ป่วย: ${patient.namepat} ${patient.surnamepat}\nHN: ${patient.hn}\nสถานะ: ${patientStatus.status}\nแพทย์ผู้ดูแล: ${patient.doctorpat || 'ไม่ระบุ'}\n\n🚨 กรุณาตรวจสอบทันที! 🚨`;
                                alert(alertMessage);
                                // Optional: Add sound alert
                                if (window.speechSynthesis) {
                                  const utterance = new SpeechSynthesisUtterance(`ผู้ป่วย 
                                    ${patient.namepat} ${patient.surnamepat} มีภาวะฉุกเฉิน กรุณาดำเนินการด่วน`);
                                  utterance.lang = 'th-TH';
                                  window.speechSynthesis.speak(utterance);  // Speak the alert message
                                }
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold animate-bounce shadow-lg"
                            >
                              🚨 แจ้งเตือนด่วน
                            </button>
                          )}
                        </div>
                      </td>
                      
                      {/* Enhanced Heart Rate with Trend Analysis */}
                      <td className="py-4 px-3 text-center">
                        {heart_rate ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold border-2 min-w-[100px] ${
                              heart_rate.level === "critical" ? "bg-red-100 text-red-800 border-red-300 animate-pulse" :
                              heart_rate.level === "danger" ? "bg-orange-100 text-orange-800 border-orange-300" :
                              heart_rate.level === "warning" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                              "bg-green-100 text-green-800 border-green-300"
                            }`}>
                              <span className="mr-1">
                                {heart_rate.level === "critical" && "🚨"}
                                {heart_rate.level === "danger" && "⚠️"}
                                {heart_rate.level === "warning" && "⚠️"}
                                {heart_rate.level === "normal" && "💚"}
                              </span>
                              {heart_rate.heartRate} bpm
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              heart_rate.minutesAgo <= 5 ? "bg-green-100 text-green-700" : 
                              heart_rate.minutesAgo <= 15 ? "bg-yellow-100 text-yellow-700" : 
                              "bg-red-100 text-red-700"
                            }`}>
                              🕒 {heart_rate.minutesAgo === 0 ? "เพิ่งอัพเดต" : `${heart_rate.minutesAgo} นาทีที่แล้ว`}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-sm bg-gray-100 px-3 py-2 rounded-full border">ไม่มีข้อมูล</span>
                            <span className="text-xs text-red-500 mt-1">❌ ไม่เชื่อมต่อ</span>
                          </div>
                        )}
                      </td>
                      
                      {/* Enhanced Temperature */}
                      <td className="py-4 px-3 text-center">
                        {temperature ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold border-2 min-w-[80px] ${
                              temperature.level === "critical" ? "bg-red-100 text-red-800 border-red-300 animate-pulse" :
                              temperature.level === "warning" ? "bg-orange-100 text-orange-800 border-orange-300" :
                              "bg-green-100 text-green-800 border-green-300"
                            }`}>
                              <span className="mr-1">{temperature.icon}</span>
                              {temperature.temperature}°C
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              temperature.isRecent ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}>
                              {temperature.minutesAgo === 0 ? "เพิ่งอัพเดต" : 
                               temperature.minutesAgo < 60 ? `${temperature.minutesAgo} นาทีที่แล้ว` :
                               "ข้อมูลเก่า"}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-sm bg-gray-100 px-3 py-2 rounded-full border">ไม่มีข้อมูล</span>
                            <span className="text-xs text-red-500 mt-1">❌ ไม่เชื่อมต่อ</span>
                          </div>
                        )}
                      </td>
                      
                      {/* Enhanced Battery Status */}
                      <td className="py-4 px-3 text-center">
                        {BatteryPercent ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold border-2 min-w-[70px] ${
                              BatteryPercent.level === "critical" ? "bg-red-100 text-red-800 border-red-300 animate-pulse" :
                              BatteryPercent.level === "warning" ? "bg-orange-100 text-orange-800 border-orange-300" :
                              "bg-green-100 text-green-800 border-green-300"
                            }`}>
                              <span className="mr-1">{BatteryPercent.icon}</span>
                              {BatteryPercent.battery}%
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              BatteryPercent.isRecent ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}>
                              {BatteryPercent.minutesAgo === 0 ? "เพิ่งอัพเดต" : `${BatteryPercent.minutesAgo} นาทีที่แล้ว`}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-sm bg-gray-100 px-3 py-2 rounded-full border">ไม่มีข้อมูล</span>
                            <span className="text-xs text-red-500 mt-1">❌ ไม่เชื่อมต่อ</span>
                          </div>
                        )}
                      </td>
                      
                      {/* Enhanced Posture with Fall Detection */}
                      <td className="py-4 px-3 text-center">
                        {postureInfo ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold border-2 min-w-[80px] ${
                              postureInfo.isFall ? "bg-red-100 text-red-800 border-red-300 animate-bounce" :
                              postureInfo.level === "critical" ? "bg-red-100 text-red-800 border-red-300" :
                              "bg-green-100 text-green-800 border-green-300"
                            }`}>
                              <span className="mr-1">{postureInfo.icon}</span>
                              {postureInfo.postureLabel}
                            </div>
                            {postureInfo.isFall && (
                              <button
                                onClick={() => {
                                  const fallAlert = `🚨 FALL DETECTED ALERT! 🚨\n\nผู้ป่วย: ${patient.namepat} ${patient.surnamepat}\nHN: ${patient.hn}\nแพทย์ผู้ดูแล: ${patient.doctorpat}\nเวลาที่ตรวจพบ: ${new Date().toLocaleString('th-TH')}\n\n🚑 กรุณาไปตรวจสอบทันที!`;
                                  alert(fallAlert);
                                  // Sound alert for fall detection
                                  if (window.speechSynthesis) {
                                    const utterance = new SpeechSynthesisUtterance(`แจ้งเตือนผู้ป่วยล้ม ${patient.namepat} ${patient.surnamepat} กรุณาไปตรวจสอบทันที`);
                                    utterance.lang = 'th-TH';
                                    utterance.rate = 1.2;
                                    window.speechSynthesis.speak(utterance);
                                  }
                                }}
                                className="text-xs text-red-600 font-bold bg-red-100 px-2 py-1 rounded-full animate-pulse border border-red-300 hover:bg-red-200"
                              >
                                🚨 ตรวจพบการล้ม!
                              </button>
                            )}
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              postureInfo.isRecent ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}>
                              {postureInfo.minutesAgo === 0 ? "เพิ่งอัพเดต" : `${postureInfo.minutesAgo} นาทีที่แล้ว`}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-sm bg-gray-100 px-3 py-2 rounded-full border">ไม่มีข้อมูล</span>
                            <span className="text-xs text-red-500 mt-1">❌ ไม่เชื่อมต่อ</span>
                          </div>
                        )}
                      </td>
                      
                      {/* Enhanced HN Link */}
                      <td className="py-4 px-3 text-center">
                        <Link
                          to={`/patient/${patient.hn}/`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold hover:underline transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200"
                        >
                          🏥 {patient.hn}
                        </Link>
                      </td>
                      
                      {/* Enhanced Patient Information Card */}
                      <td className="py-4 px-3 text-left">
                        <div className="bg-gray-50 rounded-lg p-3 min-w-[200px]">
                          <div className="font-bold text-gray-900 text-base mb-2">
                            {patient.prefix ? `${patient.prefix} ` : ''}{patient.namepat} {patient.surnamepat}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                patient.gender === "ชาย" ? "bg-blue-100 text-blue-800" :
                                patient.gender === "หญิง" ? "bg-pink-100 text-pink-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {patient.gender === "ชาย" && "👨 "}
                                {patient.gender === "หญิง" && "👩 "}
                                {patient.gender || "ไม่ระบุ"}
                              </span>
                              {patient.born && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  🎂 {new Date(patient.born).toLocaleDateString('th-TH')}
                                </span>
                              )}
                            </div>
                            {patient.phonepat && (
                              <div className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                                📞 {patient.phonepat}
                              </div>
                            )}
                            {patient.bloodgroup && (
                              <div className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded border border-red-200 font-medium">
                                🩸 หมู่เลือด {patient.bloodgroup}
                              </div>
                            )}
                            {(patient.weight || patient.height) && (
                              <div className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                {patient.weight && `⚖️ ${patient.weight} kg`}
                                {patient.weight && patient.height && " | "}
                                {patient.height && `📏 ${patient.height} cm`}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {/* Enhanced Doctor Information */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-full border border-blue-200">
                            👨‍⚕️ {patient.doctorpat || "ไม่ระบุ"}
                          </span>
                          {patient.symptomspat && (
                            <div className="text-xs text-gray-600 bg-yellow-50 px-2 py-1 rounded max-w-[150px] line-clamp-2 border border-yellow-200">
                              🩺 {patient.symptomspat}
                            </div>
                          )}
                          {patient.disease && (
                            <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded max-w-[150px] line-clamp-2 border border-red-200">
                              🦠 {patient.disease}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Enhanced Treatment Date with EMI */}
                      <td className="py-4 px-3 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {patient.datepat ? (
                            <span className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-full border">
                              📅 {new Date(patient.datepat).toLocaleDateString('th-TH')}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">ไม่ระบุวันที่</span>
                          )}
                          {patient.emi && (
                            <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded font-mono border border-purple-200">
                              📡 EMI: {patient.emi}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Enhanced Action Buttons with Quick Actions */}
                      <td className="py-4 px-3">
                        <div className="flex flex-col gap-2 items-center">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditPopup(patient)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-xs font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-1"
                              title="แก้ไขข้อมูลผู้ป่วย"
                            >
                              ✏️ แก้ไข
                            </button>
                            <button
                              onClick={() => openDeletePopup(patient)}
                              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-xs font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-1"
                              title="ลบข้อมูลผู้ป่วย"
                            >
                              🗑️ ลบ
                            </button>
                          </div>
                          {/* Smart Quick Action Buttons */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                const patientInfo = `ข้อมูลผู้ป่วย:\nชื่อ: ${patient.namepat} ${patient.surnamepat}\nHN: ${patient.hn}\nแพทย์: ${patient.doctorpat}\nเบอร์: ${patient.phonepat || 'ไม่ระบุ'}\nสถานะ: ${patientStatus.status}`;
                                navigator.clipboard.writeText(patientInfo);
                                toast.success("คัดลอกข้อมูลผู้ป่วยแล้ว");
                              }}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                              title="คัดลอกข้อมูลผู้ป่วย"
                            >
                              📋
                            </button>
                            
                            {patient.phonepat && (
                              <button
                                onClick={() => window.open(`tel:${patient.phonepat}`, '_blank')}
                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                                title="โทรหาผู้ป่วย"
                              >
                                📞
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Modals */}
        <PatientEditModal
          showEditPopup={showEditPopup}
          selectedPatient={selectedPatient}
          editFormData={editFormData}
          handleFormChange={handleFormChange}
          handleUpdate={handleUpdate}
          closeEditPopup={closeEditPopup}
        />

        <PatientDeleteModal
          showDeletePopup={showDeletePopup}
          selectedPatient={selectedPatient}
          handleDelete={handleDelete}
          closeDeletePopup={closeDeletePopup}
        />
      </div>
    );
  };

  export default DataPat;
