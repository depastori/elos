export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = import.meta.env.DEV;

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
      error,
      userId: this.getCurrentUserId(),
      component: context?.component,
      action: context?.action,
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        ...context?.metadata
      }
    };
  }

  private getCurrentUserId(): string | undefined {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    } catch (error) {
      // Silently fail to avoid infinite logging
    }
    return undefined;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Manter apenas os últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output em desenvolvimento
    if (this.isDevelopment) {
      this.outputToConsole(entry);
    }

    // Enviar logs críticos para servidor (simulado)
    if (entry.level >= LogLevel.ERROR) {
      this.sendToServer(entry);
    }
  }

  private outputToConsole(entry: LogEntry): void {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'];
    const levelColors = ['#6B7280', '#3B82F6', '#F59E0B', '#EF4444', '#DC2626'];
    
    const style = `color: ${levelColors[entry.level]}; font-weight: bold;`;
    const prefix = `[${entry.timestamp}] [${levelNames[entry.level]}]`;
    
    console.log(
      `%c${prefix} ${entry.message}`,
      style,
      entry.context || '',
      entry.error || ''
    );
  }

  private async sendToServer(entry: LogEntry): Promise<void> {
    try {
      // Simulação de envio para servidor
      if (this.isDevelopment) {
        console.warn('🚨 Log crítico que seria enviado ao servidor:', entry);
      }
      
      // Em produção, enviaria para um serviço de logging
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });
    } catch (error) {
      console.error('Falha ao enviar log para servidor:', error);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.addLog(entry);
  }

  info(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.addLog(entry);
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.addLog(entry);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.addLog(entry);
  }

  critical(message: string, error?: Error, context?: Record<string, any>): void {
    const entry = this.createLogEntry(LogLevel.CRITICAL, message, context, error);
    this.addLog(entry);
  }

  // Métodos específicos para diferentes tipos de ações
  userAction(action: string, details?: Record<string, any>): void {
    this.info(`Ação do usuário: ${action}`, {
      component: 'UserAction',
      action,
      ...details
    });
  }

  apiCall(endpoint: string, method: string, status?: number, duration?: number): void {
    const level = status && status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `API ${method} ${endpoint} - Status: ${status || 'pending'}`;
    
    const entry = this.createLogEntry(level, message, {
      component: 'API',
      action: 'apiCall',
      endpoint,
      method,
      status,
      duration
    });
    
    this.addLog(entry);
  }

  componentError(component: string, error: Error, props?: Record<string, any>): void {
    this.error(`Erro no componente ${component}`, error, {
      component,
      action: 'componentError',
      props
    });
  }

  securityEvent(event: string, details?: Record<string, any>): void {
    this.critical(`Evento de segurança: ${event}`, undefined, {
      component: 'Security',
      action: 'securityEvent',
      ...details
    });
  }

  // Obter logs para debug
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  // Limpar logs
  clearLogs(): void {
    this.logs = [];
    this.info('Logs limpos', { component: 'Logger', action: 'clearLogs' });
  }

  // Exportar logs para download
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();