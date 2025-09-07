import { CONFIG } from 'src/config-global';

const PROXY_PREFIX = `${CONFIG.apiUrl}/api/proxy/image?url=`;

// 关键字白名单，只要 url 包含这些字符串，就走代理
const ALLOWED_KEYWORDS = ['hdslb.com', 'iqiyipic.com'] as const;

/**
 * 判断 URL 是否包含白名单关键字
 */
export function isAllowedHost(url: string): boolean {
  if (!url) return false;

  // 相对路径 (./ 或 / 开头) 不代理
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return false;
  }

  return ALLOWED_KEYWORDS.some((domain) => url.includes(domain));
}

/**
 * 返回要用于 img.src 的地址：
 * - 如果 URL 包含白名单关键字 → 返回代理地址
 * - 否则返回原始 url（不走代理）
 */
export function getImageSrc(url: string): string {
  if (!url) return url;
  // 如果是 data: 或 blob: 也不走代理
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  return isAllowedHost(url) ? PROXY_PREFIX + encodeURIComponent(url) : url;
}
