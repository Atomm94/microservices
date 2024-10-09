import Redis from 'ioredis';
import jsonParse from "../common/helpers/jsonParse";
import {DeviceStatus as deviceStatus} from "../common/enums/deviceStatus";

class CacheManager {
    private redis;

    constructor() {
        this.redis = new Redis();
    }

    async getAll() {
        const keys = await this.redis.keys('*')

        return await Promise.all(keys.map(async key => {
            const values: any = jsonParse(await this.redis.get(key))

            return {_id: key, ...values };
        }));
    }

    async getOne(key: string) {
        const value: any = jsonParse(await this.redis.get(key))

        return {_id: key, ...value};
    }

    async insertMany(dbResponse: any) {
        const pipeline = this.redis.pipeline();
        try {
            const { data } = dbResponse;

            data.map(el => {
                pipeline.set(el._id, JSON.stringify({ name: el.name, status: el.status, lastPingTime: el.lastPingTime, checked: 0 }));
            })

            await pipeline.exec();

            console.log('All keys have been set.');
        } catch (err) {
            console.error('Error executing pipeline:', err);
        } finally {
            await this.redis.quit();
        }
    }

    async create(dbResponse: any) {
        try {
            const { data } = dbResponse;

            return await this.redis.set(data._id, JSON.stringify({ name: data.name, status: data.status, lastPingTime: data.lastPingTime, checked: 0 }));
        } catch (err) {
            console.error('Error executing set method:', err);
        }
    }

    async checked(data: any) {
        try {
            return await this.redis.set(data._id, JSON.stringify({ name: data.name, status: deviceStatus.ACTIVE, lastPingTime: data.lastPingTime, checked: 1 }));
        } catch (err) {
            console.error('Error executing checked method:', err);
        }
    }
}

export default () => {
    return new CacheManager();
}