"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
const connectToDatabase = async () => {
    try {
        await (0, mongoose_1.connect)(process.env.MONGO);
        console.log("Connected to database");
    }
    catch (err) {
        // console.log(err);
        throw new Error(err);
    }
};
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=connection.js.map