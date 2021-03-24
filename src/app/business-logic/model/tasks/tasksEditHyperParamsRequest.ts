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

import { ParamsItem } from './paramsItem';
import { ReplaceHyperparamsEnum } from './replaceHyperparamsEnum';


export interface TasksEditHyperParamsRequest {
    /**
     * Task ID
     */
    task: string;
    /**
     * Task hyper parameters. The new ones will be added and the already existing ones   will be updated
     */
    hyperparams: Array<ParamsItem>;
    replace_hyperparams?: ReplaceHyperparamsEnum;
}
