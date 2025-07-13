const { verify } = require('jsonwebtoken');
const {fetchSensorHospitalLatest, fetchSensorHospital} = require('../influxdb/query'); //คอนฟิกการเชื่อมต่อ influxdb
const db = require('../postgresql/pgAdmin4.js'); //คอนฟิกการเชื่อมต่อ postgresql

const hospitalLatest = async (req, res) => { 
    try {
      const results = await fetchSensorHospitalLatest();
      res.json({sensor: results});
    } catch {
      res.status(500).json({ message: 'Failed to fetch car data' });
    }
  }
const hospitals = async (req, res) => { 
  try {
    const results = await fetchSensorHospital();
    res.json({sensor: results});
  } catch {
    res.status(500).json({ message: 'Failed to fetch car data' });
  }
}
const generateHN = async () => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM patients');
    const count = parseInt(result.rows[0].count, 10) + 1; 
    return 'hn' + count.toString().padStart(3, '0'); // เช่น hn001, hn002
  } catch (error) {
    console.error('Error generating HN:', error);
    // ถ้าเกิดข้อผิดพลาด ใช้ timestamp เป็น fallback
    return 'hn' + Date.now().toString().slice(-6);
  }
};
// Function to register a new patient
const registerPat = async (req, res) => {
  const {
    prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
    bloodgroup, height, weight, symptomspat, doctorpat, emi, disease, allergy,
    treatmenthistory, surgeryhistory 
  } = req.body;

  try {
    // Validate required fields
    if (!namepat || !surnamepat || !datepat || !born || !gender) {
      return res.status(400).json({ 
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็น: ชื่อ, นามสกุล, วันที่รักษา, วันเกิด, เพศ' 
      });
    }

    console.log('Request body:', req.body); // Debug log

    const hn = await generateHN(); // สร้าง hn ใหม่
    console.log('Generated HN:', hn); // Debug log

    const response = await db.query(
      `INSERT INTO patients (
        hn, prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
        bloodgroup, height, weight, symptomspat, doctorpat, emi, disease, allergy,
        treatmenthistory, surgeryhistory
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19 
      ) RETURNING *;`,
      [hn, prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
       bloodgroup, height, weight, symptomspat, doctorpat, emi, disease, allergy,
       treatmenthistory, surgeryhistory]
    );

    const result = response.rows[0];
    res.status(201).json({
      success: true,
      message: 'ลงทะเบียนผู้ป่วยสำเร็จ',
      hn: result.hn,
      data: {
        patient: result
      }
    });

  } catch (error) {
    console.error('Error registering patient:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      detail: error.detail
    });
    
    // Handle specific database errors
    if (error.code === '23505') {
      return res.status(400).json({ 
        success: false,
        message: 'ผู้ป่วยนี้มีอยู่ในระบบแล้ว' 
      });
    }
    
    if (error.code === '42703') {
      return res.status(400).json({ 
        success: false,
        message: 'มีปัญหาเกี่ยวกับโครงสร้างฐานข้อมูล: ' + error.message
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'เกิดข้อผิดพลาดในการลงทะเบียนผู้ป่วย',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
// Function to get patient by HN
const getPatientByHN = async (req, res) => {
  const { hn } = req.params;
  try {
    const response = await db.query('SELECT * FROM patients WHERE hn = $1', [hn]);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบผู้ป่วยที่มี hn = ${hn}` });
    }

    res.status(200).json({
      status: 'success',
      data: response.rows[0]
    });

  } catch {
    res.status(500).json({ message: 'Failed to fetch patient' });
  }
};
  // Function to get all patients
const getAllPatients = async (req, res) => {
    try {
      const response = await db.query('SELECT * FROM patients ORDER BY datePat DESC');
      res.status(200).json({
        status: 'success',
        data: response.rows
      });
    } catch {
      res.status(500).json({ message: 'Failed to fetch patients' });
    }
  };
const updatePatient = async (req, res) => {
  const { hn } = req.params;
  const {
    prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
    bloodgroup, height, weight, symptomspat, doctorpat, emi, disease, allergy,
    treatmenthistory, surgeryhistory
  } = req.body;

  try {
    const response = await db.query(`
      UPDATE patients SET
        prefix = $1,
        namepat = $2,
        surnamepat = $3,
        datepat = $4,
        born = $5,
        gender = $6,
        address = $7,
        phonepat = $8,
        bloodgroup = $9,
        height = $10,
        weight = $11,
        symptomspat = $12,
        doctorpat = $13,
        emi = $14,
        disease = $15,
        allergy = $16,
        treatmenthistory = $17,
        surgeryhistory = $18
      WHERE hn = $19
      RETURNING *;
    `, [
      prefix, namepat, surnamepat, datepat, born, gender, address, phonepat,
      bloodgroup, height, weight, symptomspat, doctorpat, emi, disease, allergy,
      treatmenthistory, surgeryhistory, hn
    ]);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบผู้ป่วยที่มี hn = ${hn}` });
    }

    res.status(200).json({
      status: 'success',
      data: response.rows[0]
    });
  } catch {
    res.status(500).json({ message: 'Failed to update patient' });
  }
};
// Function to delete a patient by HN
const deletePatient = async (req, res) => {
  const { hn } = req.params;
  try {
    await db.query('DELETE FROM patients WHERE hn = $1;', [hn]);
    res.status(200).json({ message: `ลบผู้ป่วยที่มี hn: ${hn} เรียบร้อยแล้ว` });
  } catch {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
};

//########### /hospital/checkups ###########
// Function to register checkups POST
// POST /api/hospital/checkups
 const PostCheckups = async (req, res) => {
  const { datepresent, systolic, diastolic, symptoms, disease, initialresult, hn } = req.body;

  try {
    const response = await db.query(
      `
      INSERT INTO checkups (
        datepresent, 
        systolic, 
        diastolic, 
        symptoms, 
        disease, 
        initialresult, 
        hn
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *;
      `,
      [datepresent, systolic, diastolic, symptoms, disease, initialresult, hn]
    );

    const result = response.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        checkups: result
      }
    });
  } catch {
    res.status(500).json({ message: 'Failed to register checkups' });
  }
};
  // Function to get all checkups
  // GET /api/hospital/checkups
  const getAllCheckups = async (req, res) => {
    try {
      // const response = await db.query('SELECT * FROM checkups WHERE hn = $1', [hn]);
      const response = await db.query('SELECT * FROM checkups ORDER BY datePresent DESC');
      res.status(200).json({
        status: 'success',
        data: response.rows
      });
    }catch {
      res.status(500).json({ message: 'Failed to fetch checkups' });
    }
  }

const getCheckupsByHn = async (req, res) => {
  const { hn } = req.params;

  try {
    const response = await db.query(
      'SELECT * FROM checkups WHERE hn = $1 ORDER BY datepresent DESC;',
      [hn]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบข้อมูลสำหรับ hn = ${hn}` });
    }

    res.status(200).json({
      status: 'success',
      count: response.rows.length,
      data: response.rows // ✅ เปลี่ยนจาก rows[0] เป็น rows ทั้งหมด
    });

  } catch {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
};

  //Function to put checkups 
// PUT /api/hospital/checkups/:id
const updateCheckups = async (req, res) => {
  const { id } = req.params;
  const { datepresent, systolic, diastolic, symptoms, disease, initialresult, hn } = req.body;

  try {
    const response = await db.query(
      `
      UPDATE checkups
      SET 
        datepresent = $1,
        systolic = $2,
        diastolic = $3,
        symptoms = $4,
        disease = $5,
        initialresult = $6,
        hn = $7
      WHERE id = $8
      RETURNING *;
      `,
      [datepresent, systolic, diastolic, symptoms, disease, initialresult, hn, id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบการตรวจสุขภาพที่มี id = ${id}` });
    }

    res.status(200).json({
      status: 'success',
      data: response.rows[0]
    });
  } catch {
    res.status(500).json({ message: 'Failed to update checkups' });
  }
};

// Function to delete checkups by ID
// DELETE /api/hospital/checkups/:id
const deleteCheckups = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM checkups WHERE id = $1;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `ไม่พบข้อมูลที่ id: ${id}` });
    }

    res.status(200).json({ message: `ลบการตรวจสุขภาพที่มี id: ${id} เรียบร้อยแล้ว` });
  } catch {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
};

const postAppointment = async (req, res) => {
    const {
        hn ,
    datetimeappoint ,
    department ,
    doctor ,
    beforedoc ,
    labresult ,
    xrayresult 
     } = req.body;
      try {
          const response = await db.query(
          `INSERT INTO appointments (
            hn, datetimeappoint, department, doctor, beforedoc, labresult, xrayresult
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7
          ) RETURNING *;`,
          [hn, datetimeappoint, department, doctor, beforedoc, labresult, xrayresult]
        );

          const result = response.rows[0];
          res.status(201).json({
              message: 'Appointment created successfully',
              data: {
                  appointment: result
              }
          });
      } catch (err) {
          console.error('Error:', err);
          res.status(500).json({ message: 'Failed to create appointment' });
      }
  }
const getAllAppointments = async (req, res) => {
    try {
        const response = await db.query('SELECT * FROM appointments');
        const result = response.rows;
        res.status(200).json({
            status: 'success',
            data: {
                appointments: result
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Failed to fetch appointments data' });
    }
}
const getAppointments = async (req, res) => {
 try{
    const response = await db.query('SELECT * FROM appointments WHERE hn = $1', [req.params.hn]);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบการนัดหมายสำหรับผู้ป่วยที่มี HN = ${req.params.hn}` });
    }
    res.status(200).json({
      status: 'success',
      data: response.rows
    });
 }catch(error){
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments data' });
 }
}
const updateAppointments = async (req, res) => {
  const { id } = req.params;
  const {
    datetimeappoint,
    department,
    doctor,
    beforedoc,
    labresult,
    xrayresult,
  } = req.body;

  try {
    const response = await db.query(
      `UPDATE appointments SET
        datetimeappoint = $1,
        department = $2,
        doctor = $3,
        beforedoc = $4,
        labresult = $5,
        xrayresult = $6
      WHERE id = $7
      RETURNING *;`,
      [datetimeappoint, department, doctor, beforedoc, labresult, xrayresult, id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบการนัดหมายที่มี ID = ${id}` });
    }

    res.status(200).json({ message: 'อัปเดตนัดหมายสำเร็จ', data: response.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'ไม่สามารถอัปเดตข้อมูลนัดหมายได้' });
  }
};

// Function to delete appointments by HN
const deleteAppointments = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM appointments WHERE id = $1;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `ไม่พบการนัดหมายที่มี ID = ${id}` });
    }

    res.status(200).json({ message: `ลบการนัดหมาย ID ${id} เรียบร้อยแล้ว` });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลการนัดหมาย' });
  }
};

//########### /hospital/emergency-contacts ###########

// Function to create emergency contact
// POST /api/hospital/emergency-contacts
const createEmergencyContact = async (req, res) => {
  const { hn, prefix, nameemergency, surnameemergency, phone, relation } = req.body;

  try {
    // ตรวจสอบว่ามีผู้ป่วยที่มี HN นี้หรือไม่
    const patientCheck = await db.query('SELECT hn FROM patients WHERE hn = $1', [hn]);
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบผู้ป่วยที่มี HN = ${hn}` });
    }

    const response = await db.query(
      `INSERT INTO emergencycontacts (
        hn, prefix, nameemergency, surnameemergency, phone, relation
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING *;`,
      [hn, prefix, nameemergency, surnameemergency, phone, relation]
    );

    const result = response.rows[0];
    res.status(201).json({
      status: 'success',
      message: 'เพิ่มผู้ติดต่อฉุกเฉินสำเร็จ',
      data: {
        emergencyContact: result
      }
    });

  } catch (error) {
    console.error('Error creating emergency contact:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มผู้ติดต่อฉุกเฉิน' });
  }
};

// Function to get all emergency contacts
// GET /api/hospital/emergency-contacts
const getAllEmergencyContacts = async (req, res) => {
  try {
    const response = await db.query(`
      SELECT * FROM emergencycontacts 
    `);
    
    res.status(200).json({
      status: 'success',
      count: response.rows.length,
      data: response.rows
    });
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ติดต่อฉุกเฉิน' });
  }
};

// Function to get emergency contacts by HN
// GET /api/hospital/emergency-contacts/:hn
const getEmergencyContactsByHN = async (req, res) => {
  const { hn } = req.params;

  try {
    const response = await db.query(`
      SELECT * FROM emergencycontacts WHERE hn = $1
    `, [hn]);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบผู้ติดต่อฉุกเฉินสำหรับผู้ป่วย HN = ${hn}` });
    }

    res.status(200).json({
      status: 'success',
      count: response.rows.length,
      data: response.rows
    });

  } catch (error) {
    console.error('Error fetching emergency contacts by HN:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ติดต่อฉุกเฉิน' });
  }
};

// Function to get emergency contact by ID
// GET /api/hospital/emergency-contacts/detail/:id
const getEmergencyContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await db.query(`
      SELECT * FROM emergencycontacts WHERE id = $1
    `, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบผู้ติดต่อฉุกเฉินที่มี ID = ${id}` });
    }

    res.status(200).json({
      status: 'success',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error fetching emergency contact by ID:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ติดต่อฉุกเฉิน' });
  }
};

// Function to update emergency contact
// PUT /api/hospital/emergency-contacts/:id
const updateEmergencyContact = async (req, res) => {
  const { id } = req.params;
  const { prefix, nameemergency, surnameemergency, phone, relation } = req.body;

  try {
    const response = await db.query(
      `UPDATE emergencycontacts SET
        prefix = $1,
        nameemergency = $2,
        surnameemergency = $3,
        phone = $4,
        relation = $5
      WHERE id = $6
      RETURNING *;`,
      [prefix, nameemergency, surnameemergency, phone, relation, id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบผู้ติดต่อฉุกเฉินที่มี ID = ${id}` });
    }

    res.status(200).json({
      status: 'success',
      message: 'อัปเดตข้อมูลผู้ติดต่อฉุกเฉินสำเร็จ',
      data: response.rows[0]
    });

  } catch (error) {
    console.error('Error updating emergency contact:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ติดต่อฉุกเฉิน' });
  }
};

// Function to delete emergency contact by ID
// DELETE /api/hospital/emergency-contacts/:id
const deleteEmergencyContact = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM emergencycontacts WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `ไม่พบผู้ติดต่อฉุกเฉินที่มี ID = ${id}` });
    }

    res.status(200).json({ 
      status: 'success',
      message: `ลบผู้ติดต่อฉุกเฉิน ID ${id} เรียบร้อยแล้ว` 
    });

  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลผู้ติดต่อฉุกเฉิน' });
  }
};

// Function to delete all emergency contacts by HN
// DELETE /api/hospital/emergency-contacts/patient/:hn
const deleteEmergencyContactsByHN = async (req, res) => {
  const { hn } = req.params;

  try {
    const result = await db.query('DELETE FROM emergencycontacts WHERE hn = $1', [hn]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `ไม่พบผู้ติดต่อฉุกเฉินสำหรับผู้ป่วย HN = ${hn}` });
    }

    res.status(200).json({ 
      status: 'success',
      message: `ลบผู้ติดต่อฉุกเฉินทั้งหมดของผู้ป่วย HN ${hn} เรียบร้อยแล้ว`,
      deletedCount: result.rowCount
    });

  } catch (error) {
    console.error('Error deleting emergency contacts by HN:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลผู้ติดต่อฉุกเฉิน' });
  }
};

module.exports = { 
  hospitalLatest, 
  hospitals, 
  registerPat, 
  PostCheckups, 
  getAllPatients,
  getPatientByHN,
  updatePatient,
  deletePatient,
  getAllCheckups,
  updateCheckups,
  deleteCheckups,
  postAppointment,
  getAllAppointments,
  getAppointments,
  updateAppointments,
  deleteAppointments,
  getCheckupsByHn,
  // Emergency Contacts CRUD
  createEmergencyContact,
  getAllEmergencyContacts,
  getEmergencyContactsByHN,
  getEmergencyContactById,
  updateEmergencyContact,
  deleteEmergencyContact,
  deleteEmergencyContactsByHN
}; //ส่งออกฟังก์ชันที่สร้างขึ้น