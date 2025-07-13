import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  // State สำหรับข้อมูลผู้ใช้
  const [user, setUser] = useState({
    isLoggedIn: false,
    role: '',
    email: '',
    name: '',
    id: null
  });

  const [isLoading, setIsLoading] = useState(true);

  // ฟังก์ชันบันทึกข้อมูลผู้ใช้
  const saveUserData = (userData) => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // ฟังก์ชันโหลดข้อมูลจาก localStorage
  const loadUserData = () => {
    try {
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        setUser(userData);
        return true;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      localStorage.removeItem('userData');
    }
    return false;
  };

  // ฟังก์ชันออกจากระบบ
  const logout = () => {
    try {
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    setUser({
      isLoggedIn: false,
      role: '',
      email: '',
      name: '',
      id: null
    });
    
    toast.info('ออกจากระบบแล้ว');
  };

  // โหลดข้อมูลเมื่อแอพเริ่มต้น
  useEffect(() => {
    loadUserData();
    
    // ตั้ง loading เป็น false หลังจากตรวจสอบเสร็จ
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // รอสักครู่ให้โหลดข้อมูลเสร็จ

    return () => clearTimeout(timer);
  }, []);

  // ตั้งค่า axios
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      saveUserData,
      logout,
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
