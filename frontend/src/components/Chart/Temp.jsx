import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { DateTime } from 'luxon';


const TemperatureBarChart = ({ sensorData }) => {
    const data = sensorData.map(d => ({
        id: 'temperature',
        time: DateTime.fromISO(d.timestamp).toFormat('HH:mm'),
        temperature: d.temperature,
        sequence: d.sequence,
    }));

    return (
        <ResponsiveBar
            data={data}
            keys={['temperature']}
            indexBy="time"
            margin={{ top: 70, right: 20, bottom: 120, left: 90 }}
            padding={0.4}
            groupMode="grouped"
            colors={['#ff7e4a']} // สีแดงสำหรับอุณหภูมิ
            borderRadius={4}
            borderColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
            axisBottom={{   
                tickRotation: -45,
                legend: 'เวลา',
                legendPosition: 'middle',
                legendOffset: 50,
                tickPadding: 5,
                colors: "white",
            }}
            axisLeft={{
                legend: 'อุณหภูมิ (°C)',
                legendPosition: 'middle',
                legendOffset: -50,
                
                colors: "white",
            }}
            enableLabel={false}
            tooltip={({  value, indexValue,data }) => (
                <div
                    style={{
                        background: 'white',
                        padding: '10px',
                        border: '2px solid #ccc',
                        borderRadius: '6px',
                        fontFamily: 'Kanit',
                        fontSize: 14,
                        color: '#000000' // สีตัวอักษรใน tooltip
                    }}
                >
                    <strong >ลำดับ: </strong>
                        {data.sequence}<br />
                    <strong>เวลา: </strong> 
                        {indexValue}<br />
                    <strong>อุณหภูมิ: </strong>
                        {value} °C
                    <br />
                    <strong>สถานะ: </strong>  {
                        value < 35 ? 'ต่ำกว่าปกติ' :
                        value <=36 ? 'ต่ำกว่าปกติเล็กน้อย' :
                        value <= 37.2 ? 'ปกติ' :
                        value <= 38 ? 'ไข้ต่ำ' :
                        value <= 39 ? 'ไข้ปานกลาง' :
                        value <= 40 ? 'ไข้สูง' :
                        value > 40 ? 'ไข้สูงมาก' : ''
                    }
                </div>
            )}
            theme={{
                axis: {
                    ticks: {
                        text: {
                            fontSize: 12,
                            fontFamily: 'Kanit',
                            fill: '#000000' // สีขาว
                        }
                    },
                    legend: {
                        text: {
                            fontSize: 14,
                            fontFamily: 'Kanit',
                            fill: '#000000' // สีขาว
                        }
                    }
                },
                tooltip: {
                    container: {
                        fontFamily: 'Kanit',
                        fontSize: 13,
                        background: '#ffffff',
                        fill: '#000000', // สีตัวอักษรใน tooltip
                    }
                },
                
            }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'top-right',
                    direction: 'row',
                    itemWidth: 100,
                    itemHeight: 20,
                    symbolShape: 'circle',
                    translateY: -40,
                    translateX: -5,
                    itemTextColor: '#000000', // สีตัวอักษรใน legend
                }
            ]}
        />
    );
};

export default TemperatureBarChart;
