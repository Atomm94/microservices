import Redis from 'ioredis';
import jsonParse from "../common/helpers/jsonParse";

class CacheManager {
    private redis;

    constructor() {
        this.redis = new Redis();
    }

    async getOne(key: string) {
        const value: any = jsonParse(await this.redis.get(key))

        return {_id: key, ...value};
    }
}

export default () => {
    return new CacheManager();
}