/**
 * login
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 2.12
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */



export interface SignupInfo {
    /**
     * Sign-up token. Should be passed back to the Signup call
     */
    signup_token?: string;
    /**
     * The user full name as received from auth provide
     */
    name?: string;
    /**
     * The user given name as received from auth provider
     */
    given_name?: string;
    /**
     * The user family name as received from auth provider
     */
    family_name?: string;
    /**
     * The user email as received from auth provider
     */
    email?: string;
    /**
     * The user avatar as received from auth provider
     */
    avatar?: string;
    /**
     * Company name for the user. In case the user was invited to join the company this field cannot be changed
     */
    company_name?: string;
    // (nir) added manually
    crm_form: string;
}
