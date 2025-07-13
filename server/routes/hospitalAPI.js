const express = require('express'); // เรียกใช้ express
const router = express.Router(); // สร้าง router ใหม่

const hospitalController = require('../controllers/hospital'); // เรียกใช้ controller hospital

const devicesController = require('../controllers/devices'); // เรียกใช้ controller devices
const { verifyToken } = require('../controllers/auth');
router.get('/devices', devicesController.getDevices); // GET /api/devices

router.get('/sensor', hospitalController.hospitals); // GET /api/hospital
router.get('/sensor/latest', hospitalController.hospitalLatest); // GET /api/hospital/regis

router.get('/register', hospitalController.getAllPatients); // GET /api/hospital/register
router.get('/register/:hn', hospitalController.getPatientByHN); // GET /api/hospital/register/:hn
router.put('/register/:hn', hospitalController.updatePatient); // PUT /api/hospital/register/:hn
router.delete('/register/:hn', hospitalController.deletePatient); // DELETE /api/hospital/register/:hn
router.post('/register', hospitalController.registerPat); // POST /api/hospital/register

router.post('/checkups', hospitalController.PostCheckups); // POST /api/hospital/checkups
router.get('/checkups', hospitalController.getAllCheckups); // GET /api/hospital/checkups
router.get('/checkups/:hn', hospitalController.getCheckupsByHn); // GET /api/hospital/checkups/:hn
// router.get('/checkups/:id', hospitalController.getCheckupsById); // GET /api/hospital/checkups/:id

router.put('/checkups/:id', hospitalController.updateCheckups); // PUT /api/hospital/checkups/:id
router.delete('/checkups/:id', hospitalController.deleteCheckups); // DELETE /api/hospital/checkups/:id

router.post('/appointments', hospitalController.postAppointment); // POST /api/hospital/appointments
router.get('/appointments', hospitalController.getAllAppointments); // GET /api/hospital/appointments
router.get('/appointments/:hn', hospitalController.getAppointments); // GET /api/hospital/appointments/:hn
router.put('/appointments/:id', hospitalController.updateAppointments); // PUT /api/hospital/appointments/:hn
router.delete('/appointments/:id', hospitalController.deleteAppointments); // DELETE /api/hospital/appointments/:id
 // PUT /api/hospital/appointments/:id
//router.get('/someRoute' ,verifyToken,hospitalController.someRoute); // ตัวอย่างเส้นทางเพิ่มเติม
router.post('/emergencycontacts', hospitalController.createEmergencyContact); // POST /api/hospital/emergencycontacts
router.get('/emergencycontacts', hospitalController.getAllEmergencyContacts); // GET /api/hospital/emergencycontacts
router.get('/emergencycontacts/:hn', hospitalController.getEmergencyContactsByHN); // GET /api/hospital/emergencycontacts/:hn
router.put('/emergencycontacts/:id', hospitalController.updateEmergencyContact); // PUT /api/hospital/emergencycontacts/:id
router.delete('/emergencycontacts/:id', hospitalController.deleteEmergencyContact); // DELETE /api/hospital/emergencycontacts/:id
 
module.exports = router;