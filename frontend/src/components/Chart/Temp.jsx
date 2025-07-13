import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { DateTime } from 'luxon';

const TemperatureBarChart = ({ sensorData }) => {
    // ฟังก์ชันจำแนกระดับอุณหภูมิ
    const classifyTemperature = (temp) => {
        if (temp < 35) return { 
            status: 'ต่ำกว่าปกติมาก', 
            color: '#3B82F6', 
            icon: '🥶', 
            risk: 'เฝ้าระวัง',
            bgColor: 'from-blue-50 to-blue-100' 
        };
        if (temp <= 36) return { 
            status: 'ต่ำกว่าปกติเล็กน้อย', 
            color: '#06B6D4', 
            icon: '❄️', 
            risk: 'ปกติ',
            bgColor: 'from-cyan-50 to-cyan-100' 
        };
        if (temp <= 37.2) return { 
            status: 'ปกติ', 
            color: '#10B981', 
            icon: '✅', 
            risk: 'ปกติ',
            bgColor: 'from-green-50 to-green-100' 
        };
        if (temp <= 38) return { 
            status: 'ไข้ต่ำ', 
            color: '#F59E0B', 
            icon: '🌡️', 
            risk: 'เฝ้าระวัง',
            bgColor: 'from-yellow-50 to-yellow-100' 
        };
        if (temp <= 39) return { 
            status: 'ไข้ปานกลาง', 
            color: '#F97316', 
            icon: '🔥', 
            risk: 'ระวัง',
            bgColor: 'from-orange-50 to-orange-100' 
        };
        if (temp <= 40) return { 
            status: 'ไข้สูง', 
            color: '#EF4444', 
            icon: '🚨', 
            risk: 'อันตราย',
            bgColor: 'from-red-50 to-red-100' 
        };
        return { 
            status: 'ไข้สูงมาก', 
            color: '#DC2626', 
            icon: '⚠️', 
            risk: 'อันตรายมาก',
            bgColor: 'from-red-100 to-red-200' 
        };
    };

    // แปลงข้อมูลและเพิ่มการจำแนกประเภท
    const processedData = (sensorData || [])
        .filter(d => d.timestamp && typeof d.temperature === 'number')
        .map(d => {
            const classification = classifyTemperature(d.temperature);
            return {
                time: DateTime.fromISO(d.timestamp).toFormat('HH:mm'),
                temperature: d.temperature,
                sequence: d.sequence,
                timestamp: d.timestamp,
                classification: classification,
                color: classification.color
            };
        });

    if (!processedData || processedData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                <div className="text-6xl mb-4">🌡️</div>
                <div className="text-xl font-semibold text-gray-600 mb-2">ไม่มีข้อมูลอุณหภูมิ</div>
                <div className="text-sm text-gray-500">รอการเชื่อมต่อเซนเซอร์</div>
            </div>
        );
    }

    // คำนวณสถิติพื้นฐาน
    const temperatures = processedData.map(d => d.temperature);
    const avgTemp = (temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length).toFixed(1);
    const maxTemp = Math.max(...temperatures).toFixed(1);
    const minTemp = Math.min(...temperatures).toFixed(1);
    const currentTemp = temperatures[temperatures.length - 1];
    const currentClassification = classifyTemperature(currentTemp);

    return (
        <div className="w-full">
            {/* Header with Current Status */}
            <div className={`mb-6 p-4 bg-gradient-to-r ${currentClassification.bgColor} rounded-lg border border-gray-200`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">{currentClassification.icon}</div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Temperature Monitor</h3>
                            <p className="text-sm text-gray-600">Body temperature tracking</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: currentClassification.color }}>
                            {currentTemp?.toFixed(1)}°C
                        </div>
                        <div className="text-sm font-medium" style={{ color: currentClassification.color }}>
                            {currentClassification.status}
                        </div>
                    </div>
                </div>
                
                {/* Risk Alert */}
                {currentClassification.risk !== 'ปกติ' && (
                    <div className="mt-3 p-3 bg-white bg-opacity-60 rounded-lg">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{currentClassification.icon}</span>
                            <span className="text-sm font-medium" style={{ color: currentClassification.color }}>
                                Risk Level: {currentClassification.risk}
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
                    <div className="text-xl font-bold text-blue-600">{avgTemp}°C</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⬇️</span>
                        <span className="font-medium text-green-800">Minimum</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">{minTemp}°C</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⬆️</span>
                        <span className="font-medium text-orange-800">Maximum</span>
                    </div>
                    <div className="text-xl font-bold text-orange-600">{maxTemp}°C</div>
                </div>
            </div>

            {/* Chart Container */}
            <div className="bg-white rounded-lg shadow-lg p-6 border">
                <div className="h-96">
                    <ResponsiveBar
                        data={processedData}
                        keys={['temperature']}
                        indexBy="time"
                        margin={{ top: 20, right: 30, bottom: 80, left: 80 }}
                        padding={0.3}
                        groupMode="grouped"
                        colors={(d) => d.data.color}
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
                            legend: 'Temperature (°C)',
                            legendPosition: 'middle',
                            legendOffset: -60,
                            //tickValues: [34, 35, 36, 37, 38, 39, 40, 41]
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        enableGridY={true}
                        gridYValues={[35, 36, 37.2, 38, 39, 40]}
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
                        tooltip={({ value, indexValue, data }) => {
                            const classification = classifyTemperature(value);
                            return (
                                <div className="bg-white p-4 rounded-lg border shadow-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">{classification.icon}</span>
                                        <span className="font-bold text-gray-800">Temperature Data</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Sequence:</span>
                                            <span className="font-medium">#{data.sequence}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Time:</span>
                                            <span className="font-medium">{indexValue}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Temperature:</span>
                                            <span className="font-bold" style={{ color: classification.color }}>
                                                {value}°C
                                            </span>
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
                    />
                </div>
            </div>

            {/* Temperature Range Legend */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-3">Temperature Classification</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">&lt; 35°C (Low)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">35-37.2°C (Normal)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">37.2-38°C (Low Fever)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">&gt; 38°C (High Fever)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemperatureBarChart;
