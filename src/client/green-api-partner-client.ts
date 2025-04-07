import axios, { AxiosInstance } from "axios";
import {
	CreateInstanceParams,
	CreateInstanceResponse,
	DeleteInstanceAccountParams, DeleteInstanceAccountResponse,
	PartnerCredentials,
	PartnerInstance,
} from "../types";
import { GreenApiLogger } from "../utils/logger";

/**
 * Client for partner-specific operations with GREEN-API.
 * Provides methods for managing instances as a GREEN-API partner.
 *
 * @example
 * ```typescript
 * const partnerClient = new GreenApiPartnerClient({
 *   partnerToken: "your-partner-token",
 *   partnerApiUrl: "https://api.green-api.com" // Optional, defaults to this URL
 * });
 *
 * const instances = await partnerClient.getInstances();
 * ```
 */
export class GreenApiPartnerClient {
	private readonly client: AxiosInstance;
	private readonly logger: GreenApiLogger;
	private readonly baseUrl: string;

	/**
	 * Creates a new GREEN-API partner client instance.
	 *
	 * @param credentials - Partner credentials containing partnerToken and optional partnerApiUrl
	 */
	constructor(private readonly credentials: PartnerCredentials) {
		this.baseUrl = credentials.partnerApiUrl || "https://api.green-api.com";
		this.client = axios.create({
			baseURL: this.baseUrl,
		});
		this.logger = GreenApiLogger.getInstance(this.constructor.name);
	}

	/**
	 * Gets all account instances created by the partner.
	 * Returns both active and deleted instances (deleted instances shown for the last 3 months).
	 * Instance status can be determined by the 'deleted' field in the response.
	 *
	 * @returns Promise resolving to an array of instance objects
	 *
	 * @example
	 * ```typescript
	 * const instances = await partnerClient.getInstances();
	 *
	 * // Get only active instances
	 * const activeInstances = instances.filter(instance => !instance.deleted);
	 *
	 * console.log(`Total instances: ${instances.length}`);
	 * console.log(`Active instances: ${activeInstances.length}`);
	 * ```
	 */
	async getInstances(): Promise<PartnerInstance[]> {
		try {
			this.logger.info("Getting partner instances");

			const url = `/partner/getInstances/${this.credentials.partnerToken}`;
			const response = await this.client.get(url);

			this.logger.debug("Successfully retrieved partner instances");
			return response.data;
		} catch (error: any) {
			const errorMessage = `Failed to get partner instances: ${error.message}`;

			this.logger.logErrorResponse(
				error,
				"Error getting partner instances",
			);

			throw new Error(errorMessage);
		}
	}

	/**
	 * Creates a new messenger account instance as a partner.
	 * After creation, the instance must be authorized by scanning a QR code.
	 *
	 * @param params - Instance creation parameters including name and webhook settings
	 * @returns Promise resolving to the created instance details
	 *
	 * @example
	 * ```typescript
	 * const instance = await partnerClient.createInstance({
	 *   name: "Marketing Campaign",
	 *   webhookUrl: "https://example.com/webhooks/green-api",
	 *   delaySendMessagesMilliseconds: 3000,
	 *   incomingWebhook: "yes",
	 *   outgoingWebhook: "yes"
	 * });
	 *
	 * console.log(`Created instance ID: ${instance.idInstance}`);
	 * console.log(`API Token: ${instance.apiTokenInstance}`);
	 * ```
	 */
	async createInstance(params: CreateInstanceParams): Promise<CreateInstanceResponse> {
		try {
			this.logger.info("Creating new partner instance", {name: params.name});

			const url = `/partner/createInstance/${this.credentials.partnerToken}`;
			const response = await this.client.post(url, params);

			this.logger.debug("Successfully created partner instance", {
				idInstance: response.data.idInstance,
			});

			return response.data;
		} catch (error: any) {
			const errorMessage = `Failed to create partner instance: ${error.message}`;

			this.logger.logErrorResponse(
				error,
				"Error creating partner instance",
				{params},
			);

			throw new Error(errorMessage);
		}
	}

	/**
	 * Deletes a messenger account instance created by the partner.
	 *
	 * @param params - Parameters containing the ID of the instance to delete
	 * @returns Promise resolving to deletion status
	 *
	 * @example
	 * ```typescript
	 * const result = await partnerClient.deleteInstanceAccount({
	 *   idInstance: 1101000000
	 * });
	 *
	 * if (result.deleteInstanceAccount) {
	 *   console.log("Instance successfully deleted");
	 * }
	 * ```
	 */
	async deleteInstanceAccount(params: DeleteInstanceAccountParams): Promise<DeleteInstanceAccountResponse> {
		try {
			this.logger.info("Deleting partner instance", {idInstance: params.idInstance});

			const url = `/partner/deleteInstanceAccount/${this.credentials.partnerToken}`;
			const response = await this.client.post(url, params);

			this.logger.debug("Successfully deleted partner instance", {
				idInstance: params.idInstance,
			});

			return response.data;
		} catch (error: any) {
			const errorMessage = `Failed to delete partner instance: ${error.message}`;

			this.logger.logErrorResponse(
				error,
				"Error deleting partner instance",
				{idInstance: params.idInstance},
			);

			throw new Error(errorMessage);
		}
	}
}
