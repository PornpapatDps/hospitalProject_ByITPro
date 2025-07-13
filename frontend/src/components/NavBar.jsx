import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/logoNav.png';
import { FaCaretDown, FaCaretUp, FaBars, FaTimes } from 'react-icons/fa';
import { UserContext } from './UserContext';

const NavBar = () => {
  const { user, logout } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      // เรียก API logout (optional)
      await axios.post('http://localhost:4000/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }

    // ใช้ logout function จาก UserContext
    logout();
    
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="w-screen bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg border-b border-blue-700">
      <div className="mx-[3rem] my-[1.4rem] flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
          <img src={Logo} alt="Logo" className="size-20 rounded-full shadow-md" />
          <div className="leading-tight">
            <h1 className="lg:text-xl md:text-md sm:text-lg font-bold text-white">🏥 ระบบจัดการโรงพยาบาล</h1>
            <p className="lg:text-lg md:text-md sm:text-md text-blue-200">Hospital Management System</p>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button className="lg:hidden duration-200 p-2 rounded-lg hover:bg-white/20" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center space-x-8 font-medium xl:text-lg lg:text-[15px]">
          <li><Link to="/" className="hover:text-blue-200 hover:underline transition-colors px-2 py-1">🏠 หน้าหลัก</Link></li>

          {user.isLoggedIn ? (
            <>
              <li className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-x-2 hover:text-blue-200 hover:underline transition-colors
                   bg-white/10 px-4 py-2 rounded-lg cursor-pointer "
                >
                  👥 จัดการผู้ป่วย {dropdownOpen ? <FaCaretUp /> : <FaCaretDown />}
                </button>
                {dropdownOpen && (
                  <ul className="absolute top-full left-0 mt-2 bg-white text-gray-700 rounded-lg 
                  shadow-xl py-2 min-w-[200px] z-50 border border-gray-200 ">
                    <li>
                      <Link to="/registerPat" className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        ➕ ลงทะเบียนผู้ป่วย
                      </Link>
                    </li>
                    <li>
                      <Link to="/dataPat" className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        📋 รายชื่อผู้ป่วย
                      </Link>
                    </li>
                    
                  </ul>
                )}
              </li>
              <li className="bg-white/10 px-3 py-2 rounded-lg">
                <span className="text-blue-200">👨‍⚕️ {user.name || user.email } ({user.role})</span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
                >
                  🚪 ออกจากระบบ
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg font-semibold">
                  🔐 เข้าสู่ระบบ
                </Link>
              </li>
              <li>
                <Link to="/signup" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-400 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg font-semibold">
                  📝 สมัครสมาชิก
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white px-[4rem] pt-4 pb-6 shadow-lg space-y-4 text-sm">
          <Link to="/" onClick={toggleMenu} className="block hover:text-[#424242]">หน้าหลัก</Link>
          <Link to="/Contact" onClick={toggleMenu} className="block hover:text-[#424242]">ติดต่อเรา</Link>

          {user.isLoggedIn ? (
            <>
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer">
                  <span>ผู้ป่วย</span>
                  <span>{dropdownOpen ? <FaCaretUp /> : <FaCaretDown />}</span>
                </summary>
                <div className="pl-4 mt-2 space-y-2">
                  <Link to="/registerPat" onClick={toggleMenu} className="block hover:text-[#424242]">
                    ลงทะเบียนผู้ป่วยใหม่
                  </Link>
                  <Link to="/dataPat" onClick={toggleMenu} className="block hover:text-[#424242]">
                    รายชื่อผู้ป่วย
                  </Link>
                </div>
              </details>
              <div>แพทย์: {user.name || user.email} ({user.role})</div>
              <button
                onClick={() => { handleLogout(); toggleMenu(); }}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMenu} className="block bg-[#2E7D32] text-white px-4 py-2 rounded-full hover:bg-[#C8E6C9] hover:text-[#2E7D32] transition">
                เข้าสู่ระบบ
              </Link>
              <Link to="/signup" onClick={toggleMenu} className="block bg-[#C8E6C9] text-green-800 px-4 py-2 rounded-full hover:bg-[#2E7D32] hover:text-white transition">
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
