import cron from 'node-cron';
import { TIME } from "./constants";

class CronJob {
    private task: cron.ScheduledTask;

    constructor(cronTime: string) {
        this.task = cron.schedule(cronTime, this.executeTask.bind(this));
    }

    private executeTask() {
        console.log('Running scheduled task at:', new Date().toISOString());
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
// cronJob.start();
//
setTimeout(() => {
    cronjob.stop();
}, 5 * 60 * 1000);
