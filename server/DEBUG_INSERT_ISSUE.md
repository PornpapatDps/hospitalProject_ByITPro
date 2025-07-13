# 🔧 การแก้ไขปัญหา INSERT ข้อมูลไม่ได้

## 🚨 **ปัญหาที่เป็นไปได้:**

### 1. **Database Schema ไม่ตรงกัน**
- Columns ในตาราง `patients` อาจไม่ตรงกับ SQL query
- Data types ไม่ตรงกัน
- Missing columns หรือ extra columns

### 2. **Missing Required Fields**
- บางฟิลด์ใน database เป็น NOT NULL แต่ไม่ได้ส่งมา
- Constraints violation

### 3. **Data Format Issues**
- Date format ไม่ถูกต้อง
- String length เกินกำหนด
- Invalid data types

## ✅ **การแก้ไขที่ทำ:**

### 1. **เพิ่ม Error Handling ที่ละเอียด:**
```javascript
} catch (error) {
  console.error('Error registering patient:', error);
  console.error('Error details:', {
    code: error.code,
    message: error.message,
    detail: error.detail
  });
```

### 2. **เพิ่ม Debug Logging:**
```javascript
console.log('Request body:', req.body); // ดูข้อมูลที่ส่งมา
console.log('Generated HN:', hn); // ดู HN ที่สร้าง
```

### 3. **เพิ่ม Input Validation:**
```javascript
if (!namepat || !surnamepat || !datepat || !born || !gender) {
  return res.status(400).json({ 
    success: false,
    message: 'กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, นามสกุล, วันที่รักษา, วันเกิด, เพศ' 
  });
}
```

### 4. **Handle Specific Database Errors:**
```javascript
if (error.code === '23505') { // Duplicate key
  return res.status(400).json({ 
    success: false,
    message: 'ผู้ป่วยนี้มีอยู่ในระบบแล้ว' 
  });
}

if (error.code === '42703') { // Column doesn't exist
  return res.status(400).json({ 
    success: false,
    message: 'มีปัญหาเกี่ยวกับโครงสร้างฐานข้อมูล: ' + error.message
  });
}
```

## 🔍 **วิธีการ Debug:**

### 1. **ตรวจสอบ Database Schema:**
```sql
-- เช็คโครงสร้างตาราง patients
\d patients

-- หรือ
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'patients';
```

### 2. **ตรวจสอบ Error Logs:**
```bash
# ดู console logs ใน terminal ที่รัน server
node index.js

# หรือถ้าใช้ nodemon
npm run dev
```

### 3. **ทดสอบด้วย Postman/Thunder Client:**
```json
POST http://localhost:4000/api/hospital/patients
Content-Type: application/json

{
  "prefix": "นาย",
  "namepat": "ทดสอบ",
  "surnamepat": "ระบบ",
  "datepat": "2025-01-15",
  "born": "1990-05-10",
  "gender": "ชาย",
  "address": "123 ถนนสุขุมวิท",
  "phonepat": "0812345678",
  "bloodgroup": "A",
  "height": "170",
  "weight": "65",
  "symptomspat": "ปวดหัว",
  "doctorpat": "นพ.สมหมาย",
  "emi": "0898765432",
  "disease": "ไม่มี",
  "allergy": "ไม่มี",
  "treatmenthistory": "ไม่มี",
  "surgeryhistory": "ไม่มี"
}
```

## 📋 **ขั้นตอนการแก้ไข:**

### **Step 1: ตรวจสอบ Database Schema**
```sql
-- ใน PostgreSQL
\c hospital_db
\d patients
```

### **Step 2: ตรวจสอบ Error Messages**
```javascript
// ดู console ใน terminal server
// จะแสดง error details ที่เพิ่มเข้าไป
```

### **Step 3: ปรับแก้ตาม Error**
- ถ้า Column doesn't exist → ปรับ SQL query
- ถ้า Data type mismatch → ปรับ data format
- ถ้า Constraint violation → เพิ่ม required fields

## 🎯 **Error Codes ที่ควรรู้:**

```
'42703' = Column doesn't exist
'23505' = Duplicate key violation
'23502' = NOT NULL constraint violation
'22001' = String data too long
'08003' = Connection doesn't exist
'42P01' = Table doesn't exist
```

## 🚀 **การทดสอบหลังแก้ไข:**

### 1. **Start Server:**
```bash
cd server
npm run dev
```

### 2. **ส่ง Test Request:**
```bash
curl -X POST http://localhost:4000/api/hospital/patients \
  -H "Content-Type: application/json" \
  -d '{
    "namepat": "ทดสอบ",
    "surnamepat": "ระบบ", 
    "datepat": "2025-01-15",
    "born": "1990-01-01",
    "gender": "ชาย"
  }'
```

### 3. **ดู Response:**
```json
// Success
{
  "success": true,
  "message": "ลงทะเบียนผู้ป่วยสำเร็จ",
  "hn": "hn001",
  "data": { "patient": {...} }
}

// Error
{
  "success": false,
  "message": "มีปัญหาเกี่ยวกับโครงสร้างฐานข้อมูล: ...",
  "error": "..."
}
```

---
**ลองทดสอบใหม่และดู error message ที่แสดงใน console!** 🔍
