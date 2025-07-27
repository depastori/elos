import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/logger';

// Capturar erros não tratados
window.addEventListener('error', (event) => {
  logger.critical('Erro JavaScript não tratado', event.error, {
    component: 'Global',
    action: 'unhandled_error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.critical('Promise rejeitada não tratada', event.reason, {
    component: 'Global',
    action: 'unhandled_rejection'
  });
});

// Log de inicialização
logger.info('Aplicação inicializando', {
  component: 'Main',
  action: 'init',
  environment: import.meta.env.MODE,
  timestamp: new Date().toISOString()
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
