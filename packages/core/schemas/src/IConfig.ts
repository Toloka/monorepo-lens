export interface IConfig {
  collectors: Record<string, object>;
  plugins?: Record<string, object>;
  lenses: Record<string, object>;
  reporters: Record<string, object>;
}
