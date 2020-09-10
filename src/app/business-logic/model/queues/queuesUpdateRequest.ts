/**
 * queues
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 2.9
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */



export interface QueuesUpdateRequest {
    /**
     * Queue id
     */
    queue: string;
    /**
     * Queue name Unique within the company.
     */
    name?: string;
    /**
     * User-defined tags list
     */
    tags?: Array<string>;
    /**
     * System tags list. This field is reserved for system use, please don\'t use it.
     */
    system_tags?: Array<string>;
}
