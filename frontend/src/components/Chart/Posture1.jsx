import React from 'react'
import { DateTime } from 'luxon';

const postureMap = {
  0: { label: 'อยู่นิ่ง', color: '#66c2a5' },     // สีแรกของ set2 66c2a5
  1: { label: 'นอน', color: '#fc8d62' },  // สีที่สองของ set2
  2: { label: 'นั่ง', color: '#8da0cb' }, // สีที่สามของ set2
  3: { label: 'ยื่น', color: '#e78ac3' },// สีที่สี่ของ set2
  4: { label: 'ล้ม', color: '#66c2a5' }   // สีที่ห้าของ set2 a6d854
};

const Posture1 = ({ sensorData }) => {
     const data = sensorData.map(d => ({
        id: 'posture',
        time: DateTime.fromISO(d.timestamp).toFormat('HH:mm'),
        posture: d.posture,
        postureLabel: postureMap[d.posture]?.label,
        sequence: d.sequence,
      }));
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">ท่าทาง (Posture)
       <p sensorData={data.posture}> </p> </h2>
    </div>
  )
}

export default Posture1
