import React from 'react';
import Logo from '../assets/logoNav.png'; // โลโก้เดียวกับ Navbar
import { FaHospital, FaShieldAlt  } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';


const Footer = () => {
  return (
    
   <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Hospital Info with Trust Indicators */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <FaHospital className="text-3xl text-blue-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">ระบบจัดการโรงพยาบาล</h3>
                  <p className="text-blue-200 text-sm">Professional Medical Platform</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                แพลตฟอร์มดิจิทัลที่ออกแบบมาเฉพาะสำหรับบุคลากรทางการแพทย์ 
                เพื่อเพิ่มประสิทธิภาพในการดูแลผู้ป่วยด้วยเทคโนโลยีที่ทันสมัย
              </p>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <FaShieldAlt className="text-green-400" />
                    <span className="text-sm font-semibold">ISO 27001</span>
                  </div>
                  <p className="text-xs text-gray-300">ความปลอดภัยข้อมูล</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <MdSecurity className="text-blue-400" />
                    <span className="text-sm font-semibold">HIPAA Compliant</span>
                  </div>
                  <p className="text-xs text-gray-300">มาตรฐานสากล</p>
                </div>
              </div>
            </div>

            {/* Quick Links with Categories */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-blue-300 flex items-center gap-2">
                <span>🔗</span> ลิงก์ด่วน
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-blue-200 mb-2">สำหรับแพทย์</h5>
                  <div className="space-y-1 text-sm">
                    <a href="/" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-200">📖 คู่มือการใช้งาน</a>
                    <a href="/" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-200">� โปรโตคอลการรักษา</a>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-blue-200 mb-2">สนับสนุน</h5>
                  <div className="space-y-1 text-sm">
                    <a href="/" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-200">�️ ฝ่ายสนับสนุน 24/7</a>
                    <a href="/" className="block text-gray-300 hover:text-white transition-colors hover:translate-x-1 duration-200">🎓 การอบรมออนไลน์</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Performance Stats */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-green-300 flex items-center gap-2">
                <span>🛡️</span> ความปลอดภัย
              </h4>
              <div className="space-y-4">
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">Uptime</span>
                    <span className="text-green-400 font-bold">99.9%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '99.9%'}}></div>
                  </div>
                </div>
                
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">Response Time</span>
                    <span className="text-blue-400 font-bold">&lt;300ms</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400">All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <div className="text-sm text-gray-400 mb-2">
                  © 2024 ระบบจัดการโรงพยาบาล. สงวนลิขสิทธิ์.
                </div>
                <div className="text-xs text-gray-500">
                  Developed with ❤️ for Healthcare Professionals
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-400/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">ระบบออนไลน์</span>
                </div>
                <div className="text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  เวอร์ชัน 2.1.0
                </div>
                <div className="text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  ผู้ใช้งานทั้งหมด: 1,234 คน
                </div>
                <div className="text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  หมอออนไลน์: 45 คน
                </div>
              </div>
            </div>
            
            {/* Additional Trust Elements */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-4 bg-white/5 rounded-full px-6 py-2 border border-white/10">
                <span className="text-xs text-gray-400">Powered by</span>
                <div className="flex items-center gap-2 text-xs text-blue-300">
                  <span>🔒 AWS Security</span>
                  <span>•</span>
                  <span>⚡ CloudFlare CDN</span>
                  <span>•</span>
                  <span>🛡️ End-to-End Encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
