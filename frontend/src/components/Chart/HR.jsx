import { ResponsiveLine } from '@nivo/line';
import { DateTime } from 'luxon';
import React from 'react';

const HeartRateChart = ({ sensorData }) => {
  const data = [
    {
      id: 'heart_rate',
      data: (sensorData || [])
        .filter(d => d.timestamp && typeof d.heart_rate === 'number')
        .map(d => ({
          x: DateTime.fromISO(d.timestamp).toFormat('HH:mm'),
          y: d.heart_rate ,   
          sequence: d.sequence,
        }))
    } 
  ];

  if (data[0].data.length === 0) {
    return <div className="text-center text-gray-500">ไม่มีข้อมูลชีพจร</div>;
  }

  const classifyHeartRate = (bpm) => {
    if (bpm < 60) return 'ต่ำกว่าปกติ';
    if (bpm <= 100) return 'ปกติ';
    if (bpm <= 130) return 'สูง';
    return 'สูงมาก';
  };

  return (
    <ResponsiveLine
      data={data}
      // top: 50, right: 20, bottom: 120, left: 90
      margin={{ top: 50, right: 20, bottom: 100, left: 80 }}
      yScale={{ type: 'linear', min: '1', max: '120', stacked: false}} 
      curve="monotoneX"
      colors={{ scheme: 'pastel1' }}
      axisBottom={{
        tickRotation: -45,
        legend: 'เวลา',
        legendPosition: 'middle',
        legendOffset: 50,
        tickPadding: 5
      }}
      axisLeft={{
        orient: 'left',
        legend: 'ชีพจร (bpm)',
        legendOffset: -50,
        tickValues: [0,20,40, 60, 80, 100, 120]
      }}
      pointSize={6}
      pointColor={{ from: 'series.color', modifiers: [['darker', 1.2]] }}
      pointBorderWidth={3}
      pointBorderColor={{ from: 'seriesColor', modifiers: [['darker', 1]] }}
      pointLabelYOffset={-12}
      enableArea={false}
      areaOpacity={1}
      enableGridX={false}
      enableTouchCrosshair={true}
      useMesh={true}
      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: 12,
              fontFamily: 'Kanit',
              fill: '#000000'
            }
          },
          legend: {
            text: {
              fontSize: 14,
              fontFamily: 'Kanit',
              fill: '#000000'
            }
          }
        },
        legends: {
          text: {
            fontSize: 12,
            fontFamily: 'Kanit',
            fill: '#000000'
          }
        },
        tooltip: {
          container: {
            fontFamily: 'Kanit',
            fontSize: 13,
            color: '#000000', // สีตัวอักษรใน tooltip
          }
        }
      }}
      legends={[
        {
          anchor: 'top-right',
          direction: 'row',
          translateX: -10,
          translateY: -50,
          itemWidth: 80,
          itemHeight: 20,
          symbolShape: 'circle',
          fontFamily: 'Kanit',
          fontSize: 16, 
          fill: '#000000', // สีตัวอักษรใน legend
          
        }
      ]}
      tooltip={({ point }) => (
        <div
          style={{
              background: 'white',
              padding: '10px',
              border: `2px solid #000000`,
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'Kanit',
              color: '#000000' // สีตัวอักษรใน tooltip
          }}
          
      >   <strong> ลำดับ : </strong>
          {point.data.sequence}<br />
          <strong> เวลา : </strong>
           {point.data.xFormatted}<br />
          <strong>ชีพจร : </strong>
          ❤️ {point.data.yFormatted} bpm<br />
          <strong>สถานะ : </strong>
          📄 {classifyHeartRate(point.data.y)}
        </div>
      )}
    />
  );
};

export default HeartRateChart;
