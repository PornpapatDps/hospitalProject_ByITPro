import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {
  FaUserInjured,
  FaChartPie,
  FaPlus,
  FaCalendarAlt,
  FaNotesMedical,
  FaStethoscope,
  FaHeartbeat,
  FaUserMd,
  FaPrescriptionBottleAlt,
  FaBell,
  FaShieldAlt,
} from 'react-icons/fa';
import { FiLogOut, FiMenu, FiActivity } from 'react-icons/fi';
import { MdDashboard, MdBiotech, MdHealthAndSafety } from 'react-icons/md';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Logo from '../assets/logoNav.png';

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  document.head.appendChild(styleSheet);
}

const SidebarDash = ({ collapsed, setCollapsed }) => {
  const { hn } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || '';
  const location = useLocation();

  const menuItems = [
    {
      icon: <FaUserMd className="text-lg" />,
      label: 'ข้อมูลผู้ป่วย',
      path: `/patient/${hn}/`,
      subtitle: 'Patient Information',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: <MdDashboard className="text-lg" />,
      label: 'Medical Dashboard',
      path: `/patient/${hn}/DashBoard`,
      subtitle: 'Real-time Monitoring',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: <FaStethoscope className="text-lg" />,
      label: 'เพิ่มข้อมูลการรักษา',
      path: `/patient/${hn}/AddData`,
      subtitle: 'Add Medical Data',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: <FaCalendarAlt className="text-lg" />,
      label: 'ปฏิทินการรักษา',
      path: `/patient/${hn}/Calendar`,
      subtitle: 'Treatment Schedule',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    
  ];

  const handleLogout = () => {
    navigate('/dataPat');
  };

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="#FFFFFF"
      className="medical-sidebar"
      style={{
        height: 'full',
        width: collapsed ? '120px' : '320px',
        borderRight: '2px solid #E5E7EB',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        borderRadius: '0 16px 16px 0',
        fontFamily: 'Kanit ',
      }}
    >
      {/* Professional Medical Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 
          -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 
          translate-y-12"></div>
        </div>
        
        {/* Toggle Button */}
        <div className="flex justify-between items-center px-6 py-4 relative z-10">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-blue-200" />
              <span className="text-sm font-medium text-blue-100">Hospital Management</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:text-blue-200 transition-all duration-200 p-3 rounded-xl hover:bg-white hover:bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20"
          >
            <FiMenu className="text-xl" />
          </button>
        </div>

        {/* Professional Logo & Doctor Info */}
        <div className="px-6 pb-6 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <img src={Logo} alt="Hospital Logo" className="w-14 h-14 rounded-full border-3 border-white shadow-xl" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white animate-pulse"></div>
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-xl font-bold text-white">Medical Portal</h2>
                <p className="text-blue-200 text-sm font-medium">ระบบจัดการผู้ป่วย</p>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Professional Menu Items */}
      <div className="px-4 py-6 flex-1 bg-gray-50">
        {!collapsed && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Medical Functions
            </h3>
          </div>
        )}
        
        <Menu>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <MenuItem
                key={index}
                icon={
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isActive ? item.bgColor : 'bg-gray-100'
                  }`}>
                    <span className={isActive ? item.color : 'text-gray-600'}>
                      {item.icon}
                    </span>
                  </div>
                }
                component={<Link to={item.path} />}
                className={`mx-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white shadow-lg transform scale-105' 
                    : 'hover:bg-white hover:shadow-md hover:transform hover:scale-102'
                }`}
                style={{
                  backgroundColor: 'transparent',
                  color: '#1F2937',
                  padding: collapsed ? '12px' : '16px',
                  marginBottom: '8px',
                }}
                title={collapsed ? item.label : ''}
              >
                {!collapsed && (
                  <div className="ml-3">
                    <div className={`font-semibold text-sm ${isActive ? item.color : 'text-gray-800'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.subtitle}
                    </div>
                  </div>
                )}
              </MenuItem>
            );
          })}
        </Menu>

        {/* Medical Status Section */}
        {!collapsed && (
          <div className="mt-8 mx-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3 mb-2">
                <MdHealthAndSafety className="text-xl" />
                <div>
                  <h4 className="font-bold text-sm">System Status</h4>
                  <p className="text-green-100 text-xs">All systems operational</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <FaBell className="text-green-200" />
                <span className="text-xs text-green-100">No critical alerts</span>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        {!collapsed && (
          <div className="mt-4 mx-2">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold animate-pulse">!</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-red-800">Emergency Hotline</h4>
                  <p className="text-red-700 text-sm font-semibold">📞 Call: 1669</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Professional Logout Section */}
      <div className="border-t border-gray-200 bg-white p-4">
        <Menu>
          <MenuItem
            icon={
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <FiLogOut className="text-red-600" />
              </div>
            }
            onClick={handleLogout}
            className="mx-2 rounded-xl hover:bg-red-50 transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              color: '#DC2626',
              padding: collapsed ? '12px' : '16px',
            }}
            title={collapsed ? 'กลับไปหน้าหลัก' : ''}
          >
            {!collapsed && (
              <div className="ml-3">
                <div className="font-semibold text-sm text-red-600">กลับไปหน้าหลัก</div>
                <div className="text-xs text-red-400">Return to Main Page</div>
              </div>
            )}
          </MenuItem>
        </Menu>
      </div>
    </Sidebar>
  );
};

export default SidebarDash;
