export interface ICollectResult {
  lenses: Record<string, Record<string, number>>;
  dependencies: Record<string, string[]>;
}
