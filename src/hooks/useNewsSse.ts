import { useRef, useState, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/config-global';

// SSE 推送的单条新闻结构（服务端 JSON 字段与此对应）
export interface SseNewsItem {
    id: number;
    title: string;
    url: string;
    category: string;
    newsFrom: string;
    newsDate: string;
}

export type SseStatus = 'connecting' | 'connected' | 'reconnecting' | 'closed';

export interface UseNewsSseResult {
    items: SseNewsItem[];
    status: SseStatus;
    error: string | null;
}

const SSE_URL = `${CONFIG.apiUrl}/api/news/stream`;
const MAX_ITEMS = 20;
const MAX_BACKOFF_MS = 30_000;

/**
 * 订阅服务端 SSE 新闻推送流（无需登录）。
 *
 * 服务端应以如下格式推送事件：
 *   event: news
 *   data: {"id":1,"title":"...","url":"...","category":"...","newsFrom":"NGA","newsDate":"2026-04-18"}
 *
 * 若服务端使用默认 `message` 事件，也可正常接收。
 */
export function useNewsSse(maxItems = MAX_ITEMS): UseNewsSseResult {
    const [items, setItems] = useState<SseNewsItem[]>([]);
    const [status, setStatus] = useState<SseStatus>('connecting');
    const [error, setError] = useState<string | null>(null);

    // 用 ref 保存重试退避时间，避免 effect 重建
    const backoffRef = useRef(2000);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const esRef = useRef<EventSource | null>(null);

    const connect = useCallback(() => {
        // 清理旧连接
        esRef.current?.close();
        esRef.current = null;

        setStatus('connecting');
        const es = new EventSource(SSE_URL);
        esRef.current = es;

        const handleMessage = (event: MessageEvent) => {
            try {
                const item: SseNewsItem = JSON.parse(event.data as string);
                setItems((prev) => {
                    // 去重：同 id 不重复添加
                    if (prev.some((p) => p.id === item.id)) return prev;
                    return [item, ...prev].slice(0, maxItems);
                });
                setStatus('connected');
                setError(null);
                backoffRef.current = 2000; // 成功后重置退避
            } catch {
                // 忽略单条解析失败
            }
        };

        // 同时监听具名 `news` 事件和默认 `message` 事件
        es.addEventListener('news', handleMessage);
        es.addEventListener('message', handleMessage);

        es.onopen = () => {
            setStatus('connected');
            setError(null);
            backoffRef.current = 2000;
        };

        es.onerror = () => {
            es.close();
            esRef.current = null;
            const delay = backoffRef.current;
            backoffRef.current = Math.min(delay * 2, MAX_BACKOFF_MS);
            setStatus('reconnecting');
            setError(`连接中断，${Math.round(delay / 1000)}s 后重试…`);
            timerRef.current = setTimeout(connect, delay);
        };
    }, [maxItems]);

    useEffect(() => {
        connect();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            esRef.current?.close();
        };
    }, [connect]);

    return { items, status, error };
}
