import {TIMER as timer} from "../common/enums/timer";
import {Queues as queues} from '../common/enums/queues'
import connectRabbitMQ from "../messageBroker";
import cacheManager from '../casheManager';

class Logger {
    private intervals: any;
    private devices: any[];
    private cacheManager;

    constructor() {
        this.cacheManager = cacheManager()
        this.intervals = [];
    }

    async startLogging() {
        this.devices = await this.cacheManager.getAll();

        if (this.devices.length === 0) {
            console.log('no devices found');
            return;
        }

        this.intervals = this.devices.map(device => {
            return setInterval(async () => {
                await connectRabbitMQ.produce(queues.TIME_SERIES, {
                    _id: device._id,
                    name: device.name,
                    status: device.status,
                    lastPingTime: new Date().toLocaleString(),
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

export const logger = () => {
    return new Logger();
}



