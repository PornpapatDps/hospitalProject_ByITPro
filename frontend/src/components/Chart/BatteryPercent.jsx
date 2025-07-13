import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateTime } from 'luxon';

const BatteryPercent = ({ sensorData }) => {
  // ฟังก์ชันจำแนกระดับแบตเตอรี่
  const classifyBatteryLevel = (level) => {
    if (level >= 75) return { 
      status: 'เต็ม', 
      color: '#10B981', 
      icon: '🔋', 
      risk: 'ปกติ',
      bgColor: 'from-green-50 to-green-100' 
    };
    if (level >= 50) return { 
      status: 'ดี', 
      color: '#22C55E', 
      icon: '🔋', 
      risk: 'ปกติ',
      bgColor: 'from-green-50 to-green-100' 
    };
    if (level >= 30) return { 
      status: 'ปานกลาง', 
      color: '#F59E0B', 
      icon: '🔋', 
      risk: 'เฝ้าระวัง',
      bgColor: 'from-yellow-50 to-yellow-100' 
    };
    if (level >= 15) return { 
      status: 'ต่ำ', 
      color: '#F97316', 
      icon: '🪫', 
      risk: 'ควรชาร์จ',
      bgColor: 'from-orange-50 to-orange-100' 
    };
    return { 
      status: 'ต่ำมาก', 
      color: '#EF4444', 
      icon: '🔴', 
      risk: 'ต้องชาร์จด่วน',
      bgColor: 'from-red-50 to-red-100' 
    };
  };

  // ตรวจสอบข้อมูลและจัดรูปแบบ
  const chartData = sensorData
    ?.filter(item => item.BatteryPercent !== undefined && item.BatteryPercent !== null)
    ?.map(item => ({
      time: DateTime.fromISO(item.timestamp).toFormat('HH:mm'),
      fullTime: DateTime.fromISO(item.timestamp).toFormat('dd/MM HH:mm'),
      BatteryPercent: item.BatteryPercent || 0,
      timestamp: item.timestamp,
      classification: classifyBatteryLevel(item.BatteryPercent || 0)
    }))
    ?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) || [];

  // หาค่าแบตเตอรี่ล่าสุด
  const latestBattery = chartData.length > 0 ? chartData[chartData.length - 1].BatteryPercent : 0;
  const latestClassification = classifyBatteryLevel(latestBattery);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">🔋</div>
        <div className="text-xl font-semibold text-gray-600 mb-2">ไม่มีข้อมูลแบตเตอรี่</div>
        <div className="text-sm text-gray-500">รอการเชื่อมต่อเซนเซอร์</div>
      </div>
    );
  }

  // คำนวณสถิติพื้นฐาน
  const batteryLevels = chartData.map(d => d.BatteryPercent);
  const avgBattery = Math.round(batteryLevels.reduce((sum, level) => sum + level, 0) / batteryLevels.length);
  const maxBattery = Math.max(...batteryLevels);
  const minBattery = Math.min(...batteryLevels);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const classification = classifyBatteryLevel(data.BatteryPercent);
      return (
        <div className="bg-white p-4 rounded-lg border shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{classification.icon}</span>
            <span className="font-bold text-gray-800">Battery Status</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{data.fullTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Battery Level:</span>
              <span className="font-bold" style={{ color: classification.color }}>
                {data.BatteryPercent}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium" style={{ color: classification.color }}>
                {classification.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Action:</span>
              <span className="font-medium" style={{ color: classification.color }}>
                {classification.risk}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // ไอคอนแบตเตอรี่
  const BatteryIcon = ({ level }) => {
    const classification = classifyBatteryLevel(level);
    return (
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-6 border-2 border-gray-400 rounded-sm">
          <div className="absolute top-1/2 -right-1 w-1 h-3 bg-gray-400 rounded-r transform -translate-y-1/2"></div>
          <div 
            className="h-full rounded-sm transition-all duration-500"
            style={{ 
              width: `${level}%`, 
              backgroundColor: classification.color,
              minWidth: level > 0 ? '10%' : '0%'
            }}
          ></div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: classification.color }}>
            {level}%
          </div>
          <div className="text-sm font-medium" style={{ color: classification.color }}>
            {classification.status}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header with Current Status */}
      <div className={`mb-6 p-4 bg-gradient-to-r ${latestClassification.bgColor} rounded-lg border border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{latestClassification.icon}</div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Battery Monitor</h3>
              <p className="text-sm text-gray-600">Device power management</p>
            </div>
          </div>
          <div className="text-right">
            <BatteryIcon level={latestBattery} />
          </div>
        </div>
        
        {/* Battery Status Alert */}
        {latestBattery < 30 && (
          <div className="mt-3 p-3 bg-white bg-opacity-60 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium" style={{ color: latestClassification.color }}>
                {latestBattery < 15 ? 'แบตเตอรี่เหลือน้อยมาก! กรุณาชาร์จด่วน' : 'แบตเตอรี่เหลือน้อย กรุณาชาร์จ'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📊</span>
            <span className="font-medium text-blue-800">Average</span>
          </div>
          <div className="text-xl font-bold text-blue-600">{avgBattery}%</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⬆️</span>
            <span className="font-medium text-green-800">Maximum</span>
          </div>
          <div className="text-xl font-bold text-green-600">{maxBattery}%</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⬇️</span>
            <span className="font-medium text-orange-800">Minimum</span>
          </div>
          <div className="text-xl font-bold text-orange-600">{minBattery}%</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tickValues={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="BatteryPercent" 
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
                name="Battery Level (%)"
              />
              {/* Reference lines */}
              <Line 
                type="monotone" 
                dataKey={() => 75} 
                stroke="#10B981" 
                strokeWidth={2} 
                strokeDasharray="8 8" 
                dot={false}
                activeDot={false}
                name="Good Level"
              />
              <Line 
                type="monotone" 
                dataKey={() => 30} 
                stroke="#F59E0B" 
                strokeWidth={2} 
                strokeDasharray="8 8" 
                dot={false}
                activeDot={false}
                name="Low Level"
              />
              <Line 
                type="monotone" 
                dataKey={() => 15} 
                stroke="#EF4444" 
                strokeWidth={2} 
                strokeDasharray="8 8" 
                dot={false}
                activeDot={false}
                name="Critical Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Battery Level Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-bold text-gray-800 mb-3">Battery Level Classification</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">75-100% (Full)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
            <span className="text-sm text-gray-700">50-75% (Good)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">30-50% (Medium)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-700">15-30% (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">&lt; 15% (Critical)</span>
          </div>
        </div>
      </div>

      {/* Device Status */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Device Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span>Last Update: {DateTime.now().toFormat('HH:mm:ss')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>📊</span>
            <span>Records: {chartData.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryPercent;
