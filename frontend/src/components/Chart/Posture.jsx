import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { DateTime } from 'luxon';

const postureMap = {
  0: { label: 'อยู่นิ่ง', color: '#66c2a5' },     // สีแรกของ set2 66c2a5
  1: { label: 'นอน', color: '#fc8d62' },  // สีที่สองของ set2
  2: { label: 'นั่ง', color: '#8da0cb' }, // สีที่สามของ set2
  3: { label: 'ยื่น', color: '#e78ac3' },// สีที่สี่ของ set2
  4: { label: 'ล้ม', color: '#66c2a5' }   // สีที่ห้าของ set2 a6d854
};

const PostureBarChart = ({ sensorData }) => {
  const data = sensorData.map(d => ({
    id: 'posture',
    time: DateTime.fromISO(d.timestamp).toFormat('HH:mm'),
    posture: d.posture,
    postureLabel: postureMap[d.posture]?.label,
    sequence: d.sequence,
  }));

  return (
    <ResponsiveBar
      data={data}
      keys={['posture']}
      indexBy="time"
      margin={{ top: 50, right: 20, bottom: 115, left: 90 }}
      padding={0.4}
      groupMode="grouped"
      colors={bar => postureMap[bar.data.posture]?.color || '#ccc'}
      borderRadius={4}
      borderColor={{ from: 'color', modifiers: [['darker', 1.2]] }}

      axisBottom={{
        tickRotation: -45,
        legend: 'เวลา',
        legendPosition: 'middle',
        legendOffset: 50,
        tickPadding: 5
      }}

      axisLeft={{
      legend: 'ท่าทาง',
      legendPosition: 'middle',
      legendOffset: -70,
      tickValues: [0, 1, 2, 3, 4], // ลบ 5 ออก เพราะไม่มีใน postureMap
      format: v => postureMap[v]?.label || v // แสดง "อยู่นิ่ง" เมื่อ v === 0
    }}


      enableLabel={false}

      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: 12,
              fontFamily: 'Kanit'
            }
          },
          legend: {
            text: {
              fontSize: 14,
              fontFamily: 'Kanit'
            }
          }
        },
        legends: {
          text: {
            fontSize: 12,
            fontFamily: 'Kanit'
          }
        },
        tooltip: {
          container: {
            fontFamily: 'Kanit',
            fontSize: 13
          }
        }
      }}

      tooltip={({ data }) => {
  const isStill = data.posture === 0;
  return (
    <div style={{
      background: 'white',
      padding: '10px',
      border: '2px solid black',
      borderRadius: '6px',
      fontFamily: 'Kanit',
      fontSize: '14px'
    }}>
      <strong>ลำดับ:</strong> {data.sequence}<br />
      <strong>เวลา:</strong> {data.time}<br />
      <strong>ท่าทาง:</strong> {data.postureLabel}<br />
      {isStill && (
        <div style={{ marginTop: '6px', color: '#d9534f' }}>
          ⚠️ อยู่นิ่งเป็นเวลานานอาจส่งผลเสียต่อสุขภาพ
        </div>
      )}
    </div>
  );
}}

    />
  );
};

export default PostureBarChart;
