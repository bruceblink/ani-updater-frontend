import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  apiUrl: string;
};

// 工具函数：优先取 Vercel 环境变量
function getEnvVar(key: string, fallback: string): string {
  const value = import.meta.env[key] as string | undefined;
  return value ?? fallback;
}

export const CONFIG: ConfigValue = {
  appName: 'Minimal UI',
  appVersion: packageJson.version,
  apiUrl: getEnvVar("VITE_API_URL", "http://localhost:8000"),
};
