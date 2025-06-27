import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { RiCloseLargeFill } from 'react-icons/ri';
import { IoIosSave, IoMdPersonAdd } from 'react-icons/io';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Calendar = () => {
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
      hn: event.title.replace('นัด ', ''),
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
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">ปฏิทินการรักษา</h1>
        <p className="text-gray-600 mb-6">แสดงตารางการรักษาคนไข้ในแต่ละวัน</p>
        <button
          onClick={() => setPopup(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 flex gap-2 items-center"
        >
          <IoMdPersonAdd size={20} /> เพิ่มการนัดหมาย
        </button>

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="th"
          events={calendarEvents}
          height="auto"
          eventClick={handleEventClick}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
          dayHeaderFormat={{ weekday: 'short' }}
          eventContent={(info) => (
            <div className="text-xs px-1 py-0.5 bg-blue-500 text-white rounded">
              {info.event.title}
              <div className="text-xs text-gray-200">
                {info.event.extendedProps.doctor} - {info.event.extendedProps.department}
              </div>
              <div className="text-xs text-gray-200">
                {new Date(info.event.start).toLocaleDateString()} {new Date(info.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
        />
        {/* popup การเพิ่ม */}
        {popup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800/80 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">เพิ่มการนัดหมาย</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* INPUT FIELDs HN & วันที่ */}
                {[{ label: 'HN', name: 'hn', type: 'text' }, { label: 'วันที่นัดหมาย', name: 'datetimeappoint', type: 'datetime-local' }].map((field, index) => (
                  <div key={index} className="">
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}

                {/* SELECT: แผนก */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">เลือกแผนก</option>
                    <option value="เจาะเลือด">เจาะเลือด</option>
                    <option value="สูตินารี">สูตินารี</option>
                    <option value="อายุรกรรม">อายุรกรรม</option>
                  </select>
                </div>

                {/* SELECT: แพทย์ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">แพทย์ผู้รักษา</label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">เลือกแพทย์ผู้รักษา</option>
                    <option value="หมอสมชาย">หมอสมชาย</option>
                    <option value="หมอสมหญิง">หมอสมหญิง</option>
                    <option value="หมอสมศักดิ์">หมอสมศักดิ์</option>
                  </select>
                </div>

                {/* TEXT FIELDS อื่นๆ */}
                {[{ label: 'คำแนะนำก่อนพบแพทย์', name: 'beforedoc' }, { label: 'ผลแลป', name: 'labresult' }, { label: 'ผล X-ray', name: 'xrayresult' }].map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}

                {/* BUTTONS */}
                <div className="flex justify-between pt-4">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1">
                    <IoIosSave /> บันทึก
                  </button>
                  <button type="button" onClick={() => setPopup(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-1">
                    <RiCloseLargeFill /> ปิด
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* POPUP แสดงหรือแก้ไขรายละเอียด */}
        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? 'แก้ไขการนัดหมาย' : 'รายละเอียดการนัดหมาย'}
              </h2>

              {isEditing ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="space-y-4">

                    {/* ⬅️ INPUT FIELDS ชุดแรก */}
                    {[
                      { label: 'HN', name: 'hn', type: 'text', placeholder: 'รหัสคนไข้' },
                      { label: 'วันที่นัดหมาย', name: 'datetimeappoint', type: 'datetime-local' },
                    ].map((field, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    ))}
                    {/* ⬅️ SELECT FIELD (แยกต่างหาก ไม่รวมกับ .map()) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">แพทย์ผู้รักษา</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">เลือกแผนก</option>
                        <option value="เจาะเลือด">เจาะเลือด</option>
                        <option value="สูตินารี">สูตินารี</option>
                        <option value="อายุรกรรม">อายุรกรรม</option>
                      </select>

                      <label className="block text-sm font-medium text-gray-700 mb-1">แพทย์ผู้รักษา</label>
                      <select
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">เลือกแพทย์ผู้รักษา</option>
                        <option value="หมอสมชาย">หมอสมชาย</option>
                        <option value="หมอสมหญิง">หมอสมหญิง</option>
                        <option value="หมอสมศักดิ์">หมอสมศักดิ์</option>
                      </select>
                    </div>

                    {/* ⬅️ FIELDS ที่เหลือ */}
                    {[
                      { label: 'คำแนะนำก่อนพบแพทย์', name: 'beforedoc', type: 'text', placeholder: 'เช่น งดน้ำ งดอาหาร' },
                      { label: 'ผลแลป', name: 'labresult', type: 'text', placeholder: 'ระบุผลแลป' },
                      { label: 'ผล X-ray', name: 'xrayresult', type: 'text', placeholder: 'ระบุผล X-ray' },
                    ].map((field, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}

                  </div>

                  {/* ปุ่มด้านล่าง */}
                  <div className="flex justify-end gap-3 mt-8">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1">
                      <IoIosSave />
                      บันทึก
                    </button>
                    <button type="button" onClick={() => setSelectedEvent(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-1">
                      <RiCloseLargeFill />
                      ปิด
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-800 mb-4">
                    <div className="font-medium">HN:</div><div>{formData.hn}</div>
                    <div className="font-medium">วันเวลา:</div><div>{new Date(formData.datetimeappoint).toLocaleString()}</div>
                    <div className="font-medium">แผนก:</div><div>{formData.department}</div>
                    <div className="font-medium">แพทย์:</div><div>{formData.doctor}</div>
                    <div className="font-medium">คำแนะนำ:</div><div>{formData.beforedoc || '-'}</div>
                    <div className="font-medium">Lab:</div><div>{formData.labresult || '-'}</div>
                    <div className="font-medium">X-ray:</div><div>{formData.xrayresult || '-'}</div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditing(true)} className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500">
                      <MdModeEdit />
                    </button>
                    <button onClick={handleDeleteAppointment} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      <MdDelete />
                    </button>
                    <button onClick={() => setSelectedEvent(null)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                      <RiCloseLargeFill />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

       
        {/* ยืนยันการลบ */}
        {showConfirmDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm text-center">
              {/* ไอคอนคำเตือน */}
              <div className="flex justify-center mb-3">
                <div className="bg-red-100 p-3 rounded-full">
                  <MdDelete className="text-red-600 text-3xl" />
                </div>
              </div>

              {/* หัวข้อและข้อความ */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">ยืนยันการลบ</h2>
              <p className="text-sm text-gray-600 mb-6">
                คุณแน่ใจหรือไม่ว่าต้องการลบนัดหมายของ <span className="text-red-600 font-medium">{formData.hn}</span>?
              </p>

              {/* ปุ่มลบและยกเลิก */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteAppointment}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-1"
                >
                  <MdDelete className="text-lg" />
                  ลบ
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Calendar;
