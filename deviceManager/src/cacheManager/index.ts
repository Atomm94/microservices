import Redis from 'ioredis';

class CacheManager {
    private redis;

    constructor() {
        this.redis = new Redis();
    }

    async getAll() {
        const keys = await this.redis.keys('*')

        return await Promise.all(keys.map(async key => {
            return { _id: key, ...JSON.parse(await this.redis.get(key)) }
        }));
    }

    async getOne(key: string) {
        return {_id: key, ...JSON.parse(await this.redis.get(key))};
    }

    async insertMany(dbResponse: any) {
        const pipeline = this.redis.pipeline();
        try {
            dbResponse.data.map(el => {
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
            console.log(data)
            return await this.redis.set(data._id, JSON.stringify({ name: data.name, status: data.status, lastPingTime: data.lastPingTime, checked: 1 }));
        } catch (err) {
            console.error('Error executing checked method:', err);
        }
    }
}

export default () => {
    return new CacheManager();
}