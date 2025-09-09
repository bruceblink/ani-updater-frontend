import type { ReactNode} from 'react';

import { useState, useEffect ,useContext, createContext} from 'react';

import api, { type PageData, type ApiResponse } from '../utils/api';

import type { Ani } from '../hooks/useAniData';


type LatestUpdatedAnimeCtx = {
  latestUpdateAnimes: PageData<Ani>|undefined
  isLoaded: boolean
}

const LatestUpdatedAnimeContext = createContext<LatestUpdatedAnimeCtx | null>(null)

export const useLatestUpdatedAnime = () => {
  const ctx = useContext(LatestUpdatedAnimeContext)
  if (!ctx) throw new Error('useLatestUpdatedAni must be inside LatestUpdatedAniProvider')
  return ctx
}


export function LatestUpdatedAnimeProvider({ children }: { children: ReactNode }) {
  const [latestUpdateAnimes, setLatestUpdateAnis] = useState<PageData<Ani>>()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    void fetchLatestUpdateAniList()
  }, [])


  const fetchLatestUpdateAniList = async () => {
    try {
      const res = await api.get<ApiResponse<PageData<Ani>>>("/api/anis");
      const data = res.data.data;
      setLatestUpdateAnis(data);
      setIsLoaded(true);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error('未知错误');
      console.error(err)
    } finally {
      setIsLoaded(false);
    }
  }

  return (
    <LatestUpdatedAnimeContext.Provider value={{
      latestUpdateAnimes,
      isLoaded }}>
      {children}
    </LatestUpdatedAnimeContext.Provider>
  )
}
