class TsGantt {
    constructor() {
        this.property = "test";
    }
    getRandomId() {
        return crypto.getRandomValues(new Uint32Array(4)).join("-");
    }
}

export { TsGantt };
