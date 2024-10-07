import Redis from 'ioredis';

class CacheManager {
    private redis;

    constructor() {
        this.redis = new Redis();
    }

    async insertMany(dbResponse: any) {
        const pipeline = this.redis.pipeline();
        try {
            dbResponse.data.map(el => {
                pipeline.set(el._id, JSON.stringify({ name: el.name, status: el.status, lastPingTime: el.lastPingTime }));
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
            return await this.redis.set(data._id, JSON.stringify({ name: data.name, status: data.status, lastPingTime: data.lastPingTime }));
        } catch (err) {
            console.error('Error executing set method:', err);
        }
    }
}

export default () => {
    return new CacheManager();
}