/**
 * Error thrown by GreenApiClient when a GREEN-API request fails.
 * The message keeps the method name and the response, statusCode and response hold the raw values.
 */
export class GreenApiError extends Error {
	/**
	 * Creates a GREEN-API error.
	 *
	 * @param message - Human-readable error message
	 * @param statusCode - HTTP status of the response, undefined when GREEN-API could not be reached
	 * @param response - Response body from GREEN-API
	 */
	constructor(message: string, readonly statusCode?: number, readonly response?: unknown) {
		super(message);
		this.name = "GreenApiError";
	}
}
