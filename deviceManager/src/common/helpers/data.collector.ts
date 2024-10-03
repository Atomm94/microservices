class DataCollector {
    private collector: any = new Map();

    collect(data: any) {
        const { id, ...value } = data;

        if (this.collector.has(id)) {
            this.collector.delete(id);
        }
        this.collector.set(id, value);

        return 'ok';
    }

    get() {
        return this.collector;
    }
}

export default () => {
    return new DataCollector();
}