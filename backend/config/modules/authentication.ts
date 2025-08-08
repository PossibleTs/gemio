import { IAuth } from "@hsuite/auth-types";
import { registerAs } from "@nestjs/config";

/**
 * Configuration for the authentication module.
 * @module Authentication
 */

/**
 * Registers and exports the authentication configuration.
 * @function
 * @returns {IAuth.IConfiguration.IAuthentication} The authentication configuration options.
 */
export default registerAs('authentication', (): IAuth.IConfiguration.IAuthentication => ({
    /** @property {boolean} enabled - Indicates if the authentication module is enabled. */
    enabled: false,
    commonOptions: null,
    web2Options: null,
    web3Options: null,
}));