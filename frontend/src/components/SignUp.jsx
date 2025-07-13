import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logoNav.png';
import { FaEye, FaEyeSlash, FaUserMd, FaHospital, FaStethoscope } from 'react-icons/fa';
import { UserContext } from './UserContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const SignUp = () => {
  const { setUser } = useContext(UserContext);

  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (input) => /^[\w.-]+@[\w.-]+\.\w+$/.test(input);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || !email || !userPassword || !userPasswordConfirm) {
      setError('กรุณากรอกทุกช่องให้ครบ');
      return;
    }

    if (!isValidEmail(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    if (userPassword !== userPasswordConfirm) {
      setError('รหัสยืนยันไม่ตรงกับรหัสผ่าน');
      return;
    }

    if (userPassword.length < 5) {
      setError('รหัสผ่านต้องมีอย่างน้อย 5 หลัก');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:4000/auth/register', {
        email,
        password: userPassword,
        role,
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('✅ สมัครสมาชิกสำเร็จ');
      setShowPopup(true);
      setUser({
        isLoggedIn: true,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showPopup) {
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
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
            <p className="text-blue-100 text-lg">สมัครสมาชิกสำหรับแพทย์</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-blue-200">
              <FaStethoscope />
              <span className="text-sm">ลงทะเบียนบัญชีแพทย์ใหม่</span>
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
                <span className="text-blue-600">👨‍⚕️</span>
                ตำแหน่งทางการแพทย์
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                disabled={isLoading}
              >
                <option value="" disabled>เลือกตำแหน่งของท่าน</option>
                <option value="แพทย์">แพทย์</option>
                
              </select>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-600">📧</span>
                อีเมลทางการแพทย์
              </label>
              <input
                type="email"
                placeholder="doctor@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
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
                  placeholder="รหัสผ่าน (อย่างน้อย 5 หลัก)"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value.slice(0, 30))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-700 text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="text-blue-600">🔐</span>
                ยืนยันรหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  value={userPasswordConfirm}
                  onChange={(e) => setUserPasswordConfirm(e.target.value.slice(0, 30))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
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
                  กำลังสมัครสมาชิก...
                </>
              ) : (
                <>
                  <FaUserMd />
                  สมัครสมาชิกแพทย์
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-600 mb-4">
                มีบัญชีแพทย์แล้ว?
              </p>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
              >
                <FaStethoscope />
                เข้าสู่ระบบ
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
            <h2 className="text-2xl font-bold mb-3 text-green-700">สมัครสมาชิกสำเร็จ!</h2>
            <p className="text-gray-600 mb-6">ยินดีต้อนรับเข้าสู่ระบบโรงพยาบาล</p>
            <Link to="/login">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
              >
                เข้าสู่ระบบ
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
