/**
 * login
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 2.10
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */



/**
 * Server initialization errors
 */
export interface LoginSupportedModesResponseServerErrors {
    /**
     * Indicate that Elasticsearch database was not upgraded from version 5
     */
    missed_es_upgrade?: boolean;
    /**
     * Indicate an error communicating to Elasticsearch
     */
    es_connection_error?: boolean;
}
