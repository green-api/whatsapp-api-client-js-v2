import axios, { AxiosError } from "axios";

/**
 * Available log levels for the logger
 */
type LogLevel = "log" | "debug" | "info" | "warn" | "error" | "fatal";

/**
 * Structure of a log entry
 */
interface LogEntry {
	timestamp?: string;
	level: LogLevel;
	context: string;
	message: string;

	[key: string]: any;
}

/**
 * Logger for GREEN-API integration library.
 * Provides structured JSON logging with colored output and error handling.
 * Uses singleton pattern to maintain consistent logging instances across the application.
 *
 * @category Core
 *
 * @example
 * ```typescript
 * const logger = GreenApiLogger.getInstance("MyComponent");
 *
 * // Basic logging
 * logger.info("Operation successful", { userId: 123 });
 *
 * // Error logging
 * try {
 *   // ... some code
 * } catch (error) {
 *   logger.logErrorResponse(error, "Failed to process request");
 * }
 * ```
 */
export class GreenApiLogger {
	private static instances: Map<string, GreenApiLogger> = new Map();
	private readonly colors = {
		log: "\x1b[32m",      // Same as info (green)
		debug: "\x1b[36m",    // Cyan
		info: "\x1b[32m",     // Green
		warn: "\x1b[33m",     // Yellow
		error: "\x1b[31m",    // Red
		fatal: "\x1b[35m",    // Magenta/Purple for fatal
		reset: "\x1b[0m",     // Reset
	};

	/**
	 * Private constructor to enforce singleton pattern
	 * @param context - The context (usually component name) for this logger instance
	 */
	private constructor(private readonly context: string) {}

	/**
	 * Gets a logger instance for the specified context.
	 * Creates a new instance if one doesn't exist, otherwise returns existing instance.
	 *
	 * @param context - The context for the logger (default: "Global")
	 * @returns Logger instance for the specified context
	 *
	 * @example
	 * ```typescript
	 * const logger = GreenApiLogger.getInstance("MyService");
	 * ```
	 */
	public static getInstance(context: string = "Global"): GreenApiLogger {
		if (!GreenApiLogger.instances.has(context)) {
			GreenApiLogger.instances.set(context, new GreenApiLogger(context));
		}
		return GreenApiLogger.instances.get(context)!;
	}

	/**
	 * Formats timestamp in locale-specific format
	 * @returns Formatted timestamp string
	 * @private
	 */
	private formatTimestamp(): string {
		return new Date().toLocaleString("en-GB");
	}

	/**
	 * Sanitizes values for JSON serialization.
	 * Handles special cases like Error objects and BigInt values.
	 *
	 * @param value - Value to sanitize
	 * @returns Sanitized value safe for JSON serialization
	 * @private
	 */
	private sanitizeValue(value: any): any {
		if (value instanceof Error) {
			return {
				message: value.message,
				stack: value.stack?.split("\n").map(line => line.trim()),
			};
		}

		if (typeof value === "bigint") {
			return value.toString();
		}

		if (Array.isArray(value)) {
			return value.map(item => this.sanitizeValue(item));
		}

		if (value && typeof value === "object") {
			return Object.fromEntries(
				Object.entries(value).map(([key, val]) => [key, this.sanitizeValue(val)]),
			);
		}

		return value;
	}

	/**
	 * Creates and outputs a log entry
	 * @param level - Log level
	 * @param message - Log message
	 * @param additionalContext - Additional context data
	 * @private
	 */
	private logEntry(level: LogLevel, message: string, additionalContext: Record<string, any> = {}): void {
		const entry: LogEntry = {
			timestamp: this.formatTimestamp(),
			level,
			context: this.context,
			message,
			...this.sanitizeValue(additionalContext),
		};

		const color = this.colors[level];
		const jsonString = JSON.stringify(entry);

		console.log(`${color}${jsonString}${this.colors.reset}`);
	}

	/**
	 * Logs a debug message
	 * @param message - Debug message
	 * @param context - Additional context data
	 */
	debug(message: string, context: Record<string, any> = {}): void {
		this.logEntry("debug", message, context);
	}

	/**
	 * Logs an info message
	 * @param message - Info message
	 * @param context - Additional context data
	 */
	info(message: string, context: Record<string, any> = {}): void {
		this.logEntry("info", message, context);
	}

	/**
	 * Logs a warning message
	 * @param message - Warning message
	 * @param context - Additional context data
	 */
	warn(message: string, context: Record<string, any> = {}): void {
		this.logEntry("warn", message, context);
	}

	/**
	 * Logs an error message
	 * @param message - Error message
	 * @param context - Additional context data
	 */
	error(message: string, context: Record<string, any> = {}): void {
		this.logEntry("error", message, context);
	}

	/**
	 * Alternative method for logging info messages
	 * @param message - Log message
	 * @param context - Context string
	 */
	log(message: string, context?: string): void {
		this.logEntry("info", message, {context});
	}

	/**
	 * Logs a verbose debug message
	 * @param message - Debug message
	 * @param context - Context string
	 */
	verbose(message: string, context?: string): void {
		this.logEntry("debug", message, {context, level: "verbose"});
	}

	/**
	 * Logs a fatal error message
	 * @param message - Fatal error message
	 * @param context - Additional context data
	 */
	fatal(message: string, context: Record<string, any> = {}): void {
		this.logEntry("error", message, context);
	}

	/**
	 * Logs detailed error information, handling both Axios errors and regular errors.
	 * Particularly useful for API errors and exceptions.
	 *
	 * @param error - Error object (Axios error or regular error)
	 * @param context - Error context description
	 * @param additionalContext - Additional context data
	 *
	 * @example
	 * ```typescript
	 * try {
	 *   await api.request();
	 * } catch (error) {
	 *   logger.logErrorResponse(error, "API Request failed", { requestId: "123" });
	 * }
	 * ```
	 */
	logErrorResponse(error: any, context: string, additionalContext: Record<string, any> = {}) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError;
			this.error(`${context} - API Error:`, {
				status: axiosError.response?.status,
				statusText: axiosError.response?.statusText,
				data: axiosError.response?.data,
				url: axiosError.config?.url,
				method: axiosError.config?.method,
				headers: axiosError.response?.headers,
				timestamp: new Date().toISOString(),
				...additionalContext,
			});
		} else {
			const errorObject = {
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack?.split("\n").map(line => line.trim()) : undefined,
				timestamp: new Date().toISOString(),
				...additionalContext,
			};

			this.error(`${context} - Non-API Error:`, errorObject);
		}
	}
}
