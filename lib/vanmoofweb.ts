import { SimpleClass } from 'homey';
import fetch from 'node-fetch';

interface bikeDetails {
    data: {
        uuid: string;
        name: string;
        bikeDetails: [
            {
                id: string;
                name: string;
                frameNumber: string;
                bikeId: string;
                macAddress: string;
                bleProfile: string;
                bleVersion: string;
                key: {
                    encryptionKey: string;
                    passcode: string;
                    userKeyId: number;
                }
                modelDetails: {
                    Edition: string;
                }
            }
        ]
    };
}

interface authenticationReturnDetails {
  token: string;
  refreshToken: string;  
}

export default class vanMoofWeb {
    logger: SimpleClass;

    constructor(logger: SimpleClass) {
        this.logger = logger;
    }

    async getAuthToken (apiKey: string, username: string, password: string) {
    const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64').trim();
        try {
            const response = await this.fetchDataFromVanmoof(auth, "authenticate", "POST", apiKey) as authenticationReturnDetails;
            return response.token;
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async fetchDataFromVanmoof (auth: string, endpoint: string, method: string, apiKey: string) {
        try {
            const response = await fetch(`https://api.vanmoof-api.com/v8/${endpoint}`, {
                method: method,
                headers: {
                    'Authorization': auth,
                    'Accept': 'application/json',
                    'api-key': apiKey
                },
            });
            const json = await response.json();
            console.log('json',json);
            return json;
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    async getBikesDetails(authToken: string, apiKey: string) {
        const auth = 'Bearer ' + authToken;
        try {
            const bikeDetails = await this.fetchDataFromVanmoof(auth, "getCustomerData?includeBikeDetails", "GET", apiKey) as bikeDetails;
    
            if (!bikeDetails || !bikeDetails.data || !bikeDetails.data.bikeDetails) {
                throw Error("Invalid credentials, check login and password in settings.");
            }
    
            console.log('bikeDetails', bikeDetails.data.bikeDetails);
            return bikeDetails;
        } catch (error) {
            throw Error("Invalid credentials, check login and password in settings.");
        }
    }
}
