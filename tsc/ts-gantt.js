import "./styles.css";
export class TsGantt {
    constructor() {
        this.property = "test";
    }
    getRandomId() {
        return crypto.getRandomValues(new Uint32Array(4)).join("-");
    }
}
//# sourceMappingURL=ts-gantt.js.map