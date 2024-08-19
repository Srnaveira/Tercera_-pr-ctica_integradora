const MongoSingleton = require('../database/config.js');
const dotenv = require('dotenv');

dotenv.config();

let productsData;

switch (process.env.PERSISTENCE_PRODUCTS) {
    case "MONGODB":
        // Utiliza la instancia Singleton para conectar a MongoDB
        MongoSingleton.getInstance();
        const productsMongo = require('../persistence/data/productsData.js');
        productsData = productsMongo;
        break;
    case "FILESYSTEM":
        const productsFilesystem = require("../persistence/fileSystem/productsData.js");
        productsData = productsFilesystem;
        break;
    default:
        logger.fatal("No valid persistence method specified.");
}

module.exports = { productsData };
