/**
 * Logger interface for application logging
 * Provides consistent logging across the application
 */
export interface ILogger {
	debug(message: string, ...args: unknown[]): void;
	info(message: string, ...args: unknown[]): void;
	warn(message: string, ...args: unknown[]): void;
	error(message: string, ...args: unknown[]): void;
}

/**
 * Console-based logger implementation
 * - debug, info, warn: Only log in development
 * - error: Always logged (production + development)
 */
class ConsoleLogger implements ILogger {
	private isDevelopment = import.meta.env.DEV;

	debug(message: string, ...args: unknown[]): void {
		if (this.isDevelopment) {
			console.debug(message, ...args);
		}
	}

	info(message: string, ...args: unknown[]): void {
		if (this.isDevelopment) {
			console.info(message, ...args);
		}
	}

	warn(message: string, ...args: unknown[]): void {
		if (this.isDevelopment) {
			console.warn(message, ...args);
		}
	}

	error(message: string, ...args: unknown[]): void {
		// Always log errors, even in production
		console.error(message, ...args);
	}
}

// Export singleton logger instance
export const logger: ILogger = new ConsoleLogger();
