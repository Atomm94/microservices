import cacheManager from '../../cacheManager';

class LoggerList {
    private cacheManager;

    constructor() {
        this.cacheManager = cacheManager()
    }

    async get() {
        const devices = await this.cacheManager.getAll();

        if (devices.length === 0) {
            console.log('no devices found');
            return;
        }

        return devices.map(device => device);
    }
}

export default () => {
    return new LoggerList().get();
}