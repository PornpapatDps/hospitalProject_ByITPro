import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaUserMd, FaHospital } from 'react-icons/fa';

import Logo from '../assets/logoNav.png';
import { UserContext } from './UserContext';

const LoginForm = () => {
  const { saveUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (input) => /^[\w.-]+@[\w.-]+\.\w+$/.test(input);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('กรุณากรอกทุกช่องให้ครบ');
      return;
    }

    if (!isValidEmail(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    if (password.length < 5) {
      setError('กรุณากรอกรหัสผ่านให้ถูกต้อง (อย่างน้อย 5 ตัว)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:4000/auth/login',
        { email, password },
        { withCredentials: true }
      );

      const { user, token } = res.data;

      // บันทึกข้อมูลด้วย saveUserData
      const userData = {
        isLoggedIn: true,
        email: user.email,
        role: user.role,
        name: user.name || user.email,
        id: user.id
      };

      // บันทึก token และข้อมูลผู้ใช้
      if (token) {
        localStorage.setItem('token', token);
      }
      
      saveUserData(userData);

      toast.success('เข้าสู่ระบบสำเร็จ');
      setShowPopup(true);
      setEmail('');
      setPassword('');
      setError('');
      setTimeout(() => {
        setShowPopup(false);
        navigate('/');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
              <img src={Logo} alt="Logo" className="w-16 h-16 rounded-full" />
            </div>
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <FaHospital className="text-2xl" />
              ระบบโรงพยาบาล
            </h1>
            <p className="text-blue-100 text-lg">สำหรับบุคลากรทางการแพทย์</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-blue-200">
              <FaUserMd />
              <span className="text-sm">เข้าสู่ระบบด้วยบัญชีแพทย์</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-700 text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-600">📧</span>
                อีเมลแพทย์
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                placeholder="กรอกอีเมลแพทย์"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-600">🔒</span>
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="กรอกรหัสผ่าน"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                <>
                  🔐 เข้าสู่ระบบ
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-600 mb-4">
                ยังไม่มีบัญชีแพทย์?
              </p>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
              >
                <FaUserMd />
                สมัครสมาชิกแพทย์
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-green-700">เข้าสู่ระบบสำเร็จ!</h2>
            <p className="text-gray-600 mb-6">ยินดีต้อนรับเข้าสู่ระบบโรงพยาบาล</p>
            <div className="animate-pulse text-blue-600">
              กำลังเข้าสู่หน้าหลัก...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
