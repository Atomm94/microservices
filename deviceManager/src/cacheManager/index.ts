import Redis from 'ioredis';

class CacheManager {
    private redis;

    constructor() {
        this.redis = new Redis();
    }

    async get() {
        const keys = await this.redis.keys('*');

        if (keys.length === 0) {
            console.log('No keys found.');
            return 0;
        }

        return keys;
    }

    async insertMany(data: any[]) {
        const pipeline = this.redis.pipeline();
        try {
            data.map(el => {

                pipeline.set(el.id, `value$`);
            })

            const results = await pipeline.exec();

            console.log('All keys have been set.');
        } catch (err) {
            console.error('Error executing pipeline:', err);
        } finally {
            await this.redis.quit();
        }
    }
}

export default () => {
    return new CacheManager();
}