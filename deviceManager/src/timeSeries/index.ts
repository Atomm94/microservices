import { Sender } from "@questdb/nodejs-client"

class TimeSeries {
    private readonly sender: Sender;
    private deviceId: string;
    private deviceName: string;
    private status: string;
    private lastPingTime: string;

    constructor(data: any) {
        this.sender = Sender.fromConfig("http::addr=localhost:9000");
        this.deviceId = data._id;
        this.deviceName = data.name;
        this.status = data?.status || 'active';
        this.lastPingTime = data.lastPingTime;
    }

    async run() {
        try {
            await this.sender
                .table("devices")
                .symbol("deviceId", this.deviceId)
                .stringColumn("name", this.deviceName)
                .stringColumn("status", this.status)
                .stringColumn("lastPingTime", this.lastPingTime)
                .at(Date.now(), "ms")

            await this.sender.flush()

            await this.sender.close()

            return;
        } catch (error) {
            console.log(error)
        }
    }
}

export default (data) => {
    return new TimeSeries(data).run()
};