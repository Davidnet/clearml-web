/**
 * tasks
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 2.9
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { ParamKey } from './paramKey';


export interface TasksDeleteParamsRequest {
    /**
     * Task ID
     */
    task: string;
    /**
     * List of hyper parameters to delete
     */
    hyperparams?: Array<ParamKey>;
    /**
     * List of configuration items to delete
     */
    configuration?: Array<ParamKey>;
}
