import "./styles.css";

export class TsGantt {
  public property = "test";

  private getRandomId(): string {
    return crypto.getRandomValues(new Uint32Array(4)).join("-");
  }
}
