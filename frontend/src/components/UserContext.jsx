import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const API = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState({
    isLoggedIn: false,
    role: '',
    email: '',
  });

  const [tokenExpired, setTokenExpired] = useState(false);
  const [showExtendSession, setShowExtendSession] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // ตรวจสอบว่า token ใช้งานได้ไหม
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API}/auth/verifyToken`);
        const userData = res.data.user;
        setUser({
          isLoggedIn: true,
          email: userData.email,
          role: userData.role,
        });
      } catch (err) {
        if (err.response?.data?.message === 'TokenExpired') {
          logout(); // หมดอายุแล้ว ออกทันที
        }
      }
    };

    checkAuth();
  }, [API]);

  // ตรวจสอบ token ใกล้หมดอายุ (ทุก 30 วินาที)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API}/auth/token-exp`);
        const expireTime = res.data.exp * 1000;
        const now = Date.now();
        const remaining = expireTime - now;

        if (remaining <= 0) {
          toast.error('หมดเวลาใช้งาน');
          logout();
        } else if (remaining < 2 * 60 * 1000) {
          setShowExtendSession(true); // ใกล้หมด
        } else {
          setShowExtendSession(false);
        }
      } catch (err) {
        console.error('เช็ค token หมดอายุล้มเหลว:', err);
      }
    }, 30000); // ทุก 30 วิ

    return () => clearInterval(interval);
  }, [API]);

  // ออกจากระบบ
  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser({ isLoggedIn: false, email: '', role: '' });
    setTokenExpired(false);
    setShowExtendSession(false);
    window.location.href = '/login';
  };

  // ต่ออายุ session
  const extendSession = async () => {
    try {
      await axios.post(`${API}/auth/refresh-token`);
      toast.success('ต่ออายุเรียบร้อยแล้ว');
      setShowExtendSession(false);
    } catch (err) {
      toast.error('ต่ออายุไม่สำเร็จ');
      logout();
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}

      {/* Popup: ใกล้หมดอายุ */}
      {showExtendSession && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">เซสชันใกล้หมดอายุ</h2>
            <p className="mb-4">คุณต้องการต่ออายุการใช้งานหรือไม่?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={extendSession}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ต่ออายุ
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </UserContext.Provider>
  );
};

export default UserProvider;
