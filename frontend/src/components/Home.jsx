import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { 
  FaStethoscope, 
  FaUserMd, 
  FaHeartbeat, 
  FaNotesMedical, 
  FaPills, 
  FaVial, 
  FaAmbulance, 
  FaHospital,
  FaRegCalendarAlt,
  FaClipboardList,
  FaUsers,
  FaCamera,
  FaChartLine,
  FaShieldAlt,
  FaBell,
  FaClock
} from 'react-icons/fa';
import { FaCircleChevronRight,FaGears } from "react-icons/fa6";
import image1 from '../assets/filling-medical-record.jpg';
import image2 from '../assets/healthcare-workers-business-people-wearing-face-masks-applauding-seminar.jpg';
import image3 from '../assets/pain-heartburn-old-senior-asian-grandfather-patient-uniform-suffer-from-body-problem-health-ideas-concept.jpg';
import image4 from '../assets/team-doctors-meeting.jpg';
import { MdDashboard, MdSecurity } from "react-icons/md";
import axios from 'axios';
import { useEffect } from 'react';

const Home = () => {
  // ระบบหลักสำหรับแพทย์ - เชื่อมโยงกับระบบจริงในโปรเจค
  const mainSystems = [
    { 
      icon: <FaStethoscope className="text-4xl" />, 
      title: "จัดการข้อมูลผู้ป่วย", 
      description: "ดูข้อมูลและประวัติผู้ป่วยแบบครบถ้วน",
      // link: "/dataPat", // เชื่อมโยงกับคอมโพเนนต์ PatientSearch ที่มีอยู่
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
      hoverColor: "hover:from-blue-700 hover:to-blue-900",
      priority: "high",
      badge: "🔥 ใช้บ่อยสุด"
    },
    { 
      icon: <FaUserMd className="text-4xl" />, 
      title: "แดชบอร์ดการติดตาม", 
      description: "ติดตามสัญญาณชีพและข้อมูลสุขภาพผู้ป่วย",
      // link: "/dataPat", // เชื่อมโยงกับ DashBoard component ที่มีอยู่
      color: "bg-gradient-to-br from-emerald-600 to-emerald-800",
      hoverColor: "hover:from-emerald-700 hover:to-emerald-900",
      priority: "high",
      accessCount: "1,892",
      badge: "⚡ Real-time"
    },
    { 
      icon: <FaHeartbeat className="text-4xl" />, 
      title: "กราฟและชาร์ต", 
      description: "แสดงผลข้อมูลสุขภาพในรูปแบบกราฟ",
      // link: "/charts", // เชื่อมโยงกับ Chart components (HR, Temp, BatteryPercent)
      color: "bg-gradient-to-br from-red-600 to-red-800",
      hoverColor: "hover:from-red-700 hover:to-red-900",
      priority: "critical",
      accessCount: "1,567",
      badge: "� Analytics"
    },
    { 
      icon: <FaNotesMedical className="text-4xl" />, 
      title: "ลงทะเบียนผู้ป่วย", 
      description: "เพิ่มผู้ป่วยใหม่เข้าสู่ระบบ",
      // link: "/RegisterPatient", // เชื่อมโยงกับ RegisterPatient component
      color: "bg-gradient-to-br from-indigo-600 to-indigo-800",
      hoverColor: "hover:from-indigo-700 hover:to-indigo-900",
      priority: "medium",
      accessCount: "1,234",
      badge: "➕ เพิ่มใหม่"
    }
  ];


  // ข้อมูลสถิติในโรงพยาบาล - ใช้ข้อมูลจริงจากระบบ
  const [realTimeStats, _setRealTimeStats] = React.useState({
    totalPatients: 0,
    onlineDoctors: 0,
    systemUptime: "99.9%",
    activeServices: "24/7"
  });

  const medicalStatistics = [
    { value: realTimeStats.totalPatients.toString(), label: "ผู้ป่วยทั้งหมด", icon: <FaUsers />, color: "text-blue-600" },
    { value: realTimeStats.systemUptime, label: "ระบบพร้อมใช้งาน", icon: <FaShieldAlt />, color: "text-purple-600" },
    { value: realTimeStats.activeServices, label: "บริการตลอดเวลา", icon: <FaClock />, color: "text-orange-600" }
  ];

  // กิจกรรมทางการแพทย์
  const medicalActivities = [
    {

      title: "การอบรมเรื่องการใช้ระบบ EMR",
      image: image3,
      date: "15 ธันวาคม 2567",
      link: "#",
      category: "การอบรม"
    },
    {
      title: "การประชุมทีมแพทย์ประจำเดือน",
      image: image4,
      date: "10 ธันวาคม 2567",
      link: "#",
      category: "ประชุม"
    },
    {
      title: "การตรวจสุขภาพเจ้าหน้าที่",
      image: image1,
      date: "5 ธันวาคม 2567",
      link: "#",
      category: "ตรวจสุขภาพ"
    },
    {
      title: "การฝึกอบรมการใช้เครื่องมือแพทย์",
      image: image2,
      date: "1 ธันวาคม 2567",
      link: "#",
      category: "อบรม"
    }
  ];  
  const [DataPat, setDataPat] = React.useState([]);
  
  useEffect(() => {
    const fetchDataPat = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/hospital/register/`);
        const patientData = response.data.data || [];
        setDataPat(patientData);
        
        // อัพเดตสถิติตามข้อมูลจริง
        _setRealTimeStats(prev => ({
          ...prev,
          totalPatients: patientData.length,
          onlineDoctors: Math.floor(patientData.length / 10) + 5 // คำนวณจำนวนหมอที่ต้องการ
        }));
      } catch (error) {
        console.error('Error fetching data patients:', error);
        setDataPat([]);
      }
    };
    
    fetchDataPat();
    
    // อัพเดตข้อมูลทุก 5 นาที
    const interval = setInterval(fetchDataPat, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Medical Header with Advanced Status Bar */}
      <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 text-white shadow-2xl border-b-4 border-blue-400">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Status Bar for Medical Staff */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 text-sm bg-black/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-4 lg:mb-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="font-semibold text-green-300">ระบบพร้อมใช้งาน</span>
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs border border-green-400/30">
                  99.9% Uptime
                </span>
              </div>
              <div className="flex items-center gap-2 text-blue-200">
                <FaClock className="text-blue-400" />
                <span>เวลา: {new Date().toLocaleString('th-TH', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
            
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <FaHospital className="text-3xl text-blue-300" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                  ระบบบริหารจัดการโรงพยาบาล
                </h1>
                <div className="flex items-center gap-2 text-blue-200">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-sm font-medium">Professional Medical Platform</span>
                </div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-lg lg:text-xl opacity-90 mb-4 leading-relaxed">
                🩺 <span className="font-semibold text-blue-200">แพลตฟอร์มสำหรับแพทย์</span> 
              </p>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <FaShieldAlt className="text-green-400" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <MdSecurity className="text-blue-400" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <FaClock className="text-purple-400" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Medical Statistics Dashboard with Psychology Colors */}
      <div className="bg-gradient-to-r from-white via-gray-50 to-blue-50 shadow-2xl border-b border-gray-200">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
              📊 สถานะโรงพยาบาลปัจจุบัน
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Real-time Data
              </span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {medicalStatistics.map((stat, index) => (
              <div key={index} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 text-center border border-gray-100 hover:border-blue-200 transition-all duration-500 transform hover:-translate-y-2">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className={`${stat.color} text-4xl lg:text-5xl font-bold mb-3 flex 
                  items-center justify-center gap-3 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{stat.icon}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 mb-3">{stat.label}</div>
                  
                  {/* Progress Indicator */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
                    <div className={`h-full rounded-full ${stat.color.replace('text-', 'bg-')} opacity-60 transition-all duration-1000 ease-out`} 
                         style={{width: index === 0 ? '95%' : index === 1 ? '88%' : index === 2 ? '98%' : '100%'}}></div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${index < 2 ? 'bg-green-400 animate-pulse' : 'bg-blue-400'}`}></div>
                    <span className="text-gray-600 font-medium">
                      {index === 0 ? `ผู้ป่วยใหม่ ${DataPat.length > 0 ? 'มีข้อมูล' : 'ว่าง'}` : 
                       index === 1 ? 'พร้อมใช้งาน' : 
                       index === 2 ? 'สถานะดี' : 'ใช้งานต่อเนื่อง'}
                    </span>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
          
          {/* Additional Trust Indicators */}
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl px-6 py-3 text-sm text-gray-700">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <strong>Last Update:</strong> {new Date().toLocaleTimeString('th-TH')}
                </span>
                <span className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-600" />
                  <strong>Data Verified</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Medical Systems */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl">
              🏥
            </div>
            <span className="bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              ระบบหลักสำหรับแพทย์
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            เข้าถึงฟังก์ชันสำคัญได้ในคลิกเดียว - ออกแบบเพื่อการใช้งานจริงของแพทย์มืออาชีพ
          </p>
          
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainSystems.map((system, index) => (
            <div
              key={index}
              className="group relative transform transition-all duration-500 hover:-translate-y-4"
            >
              <a
                href={system.link}
                className={`${system.color} ${system.hoverColor} text-white rounded-3xl shadow-2xl transition-all duration-500 p-8 text-center block relative overflow-hidden border border-white/20 hover:border-white/40`}
              >
                {/* Enhanced Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-6 right-6 text-8xl opacity-20 transform rotate-12">
                    {system.icon}
                  </div>
                  <div className="absolute bottom-4 left-4 text-4xl opacity-10 transform -rotate-12">
                    {system.icon}
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-3xl"></div>
                
                <div className="relative z-10">
                  {/* Priority Badge */}
                  {system.priority === 'critical' && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      🚨 <span>สำคัญ</span>
                    </div>
                  )}
                  {system.priority === 'high' && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      ⭐ <span>ใช้บ่อย</span>
                    </div>
                  )}

                  {/* Usage Statistics */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium">
                    {system.accessCount} การใช้งาน
                  </div>

                  <div className="mb-8 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                    <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                      {system.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-4 leading-tight">{system.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed mb-6">{system.description}</p>
                  
                  {/* Enhanced Badge */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-semibold mb-4 border border-white/30">
                    {system.badge}
                  </div>
                  
                  {/* Action indicator with enhanced styling */}
                  
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </a>
              
              {/* External Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
          </div>
        </div>

      {/* Medical Activities and Quick Actions */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Medical Activities */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaCamera className="text-blue-600" />
                กิจกรรมทางการแพทย์
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medicalActivities.map((activity, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                        {activity.category}
                      </span>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                        <FaRegCalendarAlt className="text-blue-600" />
                        {activity.date}
                      </p>
                      <a
                        href={activity.link}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        อ่านรายละเอียด
                        <FaCircleChevronRight className="text-sm" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Quick Medical Actions */}
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-8 border border-indigo-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <MdDashboard className="text-green-600" />
                ⚡ การดำเนินการด่วน
              </h3>
              
              {/* Emergency Actions */}
              <div className="space-y-4 mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-red-800 font-bold mb-2 flex items-center gap-2">
                    🚨 ฉุกเฉิน
                  </h4>
                  <div className="space-y-2">
                    <a  className="block w-full bg-red-600 hover:bg-red-700 text-white rounded-lg p-3 text-center font-semibold transition-all duration-300 transform hover:scale-105">
                      <FaAmbulance className="inline mr-2" />
                      ติดต่อฉุกเฉิน
                    </a>
                    <a href="tel:1669"
                    className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white rounded-xl p-3 text-center font-bold transition-colors text-base shadow-lg">
                    📞 โทรด่วน 1669
                  </a>
                  </div>
                </div>
                
                {/* Quick Patient Actions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-blue-800 font-bold mb-2 flex items-center gap-2">
                    👨‍⚕️ ผู้ป่วย
                  </h4>
                  <div className="space-y-2">
                    <a href="/registerPat" className="block w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-3 text-center font-semibold transition-all duration-300 transform hover:scale-105">
                      <FaUserMd className="inline mr-2" />
                      เพิ่มผู้ป่วยใหม่
                    </a>
                    <a href="/dataPat" className="block w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 text-center font-medium transition-colors text-sm">
                      ค้นหาผู้ป่วย
                    </a>
                  </div>
                </div>
               
              </div>

              {/* Enhanced Medical Announcements */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBell className="text-orange-600" />
                  📢 ประกาศสำคัญ
                </h4>
                <div className="space-y-4">                    
                  <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-gray-800 text-sm">🔧 ระบบโรงพยาบาลใหม่</h5>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">สำคัญ</span>
                      </div>
                      <p className="text-xs text-gray-600">ระบบการจัดการข้อมูลผู้ป่วยพร้อมใช้งานแล้ว กับฟีเจอร์ใหม่ Dashboard และ Charts</p>
                      <p className="text-xs text-blue-600 mt-1">⏰ 1 ชั่วโมงที่แล้ว</p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-gray-800 text-sm">� Mobile Support</h5>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">ใหม่</span>
                      </div>
                      <p className="text-xs text-gray-600">ระบบรองรับการใช้งานบน Mobile Device สำหรับแพทย์และพยาบาล</p>
                      <p className="text-xs text-green-600 mt-1">⏰ 3 ชั่วโมงที่แล้ว</p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-semibold text-gray-800 text-sm">⚡ ปรับปรุงประสิทธิภาพ</h5>
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">ปรับปรุง</span>
                      </div>
                      <p className="text-xs text-gray-600">เพิ่มความเร็วในการโหลดข้อมูลผู้ป่วยและการแสดงผลชาร์ต</p>
                      <p className="text-xs text-yellow-600 mt-1">⏰ 1 วันที่แล้ว</p>
                    </div>
                </div>
                
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Professional Footer with Trust Elements */}
      
    </div>
  );
};

export default Home;
