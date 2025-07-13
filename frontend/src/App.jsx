
import './App.css';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


import  UserProvider  from './components/UserContext';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SidebarDash from './components/SidebarDash';
import { LoadingScreen } from './components/sections/LoadingScreen';


import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import RegisterPatient from './components/RegisterPatient';
import DataPat from './components/DataPatients/DataPat';

import Showdata from './components/DashBoad/Showdata';
import DashBoard from './components/DashBoad/DashBoard';
import AddDataDashBoard from './components/DashBoad/AddDataDashBoard';
import Calendar from './components/DashBoad/Calendar';
import ProtectedRoute from './components/ProtectedRoute';



function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isDashboard = location.pathname.startsWith('/patient/');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="text-gray-900 flex flex-col min-h-screen">

      {/* Navigation Bar */}
      {!isAuthPage && !isDashboard && <NavBar />}

      {/* Page Content */}
  <main className="flex-grow">
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/registerPat" element={<RegisterPatient />} />
        <Route path="/dataPat" element={<DataPat />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Route>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Dashboard Routes */}
      <Route
        path="/patient/:hn/*"
        element={
          <div className="flex min-h-screen">
            <SidebarDash collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="transition-all duration-300 flex-1">
              <Routes>
                <Route path="" element={<Showdata />} />
                <Route path="DashBoard" element={<DashBoard />} />
                <Route path="AddData" element={<AddDataDashBoard />} />
                <Route path="Calendar" element={<Calendar />} />
              </Routes>
            </div>
          </div>
        }
      />

      {/* 404 Not Found */}
      <Route path="*" element={
        <div className="flex items-center justify-center h-full py-20 text-xl">
          404 - หน้านี้ไม่มีอยู่
        </div>
      } />
    </Routes>
  </main>


      {/* Footer */}
      {!isAuthPage && !isDashboard && <Footer />}

      {/* Toast Notification */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
        closeButton={false}
        progressClassName="bg-green-500"
        bodyClassName="text-sm"
        toastClassName="rounded-lg shadow-lg"
        bodyStyle={{
          fontSize: '16px',
          fontFamily: 'Kanit',
        }}
      />
    </div>
  );
}


// =====================
// App: Provider + Router Wrapper
// =====================
function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) return <LoadingScreen />;

  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
