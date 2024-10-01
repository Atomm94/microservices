import {TIMER as timer} from "./constants";
import connectRabbitMQ from "../messageBroker";

class Logger {
    private intervals: any;
    private devices: any[];

    constructor(devices) {
        this.devices = devices;
        this.intervals = [];
    }

    startLogging() {
        this.intervals = this.devices.map(device => {
            return setInterval(async () => {
                await connectRabbitMQ.produce('timeseries', {
                    deviceId: device.id,
                    deviceName: device.name
                });
            }, timer.EVERY_FIFTEEN_SECONDS);
        });
        console.log("Started logging for devices.");
    }

    stopAllLogging() {
        this.intervals.forEach((intervalId, index) => {
            if (intervalId) {
                clearInterval(intervalId);
                console.log(`Interval cleared for ${this.devices[index].name}!`);
                this.intervals[index] = null;
            }
        });
        console.log("Stopped logging for all devices.");
    }
}

export const logger = (devices) => {
    return new Logger(devices);
}



