import { config } from 'dotenv';
import { z } from 'zod';

if (process.env?.NODE_ENV === 'test') {
  config({ path: '.env.test' });
  /* c8 ignore next 3 */
} else {
  config();
}

const envSchema = z.object({
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL environment variable is required',
  }),
  HOST: z.string().optional().default('localhost'),
  PORT: z.coerce.number().default(3333),
  LOGGER: z.enum(['true', 'false']).default('false'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'], {
      required_error: 'NODE_ENV environment variable is required',
    })
    .default('production'),
});

const _env = envSchema.safeParse(process.env);

/* c8 ignore next 8 */
if (!_env.success) {
  console.error({
    message: '⚠️ Invalid environment variables',
    error: _env.error.format(),
  });

  throw _env.error.format();
}

export const env = _env.data;
