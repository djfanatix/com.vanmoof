"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
class vanMoofWeb {
    constructor(logger) {
        this.logger = logger;
    }
    async getAuthToken(apiKey, username, password) {
        const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64').trim();
        try {
            const response = await this.fetchDataFromVanmoof(auth, "authenticate", "POST", apiKey);
            return response.token;
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
    async fetchDataFromVanmoof(auth, endpoint, method, apiKey) {
        try {
            const response = await (0, node_fetch_1.default)(`https://api.vanmoof-api.com/v8/${endpoint}`, {
                method: method,
                headers: {
                    'Authorization': auth,
                    'Accept': 'application/json',
                    'api-key': apiKey
                },
            });
            const json = await response.json();
            console.log('json', json);
            return json;
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
    async getBikesDetails(authToken, apiKey) {
        const auth = 'Bearer ' + authToken;
        try {
            const bikeDetails = await this.fetchDataFromVanmoof(auth, "getCustomerData?includeBikeDetails", "GET", apiKey);
            if (!bikeDetails || !bikeDetails.data || !bikeDetails.data.bikeDetails) {
                throw Error("Invalid credentials, check login and password in settings.");
            }
            console.log('bikeDetails', bikeDetails.data.bikeDetails);
            return bikeDetails;
        }
        catch (error) {
            throw Error("Invalid credentials, check login and password in settings.");
        }
    }
}
exports.default = vanMoofWeb;
//# sourceMappingURL=vanmoofweb.js.map