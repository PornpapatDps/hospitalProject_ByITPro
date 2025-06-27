import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import Logo from '../assets/logoNav.png';
import { UserContext } from './UserContext';

const LoginForm = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

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

    try {
      const res = await axios.post(
        'http://localhost:4000/auth/login',
        { email, password },
        { withCredentials: true }
      );

      const { user } = res.data;

      setUser({
        isLoggedIn: true,
        email: user.email,
        role: user.role,
      });

      toast.success('เข้าสู่ระบบสำเร็จ');
      setShowPopup(true);
      setEmail('');
      setPassword('');
      setError('');
      setTimeout(() => navigate('/'), 1500); // ไปหน้าหลักอัตโนมัติหลัง popup
    } catch (err) {
      const msg = err.response?.data?.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์';
      setError(msg);
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-3xl p-8 w-80 md:w-96 lg:w-1/3 flex flex-col items-center"
      >
        <div className="flex flex-col items-center mb-4">
          <img src={Logo} alt="Logo" className="mb-4 w-40 h-auto" />
          <h1 className="text-3xl font-bold text-green-800 mb-1">สถาบันโรคทรวงอก</h1>
          <h2 className="text-xl text-gray-600">National Heart Institute</h2>
        </div>

        <h1 className="text-2xl font-bold text-gray-700 mb-6">เข้าสู่ระบบ</h1>

        <label className="w-72 lg:w-80 mb-1 ml-5 text-gray-700 font-bold">อีเมล</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-600 hover:border-2 rounded-3xl px-4 mb-4 w-72 lg:w-80 h-12 focus:outline-orange-400 focus:bg-amber-100 placeholder-gray-500"
        />

        <label className="w-72 lg:w-80 mb-1 ml-5 text-gray-700 font-bold">รหัสผ่าน</label>
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-600 hover:border-2 rounded-3xl px-4 mb-4 w-72 lg:w-80 h-12 focus:outline-orange-400 focus:bg-amber-100 placeholder-gray-500"
        />

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 transition duration-300 cursor-pointer"
        >
          เข้าสู่ระบบ
        </button>

        <p className="mt-4 text-sm text-gray-600">
          ยังไม่มีบัญชี?{' '}
          <Link to="/signup" className="text-green-700 hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </form>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-2 text-green-700">เข้าสู่ระบบสำเร็จ!</h2>
            <p className="mb-4">ยินดีต้อนรับสู่สถาบันทรวงอก</p>
            <Link to="/">
              <button className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer">
                หน้าหลัก
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
