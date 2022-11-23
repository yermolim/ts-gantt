export interface AppendableComponent {
  destroy(): void;
  appendTo(parent: Element): void;
  appendToWithOffset(parent: Element, offsetX: number): void;
}
