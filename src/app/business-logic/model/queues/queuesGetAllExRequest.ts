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



export interface QueuesGetAllExRequest {
    /**
     * Get only queues whose name matches this pattern (python regular expression   syntax)
     */
    name?: string;
    /**
     * List of Queue IDs used to filter results
     */
    id?: Array<string>;
    /**
     * User-defined tags list used to filter results. Prepend \'-\' to tag name to   indicate exclusion
     */
    tags?: Array<string>;
    /**
     * System tags list used to filter results. Prepend \'-\' to system tag name to   indicate exclusion
     */
    system_tags?: Array<string>;
    /**
     * Page number, returns a specific page out of the result list of results.
     */
    page?: number;
    /**
     * Page size, specifies the number of results returned in each page (last page may   contain fewer results)
     */
    page_size?: number;
    /**
     * List of field names to order by. When search_text is used, \'@text_score\' can be   used as a field representing the text score of returned documents. Use \'-\'   prefix to specify descending order. Optional, recommended when using page
     */
    order_by?: Array<string>;
    /**
     * Free text search query
     */
    search_text?: string;
    /**
     * List of document field names (nesting is supported using \'.\', e.g.   execution.model_labels). If provided, this list defines the query\'s projection   (only these fields will be returned for each result entry)
     */
    only_fields?: Array<string>;
}
