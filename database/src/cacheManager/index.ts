import Redis from 'ioredis';

class CacheManager {
    private redis;

    constructor() {
        this.redis = new Redis();
    }

    async getOne(key: string) {
        return {_id: key, ...JSON.parse(await this.redis.get(key))};
    }
}

export default () => {
    return new CacheManager();
}