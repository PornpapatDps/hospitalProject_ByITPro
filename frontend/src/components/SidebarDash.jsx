import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {
  FaUserInjured,
  FaChartPie,
  FaPlus,
  FaCalendarAlt,
  FaNotesMedical,
} from 'react-icons/fa';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Logo from '../assets/logoNav.png';

const SidebarDash = ({ collapsed, setCollapsed }) => {
  const { hn } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || '';
  const location = useLocation();

  const menuItems = [
    {
      icon: <FaUserInjured />,
      label: 'ข้อมูลคนไข้',
      path: `/patient/${hn}/`,
    },
    {
      icon: <FaChartPie />,
      label: 'Dashboard',
      path: `/patient/${hn}/DashBoard`,
    },
    {
      icon: <FaPlus />,
      label: 'เพิ่มคนไข้',
      path: `/patient/${hn}/AddData`,
    },
    {
      icon: <FaCalendarAlt />,
      label: 'ปฏิทิน',
      path: `/patient/${hn}/Calendar`,
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="#F9FAFB"
      style={{
        height: 'full',
        width: collapsed ? '50px' : '250px',
        borderRight: '1px solid #E5E7EB',
        transition: 'all 0.3s ease-in-out',
        color: '#1F2937',
      }}
    >
      {/* Toggle Button */}
      <div className="flex justify-end px-6 py-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-700 text-xl hover:text-blue-500"
        >
          <FiMenu />
        </button>
      </div>

      {/* Logo & Header */}
      {!collapsed && (
        <div className="flex flex-col items-center py-4 mb-6">
          <img src={Logo} alt="Logo" className="w-16 h-16 mb-2" />
          <p className="text-lg font-bold text-gray-800">ระบบจัดการคนไข้</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      )}

      {/* Menu Items */}
      <Menu className="flex-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <MenuItem
              key={index}
              icon={item.icon}
              component={<Link to={item.path} />}
              style={{
                backgroundColor: isActive ? '#E0F2FE' : 'transparent',
                color: isActive ? '#2563EB' : '#1F2937',
                fontWeight: isActive ? 'bold' : 'normal',
              }}
              className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-150"
              title={collapsed ? item.label : ''}
            >
              {!collapsed && item.label}
            </MenuItem>
          );
        })}


        {/* Logout */}
        <div className="mt-10">
          <MenuItem
            icon={<FiLogOut />}
            onClick={handleLogout}
            style={{ color: '#DC2626' }}
            className="hover:bg-red-100 hover:text-red-600"
            title={collapsed ? 'ออกจากระบบ' : ''}
          >
            {!collapsed && 'ออกจากระบบ'}
          </MenuItem>
        </div>
      </Menu>
    </Sidebar>
  );
};

export default SidebarDash;
