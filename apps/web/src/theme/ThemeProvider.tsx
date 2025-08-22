import * as React from 'react';
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {createTheme, Theme, ThemeProvider as MuiThemeProvider} from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const getTheme = (mode: ThemeMode): Theme => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#000000' : '#ffffff',
        secondary: mode === 'light' ? '#666666' : '#aaaaaa',
      },
    },
    typography: {
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: mode === 'light' ? '#1976d2' : '#1e1e1e',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            borderRight: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333333'}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
      },
    },
  });
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    return savedTheme || 'light';
  });

  const theme = React.useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const value = {
    mode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
