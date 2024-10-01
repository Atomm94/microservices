import { Sender } from "@questdb/nodejs-client"

class TimeSeries {
    private readonly sender: Sender;
    private deviceId: string;
    private deviceName: string;
    private status: string;

    constructor(data: any) {
        this.sender = Sender.fromConfig("http::addr=localhost:9000");
        this.deviceId = data.deviceId;
        this.deviceName = data.deviceName;
        this.status = data?.status || 'active';
    }

    async run() {
        try {
            await this.sender
                .table("devices")
                .symbol("deviceId", this.deviceId)
                .stringColumn("deviceName", this.deviceName)
                .stringColumn("status", this.status)
                .at(Date.now(), "ms")

            await this.sender.flush()

            await this.sender.close()
        } catch (error) {
            console.log(error)
        }
    }
}

export default (data) => {
    return new TimeSeries(data).run()
};