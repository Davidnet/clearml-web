/**
 * tasks
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 2.11
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import { ArtifactId } from '././artifactId';


export interface TasksDeleteArtifactsRequest {
    /**
     * Task ID
     */
    task: string;
    /**
     * Artifacts to delete
     */
    artifacts: Array<ArtifactId>;
}
