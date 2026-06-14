type EnvMap = Record<string, string | undefined>;

const importMetaEnv = ((import.meta as ImportMeta & { env?: EnvMap }).env ?? {}) as EnvMap;

export function readEnv(name: string): string | undefined {
  const runtimeValue = typeof process !== 'undefined' ? process.env[name] : undefined;
  if (runtimeValue && runtimeValue !== 'undefined') {
    return runtimeValue;
  }

  const devValue = importMetaEnv[name];
  if (devValue && devValue !== 'undefined') {
    return devValue;
  }

  return undefined;
}

export function requireEnv(names: string[]): Record<string, string> {
  const missing: string[] = [];
  const resolved: Record<string, string> = {};

  for (const name of names) {
    const value = readEnv(name);
    if (!value) {
      missing.push(name);
      continue;
    }
    resolved[name] = value;
  }

  if (missing.length > 0) {
    throw new Error(`Missing Firebase env vars: ${missing.join(', ')}`);
  }

  return resolved;
}
