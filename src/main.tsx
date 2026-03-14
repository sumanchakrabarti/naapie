import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import MsalProviderWrapper from './auth/MsalProviderWrapper';
import { ThemeProvider } from './hooks/useTheme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MsalProviderWrapper>
        <App />
      </MsalProviderWrapper>
    </ThemeProvider>
  </StrictMode>,
);
