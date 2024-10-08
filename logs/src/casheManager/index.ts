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
}

export default () => {
    return new CacheManager();
}