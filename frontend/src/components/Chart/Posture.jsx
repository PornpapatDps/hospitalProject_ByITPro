import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { DateTime } from 'luxon';

const postureMap = {
  0: { label: 'อยู่นิ่ง', color: '#EF4444', icon: '🔴', risk: 'ระวัง', bgColor: 'from-red-50 to-red-100' },
  1: { label: 'นอน', color: '#3B82F6', icon: '🛏️', risk: 'ปกติ', bgColor: 'from-blue-50 to-blue-100' },
  2: { label: 'นั่ง', color: '#F59E0B', icon: '🪑', risk: 'ปกติ', bgColor: 'from-yellow-50 to-yellow-100' },
  3: { label: 'ยืน', color: '#10B981', icon: '🧍', risk: 'ดี', bgColor: 'from-green-50 to-green-100' },
  4: { label: 'เดิน', color: '#8B5CF6', icon: '🚶', risk: 'ดีมาก', bgColor: 'from-purple-50 to-purple-100' }
};

const PostureBarChart = ({ sensorData }) => {
  // แปลงข้อมูลและเพิ่มการจำแนกประเภท
  const processedData = (sensorData || [])
    .filter(d => d.timestamp && typeof d.posture === 'number')
    .map(d => ({
      time: DateTime.fromISO(d.timestamp).toFormat('HH:mm'),
      posture: d.posture,
      postureLabel: postureMap[d.posture]?.label || 'ไม่ทราบ',
      sequence: d.sequence,
      timestamp: d.timestamp,
      classification: postureMap[d.posture] || { label: 'ไม่ทราบ', color: '#6B7280', icon: '❓', risk: 'ไม่ทราบ' }
    }));

  if (!processedData || processedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">🏃</div>
        <div className="text-xl font-semibold text-gray-600 mb-2">ไม่มีข้อมูลการเคลื่อนไหว</div>
        <div className="text-sm text-gray-500">รอการเชื่อมต่อเซนเซอร์</div>
      </div>
    );
  }

  // คำนวณสถิติการเคลื่อนไหว
  const postureCounts = processedData.reduce((acc, d) => {
    acc[d.posture] = (acc[d.posture] || 0) + 1;
    return acc;
  }, {});

  const totalRecords = processedData.length;
  const stillCount = postureCounts[0] || 0;
  const activeCount = totalRecords - stillCount;
  const stillPercentage = Math.round((stillCount / totalRecords) * 100);
  const activePercentage = 100 - stillPercentage;

  // หาท่าทางที่พบมากที่สุด
  const mostCommonPosture = Object.entries(postureCounts)
    .sort(([,a], [,b]) => b - a)[0];
  const dominantPosture = mostCommonPosture ? 
    postureMap[mostCommonPosture[0]] : 
    { label: 'ไม่ทราบ', icon: '❓', color: '#6B7280' };

  // ล่าสุดของท่าทาง
  const currentPosture = processedData[processedData.length - 1];
  const currentClassification = currentPosture ? postureMap[currentPosture.posture] : null;

  return (
    <div className="w-full">
      {/* Header with Current Status */}
      {currentClassification && (
        <div className={`mb-6 p-4 bg-gradient-to-r ${currentClassification.bgColor} rounded-lg border border-gray-200`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{currentClassification.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Posture Monitor</h3>
                <p className="text-sm text-gray-600">Movement and posture tracking</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: currentClassification.color }}>
                {currentClassification.label}
              </div>
              <div className="text-sm font-medium" style={{ color: currentClassification.color }}>
                {currentClassification.risk}
              </div>
            </div>
          </div>
          
          {/* Health Alert for Stillness */}
          {stillPercentage > 60 && (
            <div className="mt-3 p-3 bg-white bg-opacity-60 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span className="text-sm font-medium text-red-600">
                  {stillPercentage > 80 ? 
                    'อยู่นิ่งมากเกินไป! ควรเคลื่อนไหวร่างกายบ้าง' : 
                    'อยู่นิ่งค่อนข้างมาก ควรเพิ่มกิจกรรมการเคลื่อนไหว'
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity Statistics */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏃</span>
            <span className="font-medium text-purple-800">Active Time</span>
          </div>
          <div className="text-xl font-bold text-purple-600">{activePercentage}%</div>
          <div className="text-sm text-purple-700">{activeCount} records</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔴</span>
            <span className="font-medium text-red-800">Still Time</span>
          </div>
          <div className="text-xl font-bold text-red-600">{stillPercentage}%</div>
          <div className="text-sm text-red-700">{stillCount} records</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{dominantPosture.icon}</span>
            <span className="font-medium text-green-800">Primary Posture</span>
          </div>
          <div className="text-xl font-bold text-green-600">{dominantPosture.label}</div>
          <div className="text-sm text-green-700">{Math.round((postureCounts[mostCommonPosture?.[0]] || 0) / totalRecords * 100)}%</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <div className="h-96">
          <ResponsiveBar
            data={processedData}
            keys={['posture']}
            indexBy="time"
            margin={{ top: 20, right: 30, bottom: 80, left: 80 }}
            padding={0.3}
            groupMode="grouped"
            colors={bar => postureMap[bar.data.posture]?.color || '#6B7280'}
            borderRadius={4}
            borderWidth={2}
            borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              legend: 'Time (เวลา)',
              legendPosition: 'middle',
              legendOffset: 60
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Posture (ท่าทาง)',
              legendPosition: 'middle',
              legendOffset: -60,
              tickValues: [0, 1, 2, 3, 4],
              format: v => postureMap[v]?.label || v
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            enableGridY={true}
            gridYValues={[0, 1, 2, 3, 4]}
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
            tooltip={({ data }) => {
              const classification = postureMap[data.posture];
              const isStill = data.posture === 0;
              return (
                <div className="bg-white p-4 rounded-lg border shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{classification?.icon || '❓'}</span>
                    <span className="font-bold text-gray-800">Posture Data</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sequence:</span>
                      <span className="font-medium">#{data.sequence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{data.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posture:</span>
                      <span className="font-bold" style={{ color: classification?.color || '#6B7280' }}>
                        {data.postureLabel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Health Status:</span>
                      <span className="font-medium" style={{ color: classification?.color || '#6B7280' }}>
                        {classification?.risk || 'ไม่ทราบ'}
                      </span>
                    </div>
                    {isStill && (
                      <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                        <div className="flex items-center gap-2 text-red-700">
                          <span>⚠️</span>
                          <span className="text-xs">อยู่นิ่งเป็นเวลานานอาจส่งผลเสียต่อสุขภาพ</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* Posture Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-800 mb-3">Posture Classification</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(postureMap).map(([key, posture]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: posture.color }}></div>
              <span className="text-sm text-gray-700">{posture.icon} {posture.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Recommendations */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
          <span className="text-lg">💡</span>
          Health Recommendations
        </h4>
        <div className="space-y-2 text-sm text-blue-700">
          {stillPercentage > 70 && (
            <div className="flex items-center gap-2">
              <span>🚶</span>
              <span>ควรเพิ่มกิจกรรมการเคลื่อนไหว เช่น เดิน ยืน หรือออกกำลังกายเบาๆ</span>
            </div>
          )}
          {stillPercentage > 50 && stillPercentage <= 70 && (
            <div className="flex items-center gap-2">
              <span>⏰</span>
              <span>ควรหยุดพักและเปลี่ยนท่าทางทุก 30-60 นาที</span>
            </div>
          )}
          {activePercentage > 60 && (
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>ดี! มีการเคลื่อนไหวที่เหมาะสม ช่วยส่งเสริมสุขภาพ</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>เป้าหมาย: ควรมีการเคลื่อนไหวอย่างน้อย 50% ของเวลา</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureBarChart;
