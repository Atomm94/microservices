import Redis from 'ioredis';

class CacheManager {
    private redis;

    constructor() {
        this.redis = new Redis();
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