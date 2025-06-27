import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { DateTime } from 'luxon';

const BloodPressureBarChart = ({ sensorData }) => {
    const data = sensorData.map(d => {
        const time = DateTime.fromISO(d.timestamp).toFormat('HH:mm');
        return {
            sequence: d.sequence,
            time,
            systolic: d.systolic,
            diastolic: d.diastolic,
            bp_status: d.bp_status,
            
        };
    });

    return (
        <ResponsiveBar
            data={data}
            keys={['systolic', 'diastolic']}
            indexBy="time"
            margin={{ top: 50, right: 20, bottom: 135, left: 90 }}
            padding={0.3}
            groupMode="grouped"
            colors={{ scheme: 'set2' }}
            borderRadius={4}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisBottom={{
                tickRotation: -45,
                legend: 'เวลา',
                legendPosition: 'middle',
                legendOffset: 60,
                tickPadding: 5,
            }}
            axisLeft={{
                legend: 'ความดันโลหิต (mmHg)',
                legendPosition: 'middle',
                legendOffset: -50,
            }}
            enableLabel={false}
            tooltip={({ id, value, indexValue, data }) => (
                <div
                    style={{
                        background: 'white',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontFamily: 'Kanit',
                        color: '#000000' // สีตัวอักษรใน tooltip
                    }}
                >
                    <strong className=''>ลำดับ: </strong>{data.sequence}<br />
                    
                    <strong>
                        {id === 'systolic' ? 'ความดันโลหิตสูง' : 'ความดันโลหิตต่ำ'}
                    </strong><br />
                    <strong>เวลา: </strong>{indexValue}<br />
                    <strong>ค่า: </strong>{value} mmHg <br />
                    <strong>สถานะ:</strong> {
                        data.bp_status === 3 ? 'สูง' :
                        data.bp_status === 2 ? 'เริ่มสูง' :
                        data.bp_status === 1 ? 'ปกติ' :
                        data.bp_status === 0 ? 'ต่ำ' : 'ไม่ทราบ'
                    }<br />
                </div>
            )}
            theme={{
                axis: {
                    ticks: {
                        text: {
                            fontSize: 12,
                            fontFamily: 'Kanit',
                            fill: '#000000' // สีตัวเลขแกน
                        }
                    },
                    legend: {
                        text: {
                            fontSize: 14,
                            fontFamily: 'Kanit',
                            fill: '#000000' // สีชื่อแกน
                        }
                    }
                },
                legends: {
                    text: {
                        fontSize: 12,
                        fontFamily: 'Kanit',
                        fill: '#000000' // สีคำอธิบาย legend
                    }
                },
                tooltip: {
                    container: {
                        fontFamily: 'Kanit',
                        fontSize: 13,
                        background: '#ffffff',
                        color: '#000000' // สีตัวอักษรใน tooltip
                    }
                }
            }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'top-right',
                    direction: 'row',
                    itemWidth: 100,
                    itemHeight: 10,
                    symbolShape: 'circle',
                    translateY: -40,
                    translateX: 5,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000000'
                            }
                        },
                        {
                            style: {
                                itemTextColor: '#000000' // สีปกติของ legend
                            }
                        }
                    ]
                }
            ]}
        />
    );
};

export default BloodPressureBarChart;
