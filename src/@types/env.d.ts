type BooleanType = 'true' | 'false';
type NodeEnv = 'development' | 'test' | 'production';

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      HOST?: string;
      NODE_ENV: NodeEnv;
      LOGGER?: BooleanType;
      DATABASE_URL: string;
      POSTGRESQL_USERNAME?: string;
      POSTGRESQL_PASSWORD?: string;
      POSTGRESQL_DATABASE?: string;
      POSTGRESQL_PORT?: string;
    }
  }
}
