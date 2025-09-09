import 'src/global.css';

import React, { useEffect } from 'react';

import Fab from '@mui/material/Fab';

import { usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { AuthProvider } from 'src/context/AuthContext';
import { ThemeProvider } from 'src/theme/theme-provider';
import { LatestUpdatedAnimeProvider } from 'src/context/LatestAnimeContext';

import { Iconify } from 'src/components/iconify';
import { BackToTop } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  const githubButton = () => (
    <Fab
      size="medium"
      aria-label="Github"
      href={CONFIG.projectUrl}
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 48,
        height: 48,
        position: 'fixed',
        bgcolor: 'grey.800',
      }}
    >
      <Iconify width={24} icon="socials:github" sx={{ '--color': 'white' }} />
    </Fab>
  );

  return (
    <AuthProvider>
      <ThemeProvider>
        <LatestUpdatedAnimeProvider>
          {children}
          <BackToTop/>
          { CONFIG.isBrowser == "true" ? githubButton() : ""}
        </LatestUpdatedAnimeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
