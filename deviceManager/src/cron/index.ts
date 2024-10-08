import cron from 'node-cron';
import cacheManager from '../cacheManager';
import { TIME } from "./constants";
import {DeviceStatus as deviceStatus} from "../common/enums/deviceStatus";

class CronJob {
    private task: cron.ScheduledTask;
    private cacheManager;

    constructor(cronTime: string) {
        this.task = cron.schedule(cronTime, this.executeTask.bind(this));
        this.cacheManager = cacheManager();
    }

    private async executeTask() {
        console.log('Running scheduled task at:', new Date().toISOString());
        const devices = await this.cacheManager.getAll();
        console.log('d')
        console.log(devices)
        if (!devices.length) {
            console.log('no devices')
            return;
        }
        // const inactiveDevices = devices.filter(device => device.checked);
        //
        // if (!inactiveDevices.length) return;
        // console.log('dd')
        // const updatedData = devices.map(device => {
        //     if (device.checked) {
        //         console.log('a')
        //         device.status === deviceStatus.INACTIVE
        //     }
        //     console.log('v')
        //     device.checked = 0;
        // })
        //
        // console.log(updatedData)

        //const updatedStatuses = inactiveDevices.map(device => device.status === deviceStatus.INACTIVE)

        //await this.cacheManager.insertMany(updatedStatuses);
    }

    public start() {
        this.task.start();
        console.log('Cron job started');
    }

    public stop() {
        this.task.stop();
        console.log('Cron job stopped');
    }
}

export const cronjob = new CronJob(TIME.EVERY_THIRTY_SECONDS);

