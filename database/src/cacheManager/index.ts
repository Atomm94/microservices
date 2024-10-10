import Redis from 'ioredis';
import jsonParse from "../common/helpers/jsonParse";

class CacheManager {
    private redis;

    constructor() {
        this.redis = new Redis();
    }

    async getOne(key: string) {
        const value: any = jsonParse(await this.redis.get(key))

        const { checked, ...respValue } = value

        return {_id: key, ...respValue};
    }
}

export default () => {
    return new CacheManager();
}