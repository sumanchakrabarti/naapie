import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import MsalProviderWrapper from './auth/MsalProviderWrapper';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProviderWrapper>
      <App />
    </MsalProviderWrapper>
  </StrictMode>,
);
