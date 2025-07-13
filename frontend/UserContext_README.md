# 📝 คู่มือการใช้งาน UserContext (ปรับปรุงแล้ว - ไม่มีบัค)

## 🎯 **ความเปลี่ยนแปลง:**
- ✅ ลบการตรวจสอบ auth อัตโนมัติที่ทำให้ logout ทันที
- ✅ เพิ่ม error handling ที่ดีขึ้น
- ✅ ไม่มี session timeout ที่ซับซ้อน
- ✅ ใช้งานง่าย ไม่ซับซ้อน

## 🔧 **วิธีการใช้งาน:**

### 1. ใน App.jsx หรือ main.jsx:
```jsx
import UserProvider from './components/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
```

### 2. ใน Login Component:
```jsx
import { useContext, useState } from 'react';
import { UserContext } from './UserContext';

const Login = () => {
  const { login, isLoading } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      window.location.href = '/'; // ไปหน้าหลัก
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="อีเมล" 
        required 
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="รหัสผ่าน" 
        required 
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  );
};
```

### 3. ใน Component อื่นๆ:
```jsx
import { useContext } from 'react';
import { UserContext } from './UserContext';

const Navigation = () => {
  const { user, logout } = useContext(UserContext);

  if (user.isLoggedIn) {
    return (
      <div>
        <span>สวัสดี {user.name}</span>
        <button onClick={logout}>ออกจากระบบ</button>
      </div>
    );
  }

  return <a href="/login">เข้าสู่ระบบ</a>;
};
```

## 🔒 **ความปลอดภัย:**
- ✅ ไม่เก็บ sensitive data ใน localStorage
- ✅ ใช้ cookies สำหรับ session management
- ✅ Auto logout เมื่อมี error จริงๆ เท่านั้น
- ✅ ไม่ logout ทันทีเมื่อรีเฟรช

## 🚫 **สิ่งที่เอาออก:**
- ❌ Token expiry check ที่ซับซ้อน
- ❌ Auto auth check ที่ทำให้ logout ทันที
- ❌ Session extension modal
- ❌ Complex error handling

## 🎉 **ประโยชน์:**
- 🚀 เริ่มใช้งานได้ทันที
- 🛡️ ไม่มีปัญหาการ logout ทันทีเมื่อรีเฟรช
- 📱 ใช้งานง่าย เข้าใจง่าย
- 🔧 แก้ไขและปรับแต่งได้ง่าย

## 🐛 **การแก้ไขปัญหา:**
1. **ถ้า login ไม่ได้:** ตรวจสอบ API endpoint และ CORS
2. **ถ้า logout ทันที:** ตรวจสอบ console logs
3. **ถ้า toast ไม่แสดง:** ตรวจสอบ react-toastify setup

## 📋 **Environment Variables:**
สร้างไฟล์ `.env` ใน `frontend/`:
```
VITE_API_BASE_URL=http://localhost:4000
```
