const { InfluxDB } = require('@influxdata/influxdb-client');
const dotenv = require('dotenv');
const { DateTime } = require('luxon');

dotenv.config();

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const influxDB = new InfluxDB({ url, token });
const queryApi = influxDB.getQueryApi(org);

async function fetchSensorHospitalLatest() {
    const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -2h)
      |> filter(fn: (r) => r._measurement == "Hospital01")
      |> last()
  `;

    const results = [];

    return new Promise((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                results.push({
                    field: o._field,
                    value: o._value,
                    time: o._time
                });
            },
            error(error) {
                console.error("INFLUX ERROR:", error);
                reject(error);
            },
            complete() {
                const resultMap = new Map();

                results.forEach(item => {
                    const key = item.time;
                    if (!key) return;

                    if (!resultMap.has(key)) {
                        resultMap.set(key, {});
                    }

                    resultMap.get(key)[item.field] = item.value;
                });

                const resultArray = Array.from(resultMap.values())
                    .filter(obj => obj.timestamp !== undefined && obj.sequence !== undefined 
                    )
                    .map(obj => {
                        const tsUnix = Number(obj.timestamp); // สมมุติ timestamp เป็น Unix
                        const timestamp = DateTime
                            .fromSeconds(tsUnix - 7 * 60 * 60)
                            .setZone('Asia/Bangkok')
                            .toISO({ suppressMilliseconds: true });


                        return {
                            sequence: obj.sequence,
                            timestamp,
                            bp_status : obj.bp_status,
                            BatteryPercent: obj.BatteryPercent,
                            emi: obj.emi,
                            heart_rate: obj.heart_rate,
                            posture : obj.posture,
                            sequence: obj.sequence,
                            temperature: obj.temperature,
                        };
                    });

                resolve(resultArray);
            }
        });
    });
}

async function fetchSensorHospital() {
    const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -20d)
      |> filter(fn: (r) => r._measurement == "Hospital01")
    `;

    const results = [];

    return new Promise((resolve, reject) => {
        queryApi.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const o = tableMeta.toObject(row);
                results.push({
                    field: o._field,
                    value: o._value,
                    time: o._time
                });
            },
            error(error) {
                console.error("INFLUX ERROR:", error);
                reject(error);
            },
            complete() {
                const resultMap = new Map();

                results.forEach(item => {
                    const key = item.time;
                    if (!key) return;
                    if (!resultMap.has(key)) {
                        resultMap.set(key, {});
                    }

                    resultMap.get(key)[item.field] = item.value;
                });

                const resultArray = Array.from(resultMap.values())
                    .filter(obj => obj.timestamp !== undefined && obj.sequence !== undefined)
                    .map(obj => {
                        const tsUnix = Number(obj.timestamp);
                        const timestamp = DateTime
                            .fromSeconds(tsUnix - 7 * 60 * 60)
                            .setZone('Asia/Bangkok')
                            .toISO({ suppressMilliseconds: true });

                        return {
                            sequence: obj.sequence,
                            timestamp,
                            bp_status: obj.bp_status,
                            BatteryPercent: obj.BatteryPercent,
                            emi: obj.emi,
                            heart_rate: obj.heart_rate,
                            posture: obj.posture,
                            temperature: obj.temperature,
                        };
                    });

                resolve(resultArray);
            }
        });
    });
}


module.exports = {
    fetchSensorHospitalLatest, fetchSensorHospital
};