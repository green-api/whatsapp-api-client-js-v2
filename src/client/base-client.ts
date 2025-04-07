import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Instance } from "../types";
import { GreenApiLogger } from "../utils/logger";

/**
 * Base client for GREEN-API interactions.
 * Provides common HTTP request methods and URL building.
 */
export abstract class BaseClient {
    protected client: AxiosInstance;
    protected readonly baseUrl = "https://api.green-api.com";
    protected readonly logger: GreenApiLogger;

    /**
     * Creates a new BaseClient instance.
     *
     * @param instance - GREEN-API instance credentials
     */
	protected constructor(protected instance: Instance) {
        this.client = axios.create({
            baseURL: this.buildUrl(),
        });
        this.logger = GreenApiLogger.getInstance(this.constructor.name);
    }

    /**
     * Builds the base URL for the GREEN-API instance.
     *
     * @returns The complete base URL
     */
    protected buildUrl(): string {
        return `${this.baseUrl}/waInstance${this.instance.idInstance}`;
    }

    /**
     * Builds an endpoint path with the API token.
     *
     * @param endpoint - API endpoint name
     * @returns Complete endpoint path
     */
    protected buildEndpoint(endpoint: string): string {
        return `/${endpoint}/${this.instance.apiTokenInstance}`;
    }

    /**
     * Makes an HTTP request to the GREEN-API.
     *
     * @param method - HTTP method (get or post)
     * @param endpoint - API endpoint
     * @param data - Request body data (for POST)
     * @param queryParams - Query parameters (for GET)
     * @param config - Additional Axios config
     * @returns Promise resolving to the response data
     * @throws Error on failure
     */
    protected async makeRequest<T>(
        method: "get" | "post",
        endpoint: string,
        data?: any,
        queryParams?: Record<string, string | number>,
        config?: any,
    ): Promise<T> {
        try {
            this.logger.info("Making a request", {
                idInstance: this.instance.idInstance,
                endpoint,
                method,
                data,
                queryParams,
            });

            const url = this.buildEndpoint(endpoint) + (queryParams
                ? "?" + new URLSearchParams(
                    Object.entries(queryParams).map(([key, value]) => [key, value.toString()])
                ).toString()
                : ""
            );

            const response: AxiosResponse<T> = await (method === "get"
                ? this.client.get(url, config)
                : this.client.post(url, data, config));

            this.logger.debug("Request successful", {
                endpoint,
                status: response.status
            });

            return response.data;
        } catch (error: any) {
            const errorMessage = `Failed to ${endpoint.replace(/([A-Z])/g, " $1").toLowerCase()}: ${error.message}`;
            const detailedError = error.response?.data ? `${errorMessage}. ${JSON.stringify(error.response?.data)}` : errorMessage;

            this.logger.logErrorResponse(error, `Error in ${endpoint}`, {
                endpoint,
                data
            });

            throw new Error(detailedError);
        }
    }

    /**
     * Makes a file upload request to the GREEN-API.
     *
     * @param endpoint - API endpoint
     * @param formData - Form data with file
     * @param headers - Additional headers
     * @returns Promise resolving to the response data
     */
    protected async makeFileUploadRequest<T>(
        endpoint: string,
        formData: FormData,
        headers?: Record<string, string>,
    ): Promise<T> {
        return this.makeRequest(
            "post",
            endpoint,
            formData,
            undefined,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...headers
                },
            },
        );
    }
}
