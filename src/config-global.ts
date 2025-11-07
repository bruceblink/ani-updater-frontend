import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
    appName: string;
    appTitle: string;
    appVersion: string;
    apiUrl: string;
    projectUrl: string;
    isBrowser: string;
};

// 工具函数：优先取 Vercel 环境变量
function getEnvVar(key: string, fallback: string): string {
    const value = import.meta.env[key] as string | undefined;
    return value ?? fallback;
}

export const CONFIG: ConfigValue = {
    appName: getEnvVar('VITE_APP_NAME', 'Ani Updater'),
    appTitle: getEnvVar('VITE_APP_TITLE', 'Ani Updater'),
    appVersion: packageJson.version,
    apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:8000'),
    projectUrl: getEnvVar('VITE_PROJECT_URL', 'https://github.com/bruceblink/ani-updater-frontend'),
    isBrowser: getEnvVar('VITE_IS_BROWSER', 'false'),
};
