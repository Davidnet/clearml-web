/**
 * auth
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 2.11
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */



export interface AuthGetTaskTokenForUserRequest {
    /**
     * User ID
     */
    user: string;
    /**
     * Company ID
     */
    company: string;
    /**
     * Requested token expiration time in seconds. Not guaranteed,  might be   overridden by the service
     */
    expiration_sec?: number;
    /**
     * Task ID
     */
    task: string;
}
