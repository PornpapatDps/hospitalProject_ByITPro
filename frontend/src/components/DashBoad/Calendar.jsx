import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { RiCloseLargeFill } from 'react-icons/ri';
import { IoIosSave, IoMdPersonAdd } from 'react-icons/io';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// เพิ่ม CSS animations
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.4s ease-out;
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

const Calendar = () => {
  // เพิ่ม style element ไปใน DOM
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [popup, setPopup] = useState(false);
  const [formData, setFormData] = useState({
    hn: '',
    datetimeappoint: '',
    department: '',
    doctor: '',
    beforedoc: '',
    labresult: '',
    xrayresult: '',
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const fetchCalendarData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/hospital/appointments');
      const appointments = response.data.data.appointments || [];
      toast.success('ดึงข้อมูลนัดหมายสำเร็จ');
      const events = appointments.map(item => ({
        id: item.id,
        title: `นัด ${item.hn}`,
        date: item.datetimeappoint,
        extendedProps: {
          doctor: item.doctor,
          department: item.department,
          beforedoc: item.beforedoc,
          labresult: item.labresult,
          xrayresult: item.xrayresult,
        },
      }));
      setCalendarEvents(events);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast.error('ไม่สามารถดึงข้อมูลนัดหมายได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    if (!data.hn || !data.datetimeappoint) {
      toast.error('กรุณากรอกข้อมูล HN และ วันที่นัดหมาย');
      return;
    }

    try {
      await axios.post('http://localhost:4000/hospital/appointments', data);
      toast.success('บันทึกนัดหมายสำเร็จ');
      fetchCalendarData();
      setPopup(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/hospital/appointments/${selectedEvent.id}`, formData);
      toast.success('อัปเดตนัดหมายสำเร็จ');
      fetchCalendarData();
      setSelectedEvent(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('ไม่สามารถอัปเดตนัดหมายได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleEventClick = (info) => {
    const event = info.event;
    const extended = event.extendedProps;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      datetime: event.start.toISOString().slice(0, 16),
    });
    setFormData({
      hn: {hn: event.title.replace('นัด ', '')},
      datetimeappoint: event.start.toISOString().slice(0, 16),
      department: extended.department || '',
      doctor: extended.doctor || '',
      beforedoc: extended.beforedoc || '',
      labresult: extended.labresult || '',
      xrayresult: extended.xrayresult || '',
    });
    setIsEditing(false);
    toast.info('เปิดข้อมูลนัดหมาย');
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDeleteAppointment = async () => {
    if (!selectedEvent) return;
    try {
      await axios.delete(`http://localhost:4000/hospital/appointments/${selectedEvent.id}`);
      toast.success('ลบนัดหมายสำเร็จ');
      setSelectedEvent(null);
      setShowConfirmDelete(false);
      fetchCalendarData();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('ไม่สามารถลบนัดหมายได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ===================== HEADER SECTION ===================== */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-all duration-300">
                  <span className="text-3xl filter drop-shadow-lg">📅</span>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  ปฏิทินการรักษา
                </h1>
                <p className="text-gray-600 text-lg">จัดการและติดตามการนัดหมายคนไข้ด้วยระบบที่ทันสมัย</p>
              </div>
            </div>
            <button
              onClick={() => setPopup(true)}
              className="group relative bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-600 hover:via-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <IoMdPersonAdd size={24} className="relative z-10" />
              <span className="relative z-10 font-semibold">เพิ่มการนัดหมาย</span>
            </button>
          </div>
        </div>

        {/* ===================== CALENDAR SECTION ===================== */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-500">

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="th"
          events={calendarEvents}
          height="auto"
          eventClick={handleEventClick}
          headerToolbar={{ 
            left: 'prev,next today', 
            center: 'title', 
            right: 'dayGridMonth,dayGridWeek' 
          }}
          dayHeaderFormat={{ weekday: 'short' }}
          eventContent={(info) => (
            <div className="group relative bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl p-3 cursor-pointer hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="font-bold text-sm mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  {info.event.title}
                </div>
                <div className="text-xs text-blue-100 space-y-1">
                  <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
                    <span>👨‍⚕️</span>
                    <span className="truncate">{info.event.extendedProps.doctor}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
                    <span>🏥</span>
                    <span className="truncate">{info.event.extendedProps.department}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
                    <span>🕒</span>
                    <span>{new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          dayCellClassNames="hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-lg"
          dayHeaderClassNames="text-gray-700 font-semibold bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg"
        />
        </div>
        
        {/* ===================== ADD APPOINTMENT MODAL ===================== */}
        {popup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto transform animate-slideUp border border-white/20">
              <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white p-8 rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer"></div>
                <h2 className="text-2xl font-bold flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <IoMdPersonAdd size={20} />
                  </div>
                  เพิ่มการนัดหมาย
                </h2>
                <p className="text-green-100 mt-2 relative z-10">กรอกข้อมูลการนัดหมายใหม่</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Patient HN */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">🏥</span>
                    หมายเลขผู้ป่วย (HN)
                  </label>
                  <input
                    type="text"
                    name="hn"
                    value={formData.hn || ''}
                    onChange={handleChange}
                    placeholder="ระบุหมายเลขผู้ป่วย"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                    required
                  />
                </div>

                {/* Appointment Date */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">📅</span>
                    วันที่และเวลานัดหมาย
                  </label>
                  <input
                    type="datetime-local"
                    name="datetimeappoint"
                    value={formData.datetimeappoint || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                    required
                  />
                </div>

                {/* Department */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">🏥</span>
                    แผนก
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                    required
                  >
                    <option value="">เลือกแผนก</option>
                    <option value="เจาะเลือด">🩸 เจาะเลือด</option>
                    <option value="สูตินารี">👶 สูตินารี</option>
                    <option value="อายุรกรรม">👨‍⚕️ อายุรกรรม</option>
                    <option value="ศัลยกรรม">🔪 ศัลยกรรม</option>
                    <option value="กุมารเวชศาสตร์">🧸 กุมารเวชศาสตร์</option>
                  </select>
                </div>

                {/* Doctor */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">👨‍⚕️</span>
                    แพทย์ผู้รักษา
                  </label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                    required
                  >
                    <option value="">เลือกแพทย์ผู้รักษา</option>
                    <option value="หมอสมชาย">👨‍⚕️ หมอสมชาย</option>
                    <option value="หมอสมหญิง">👩‍⚕️ หมอสมหญิง</option>
                    <option value="หมอสมศักดิ์">👨‍⚕️ หมอสมศักดิ์</option>
                    <option value="หมอสมใจ">👩‍⚕️ หมอสมใจ</option>
                  </select>
                </div>

                {/* Before Doctor Instructions */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">📋</span>
                    คำแนะนำก่อนพบแพทย์
                  </label>
                  <textarea
                    name="beforedoc"
                    value={formData.beforedoc || ''}
                    onChange={handleChange}
                    placeholder="เช่น งดน้ำ งดอาหาร 8 ชั่วโมง"
                    rows="3"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                  />
                </div>

                {/* Lab Results */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">🧪</span>
                    ผลแลป
                  </label>
                  <input
                    type="text"
                    name="labresult"
                    value={formData.labresult || ''}
                    onChange={handleChange}
                    placeholder="ระบุผลการตรวจแลป"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                  />
                </div>

                {/* X-ray Results */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">📷</span>
                    ผล X-ray
                  </label>
                  <input
                    type="text"
                    name="xrayresult"
                    value={formData.xrayresult || ''}
                    onChange={handleChange}
                    placeholder="ระบุผลการตรวจ X-ray"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-8">
                  <button 
                    type="button" 
                    onClick={() => setPopup(false)} 
                    className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <RiCloseLargeFill /> ยกเลิก
                  </button>
                  <button 
                    type="submit" 
                    className="group relative px-8 py-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:via-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <IoIosSave className="relative z-10" /> 
                    <span className="relative z-10">บันทึก</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================== APPOINTMENT DETAILS MODAL ===================== */}
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto transform animate-slideUp border border-white/20">
              <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white p-8 rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer"></div>
                <h2 className="text-2xl font-bold flex items-center gap-3 relative z-10">
                  {isEditing ? (
                    <>
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <MdModeEdit size={20} />
                      </div>
                      แก้ไขการนัดหมาย
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📋</span>
                      </div>
                      รายละเอียดการนัดหมาย
                    </>
                  )}
                </h2>
                <p className="text-blue-100 mt-2 relative z-10">
                  {isEditing ? 'แก้ไขข้อมูลการนัดหมาย' : 'ดูข้อมูลการนัดหมาย'}
                </p>
              </div>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
                  {/* Patient HN */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">🏥</span>
                      หมายเลขผู้ป่วย (HN)
                    </label>
                    <input
                      type="text"
                      name="hn"
                      value={formData.hn}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                      required
                    />
                  </div>

                  {/* Appointment Date */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">📅</span>
                      วันที่และเวลานัดหมาย
                    </label>
                    <input
                      type="datetime-local"
                      name="datetimeappoint"
                      value={formData.datetimeappoint}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                      required
                    />
                  </div>

                  {/* Department */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">🏥</span>
                      แผนก
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                      required
                    >
                      <option value="">เลือกแผนก</option>
                      <option value="เจาะเลือด">🩸 เจาะเลือด</option>
                      <option value="สูตินารี">👶 สูตินารี</option>
                      <option value="อายุรกรรม">👨‍⚕️ อายุรกรรม</option>
                      <option value="ศัลยกรรม">🔪 ศัลยกรรม</option>
                      <option value="กุมารเวชศาสตร์">🧸 กุมารเวชศาสตร์</option>
                    </select>
                  </div>

                  {/* Doctor */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">👨‍⚕️</span>
                      แพทย์ผู้รักษา
                    </label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                      required
                    >
                      <option value="">เลือกแพทย์ผู้รักษา</option>
                      <option value="หมอสมชาย">👨‍⚕️ หมอสมชาย</option>
                      <option value="หมอสมหญิง">👩‍⚕️ หมอสมหญิง</option>
                      <option value="หมอสมศักดิ์">👨‍⚕️ หมอสมศักดิ์</option>
                      <option value="หมอสมใจ">👩‍⚕️ หมอสมใจ</option>
                    </select>
                  </div>

                  {/* Before Doctor Instructions */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">📋</span>
                      คำแนะนำก่อนพบแพทย์
                    </label>
                    <textarea
                      name="beforedoc"
                      value={formData.beforedoc}
                      onChange={handleChange}
                      placeholder="เช่น งดน้ำ งดอาหาร 8 ชั่วโมง"
                      rows="3"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                    />
                  </div>

                  {/* Lab Results */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">🧪</span>
                      ผลแลป
                    </label>
                    <input
                      type="text"
                      name="labresult"
                      value={formData.labresult}
                      onChange={handleChange}
                      placeholder="ระบุผลการตรวจแลป"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                    />
                  </div>

                  {/* X-ray Results */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs">📷</span>
                      ผล X-ray
                    </label>
                    <input
                      type="text"
                      name="xrayresult"
                      value={formData.xrayresult}
                      onChange={handleChange}
                      placeholder="ระบุผลการตรวจ X-ray"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm hover:bg-white group-hover:border-gray-300"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-8">
                    <button 
                      type="button" 
                      onClick={() => setSelectedEvent(null)} 
                      className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <RiCloseLargeFill /> ยกเลิก
                    </button>
                    <button 
                      type="submit" 
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <IoIosSave className="relative z-10" />
                      <span className="relative z-10">บันทึก</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-100">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">🏥</span>
                            <span className="text-sm font-medium text-gray-600">หมายเลขผู้ป่วย</span>
                          </div>
                          <span className="text-lg font-bold text-gray-800">{formData.hn}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">📅</span>
                            <span className="text-sm font-medium text-gray-600">วันที่และเวลา</span>
                          </div>
                          <span className="text-gray-800 font-semibold">{new Date(formData.datetimeappoint).toLocaleString('th-TH')}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">🏥</span>
                            <span className="text-sm font-medium text-gray-600">แผนก</span>
                          </div>
                          <span className="text-gray-800 font-semibold">{formData.department}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">👨‍⚕️</span>
                            <span className="text-sm font-medium text-gray-600">แพทย์ผู้รักษา</span>
                          </div>
                          <span className="text-gray-800 font-semibold">{formData.doctor}</span>
                        </div>
                      </div>
                    </div>

                    {(formData.beforedoc || formData.labresult || formData.xrayresult) && (
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs">ℹ️</span>
                          ข้อมูลเพิ่มเติม
                        </h3>
                        <div className="space-y-3">
                          {formData.beforedoc && (
                            <div className="p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-xs">📋</span>
                                <span className="text-sm font-semibold text-gray-700">คำแนะนำก่อนพบแพทย์</span>
                              </div>
                              <p className="text-gray-800 ml-8">{formData.beforedoc}</p>
                            </div>
                          )}
                          {formData.labresult && (
                            <div className="p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs">🧪</span>
                                <span className="text-sm font-semibold text-gray-700">ผลแลป</span>
                              </div>
                              <p className="text-gray-800 ml-8">{formData.labresult}</p>
                            </div>
                          )}
                          {formData.xrayresult && (
                            <div className="p-4 bg-white/60 rounded-xl backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs">📷</span>
                                <span className="text-sm font-semibold text-gray-700">ผล X-ray</span>
                              </div>
                              <p className="text-gray-800 ml-8">{formData.xrayresult}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-8">
                    <button 
                      onClick={() => setSelectedEvent(null)} 
                      className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <RiCloseLargeFill /> ปิด
                    </button>
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:via-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <MdModeEdit className="relative z-10" />
                      <span className="relative z-10">แก้ไข</span>
                    </button>
                    <button 
                      onClick={() => setShowConfirmDelete(true)} 
                      className="group relative px-8 py-4 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white rounded-xl hover:from-red-600 hover:via-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <MdDelete className="relative z-10" />
                      <span className="relative z-10">ลบ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== DELETE CONFIRMATION MODAL ===================== */}
        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md mx-4 transform animate-slideUp border border-white/20">
              <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white p-8 rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer"></div>
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MdDelete className="text-red-600 text-4xl" />
                  </div>
                  <h2 className="text-2xl font-bold">ยืนยันการลบ</h2>
                  <p className="text-red-100 mt-2">การกระทำนี้ไม่สามารถกลับคืนได้</p>
                </div>
              </div>
              
              <div className="p-8 text-center">
                <div className="mb-8">
                  <p className="text-gray-700 text-lg mb-4">
                    คุณแน่ใจหรือไม่ว่าต้องการลบการนัดหมาย?
                  </p>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white">🏥</span>
                      <span className="font-bold text-red-800 text-xl">ผู้ป่วย {formData.hn}</span>
                    </div>
                    <div className="text-sm text-red-700">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span>📅</span>
                        <span>{new Date(formData.datetimeappoint).toLocaleString('th-TH')}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span>👨‍⚕️</span>
                        <span>{formData.doctor} | {formData.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <RiCloseLargeFill />
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleDeleteAppointment}
                    className="group relative px-8 py-4 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white rounded-xl hover:from-red-600 hover:via-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <MdDelete className="relative z-10" />
                    <span className="relative z-10">ลบการนัดหมาย</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
