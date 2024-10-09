import Redis from 'ioredis';
import jsonParse from "../common/helpers/jsonParse";

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
}

export default () => {
    return new CacheManager();
}