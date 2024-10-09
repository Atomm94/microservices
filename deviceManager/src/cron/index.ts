import cron from 'node-cron';
import cacheManager from '../cacheManager';
import { TIME } from "./constants";
import {DeviceStatus as deviceStatus} from "../common/enums/deviceStatus";
import { DatabaseRoutes as routes } from '../common/enums/databaseRoutes';
import messageBroker from "../messageBroker";

class CronJob {
    private task: cron.ScheduledTask;

    constructor(cronTime: string) {
        this.task = cron.schedule(cronTime, this.executeTask.bind(this));
    }

    private async executeTask() {
        console.log('Running scheduled task at:', new Date().toISOString());
        const devices: any[] = await cacheManager().getAll();

        if (!devices.length) {
            console.log('no devices')
            return;
        }

        const updateData = devices.map(device => {
            if (!device.checked) {
                device.status = deviceStatus.INACTIVE;
            }

            return device;
        })

        await cacheManager().insertMany({ data: updateData });

        return await messageBroker.produce(routes.UPDATE_MANY_DEVICES, updateData);
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

export const cronjob = new CronJob(TIME.EVERY_THIRTYFIVE_SECONDS);

