"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const vanmoofweb_1 = __importDefault(require("./lib/vanmoofweb"));
class VanMoof extends homey_1.default.App {
    constructor() {
        super(...arguments);
        this.vanmoof = new vanmoofweb_1.default(this);
    }
    /**
     * onInit is called when the app is initialized.
     */
    async onInit() {
        this.log('VanMoof has been initialized');
    }
}
module.exports = VanMoof;
//# sourceMappingURL=app.js.map