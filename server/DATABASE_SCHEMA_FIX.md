# 🔧 แก้ไขปัญหา Database Schema Mismatch

## ❌ **ปัญหาที่พบ:**

```
Error registering patient: error: column "systolic" of relation "patients" does not exist
```

**สาเหตุ**: ตาราง `patients` ใน PostgreSQL ไม่มี columns `systolic` และ `diastolic`

## ✅ **การแก้ไข:**

### 1. **ปรับปรุง `registerPat` function**

#### **เก่า (ผิด):**
```javascript
const {
  prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
  bloodgroup, systolic, diastolic, symptomspat, doctorpat, emi, disease, allergy,
  treatmenthistory, surgeryhistory
} = req.body;

INSERT INTO patients (
  hn, prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
  bloodgroup, systolic, diastolic, symptomspat, doctorpat, emi, disease, allergy,
  treatmenthistory, surgeryhistory
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9,
  $10, $11, $12, $13, $14, $15, $16, $17,
  $18, $19 
)
```

#### **ใหม่ (ถูกต้อง):**
```javascript
const {
  prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
  bloodgroup, symptomspat, doctorpat, emi, disease, allergy,
  treatmenthistory, surgeryhistory
} = req.body;

INSERT INTO patients (
  hn, prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
  bloodgroup, symptomspat, doctorpat, emi, disease, allergy,
  treatmenthistory, surgeryhistory
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9,
  $10, $11, $12, $13, $14, $15,
  $16, $17 
)
```

### 2. **ปรับปรุง `updatePatient` function**

#### **การเปลี่ยนแปลง:**
- ลบ `systolic, diastolic` ออกจาก destructuring
- ลบ columns เหล่านี้ออกจาก UPDATE statement
- ปรับ parameter positions ($10, $11, $12...)
- เพิ่ม error handling ที่ดีขึ้น

### 3. **ปรับปรุง `deletePatient` function**

#### **การเปลี่ยนแปลง:**
- เพิ่มการตรวจสอบ `result.rowCount`
- ปรับปรุง error messages
- เพิ่ม success/error structure

## 🎯 **สาเหตุของปัญหา:**

### **Schema Mismatch:**
```sql
-- ที่คาด (ในโค้ด)
patients table: hn, prefix, namepat, ..., systolic, diastolic, ...

-- ที่มีจริง (ใน database)
patients table: hn, prefix, namepat, ..., symptomspat, ... (ไม่มี systolic, diastolic)
```

### **เหตุผล:**
- `systolic` และ `diastolic` เป็นข้อมูลการตรวจวัด
- ควรอยู่ในตาราง `checkups` ไม่ใช่ `patients`
- ตาราง `patients` เก็บข้อมูลพื้นฐานของผู้ป่วย
- ตาราง `checkups` เก็บข้อมูลการตรวจสุขภาพ

## 📊 **โครงสร้างตารางที่ถูกต้อง:**

### **🏥 patients table:**
```sql
- hn (Primary Key)
- prefix
- namepat
- surnamepat
- datepat
- born
- gender
- address
- phonepat
- bloodgroup
- symptomspat
- doctorpat
- emi
- disease
- allergy
- treatmenthistory
- surgeryhistory
```

### **📋 checkups table:**
```sql
- id (Primary Key)
- hn (Foreign Key → patients.hn)
- datePresent
- systolic    ← ข้อมูลความดันโลหิต
- diastolic   ← ข้อมูลความดันโลหิต
- symptoms
- disease
- initialResult
```

## 🚀 **ผลลัพธ์หลังแก้ไข:**

### **✅ ข้อดี:**
1. **Schema Consistency** - โค้ดตรงกับ database structure
2. **Data Separation** - แยกข้อมูลผู้ป่วยกับข้อมูลการตรวจ
3. **Error Handling** - มี error handling ที่ดีขึ้น
4. **Proper Response** - รูปแบบ response ที่สม่ำเสมอ

### **📱 การใช้งานใหม่:**

#### **ลงทะเบียนผู้ป่วยใหม่:**
```javascript
POST /api/hospital/patients
{
  "prefix": "นาย",
  "namepat": "สมชาย",
  "surnamepat": "ใจดี",
  "datepat": "2025-01-15",
  "born": "1990-05-10",
  "gender": "ชาย",
  "address": "123 ถนนสุขุมวิท กรุงเทพฯ",
  "phonepat": "0812345678",
  "bloodgroup": "A",
  "symptomspat": "ปวดหัว",
  "doctorpat": "นพ.สมหมาย",
  "emi": "0898765432",
  "disease": "ไม่มี",
  "allergy": "ไม่มี",
  "treatmenthistory": "ไม่มี",
  "surgeryhistory": "ไม่มี"
}
```

#### **บันทึกข้อมูลการตรวจ:**
```javascript
POST /api/hospital/checkups
{
  "hn": "hn001",
  "datePresent": "2025-01-15",
  "systolic": 120,      ← ข้อมูลความดันโลหิตอยู่ที่นี่
  "diastolic": 80,      ← ข้อมูลความดันโลหิตอยู่ที่นี่
  "symptoms": "ปวดหัว",
  "disease": "ไมเกรน",
  "initialResult": "ให้ยาแก้ปวด"
}
```

## 🔍 **การทดสอบ:**

```bash
# ทดสอบลงทะเบียนผู้ป่วย
curl -X POST http://localhost:4000/api/hospital/patients \
  -H "Content-Type: application/json" \
  -d '{"namepat":"ทดสอบ","surnamepat":"ระบบ","datepat":"2025-01-15","born":"1990-01-01","gender":"ชาย"}'

# ควรได้ response:
{
  "success": true,
  "message": "ลงทะเบียนผู้ป่วยสำเร็จ",
  "hn": "hn001",
  "data": { "patient": {...} }
}
```

---
**ปัญหา Database Schema แก้ไขเรียบร้อย!** ✅
