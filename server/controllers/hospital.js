const { verify } = require('jsonwebtoken');
const {fetchSensorHospitalLatest, fetchSensorHospital} = require('../influxdb/query'); //คอนฟิกการเชื่อมต่อ influxdb
const db = require('../postgresql/pgAdmin4.js'); //คอนฟิกการเชื่อมต่อ postgresql

const hospitalLatest = async (req, res) => { 
    try {
      const results = await fetchSensorHospitalLatest();
      res.json({sensor: results});
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Failed to fetch car data' });
    }
  }
const hospitals = async (req, res) => { 
  try {
    const results = await fetchSensorHospital();
    res.json({sensor: results});
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Failed to fetch car data' });
  }
}
const generateHN = async () => {
  const result = await db.query("SELECT hn FROM patients ORDER BY hn DESC LIMIT 1");

  if (result.rows.length === 0) {
    return 'hn001'; // ถ้ายังไม่มีข้อมูลเลย
  }

  const lastHN = result.rows[0].hn; // เช่น hn007
  const lastNumber = parseInt(lastHN.replace('hn', ''), 10); // เอาแค่ตัวเลข 007 → 7
  const nextNumber = lastNumber + 1;

  return 'hn' + nextNumber.toString().padStart(3, '0'); // เช่น hn008
};

// Function to register a new patient
const registerPat = async (req, res) => {
  const {
    namepat, surnamepat, datepat, born, gender, address,
    symptomspat, doctorpat, emi, disease, allergy,
    treatmenthistory, surgeryhistory
  } = req.body;

  try {
    const hn = await generateHN(); // สร้าง hn ใหม่

    const response = await db.query(
      `INSERT INTO patients (
        hn, namepat, surnamepat, datepat, born, gender, address,
        symptomspat, doctorpat, emi, disease, allergy,
        treatmenthistory, surgeryhistory
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14
      ) RETURNING *;`,
      [hn, namepat, surnamepat, datepat, born, gender, address,
       symptomspat, doctorpat, emi, disease, allergy,
       treatmenthistory, surgeryhistory]
    );

    const result = response.rows[0];
    res.status(201).json({
      message: 'Register success',
      hn: result.hn,
      data: {
        patient: result
      }
    });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Failed to register patient' });
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

  } catch (error) {
    console.error('Error fetching patient by HN:', error);
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
    } catch (error) {
      console.error('Error fetching all patients:', error);
      res.status(500).json({ message: 'Failed to fetch patients' });
    }
  };
const updatePatient = async (req, res) => {
  const { hn } = req.params;
  const {
    namepat, surnamepat, datepat, born, gender, address,
    symptomspat, doctorpat, emi, disease, allergy,
    treatmenthistory, surgeryhistory
  } = req.body;

  try {
    const response = await db.query(`
      UPDATE patients SET
        namepat = $1,
        surnamepat = $2,
        datepat = $3,
        born = $4,
        gender = $5,
        address = $6,
        symptomspat = $7,
        doctorpat = $8,
        emi = $9,
        disease = $10,
        allergy = $11,
        treatmenthistory = $12,
        surgeryhistory = $13
      WHERE hn = $14
      RETURNING *;
    `, [
      namepat, surnamepat, datepat, born, gender, address,
      symptomspat, doctorpat, emi, disease, allergy,
      treatmenthistory, surgeryhistory, hn
    ]);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบผู้ป่วยที่มี hn = ${hn}` });
    }

    res.status(200).json({
      status: 'success',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Failed to update patient' });
  }
};
// Function to delete a patient by HN
const deletePatient = async (req, res) => {
  const { hn } = req.params;
  try {
    await db.query('DELETE FROM patients WHERE hn = $1;', [hn]);
    res.status(200).json({ message: `ลบผู้ป่วยที่มี hn: ${hn} เรียบร้อยแล้ว` });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
};

//########### /hospital/checkups ###########
// Function to register checkups POST
// POST /api/hospital/checkups
 const PostCheckups = async (req, res) => {
  const { datePresent, weight, height, symptoms, disease, initialResult, hn } = req.body;

  try {
    const response = await db.query(
      `
      INSERT INTO checkups (
        datePresent, 
        weight, 
        height, 
        symptoms, 
        disease, 
        initialResult, 
        hn
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *;
      `,
      [datePresent, weight, height, symptoms, disease, initialResult, hn]
    );

    const result = response.rows[0];

    res.status(200).json({
      status: 'success',
      data: {
        checkups: result
      }
    });
  } catch (err) {
    console.error('Error inserting checkup:', err.message);
    res.status(500).json({ message: 'Failed to register checkup' });
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
    }catch (error){
      console.error('Error fetching all checkups:', error);
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

  } catch (error) {
    console.error('Error fetching checkups by HN:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
};

// GET /api/hospital/checkups/:id
  // GET /api/hospital/checkups/:id
// const getCheckupsById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const response = await db.query('SELECT * FROM checkups WHERE id = $1;', [id]);
//     if (response.rows.length === 0) {
//       return res.status(404).json({ message: `ไม่พบข้อมูลการตรวจสุขภาพที่ id = ${id}` });
//     }

//     res.status(200).json({
//       status: 'success',
//       data: response.rows[0]
//     });
//   } catch (error) {
//     console.error('Error fetching checkup byห ID:', error);
//     res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
//   }
// };

  //Function to put checkups 
// PUT /api/hospital/checkups/:id
const updateCheckups = async (req, res) => {
  const { id } = req.params;
  const { datePresent, weight, height, symptoms, disease, initialResult, hn } = req.body;

  try {
    const response = await db.query(
      `
      UPDATE checkups
      SET 
        datePresent = $1,
        weight = $2,
        height = $3,
        symptoms = $4,
        disease = $5,
        initialResult = $6,
        hn = $7
      WHERE id = $8
      RETURNING *;
      `,
      [datePresent, weight, height, symptoms, disease, initialResult, hn, id]
    );

    if (response.rows.length === 0) {
      return res.status(404).json({ message: `ไม่พบการตรวจสุขภาพที่มี id = ${id}` });
    }

    res.status(200).json({
      status: 'success',
      data: response.rows[0]
    });
  } catch (error) {
    console.error('Error updating checkups:', error);
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
  } catch (error) {
    console.error('Error:', error);
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

// const someRoute = async (req,res ) => {
//    try {
//     const result = await client.query('SELECT * FROM table');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error while accessing DB:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }; 

module.exports = { hospitalLatest, hospitals, registerPat, PostCheckups , getAllPatients 
  ,getPatientByHN,updatePatient ,deletePatient ,getAllCheckups 
  //,getCheckupsById 
,updateCheckups ,deleteCheckups,postAppointment,getAllAppointments,getAppointments ,updateAppointments
,deleteAppointments ,getCheckupsByHn }; //ส่งออกฟังก์ชันที่สร้างขึ้น