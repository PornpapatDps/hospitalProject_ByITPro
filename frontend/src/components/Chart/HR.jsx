import { ResponsiveLine } from '@nivo/line';
import { DateTime } from 'luxon';
import React from 'react';

const HeartRateChart = ({ sensorData }) => {
  // ฟังก์ชันจำแนกระดับชีพจร
  const classifyHeartRate = (bpm) => {
    if (bpm < 60) return { status: 'ต่ำกว่าปกติ', color: '#3B82F6', icon: '💙', risk: 'ต่ำ' };
    if (bpm <= 100) return { status: 'ปกติ', color: '#10B981', icon: '💚', risk: 'ปกติ' };
    if (bpm <= 130) return { status: 'สูง', color: '#F59E0B', icon: '💛', risk: 'เฝ้าระวัง' };
    return { status: 'สูงมาก', color: '#EF4444', icon: '❤️', risk: 'อันตราย' };
  };

  // แปลงข้อมูลและเพิ่มสีตามระดับความเสี่ยง
  const processedData = (sensorData || [])
    .filter(d => d.timestamp && typeof d.heart_rate === 'number')
    .map(d => ({
      x: DateTime.fromISO(d.timestamp).toFormat('HH:mm'),
      y: d.heart_rate,
      sequence: d.sequence,
      classification: classifyHeartRate(d.heart_rate),
      timestamp: d.timestamp
    }));

  const data = [
    {
      id: 'Heart Rate',
      data: processedData
    }
  ];

  if (processedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">❤️</div>
        <div className="text-xl font-semibold text-gray-600 mb-2">ไม่มีข้อมูลชีพจร</div>
        <div className="text-sm text-gray-500">รอการเชื่อมต่อเซนเซอร์</div>
      </div>
    );
  }

  // คำนวณสถิติพื้นฐาน
  const heartRates = processedData.map(d => d.y);
  const avgHeartRate = Math.round(heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length);
  const maxHeartRate = Math.max(...heartRates);
  const minHeartRate = Math.min(...heartRates);
  const currentHeartRate = heartRates[heartRates.length - 1];
  const currentClassification = classifyHeartRate(currentHeartRate);

  return (
    <div className="w-full">
      {/* Header with Current Status */}
      <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{currentClassification.icon}</div>
            <div>
              <h3 className="text-lg font-bold text-red-800">Heart Rate Monitor</h3>
              <p className="text-sm text-red-600">Real-time cardiac monitoring</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: currentClassification.color }}>
              {currentHeartRate} bpm
            </div>
            <div className="text-sm font-medium" style={{ color: currentClassification.color }}>
              {currentClassification.status}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📊</span>
            <span className="font-medium text-blue-800">Average</span>
          </div>
          <div className="text-xl font-bold text-blue-600">{avgHeartRate} bpm</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⬇️</span>
            <span className="font-medium text-green-800">Minimum</span>
          </div>
          <div className="text-xl font-bold text-green-600">{minHeartRate} bpm</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⬆️</span>
            <span className="font-medium text-orange-800">Maximum</span>
          </div>
          <div className="text-xl font-bold text-orange-600">{maxHeartRate} bpm</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <div className="h-96">
          <ResponsiveLine
            data={data}
            margin={{ top: 20, right: 30, bottom: 80, left: 80 }}
            xScale={{ type: 'point' }}
            // yScale={{ 
            //   type: 'linear', 
            //   min: Math.max(0, minHeartRate - 10), 
            //   max: Math.min(200, maxHeartRate + 20), 
            //   stacked: false 
            // }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Time (เวลา)',
              legendOffset: 60,
              legendPosition: 'middle',
              format: (value) => value
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Heart Rate (bpm)',
              legendOffset: -60,
              legendPosition: 'middle',
              tickValues: 8
            }}
            lineWidth={3}
            pointSize={8}
            pointColor={{ from: 'seriesColor' }}
            pointBorderWidth={3}
            pointBorderColor={{ from: 'seriesColor', modifiers: [['darker', 0.3]] }}
            enablePointLabel={false}
            useMesh={true}
            enableArea={true}
            areaBaselineValue={Math.max(0, minHeartRate - 10)}
            areaOpacity={0.15}
            colors={[currentClassification.color]}
            enableGridX={true}
            enableGridY={true}
            gridXValues={5}
            gridYValues={8}
            theme={{
              background: 'transparent',
              grid: {
                line: {
                  stroke: '#e5e7eb',
                  strokeWidth: 1,
                  strokeDasharray: '4 4'
                }
              },
              axis: {
                domain: {
                  line: {
                    stroke: '#374151',
                    strokeWidth: 2
                  }
                },
                ticks: {
                  line: {
                    stroke: '#6b7280',
                    strokeWidth: 1
                  },
                  text: {
                    fontSize: 12,
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    fill: '#374151',
                    fontWeight: 500
                  }
                },
                legend: {
                  text: {
                    fontSize: 14,
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    fill: '#1f2937',
                    fontWeight: 600
                  }
                }
              },
              tooltip: {
                container: {
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  fontSize: '14px',
                  color: '#1f2937'
                }
              }
            }}
            tooltip={({ point }) => {
              const classification = classifyHeartRate(point.data.y);
              return (
                <div className="bg-white p-4 rounded-lg border shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{classification.icon}</span>
                    <span className="font-bold text-gray-800">Heart Rate Data</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sequence:</span>
                      <span className="font-medium">#{point.data.sequence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{point.data.xFormatted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heart Rate:</span>
                      <span className="font-bold text-red-600">{point.data.yFormatted} bpm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium" style={{ color: classification.color }}>
                        {classification.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className="font-medium" style={{ color: classification.color }}>
                        {classification.risk}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }}
            markers={[
              {
                axis: 'y',
                value: 60,
                lineStyle: { stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '4 4' },
                legend: 'Min Normal',
                legendPosition: 'top-left'
              },
              {
                axis: 'y', 
                value: 100,
                lineStyle: { stroke: '#10B981', strokeWidth: 2, strokeDasharray: '4 4' },
                legend: 'Max Normal',
                legendPosition: 'top-left'
              },
              {
                axis: 'y',
                value: 130,
                lineStyle: { stroke: '#F59E0B', strokeWidth: 2, strokeDasharray: '4 4' },
                legend: 'High Risk',
                legendPosition: 'top-left'
              }
            ]}
          />
        </div>
      </div>

      {/* Risk Level Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-800 mb-3">Heart Rate Classification</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">&lt; 60 bpm (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">60-100 bpm (Normal)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">100-130 bpm (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">&gt; 130 bpm (Critical)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeartRateChart;
