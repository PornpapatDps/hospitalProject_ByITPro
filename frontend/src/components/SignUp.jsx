import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logoNav.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
      console.error(err);
    }
  };
  if (showPopup) {
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Logo" className="w-32 h-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-700">สถาบันโรคทรวงอก</h1>
          <h2 className="text-sm text-gray-500">National Heart Institute</h2>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 text-center mb-6">สมัครสมาชิก</h3>

        <label className="text-sm font-medium text-gray-600 mb-1">ตำแหน่ง</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="" disabled hidden>เลือกตำแหน่ง</option>
          <option value="แพทย์">แพทย์</option>
        </select>

        <label className="text-sm font-medium text-gray-600 mb-1">อีเมล</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <label className="text-sm font-medium text-gray-600 mb-1">รหัสผ่าน</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="รหัสผ่าน (5 หลักขึ้นไป)"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value.slice(0, 30))}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <label className="text-sm font-medium text-gray-600 mb-1">ยืนยันรหัสผ่าน</label>
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="ยืนยันรหัสผ่าน"
            value={userPasswordConfirm}
            onChange={(e) => setUserPasswordConfirm(e.target.value.slice(0, 30))}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-xl hover:bg-green-700 transition"
        >
          สมัครสมาชิก
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          มีบัญชีแล้ว?{' '}
          <Link to="/login" className="text-green-600 hover:underline">เข้าสู่ระบบ</Link>
        </p>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            <h2 className="text-lg font-bold text-green-700 mb-2">สมัครสมาชิกสำเร็จ!</h2>
            <p className="mb-4">ระบบได้บันทึกข้อมูลของคุณเรียบร้อยแล้ว</p>
            <Link to="/login">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-800 transition"
              >
                รับทราบ
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
